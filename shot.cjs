const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1366,height:768}});
await p.goto('http://localhost:5173/dars/kasr-ayirish-harxil',{waitUntil:'networkidle'});await p.waitForSelector('.stage-content');await p.waitForTimeout(400);
for(const [idx,name] of [[12,'s12_sl13'],[14,'s14_sl15'],[15,'s15_sl16']]){await p.evaluate(i=>window.__go(i),idx);await p.waitForTimeout(900);await p.screenshot({path:`/tmp/${name}.png`});const sc=await p.evaluate(()=>{const s=document.querySelector('.stage-content');return s.scrollHeight-s.clientHeight;});console.log(name,'scroll=',sc);}
await b.close();})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
