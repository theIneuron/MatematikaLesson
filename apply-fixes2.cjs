const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');
const files = ['Dars06','Dars07','Dars08','Dars09','Dars10','Dars11','Dars12','Dars13','Dars14','Dars15','Dars16'].map(f => f + '.jsx');
const REPLACEMENTS = [
  // variant tugmalari vertikal paddingini kamaytirish (4 ta variant => ~24px)
  ["padding: 'clamp(12px, 1.7vw, 15px) clamp(14px, 2.1vw, 19px)'", "padding: 'clamp(10px, 1.5vw, 12px) clamp(14px, 2.1vw, 19px)'"],
  // kasr-variant balandligi (ustun: surat/chiziq/maxraj) — desktop chegarasi 38->27
  ['.frac-mid { font-size: clamp(26px, 5vw, 38px); }', '.frac-mid { font-size: clamp(22px, 3.6vw, 27px); }'],
];
for (const f of files) {
  const p = path.join(dir, f);
  let txt = fs.readFileSync(p, 'utf8');
  const counts = REPLACEMENTS.map(([s, r]) => { const n = txt.split(s).length - 1; if (n) txt = txt.split(s).join(r); return n; });
  fs.writeFileSync(p, txt, 'utf8');
  console.log(f, counts.join(','));
}
