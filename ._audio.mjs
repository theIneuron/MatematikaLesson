import { chromium } from 'playwright';
const urls = {
  v2: 'http://localhost:5173/1-sinf/matematika/dars01-v2-sanash-1-5',
  v1: 'http://localhost:5173/1-sinf/matematika/dars01-sanash-1-5',
};
const stub = () => {
  window.__spoken = [];
  const ss = window.speechSynthesis;
  ss.speak = function(u){ window.__spoken.push({t:String(u&&u.text||'').slice(0,40), lang:u&&u.lang});
    setTimeout(()=>{try{u.onstart&&u.onstart();}catch(e){}},5);
    setTimeout(()=>{try{u.onend&&u.onend();}catch(e){}},30); };
  ss.cancel=function(){}; ss.getVoices=function(){return [{lang:'ru-RU'},{lang:'uz-UZ'}];};
};
const browser = await chromium.launch();
async function run(url, toggleTo){
  const page = await browser.newPage();
  await page.addInitScript(stub);
  await page.goto(url,{waitUntil:'networkidle',timeout:20000});
  await page.waitForTimeout(200);
  if(toggleTo){ const b=page.locator(`button:text-is("${toggleTo}")`).first(); if(await b.count()) {await b.click().catch(()=>{});} }
  await page.waitForTimeout(2200);
  // advance 3 screens
  for(let i=0;i<3;i++){ const n=page.locator('button:has-text("Дальше"),button:has-text("Davom")').first(); if(await n.count()){await n.click().catch(()=>{});await page.waitForTimeout(1500);} }
  const spoken = await page.evaluate(()=>window.__spoken||[]);
  await page.close();
  return spoken;
}
for (const [k,url] of Object.entries(urls)) {
  const ru = await run(url, 'RU');
  console.log(`\n=== ${k} RU === (${ru.length} spoken)`);
  ru.slice(0,6).forEach((s,i)=>console.log(`  [${i}] lang=${s.lang} :: ${s.t}`));
}
for (const [k,url] of Object.entries(urls)) {
  const uz = await run(url, 'UZ');
  console.log(`\n=== ${k} UZ === (${uz.length} spoken)`);
  uz.slice(0,6).forEach((s,i)=>console.log(`  [${i}] lang=${s.lang} :: ${s.t}`));
}
await browser.close();
