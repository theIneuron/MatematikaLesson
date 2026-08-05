// build-grade3-dars15.mjs — Dars15.jsx ni Dars14.jsx dan YIG'ADI (etap 3, sborka).
// Nega skript: infra (Stage, audio dvijoki, NumPad, MCRoundD2, personajlar, CSS) qo'lda
// ko'chirilmaydi — donordan bayt-aniq oladi, faqat DARSGA XOS bloklarni almashtiradi.
// Almashtiriladigan bloklar (anchor'lar bilan, qattiq qator raqamlari YO'Q):
//   1) sarlavha izohi           4) BRIDGES + S14_PAYOFF
//   2) TOTAL_SCREENS..SCREEN_META 5) sahna (HookScene/GardenTerraceBg/LessonScene/ArrayViz/MiniCity -> YardBg/YardScene)
//   3) CONTENT                    6) dars figuralari (OrderBoard..SunflowerFig -> CargoCart/FamilyTriangle/CheckStrip/BatFig)
//   7) EKRANLAR s0..s14           8) root funksiya nomi   9) STYLES (d14 CSS olib tashlanadi, d15 qo'shiladi)
// Qo'shimcha: MCRoundD2 ga savolni OVOZDA so'z bilan aytish (q_speech) qo'shiladi.
//
// MUHIM: bu BIR MARTALIK generator. Yig'ilgandan keyin haqiqiy manba —
// `src/components/grade3/Dars15.jsx` faylining O'ZI; tuzatishlar shu faylga kiritiladi.
// Blok fayllari (d15-*.txt) sessiya vaqtinchalik papkasida qolgan va git'da yo'q — skript
// qayta ishga tushirilsa, ular kerak bo'ladi (D15_BLOCKS bilan yo'l ko'rsatiladi).
// Skript tarixda saqlanadi: keyingi darsni xuddi shu usulda yig'ish uchun namuna.
//
// Ishlatish: node scripts/build-grade3-dars15.mjs [--out src/components/grade3/Dars15.jsx]
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars14.jsx');
const OUT = path.resolve(process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'src/components/grade3/Dars15.jsx');
const BLK = path.resolve(process.env.D15_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const blk = (n) => fs.readFileSync(path.join(BLK, n), 'utf8');

let s = fs.readFileSync(SRC, 'utf8');
const cut = (startAnchor, endAnchor, replacement, label) => {
  const a = s.indexOf(startAnchor);
  if (a < 0) throw new Error(`${label}: boshlanish topilmadi -> ${startAnchor.slice(0, 60)}`);
  const b = s.indexOf(endAnchor, a + startAnchor.length);
  if (b < 0) throw new Error(`${label}: oxiri topilmadi -> ${endAnchor.slice(0, 60)}`);
  s = s.slice(0, a) + replacement + s.slice(b);
  console.log(`${label}: ${b - a} belgi -> ${replacement.length} belgi`);
};

// 1) sarlavha
cut('// ============================================================================\n// DD 3-SINF | Dars14',
  '\n// ============================================================\n\n// ============================================================\n// ПАЛИТРА',
  blk('d15-head.txt').trimEnd(),
  'sarlavha');

// 2) TOTAL_SCREENS + LESSON_META + SCREEN_META
cut('const TOTAL_SCREENS = 15;', '\n\n// shuffleMC/shuffleArr', blk('d15-meta.txt').trimEnd(), 'meta');

// 3) CONTENT
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blk('d15-content.txt').trimEnd(), 'CONTENT');

// 4) BRIDGES va S14_PAYOFF
cut('const BRIDGES = {', '\n\n// s14 payoff', blk('d15-bridges.txt').trimEnd(), 'BRIDGES');
cut('const S14_PAYOFF = {', '\n\n// Lumo yo\'l-xaritasi yozuvi',
  `const S14_PAYOFF = {
  ru: 'Миссия выполнена! Вагонетка ушла в город, накладная сошлась, и число ящиков нашлось делением. Спасибо за помощь!',
  uz: "Missiya bajarildi! Vagonetka shaharga ketdi, yorliq to'g'ri chiqdi, yashiklar soni esa bo'lish bilan topildi. Yordamingiz uchun rahmat!"
};`, 'S14_PAYOFF');

// 5) sahna: HookScene o'chadi (dead code), GardenTerraceBg..MiniCity -> YardBg/YardScene
cut('const HookScene = ({ gathered = false }) => {', '\n// --- Lumo hudud-progress', '', 'HookScene o\'chirildi');
cut("// --- NUR BOG'I TERRASALARI SAHNASI (D10)", '// --- RAQAM-PLITA (NumPad).', blk('d15-scene.txt'), 'sahna');

// 6) dars figuralari
cut("// --- BUYURTMA TAXTASI: yog'och lavha", 'const Screen0 = (props) => {', blk('d15-figs.txt'), 'figuralar');

// 7) ekranlar
cut('const Screen0 = (props) => {', '// ============================================================\n// KORNEVOY KOMPONENT',
  blk('d15-screens.txt'), 'ekranlar');

// 8) root funksiya nomi
if (!s.includes('export default function OrderOpsLesson({')) throw new Error('root funksiya topilmadi');
s = s.replace('export default function OrderOpsLesson({', 'export default function CompLinkLesson({');

// 9) MCRoundD2: savol ekranda belgi bilan, OVOZDA so'z bilan (q_speech)
const mcAnchor = `  const it = items[Math.min(idx, items.length - 1)];
  const done = idx >= items.length;
  const revealRef = useRevealScroll(done, 400);`;
if (!s.includes(mcAnchor)) throw new Error('MCRoundD2 anchor topilmadi');
s = s.replace(mcAnchor, `${mcAnchor}
  // Savol matnida belgi (56 : 7), OVOZDA esa so'z bilan — KONTENT_3SINF.md «Ovoz variantlari».
  useEffect(() => {
    if (done || audio.muted || !it || !it.q_speech) return;
    const e = getAudioEngine(); if (e) e.pushOneOff(it.q_speech[lang]);
  }, [idx]);`);

// 10) STYLES: d14 qoidalari olib tashlanadi (komponentlari o'chdi), d15 qo'shiladi
const si = s.indexOf('const STYLES = `');
if (si < 0) throw new Error('STYLES topilmadi');
let head = s.slice(0, si);
let css = s.slice(si);
const before = css.length;
// `.d14-...{...}` qoidalari (selektor + blok) o'chiriladi
css = css.replace(/(^|\n)([^\n{}]*\.d14-[^\n{}]*)\{[^}]*\}/g, (m, pre) => pre.replace(/\n$/, ''));
console.log(`STYLES: d14 qoidalari -${before - css.length} belgi`);
if (/\.d14-/.test(css.replace(/@keyframes[^}]*\}[^}]*\}/g, ''))) {
  console.log('OGOHLANTIRISH: STYLES da hali .d14- uchraydi (murakkab selektor) — qo\'lda ko\'rish kerak');
}
// d15 CSS ni yopuvchi backtick oldiga qo'yamiz
const closeIdx = css.lastIndexOf('`;');
if (closeIdx < 0) throw new Error('STYLES yopilishi topilmadi');
css = css.slice(0, closeIdx) + blk('d15-styles.txt') + css.slice(closeIdx);
s = head + css;

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nYozildi: ${OUT} (${s.split('\n').length} qator)`);
