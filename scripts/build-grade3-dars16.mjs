// build-grade3-dars16.mjs — Dars16.jsx ni Dars15.jsx dan YIG'ADI (etap 3, sborka).
// Metodist 2026-08-05: «yangi mexanika YARATMA, tayyoridan foydalan» — shuning uchun infra
// donordan bayt-aniq ko'chadi, sahna va sonlar o'qi 6-darsdan, qatorlar 13-darsdan,
// tokchaga saralash 1-darsdan.
// Bir martalik generator: yig'ilgandan keyin manba — `src/components/grade3/Dars16.jsx` o'zi.
//
// Ishlatish: node scripts/build-grade3-dars16.mjs [--out src/components/grade3/Dars16.jsx]
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars15.jsx');
const OUT = path.resolve(process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'src/components/grade3/Dars16.jsx');
const BLK = path.resolve(process.env.D17_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const blk = (n) => fs.readFileSync(path.join(BLK, n), 'utf8');

// Donor ish nusxasida CRLF bo'lishi mumkin (git normalizatsiyasi), anchorlar esa LF bilan
// yozilgan — shuning uchun CR belgilarini olib tashlaymiz, natija LF bilan yoziladi.
const CR = String.fromCharCode(13);
let s = fs.readFileSync(SRC, 'utf8').split(CR).join('');

const cut = (startAnchor, endAnchor, replacement, label) => {
  const a = s.indexOf(startAnchor);
  if (a < 0) throw new Error(`${label}: boshlanish topilmadi -> ${startAnchor.slice(0, 60)}`);
  const b = s.indexOf(endAnchor, a + startAnchor.length);
  if (b < 0) throw new Error(`${label}: oxiri topilmadi -> ${endAnchor.slice(0, 60)}`);
  s = s.slice(0, a) + replacement + s.slice(b);
  console.log(`${label}: ${b - a} -> ${replacement.length} belgi`);
};

// 1) sarlavha
cut('// ============================================================================\n// DD 3-SINF | Dars15',
  '\n// ============================================================\n\n// ============================================================\n// ПАЛИТРА',
  blk('d17-head.txt').trimEnd(), 'sarlavha');

// 2) TOTAL_SCREENS + LESSON_META + SCREEN_META
cut('const TOTAL_SCREENS = 15;', '\n\n// shuffleMC/shuffleArr', blk('d17-meta.txt').trimEnd(), 'meta');

// 3) CONTENT
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blk('d17-content.txt').trimEnd(), 'CONTENT');

// 4) BRIDGES va S14_PAYOFF
cut('const BRIDGES = {', '\n\n// s14 payoff', blk('d17-bridges.txt').trimEnd(), 'BRIDGES');
cut('const S14_PAYOFF = {', "\n\n// Lumo yo'l-xaritasi yozuvi", blk('d17-payoff.txt').trimEnd(), 'S14_PAYOFF');

// 5) sahna: D16 ning bog' vazifasi zali -> D17 ning saralash zali (6-dars asosida)
cut("// --- BOG' VAZIFASI ZALI (D16)", '// --- RAQAM-PLITA (NumPad).', blk('d17-scene.txt'), 'sahna');

// 6) dars figuralari: konsol/jadval/chumoli -> qatorlar massivi/sonlar o'qi/soat
cut('// --- KONSOL YACHEYKASI (1-darsdan', 'const Screen0 = (props) => {', blk('d17-figs.txt'), 'figuralar');

// 7) ekranlar
cut('const Screen0 = (props) => {', '// ============================================================\n// KORNEVOY KOMPONENT',
  blk('d17-screens.txt'), 'ekranlar');

// 8) root funksiya nomi
if (!s.includes('export default function WordProblemLesson({')) throw new Error('root funksiya topilmadi');
s = s.replace('export default function WordProblemLesson({', 'export default function DivisorsLesson({');

// 9) STYLES: D16 ga xos, bu darsda ISHLATILMAYDIGAN qoidalar olib tashlanadi, D16 qo'shiladi.
//    Saqlanadi: d15-check*, d15-pan*, d15-rulelines/ruleline/ruleex, d12-card* (ko'prik kartalari).
const si = s.indexOf('const STYLES = `');
if (si < 0) throw new Error('STYLES topilmadi');
const head = s.slice(0, si);
let css = s.slice(si);
const DROP = ['lm-console', 'lm-cons', 'd16-console', 'd16-row', 'd16-plate', 'd16-bed', 'd16-cover', 'd16-tbl',
  'd16-bars', 'd16-bar', 'd16-expr', 'd16-note', 'd16-setup', 'd16-steprow', 'd16-res', 'd16-hook-scene',
  'd16-final-scene', 'd16-load', 'd16-tagrow', 'd16-tag'];
const before = css.length;
css = css.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return DROP.some((d) => sel.includes('.' + d)) ? pre.replace(/\n$/, '') : m;
});
console.log(`STYLES: D16 ga xos qoidalar -${before - css.length} belgi`);
const closeIdx = css.lastIndexOf('`;');
if (closeIdx < 0) throw new Error('STYLES yopilishi topilmadi');
css = css.slice(0, closeIdx) + blk('d17-styles.txt') + css.slice(closeIdx);
s = head + css;

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nYozildi: ${OUT} (${s.split('\n').length} qator)`);
