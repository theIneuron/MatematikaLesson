const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');
const files = ['Dars06','Dars07','Dars08','Dars09','Dars10','Dars11','Dars12','Dars13','Dars14','Dars15','Dars16'].map(f => f + '.jsx');

// [search, replace, expectAtLeast]  — desktop yuqori clamp-chegaralarini pasaytirish (mobil min o'zgarmaydi)
const REPLACEMENTS = [
  // --- scroll maydonini kengaytirish: header / nav / content padding ---
  ['padding-bottom: clamp(17px, 3.4vw, 34px);', 'padding-bottom: clamp(12px, 2.2vw, 20px);'],   // stage-content
  ['padding-top: clamp(10px, 1.7vw, 16px);',    'padding-top: clamp(8px, 1.3vw, 12px);'],        // stage-content
  ['padding-top: clamp(12px, 2vw, 18px);',      'padding-top: clamp(8px, 1.4vw, 12px);'],        // stage-header
  ['padding-top: clamp(12px, 2vw, 15px);',      'padding-top: clamp(9px, 1.5vw, 11px);'],        // stage-nav
  ['padding-bottom: clamp(12px, 2vw, 15px);',   'padding-bottom: clamp(9px, 1.5vw, 11px);'],     // stage-nav
  // --- frame paddinglari ---
  ['padding: clamp(17px, 3.4vw, 30px);',        'padding: clamp(14px, 2.6vw, 20px);'],           // .frame
  ['padding: clamp(14px, 2.5vw, 20px)',         'padding: clamp(12px, 2vw, 16px)'],              // frame-soft/success/tip (×3)
  // --- tipografika ---
  ['.h-title { font-size: clamp(22px, 4vw, 38px); }', '.h-title { font-size: clamp(22px, 3.4vw, 30px); }'],
  // --- ustun oraliqlari (inline) ---
  ["gap: 'clamp(16px, 2.6vw, 24px)'", "gap: 'clamp(12px, 2vw, 18px)'"],
  ["gap: 'clamp(18px, 3vw, 26px)'",   "gap: 'clamp(13px, 2.2vw, 18px)'"],
  ["gap: 'clamp(15px, 2.4vw, 22px)'", "gap: 'clamp(12px, 2vw, 16px)'"],
  ["gap: 'clamp(17px, 2.5vw, 24px)'", "gap: 'clamp(12px, 2vw, 18px)'"],   // QuestionScreen/NumInputScreen
];

for (const f of files) {
  const p = path.join(dir, f);
  let txt = fs.readFileSync(p, 'utf8');
  const counts = [];
  for (const [s, r] of REPLACEMENTS) {
    const n = txt.split(s).length - 1;
    if (n > 0) txt = txt.split(s).join(r);
    counts.push(n);
  }
  fs.writeFileSync(p, txt, 'utf8');
  console.log(f, counts.join(','));
}
console.log('legend:', REPLACEMENTS.map((_,i)=>i).join(','));
