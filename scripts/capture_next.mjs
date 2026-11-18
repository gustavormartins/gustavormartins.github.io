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
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(20000);
    console.log('Scenario start:', shot.name);
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
    // Brand must display correct live text, an actual animated caret, and
    // the existing Blohsh watermark without overflowing the navigation.
    const brand = page.locator('.brand-lockup');
    if (await brand.count() !== 1 || !await brand.isVisible()) {
      failures.push(shot.name + ': branded link is missing');
    } else {
      const brandMetrics = await brand.evaluate(node => {
        const caret = node.querySelector('.brand-terminal-cursor');
        const watermark = node.querySelector('.brand-blohsh-watermark');
        const rect = node.getBoundingClientRect();
        return {
          text: node.textContent || '',
          right: rect.right,
          caretAnimation: caret ? getComputedStyle(caret).animationName : 'missing',
          watermarkImage: watermark ? getComputedStyle(watermark).backgroundImage : 'missing'
        };
      });
      if (!brandMetrics.text.includes('Gustavo Martins Dev') || !brandMetrics.text.includes('BLOHSH')) {
        failures.push(shot.name + ': incorrect brand text');
      }
      if (shot.reduce && brandMetrics.caretAnimation !== 'none') {
        failures.push(shot.name + ': cursor ignored reduced motion');
      }
      if (!shot.reduce && brandMetrics.caretAnimation === 'none') {
        failures.push(shot.name + ': terminal cursor does not blink');
      }
      if (!brandMetrics.watermarkImage.includes('blohsh-logo.png')) {
        failures.push(shot.name + ': Blohsh watermark is missing');
      }
      if (brandMetrics.right > shot.width + 2) {
        failures.push(shot.name + ': brand overflows header');
      }
      if (shot.name === 'home-desktop' || shot.name === 'home-mobile' || shot.name === 'home-small') {
        await page.locator('.site-header').screenshot({ path: path.join(outputs, 'brand-' + shot.name + '.png'), animations: 'disabled' });
      }
    }
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
      ownImages.forEach(img => { img.loading = 'eager'; });
      await Promise.race([
        Promise.all(ownImages.map(async img => { try { await img.decode(); } catch {} })),
        new Promise(resolve => setTimeout(resolve, 2500))
      ]);
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
    // Ensure all viewport-triggered reveals have actually been seen before a
    // full-page snapshot. A single top-of-page capture hides lazy reveals.
    if (['home-mobile', 'cases-mobile'].includes(shot.name)) {
      await page.evaluate(async () => {
        const height = document.documentElement.scrollHeight;
        const step = Math.max(300, Math.round(window.innerHeight * .7));
        for (let y = 0; y < height; y += step) {
          window.scrollTo({ top: y, behavior: 'instant' });
          await new Promise(resolve => setTimeout(resolve, 80));
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.waitForTimeout(200);
    }
    await page.screenshot({ path: path.join(outputs, shot.name + '.png'), animations: 'disabled', fullPage: ['home-mobile','cases-mobile'].includes(shot.name) });
    if (shot.name === 'home-desktop') {
      await page.getByRole('tab', { name: /02 \/ PROCESS/ }).click();
      if (await page.getByRole('tab', { name: /02 \/ PROCESS/ }).getAttribute('aria-selected') !== 'true') {
        failures.push('Hero console tab did not change');
      }
    }
    if (shot.name === 'home-mobile') {
      const button = page.locator('.mobile-nav-toggle');
      await button.click();
      if (await button.getAttribute('aria-expanded') !== 'true') failures.push('Mobile menu did not open');
      await page.locator('.mobile-nav-panel a[href="#trabalhos"]').click();
      if (await button.getAttribute('aria-expanded') !== 'false') {
        failures.push('Mobile menu did not close after navigation');
      }
      const simulator = page.locator('.ops-next');
      await simulator.scrollIntoViewIfNeeded();
      const before = await page.locator('.ops-event').innerText();
      await simulator.click();
      const after = await page.locator('.ops-event').innerText();
      if (after === before || !after.includes('EVT-002')) {
        failures.push('OpsLens synthetic simulation did not advance to the SLA event');
      }
    }
    if (shot.name === 'home-desktop' || shot.name === 'home-mobile') {
      const funnel = page.locator('.contact-funnel');
      await funnel.scrollIntoViewIfNeeded();
      if (await page.locator('.funnel-send').count()) {
        failures.push(shot.name + ': mail composer is exposed before category selection');
      }
      await page.locator('.funnel-option').first().click();
      await page.locator('.funnel-field input').first().fill('Pessoa de Teste');
      await page.locator('.funnel-field textarea').fill('Preciso de uma aplicação web com acesso por login.');
      const mailto = decodeURIComponent(await page.locator('.funnel-send').getAttribute('href') || '');
      if (!mailto.startsWith('mailto:gustavoromaom178@hotmail.com?') ||
          !mailto.includes('Proposta de site ou aplicação web') ||
          !mailto.includes('Pessoa de Teste') ||
          !mailto.includes('Preciso de uma aplicação web')) {
        failures.push(shot.name + ': site demand generated an invalid email draft');
      }
      await funnel.screenshot({
        path: path.join(outputs, 'contact-web-' + shot.name + '.png'),
        animations: 'disabled'
      });
      await page.locator('.funnel-back').click();
      if (await page.locator('.funnel-send').count()) {
        failures.push(shot.name + ': email composer remains visible after going back');
      }
      await page.locator('.funnel-option').nth(4).click();
      const recruitmentDraft = decodeURIComponent(await page.locator('.funnel-send').getAttribute('href') || '');
      if (!recruitmentDraft.includes('Convite para oportunidade em desenvolvimento de software') ||
          !recruitmentDraft.includes('Recrutamento') ||
          !recruitmentDraft.includes('Vaga ou oportunidade:')) {
        failures.push(shot.name + ': recruiter email template is invalid');
      }
      await funnel.screenshot({
        path: path.join(outputs, 'contact-recruiter-' + shot.name + '.png'),
        animations: 'disabled'
      });
      const contactWidth = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (contactWidth > 2) failures.push(shot.name + ': contact funnel causes overflow ' + contactWidth);
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
