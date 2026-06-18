// Dars31.jsx yig'uvchi (v2, self-sourcing): infra + base STYLES O'ZIDAN olinadi (Dars30 markerlari
// 2026-06-16 unifikatsiyada o'zgargan), o'rta qism + MATH-CSS yangidan.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const FILE = path.join(ROOT, 'src/components/Dars31.jsx');
const src = fs.readFileSync(FILE, 'utf8');
const middle = fs.readFileSync(path.join(ROOT, 'dars31_middle.txt'), 'utf8');
const myCss = fs.readFileSync(path.join(ROOT, 'dars31_css.txt'), 'utf8');

// --- 1. INFRA: boshidan POD UROK doc-comment'gacha ---
const cutMarker = '// ============================================================\n// --- POD UROK:';
const cutIdx = src.indexOf(cutMarker);
if (cutIdx < 0) throw new Error('infra cut marker topilmadi');
let infra = src.slice(0, cutIdx);

// NumInputScreen sarlavha (h-title) renderini tiklash — s8 uchun (metodist 2026-06-17: sarlavha bo'lsin).
const numNoTitle = '<div className="fade-up"><h2 className="title h-sub">{mt(t(c.question))}</h2></div>';
const numWithTitle = '<div className="fade-up">{c.title && <h2 className="title h-title" style={{ marginBottom: 8 }}>{mt(t(c.title))}</h2>}<h2 className="title h-sub">{mt(t(c.question))}</h2></div>';
if (infra.includes(numNoTitle)) infra = infra.replace(numNoTitle, numWithTitle);

// --- 2. STYLES: base (LayerBox MATH-CSS'gacha) + mening yangi CSS + ambient/reduced-motion tail ---
const stylesOpen = 'const STYLES = `';
const sOpenIdx = src.indexOf(stylesOpen);
if (sOpenIdx < 0) throw new Error('const STYLES topilmadi');
const baseStart = sOpenIdx + stylesOpen.length;
const mathMarker = '/* MATH geom_5_04: LayerBox';
const baseEnd = src.indexOf(mathMarker);
if (baseEnd < 0) throw new Error('LayerBox MATH marker topilmadi');
const stylesBase = src.slice(baseStart, baseEnd);

const ambMarker = '/* MATH: ambient';
const ambStart = src.indexOf(ambMarker);
const closeIdx = src.indexOf('`;', ambStart);
if (ambStart < 0 || closeIdx < 0) throw new Error('ambient/close marker topilmadi');
const stylesTail = src.slice(ambStart, closeIdx); // ambient + reduced-motion (yopuvchi backtick'siz)

const STYLES = stylesBase.trimEnd() + '\n\n\n' + myCss.trim() + '\n\n' + stylesTail.trimEnd() + '\n';

// --- 3. Yig'ish ---
const out = infra + middle.trim() + '\n\n\n' + 'const STYLES = `\n' + STYLES + '`;\n';
const outLf = out.replace(/\r\n/g, '\n');
fs.writeFileSync(FILE, outLf, { encoding: 'utf8' });
console.log('Dars31.jsx yozildi:', outLf.split('\n').length, 'qator');
