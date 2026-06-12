const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');
const all = ['Dars06','Dars07','Dars08','Dars09','Dars10','Dars11','Dars12','Dars13','Dars14','Dars15','Dars16'].map(f => f + '.jsx');

// global: body qator balandligi
const GLOBAL = [['line-height: 1.5; }', 'line-height: 1.42; }']];
// fayl bo'yicha
const PER_FILE = {
  'Dars06.jsx': [
    ["<div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}><BarModel parts={4} shaded={3} height={50}/></div>",
     "<div style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}><BarModel parts={4} shaded={3} height={40}/></div>"],
  ],
  'Dars14.jsx': [
    ['marginBottom: 14 }}>{t(c.main_label)}', 'marginBottom: 6 }}>{t(c.main_label)}'],
    ["fade-up delay-2\" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>", "fade-up delay-2\" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>"],
    ["flexDirection: 'column', gap: 12 }}>", "flexDirection: 'column', gap: 8 }}>"],
  ],
  'Dars15.jsx': [
    ['marginBottom: 14 }}>{t(c.main_label)}', 'marginBottom: 6 }}>{t(c.main_label)}'],
    ["fade-up delay-2\" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>", "fade-up delay-2\" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>"],
    ["flexDirection: 'column', gap: 12 }}>", "flexDirection: 'column', gap: 8 }}>"],
  ],
  'Dars16.jsx': [
    ['marginBottom: 14 }}>{t(c.main_label)}', 'marginBottom: 6 }}>{t(c.main_label)}'],
    ["fade-up delay-2\" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>", "fade-up delay-2\" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>"],
  ],
};
for (const f of all) {
  const p = path.join(dir, f);
  let txt = fs.readFileSync(p, 'utf8');
  const reps = [...GLOBAL, ...(PER_FILE[f] || [])];
  const counts = reps.map(([s, r]) => { const n = txt.split(s).length - 1; if (n) txt = txt.split(s).join(r); return n; });
  fs.writeFileSync(p, txt, 'utf8');
  console.log(f, counts.join(','));
}
