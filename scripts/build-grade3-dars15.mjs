// build-grade3-dars15.mjs — Dars15.jsx ni Dars14.jsx dan YIG'ADI (etap 3, sborka).
// Metodist 2026-08-05: «yangi mexanika YARATMA, tayyoridan foydalan» — shuning uchun infra
// donordan bayt-aniq ko'chadi, sahna 4-darsdan, konsol 1-darsdan, «xatoni top» 13-darsdan.
// Bir martalik generator: yig'ilgandan keyin manba — `src/components/grade3/Dars15.jsx` o'zi.
//
// Ishlatish: node scripts/build-grade3-dars15.mjs [--out src/components/grade3/Dars15.jsx]
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars14.jsx');
const OUT = path.resolve(process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'src/components/grade3/Dars15.jsx');
const BLK = path.resolve(process.env.D16_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
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
cut('// ============================================================================\n// DD 3-SINF | Dars14',
  '\n// ============================================================\n\n// ============================================================\n// ПАЛИТРА',
  blk('d16-head.txt').trimEnd(), 'sarlavha');

// 2) TOTAL_SCREENS + LESSON_META + SCREEN_META
cut('const TOTAL_SCREENS = 15;', '\n\n// shuffleMC/shuffleArr', blk('d16-meta.txt').trimEnd(), 'meta');

// 3) CONTENT
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blk('d16-content.txt').trimEnd(), 'CONTENT');

// 4) BRIDGES va S14_PAYOFF
cut('const BRIDGES = {', '\n\n// s14 payoff', blk('d16-bridges.txt').trimEnd(), 'BRIDGES');
cut('const S14_PAYOFF = {', "\n\n// Lumo yo'l-xaritasi yozuvi", blk('d16-payoff.txt').trimEnd(), 'S14_PAYOFF');

// 5) sahna: D15 ning jo'natish maydonchasi -> D16 ning bog' vazifasi zali (4-dars asosida)
cut("// --- JO'NATISH MAYDONCHASI SAHNASI (D15)", '// --- RAQAM-PLITA (NumPad).', blk('d16-scene.txt'), 'sahna');

// 6) dars figuralari: vagonetka/uchburchak/ko'rshapalak -> konsol yacheykasi/jadval/chumoli
cut('// --- VAGONETKA (D15 asosiy rekviziti)', 'const Screen0 = (props) => {', blk('d16-figs.txt'), 'figuralar');

// 7) ekranlar
cut('const Screen0 = (props) => {', '// ============================================================\n// KORNEVOY KOMPONENT',
  blk('d16-screens.txt'), 'ekranlar');

// 8) root funksiya nomi
if (!s.includes('export default function CompLinkLesson({')) throw new Error('root funksiya topilmadi');
s = s.replace('export default function CompLinkLesson({', 'export default function WordProblemLesson({');

// 9) STYLES: D15 ga xos, bu darsda ISHLATILMAYDIGAN qoidalar olib tashlanadi, D16 qo'shiladi.
//    Saqlanadi: d15-check* (tekshirish satri), d15-pan* (s6 panellari), d15-rulelines/ruleline/ruleex (s4).
const si = s.indexOf('const STYLES = `');
if (si < 0) throw new Error('STYLES topilmadi');
const head = s.slice(0, si);
let css = s.slice(si);
const DROP = ['d15-cart', 'd15-crate', 'd15-cover', 'd15-tag', 'd15-wheel', 'd15-rail', 'd15-tri', 'd15-count',
  'd15-res', 'd15-step-expr', 'd15-xrow', 'd15-xline', 'd15-booknote', 'd15-wave', 'd15-hook-scene', 'd15-final-scene'];
const before = css.length;
css = css.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return DROP.some((d) => sel.includes('.' + d)) ? pre.replace(/\n$/, '') : m;
});
console.log(`STYLES: D15 ga xos qoidalar -${before - css.length} belgi`);
const closeIdx = css.lastIndexOf('`;');
if (closeIdx < 0) throw new Error('STYLES yopilishi topilmadi');
css = css.slice(0, closeIdx) + blk('d16-styles.txt') + css.slice(closeIdx);
s = head + css;

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nYozildi: ${OUT} (${s.split('\n').length} qator)`);
