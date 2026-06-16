// Dars30.jsx yig'uvchi: infra + base STYLES baytma-bayt Dars29 dan, o'rta qism + MATH-CSS yangidan.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const src = fs.readFileSync(path.join(ROOT, 'src/components/Dars29.jsx'), 'utf8');
const middle = fs.readFileSync(path.join(ROOT, 'dars30_middle.txt'), 'utf8');
const myCss = fs.readFileSync(path.join(ROOT, 'dars30_css.txt'), 'utf8');

// --- 1. INFRA: Dars29 boshidan geom_5_02 doc-comment'gacha (NumInputScreen oxiri + 2 bo'sh qator) ---
const cutMarker = '// ============================================================\n// --- POD UROK:';
const cutIdx = src.indexOf(cutMarker);
if (cutIdx < 0) throw new Error('infra cut marker topilmadi');
let infra = src.slice(0, cutIdx);
const oldComment = '// УРОК: Площадь прямоугольника и квадрата — geom_5_02 (Dars29)';
const newComment = '// УРОК: Площадь треугольника — geom_5_03 (Dars30)';
if (!infra.includes(oldComment)) throw new Error('УРОК comment topilmadi');
infra = infra.replace(oldComment, newComment);

// --- 2. STYLES: base (geom_5_02 MATH-CSS'gacha) + mening CSS + tail (ambient + reduced-motion) ---
const stylesOpen = 'const STYLES = `';
const sOpenIdx = src.indexOf(stylesOpen);
const baseStart = sOpenIdx + stylesOpen.length;
const geomCssMarker = "/* MATH geom_5_02: TileGrid";
const baseEnd = src.indexOf(geomCssMarker);
if (baseEnd < 0) throw new Error('geom CSS marker topilmadi');
const stylesBase = src.slice(baseStart, baseEnd);

const ambMarker = '/* MATH: ambient';
const ambStart = src.indexOf(ambMarker);
const closeIdx = src.indexOf('`;', ambStart);
if (ambStart < 0 || closeIdx < 0) throw new Error('ambient/close marker topilmadi');
const stylesTail = src.slice(ambStart, closeIdx); // ambient + reduced-motion (yopuvchi backtick'siz)

const STYLES = stylesBase + myCss.trim() + '\n\n' + stylesTail;

// --- 3. Yig'ish ---
const out = infra + middle.trim() + '\n\n\n' + 'const STYLES = `\n' + STYLES + '\n`;\n';

// LF, BOM'siz UTF-8
const outLf = out.replace(/\r\n/g, '\n');
fs.writeFileSync(path.join(ROOT, 'src/components/Dars30.jsx'), outLf, { encoding: 'utf8' });
const lines = outLf.split('\n').length;
console.log('Dars30.jsx yozildi:', lines, 'qator');
