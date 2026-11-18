import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const origin = 'http://127.0.0.1:4173';
const output = path.join(process.cwd(), 'snapshots-next');
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

try {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 1440 ? 900 : 820 },
      reducedMotion: 'reduce',
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    const brokenGameRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => {
      if (request.url().includes('/jogar/blohshblast/')) {
        brokenGameRequests.push(request.url() + ': ' + request.failure()?.errorText);
      }
    });
    page.on('response', response => {
      if (response.url().includes('/jogar/blohshblast/') && response.status() >= 400) {
        brokenGameRequests.push(response.status() + ' ' + response.url());
      }
    });

    const response = await page.goto(origin + '/jogar/', { waitUntil: 'domcontentloaded' });
    if (!response || response.status() !== 200) throw new Error('Showcase route HTTP error at '+width);
    await page.getByRole('heading', {name:/BlohshBlast/i}).waitFor();
    if (await page.locator('.playable-frame').count()) {
      throw new Error('Game mounted before opt-in at '+width);
    }
    await page.locator('.playable-start-button').click();
    const iframe = page.frameLocator('.playable-frame');
    await iframe.locator('#board .cell').first().waitFor();
    await iframe.locator('[data-pc-action="play"]').waitFor();
    const before = await iframe.locator('#score-display').innerText();
    await iframe.locator('[data-pc-action="play"]').click();
    const classic = iframe.locator('.phase3-mode[data-mode="classic"]');
    if (await classic.isVisible()) await classic.click();
    const after = await iframe.locator('#score-display').innerText();

    // The real runtime API calls the game's keyboard-placement logic.
    const result = await iframe.locator('#board').evaluate(board => {
      const runtime = window.BlohshBlastLegacyRuntime;
      const product = window.BlohshBlastPhase3;
      if (!runtime || !product) return {ok:false, reason:'Original runtime missing'};
      product.startGame?.('classic');
      const scoreBefore = runtime.getState().score;
      const placed = runtime.placeFirstAvailable(0);
      const scoreAfter = runtime.getState().score;
      return {
        ok: true,
        cells: board.querySelectorAll('.cell').length,
        placed,
        scoreBefore,
        scoreAfter,
        mode: product.getMode?.()
      };
    });

    if (!result.ok || result.cells !== 64 || !result.placed || result.scoreAfter <= result.scoreBefore) {
      throw new Error('Game did not place a real piece at '+width+': '+JSON.stringify(result));
    }
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      iframe: document.querySelector('.playable-frame')?.getBoundingClientRect().width,
      available: document.querySelector('.playable-demo')?.getBoundingClientRect().width
    }));
    if (layout.overflow > 2) throw new Error('Showcase horizontal overflow at '+width+': '+layout.overflow);
    if (errors.length || brokenGameRequests.length) {
      throw new Error('Runtime/asset errors at '+width+': '+JSON.stringify({errors,brokenGameRequests}));
    }
    await page.locator('.playable-demo').screenshot({
      path: path.join(output, 'blohshblast-live-'+width+'.png'), animations: 'disabled'
    });
    console.log('REAL_GAME_OK',JSON.stringify({width,before,after,result,layout}));
    await context.close();
  }

  const standalone = await browser.newPage({viewport:{width:390,height:820}});
  const direct = await standalone.goto(origin+'/jogar/blohshblast/',{waitUntil:'domcontentloaded'});
  if (!direct || direct.status() !== 200) {
    throw new Error('Direct full screen game route returned '+direct?.status());
  }
  await standalone.locator('#board .cell').first().waitFor();
  if (!await standalone.locator('[data-pc-action="play"]').isVisible()) {
    throw new Error('Original game menu not visible in standalone mode');
  }
  console.log('STANDALONE_GAME_OK',standalone.url());
  await standalone.close();
} finally {
  await browser.close();
}
