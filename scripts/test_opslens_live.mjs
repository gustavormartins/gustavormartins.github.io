import { chromium } from 'playwright-core';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const output = path.join(process.cwd(), 'snapshots-next');
await mkdir(output, { recursive: true });

try {
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({
      viewport: { width, height: width >= 1000 ? 900 : 840 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    page.setDefaultTimeout(18000);
    const errors = [];
    const apiResponses = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => {
      if (r.url().includes('blohsh-opslens-api.vercel.app')) {
        apiResponses.push({status:r.status(),url:r.url()});
      }
    });
    const res = await page.goto('http://127.0.0.1:4173/opslens/',{waitUntil:'domcontentloaded'});
    if (res?.status() !== 200) throw new Error('OpsLens page not served at '+width);
    await page.getByText('API CONECTADA', {exact:true}).waitFor({state:'visible',timeout:25000});

    const metrics = page.locator('.opslens-metrics strong');
    if ((await metrics.allTextContents())[0] !== '—') {
      throw new Error('Dashboard displayed precomputed fake data before interaction');
    }
    await page.getByRole('button',{name:'Enviar: Operação normal'}).click();
    await page.locator('.opslens-metrics strong').first().getByText('1').waitFor();
    const afterGood = await metrics.allTextContents();
    if (afterGood[0] !== '1' || afterGood[1] !== '100%' || afterGood[2] !== '0') {
      throw new Error('Unexpected FastAPI metrics after normal event: '+JSON.stringify(afterGood));
    }
    await page.getByRole('button',{name:'Enviar: Atraso de SLA'}).click();
    await page.locator('.opslens-metrics strong').first().getByText('2').waitFor();
    const afterSla = await metrics.allTextContents();
    if (afterSla[0] !== '2' || afterSla[1] !== '50%' || afterSla[2] !== '1') {
      throw new Error('Wrong SLA after Python calculation: '+JSON.stringify(afterSla));
    }
    await page.getByRole('button',{name:'Enviar: Falha de processo'}).click();
    await page.locator('.opslens-metrics strong').first().getByText('3').waitFor();
    const afterFailure = await metrics.allTextContents();
    if (afterFailure[0] !== '3' || afterFailure[1] !== '66,67%' || afterFailure[2] !== '1' || afterFailure[3] !== '1') {
      throw new Error('Wrong failure metrics from Python: '+JSON.stringify(afterFailure));
    }
    if (await page.locator('.opslens-incident').count() !== 2) {
      throw new Error('Expected two server-reported incidents');
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 2) throw new Error('Dashboard overflow '+overflow+' at '+width+' px');
    const pythonPosts = apiResponses.filter(r => r.url.endsWith('/api/simulate') && r.status===200).length;
    if (pythonPosts !== 3) throw new Error('Not all three events reached real remote Python API: '+JSON.stringify(apiResponses));
    if (errors.length) throw new Error('Browser JS errors: '+errors.join(';'));

    await page.locator('.opslens-live').screenshot({
      path:path.join(output,'opslens-live-'+width+'.png'),
      animations:'disabled'
    });

    await page.getByRole('button',{name:/REINICIAR SESSÃO/}).click();
    if ((await metrics.allTextContents())[0] !== '—') {
      throw new Error('Reset showed stale, persistent metrics');
    }
    console.log('OPSLENS_REAL_UI_OK',JSON.stringify({width,afterGood,afterSla,afterFailure,pythonPosts,overflow}));
    await context.close();
  }
} finally {
  await browser.close();
}
