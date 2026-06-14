const { chromium } = require('playwright');
const BASE = 'http://localhost:5176';
const VIEWPORT = { width: 1366, height: 768 };
const TOL = 2;
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: VIEWPORT });
  const setLang = async (l) => { await page.evaluate((x) => { const b=[...document.querySelectorAll('button')].find(z=>z.textContent.trim().toUpperCase()===x.toUpperCase()&&z.offsetParent!==null); if(b)b.click(); }, l); };
  for (const lang of ['ru','uz']) {
    await page.goto(`${BASE}/dars/kasr-ayirish-harxil`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.stage-content', { timeout: 10000 }); await page.waitForFunction(()=>typeof window.__total==='number', { timeout: 10000 });
    if (lang==='uz'){ await setLang('uz'); await page.waitForTimeout(250); }
    const total = await page.evaluate(()=>window.__total);
    const bad = [];
    for (let i=0;i<total;i++){
      await page.evaluate((idx)=>window.__goScreen(idx), i);
      await page.waitForTimeout(540);
      const m = await page.evaluate(()=>{ const sc=document.querySelector('.stage-content'); return sc?{o:sc.scrollHeight-sc.clientHeight, ch:sc.clientHeight}:null; });
      if (m && m.o>TOL) bad.push(`s${i}(+${m.o})`);
    }
    console.log(`[${lang.toUpperCase()}] ${total} ekran -> ` + (bad.length? 'SKROLL: '+bad.join(', ') : "skroll YO'Q ✓"));
  }
  await browser.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
