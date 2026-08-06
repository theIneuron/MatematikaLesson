// build-grade3-dars17.mjs — Dars17.jsx ni Dars16.jsx dan YIG'ADI (etap 3, sborka).
// Metodist qoidasi: «yangi mexanika YARATMA, tayyoridan foydalan» — infra donordan bayt-aniq
// ko'chadi; sahna 3-darsdan (ustaxona), konsol va jadval 15-darsdan, svyortka 13-darsdan.
// Bir martalik generator: yig'ilgandan keyin manba — `src/components/grade3/Dars17.jsx` o'zi.
//
// Ishlatish: node scripts/build-grade3-dars17.mjs [--out src/components/grade3/Dars17.jsx]
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars16.jsx');
const OUT = path.resolve(process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'src/components/grade3/Dars17.jsx');
const BLK = path.resolve(process.env.D19_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const blk = (n) => fs.readFileSync(path.join(BLK, n), 'utf8').split(String.fromCharCode(13)).join('');

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
cut('// ============================================================================\n// DD 3-SINF | Dars16',
  '\n// ============================================================\n\n// ============================================================\n// ПАЛИТРА',
  blk('d19-head.txt').trimEnd(), 'sarlavha');

// 2) TOTAL_SCREENS + LESSON_META + SCREEN_META
cut('const TOTAL_SCREENS = 15;', '\n\n// shuffleMC/shuffleArr', blk('d19-meta.txt').trimEnd(), 'meta');

// 3) CONTENT
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blk('d19-content.txt').trimEnd(), 'CONTENT');

// 4) BRIDGES va S14_PAYOFF
cut('const BRIDGES = {', '\n\n// s14 payoff', blk('d19-bridges.txt').trimEnd(), 'BRIDGES');
cut('const S14_PAYOFF = {', "\n\n// Lumo yo'l-xaritasi yozuvi", blk('d19-payoff.txt').trimEnd(), 'S14_PAYOFF');

// 5) sahna: D17 saralash zali -> D19 ustaxona (3-dars maydoni asosida)
cut('// --- SARALASH ZALI (D17)', '// --- RAQAM-PLITA (NumPad).', blk('d19-scene.txt'), 'sahna');

// 6) MCRoundD2 bu darsda ISHLATILMAYDI (bitta savolli MC o'zimizniki, MCOne) — o'lik kod
// qolmasin deb olib tashlaymiz.
cut("// --- KO'P-RAUNDLI MC", '// ============================================================\n// DARS12 EKRANLARI', '', 'MCRoundD2 olib tashlash');

// 7) dars figuralari: soat/qatorlar/sonlar o'qi/soat-fakt -> konsol/jadval/svyortka/modul
cut("// --- 5 soniyalik o'ylash SOATI", 'const Screen0 = (props) => {', blk('d19-figs.txt'), 'figuralar');

// 8) ekranlar
cut('const Screen0 = (props) => {', '// ============================================================\n// KORNEVOY KOMPONENT',
  blk('d19-screens.txt'), 'ekranlar');

// 9) root funksiya nomi
if (!s.includes('export default function DivisorsLesson({')) throw new Error('root funksiya topilmadi');
s = s.replace('export default function DivisorsLesson({', 'export default function TwoDigitMulLesson({');

// 10) STYLES: D17 ga xos, bu darsda ISHLATILMAYDIGAN qoidalar olib tashlanadi, D19 qo'shiladi.
//     Saqlanadi: d15-check*, d15-rulelines/ruleline/ruleex, reveal-soft.
const si = s.indexOf('const STYLES = `');
if (si < 0) throw new Error('STYLES topilmadi');
const head = s.slice(0, si);
let css = s.slice(si);
const DROP = ['d17-', 'lm-digtray', 'lm-digchip', 'lm-bin', 'd15-pan', 'd12-card', 'lm-clock'];
const before = css.length;
css = css.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return DROP.some((d) => sel.includes('.' + d)) ? pre.replace(/\n$/, '') : m;
});
console.log(`STYLES: D17 ga xos qoidalar -${before - css.length} belgi`);
const closeIdx = css.lastIndexOf('`;');
if (closeIdx < 0) throw new Error('STYLES yopilishi topilmadi');
css = css.slice(0, closeIdx) + blk('d19-styles.txt') + css.slice(closeIdx);
s = head + css;

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nYozildi: ${OUT} (${s.split('\n').length} qator)`);
