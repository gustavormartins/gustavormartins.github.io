import { chromium } from 'playwright-core';
const hosts = [
  'https://gustavormartins.vercel.app/',
  'https://gustavormartins.vercel.app/cases/',
  'https://gustavormartins.vercel.app/recrutador/',
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
      if (url === 'https://gustavormartins.vercel.app/' && width === 390) {
        const options = page.locator('.funnel-option');
        if (await options.count() !== 6) {
          failures.push('Expected six intent options on the public homepage');
        } else {
          if (await page.locator('.funnel-send').count()) failures.push('Mail draft visible before choosing a demand');
          await options.first().click();
          const webDraft = decodeURIComponent(await page.locator('.funnel-send').getAttribute('href') || '');
          if (!webDraft.startsWith('mailto:gustavoromaom178@hotmail.com?') ||
              !webDraft.includes('Proposta de site ou aplicação web')) {
            failures.push('Website offer mailto is incorrect on production');
          }
          await page.locator('.funnel-back').click();
          await page.locator('.funnel-option').nth(4).click();
          const recruiterDraft = decodeURIComponent(await page.locator('.funnel-send').getAttribute('href') || '');
          if (!recruiterDraft.includes('Convite para oportunidade em desenvolvimento de software')) {
            failures.push('Recruiter mailto is incorrect on production');
          }
          console.log('CONTACT_FUNNEL_OK', JSON.stringify({options: 6, webMailto: webDraft.startsWith('mailto:'), recruiterMailto: recruiterDraft.startsWith('mailto:')}));
        }
      }
      if (url === 'https://gustavormartins.vercel.app/recrutador/') {
        const projects = await page.locator('.recruiter-project').count();
        if (projects !== 3) failures.push('Expected exactly 3 evidence-led recruiter projects');
        if (!result.text.includes('RECRUITER VIEW')) failures.push('Recruiter hero copy missing');
        await page.getByRole('link', {name: /CONVIDAR PARA ENTREVISTA/}).first().click();
        await page.locator('.funnel-send').waitFor({state:'visible',timeout:12000});
        const mail = decodeURIComponent(await page.locator('.funnel-send').getAttribute('href') || '');
        if (!mail.includes('Convite para oportunidade em desenvolvimento de software')) failures.push('Recruiter deep-link did not preselect the email template');
        console.log('RECRUITER_MODE_OK',JSON.stringify({width,projects,mailPreview:mail.startsWith('mailto:'),url:page.url()}));
      }
    } catch(e) {console.log('DIAG_FAILED',JSON.stringify({url,width,error:String(e),errors:issues,requestFailures:requestFailures.slice(0,10)}));}
    await context.close();
  }
}
await browser.close();
if (failures.length) { console.error('PRODUCTION CHECK FAILED', failures); process.exitCode = 1; } else { console.log('PRODUCTION PUBLIC ROUTES OK'); }
