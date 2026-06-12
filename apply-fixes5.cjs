const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'src','components');
const all=['Dars06','Dars07','Dars08','Dars09','Dars10','Dars11','Dars12','Dars13','Dars14','Dars15','Dars16'].map(f=>f+'.jsx');
const R=[
  ['.frac-mid { font-size: clamp(22px, 3.6vw, 27px); }','.frac-mid { font-size: clamp(20px, 3.2vw, 24px); }'],
  ['padding: clamp(14px, 2.6vw, 20px);','padding: clamp(13px, 2.2vw, 17px);'],          // .frame
  ['padding: clamp(12px, 2vw, 16px)','padding: clamp(11px, 1.8vw, 14px)'],              // frame-soft/success/tip
  ['.h-sub { font-size: clamp(17px, 2.5vw, 20px); }','.h-sub { font-size: clamp(16px, 2.2vw, 18px); }'],
];
for(const f of all){const p=path.join(dir,f);let t=fs.readFileSync(p,'utf8');const c=R.map(([s,r])=>{const n=t.split(s).length-1;if(n)t=t.split(s).join(r);return n;});fs.writeFileSync(p,t,'utf8');console.log(f,c.join(','));}
