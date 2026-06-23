// Assembler for Dars19 (frac_5_06 — har xil maxrajli kasrlarni qo'shish), keep-visible rebuild.
// Infra (byte-exact) sliced from Dars28.jsx (1..before POD UROK marker).
// Base STYLES body extracted from Dars28 and injected into the middle's STYLES placeholder.
// Re-run after editing _dars19_middle.jsx:  node build_dars19.cjs
const fs = require('fs');
const path = require('path');
const root = __dirname;
const dars28 = fs.readFileSync(path.join(root, 'src/components/Dars28.jsx'), 'utf8').replace(/\r\n/g, '\n');

// 1) infra = everything before the "// ==== / // --- POD UROK" boundary
const m = dars28.match(/\n\/\/ ={10,}\n\/\/ --- (?:POD )?UROK/);
if (!m) throw new Error('POD UROK boundary not found in Dars28.jsx');
const infra = dars28.slice(0, m.index) + '\n';

// 2) extract Dars28 STYLES template body (CSS text inside the backticks)
const sKey = 'const STYLES = `';
const sIdx = dars28.indexOf(sKey);
if (sIdx === -1) throw new Error('const STYLES not found in Dars28.jsx');
const bodyStart = sIdx + sKey.length;
const bodyEnd = dars28.indexOf('`;', bodyStart);
if (bodyEnd === -1) throw new Error('STYLES terminator not found');
const stylesBody = dars28.slice(bodyStart, bodyEnd);

// 3) middle, with base-styles placeholder substituted
let mid = fs.readFileSync(path.join(root, 'src/components/_dars19_middle.jsx'), 'utf8').replace(/\r\n/g, '\n');
if (mid.indexOf('/*__BASE__*/') === -1) throw new Error('base-styles placeholder /*__BASE__*/ missing in _dars19_middle.jsx');
mid = mid.replace('/*__BASE__*/', stylesBody);

const out = infra + mid;
fs.writeFileSync(path.join(root, 'src/components/Dars19.jsx'), out, 'utf8');
console.log('Dars19.jsx built:', out.length, 'chars,', out.split('\n').length, 'lines');
