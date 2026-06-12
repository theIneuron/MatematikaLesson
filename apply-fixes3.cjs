const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');
// fayl bo'yicha vizualizator o'lchamlarini kamaytirish
const PER_FILE = {
  'Dars07.jsx': [['height={76}', 'height={58}']],           // NumberLine
  'Dars08.jsx': [['size={56}', 'size={44}'], ['size={58}', 'size={44}']], // SharingBoard
  'Dars14.jsx': [['pieSize={128}', 'pieSize={96}']],        // FracFigure
};
for (const [f, reps] of Object.entries(PER_FILE)) {
  const p = path.join(dir, f);
  let txt = fs.readFileSync(p, 'utf8');
  const counts = reps.map(([s, r]) => { const n = txt.split(s).length - 1; if (n) txt = txt.split(s).join(r); return `${s}=${n}`; });
  fs.writeFileSync(p, txt, 'utf8');
  console.log(f, counts.join(' | '));
}
