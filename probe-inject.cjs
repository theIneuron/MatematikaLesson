const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');
const files = ['Dars06','Dars07','Dars08','Dars09','Dars10','Dars11','Dars12','Dars13','Dars14','Dars15','Dars16'].map(f => f + '.jsx');
const ORIG = 'const [current, setCurrent] = useState(0);';
const MARK = ' useEffect(()=>{window.__goScreen=(i)=>setCurrent(i);window.__total=TOTAL_SCREENS;},[]);/*SCROLLPROBE*/';
const mode = process.argv[2];
for (const f of files) {
  const p = path.join(dir, f);
  let txt = fs.readFileSync(p, 'utf8');
  if (mode === 'inject') {
    if (txt.includes('/*SCROLLPROBE*/')) { console.log('skip', f); continue; }
    if (!txt.includes(ORIG)) { console.log('NOT FOUND', f); continue; }
    txt = txt.replace(ORIG, ORIG + MARK);
  } else {
    txt = txt.replace(ORIG + MARK, ORIG);
  }
  fs.writeFileSync(p, txt, 'utf8');
  console.log(mode, f);
}
