import { chromium } from 'playwright-core';
const hosts = [
  'https://gustavormartins.vercel.app/',
  'https://gustavormartins.vercel.app/cases/',
  'https://gustavormartins-github-pxegejdos-gustavormartins-projects.vercel.app/',
];
const failures = [];
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage']
});
for (const url of hosts) {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1});
    const page = await context.newPage();
    const issues=[];
    const requestFailures=[];
    const badResponses=[];
    page.on('pageerror', e => issues.push(e.message));
    page.on('console', e => {if(e.type()==='error')issues.push('console: '+e.text());});
    page.on('requestfailed', r => requestFailures.push(r.url()+' '+r.failure()?.errorText));
    page.on('response', r => {if (r.status()>=400)badResponses.push({status:r.status(),url:r.url()});});
    try {
      const response = await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
      await page.waitForTimeout(3000);
      const result=await page.evaluate(()=>({
        title:document.title,
        htmlLang:document.documentElement.lang,
        heading:document.querySelector('h1')?.textContent?.trim().slice(0,180),
        text:document.body.innerText.slice(0,300),
        overflow:document.documentElement.scrollWidth-window.innerWidth,
        scripts:[...document.scripts].length,
        brokenImages:[...document.images].filter(x=>x.complete&&x.naturalWidth===0).map(x=>x.src).slice(0,8),
        branding:(()=>{const brand=document.querySelector('.brand-lockup');const cursor=brand?.querySelector('.brand-terminal-cursor');const watermark=brand?.querySelector('.brand-blohsh-watermark');return brand?{text:brand.textContent?.trim(),cursorAnimation:cursor?getComputedStyle(cursor).animationName:null,watermark:watermark?getComputedStyle(watermark).backgroundImage:null,right:brand.getBoundingClientRect().right}:null;})(),
      }));
      console.log('DIAG',JSON.stringify({url,width,http:response?.status(),finalUrl:page.url(),...result,errors:issues.slice(0,12),requestFailures:requestFailures.slice(0,10),badResponses:badResponses.slice(0,15)}));
      if (url.includes('gustavormartins.vercel.app') && (response?.status() !== 200 || !result.heading || /vercel|login|not_found/i.test(result.heading))) failures.push(`${url} ${width}px did not serve the portfolio`);
      if (url.startsWith('https://gustavormartins.vercel.app/')) {
        if (!result.branding?.text?.includes('Gustavo Martins Dev') || !result.branding.text.includes('BLOHSH')) failures.push(`${url}: new GM/BLOHSH wordmark missing`);
        if (result.branding?.cursorAnimation !== 'brand-blink') failures.push(`${url}: blinking terminal cursor missing`);
        if (!result.branding?.watermark?.includes('blohsh-logo.png')) failures.push(`${url}: original Blohsh mark missing`);
        if (result.branding?.right > width+2) failures.push(`${url}: wordmark exceeds viewport`);
      }
    } catch(e) {console.log('DIAG_FAILED',JSON.stringify({url,width,error:String(e),errors:issues,requestFailures:requestFailures.slice(0,10)}));}
    await context.close();
  }
}
await browser.close();
if (failures.length) { console.error('PRODUCTION CHECK FAILED', failures); process.exitCode = 1; } else { console.log('PRODUCTION PUBLIC ROUTES OK'); }
