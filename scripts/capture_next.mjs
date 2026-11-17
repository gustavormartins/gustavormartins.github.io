import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const origin = 'http://127.0.0.1:4173';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const outputs = path.join(process.cwd(), 'snapshots-next');
await mkdir(outputs, { recursive: true });
const failures = [];
const scenarios = [
  { name: 'home-desktop', route: '/', width: 1440, height: 900, reduce: false },
  { name: 'home-mobile', route: '/', width: 390, height: 844, reduce: true },
  { name: 'home-small', route: '/', width: 320, height: 720, reduce: true },
  { name: 'projects-desktop', route: '/#trabalhos', width: 1440, height: 900, reduce: true },
  { name: 'projects-mobile', route: '/#trabalhos', width: 390, height: 844, reduce: true },
  { name: 'cases-desktop', route: '/cases/', width: 1440, height: 900, reduce: true },
  { name: 'cases-mobile', route: '/cases/', width: 390, height: 844, reduce: true }
];

try {
  for (const shot of scenarios) {
    const context = await browser.newContext({
      viewport: { width: shot.width, height: shot.height },
      reducedMotion: shot.reduce ? 'reduce' : 'no-preference',
      deviceScaleFactor: 1
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));
    const response = await page.goto(origin + shot.route, { waitUntil: 'domcontentloaded' });
    if (!response || response.status() >= 400) {
      failures.push(shot.name + ': HTTP ' + response?.status());
      await context.close();
      continue;
    }
    await page.locator('main').waitFor({ state: 'visible' });
    await page.waitForTimeout(400);
    if (shot.route.includes('#')) {
      await page.evaluate(() => {
        const hash = decodeURIComponent(window.location.hash);
        const target = hash ? document.querySelector(hash) : null;
        if(target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 82, behavior: 'instant' });
      });
      await page.waitForTimeout(250);
    }
    const result = await page.evaluate(async () => {
      const ownImages = Array.from(document.images).filter(img => img.currentSrc.includes('/assets/'));
      await Promise.all(ownImages.map(async img => { try { await img.decode(); } catch {} }));
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        imageFailures: ownImages.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
        personal: /Lista.de.Casa|Lista-de-Casa|para-a-bia/i.test(document.body.textContent || ''),
        heading: document.querySelector('main h1')?.textContent?.trim() || 'missing'
      };
    });
    console.log(shot.name, JSON.stringify(result));
    if (result.overflow > 2) failures.push(shot.name + ': overflow ' + result.overflow);
    if (result.imageFailures.length) failures.push(shot.name + ': images ' + result.imageFailures.join(', '));
    if (result.personal) failures.push(shot.name + ': personal content found');
    if (pageErrors.length) failures.push(shot.name + ': JS errors ' + pageErrors.join('; '));
    await page.screenshot({ path: path.join(outputs, shot.name + '.png'), animations: 'disabled', fullPage: ['home-mobile','cases-mobile'].includes(shot.name) });
    if (shot.name === 'home-desktop') {
      await page.getByRole('tab', { name: /02 \/ PROCESS/ }).click();
      if (await page.getByRole('tab', { name: /02 \/ PROCESS/ }).getAttribute('aria-selected') !== 'true') {
        failures.push('Hero console tab did not change');
      }
    }
    if (shot.name === 'home-mobile') {
      const button = page.getByRole('button', { name: 'Abrir menu' });
      await button.click();
      if (await button.getAttribute('aria-expanded') !== 'true') failures.push('Mobile menu did not open');
      await page.locator('.mobile-nav-panel a[href="#trabalhos"]').click();
      if (await page.getByRole('button', { name: 'Abrir menu' }).getAttribute('aria-expanded') !== 'false') {
        failures.push('Mobile menu did not close after navigation');
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('NEXT FRONT REVIEW: all responsive and interaction checks passed');
}
