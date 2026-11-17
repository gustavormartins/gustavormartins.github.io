import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const root = process.cwd();
const issues = [];
await mkdir(path.join(root, 'snapshots'), { recursive: true });

const shots = [
  { name: 'home-desktop', file: 'index.html', width: 1440, height: 900 },
  { name: 'home-mobile', file: 'index.html', width: 390, height: 844 },
  { name: 'home-small', file: 'index.html', width: 320, height: 720 },
  { name: 'projects-desktop', file: 'index.html', anchor: '#projetos', width: 1440, height: 900 },
  { name: 'projects-mobile', file: 'index.html', anchor: '#projetos', width: 390, height: 844 },
  { name: 'case-desktop', file: 'cases/index.html', anchor: '#blohshblast', width: 1440, height: 900 },
  { name: 'case-mobile', file: 'cases/index.html', anchor: '#blohshblast', width: 390, height: 844 },
  { name: 'full-home-mobile', file: 'index.html', width: 390, height: 844, fullPage: true },
  { name: 'full-case-mobile', file: 'cases/index.html', width: 390, height: 844, fullPage: true },
];

try {
  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const fileUrl = pathToFileURL(path.join(root, shot.file)).href;
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });

    // Wait for images and fonts where possible, then freeze scrolling at the target.
    await page.evaluate(async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 2000)),
      ]);
    });
    await page.waitForTimeout(150);

    if (shot.anchor) {
      await page.evaluate(selector => {
        const element = document.querySelector(selector);
        if (!element) throw new Error('Missing anchor: ' + selector);
        const absoluteTop = element.getBoundingClientRect().top + window.scrollY - 85;
        window.scrollTo({ top: absoluteTop, behavior: 'instant' });
      }, shot.anchor);
      await page.waitForTimeout(320);
    }

    const metrics = await page.evaluate(() => ({
      overflow: Math.round(document.documentElement.scrollWidth - window.innerWidth),
      y: Math.round(window.scrollY),
      height: document.documentElement.scrollHeight,
    }));
    if (metrics.overflow > 2) {
      issues.push(`Horizontal overflow on ${shot.name}: ${metrics.overflow}px`);
    }
    const output = path.join(root, 'snapshots', shot.name + '.png');
    await page.screenshot({ path: output, fullPage: Boolean(shot.fullPage), animations: 'disabled' });
    console.log(`${shot.name}: ${shot.width}x${shot.height}, scrollY=${metrics.y}, pageHeight=${metrics.height}, overflow=${metrics.overflow}`);
    await context.close();
  }
} finally {
  await browser.close();
}
if (issues.length) {
  throw new Error(issues.join('\n'));
}
