import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const out = 'project-artifacts';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({
  executablePath:process.env.CHROME_BIN || '/usr/bin/google-chrome',
  headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']
});
try {
  const page=await browser.newPage({viewport:{width:1160,height:780},deviceScaleFactor:1});
  page.on('pageerror',e=>console.warn('PAGE ERROR',e.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(2000);
  const menu = page.locator('#phase3-menu');
  console.log('Title:',await page.title(),'Menu count:',await menu.count());
  await page.screenshot({path:out+'/blohshblast-home.png',animations:'disabled'});
  // Move to gameplay using actual interface controls; do not simulate game state.
  const play = page.locator('[data-pc-action="play"]');
  if (await play.count() && await play.first().isVisible()) {
    await play.first().click();
  }
  const classic=page.locator('[data-mode="classic"]');
  if(await classic.count() && await classic.first().isVisible()) {
    await classic.first().click();
  }
  await page.waitForTimeout(900);
  const board=page.locator('#board');
  console.log('Board visible:',await board.isVisible(), 'cells:', await board.locator('*').count());
  if(await board.isVisible())await page.screenshot({path:out+'/blohshblast-gameplay.png',animations:'disabled'});
  await page.close();
} finally {await browser.close();}
