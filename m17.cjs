const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage({ viewport: { width:1366, height:768 } });
  for (const lang of ['ru','uz']) {
    await p.goto('http://localhost:5174/dars/kasr-ayirish-harxil', { waitUntil:'networkidle' });
    await p.waitForSelector('.stage-content');
    if(lang==='uz'){await p.evaluate(()=>{const x=[...document.querySelectorAll('button')].find(e=>e.textContent.trim().toUpperCase()==='UZ'&&e.offsetParent!==null);if(x)x.click();});await p.waitForTimeout(200);}
    const total = await p.evaluate(()=>window.__total);
    const res=[];
    for(let i=0;i<total;i++){await p.evaluate(idx=>window.__goScreen(idx),i);await p.waitForTimeout(500);const m=await p.evaluate(()=>{const s=document.querySelector('.stage-content');const c=document.querySelector('.stage-header .chrome .mono.small');const mm=(c?c.textContent.trim():'').match(/(\d+)\s*\/\s*(\d+)/);return{cur:mm?+mm[1]:null,o:s.scrollHeight-s.clientHeight,ch:s.clientHeight};});if(m.o>2)res.push(`s${m.cur}(+${m.o})`);}
    console.log(`Dars17 [${lang.toUpperCase()}] total=${total} clientH check ->`, res.length?res.join(', '):"scroll YO'Q");
  }
  await b.close();
})();
