// Assembler for Dars18.jsx (frac_5_10 — Bir xil maxrajli kasrlarni ayirish) — keep-visible from-scratch rebuild.
// Final = [Dars28 etalon infra, baytma-bayt + Stage fon-on-all patch] + [authored _dars18_middle.jsx] + [Dars28 STYLES + _dars18_css.txt].
// Run: node build_dars18.cjs
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

const etalon = fs.readFileSync(path.join(dir, 'Dars28.jsx'), 'utf8').replace(/\r\n/g, '\n');

// 1) Infra slice [0 .. POD UROK marker]
const em = etalon.match(/\n\/\/ ={10,}\n\/\/ --- (?:POD )?UROK/);
if (!em) { console.error('FATAL: UROK marker not found in Dars28.jsx'); process.exit(1); }
let infra = etalon.slice(0, em.index).replace(/\s+$/, '');

// 2) Patch Stage → fon-on-all (Floaters + has-amb inside .stage-content). Floaters defined in middle (module scope).
const stageNeedle = '<div className="stage-content" style={{ paddingLeft: padH, paddingRight: padH }}>\n        {children}';
if (!infra.includes(stageNeedle)) { console.error('FATAL: stage-content needle not found'); process.exit(1); }
infra = infra.replace(stageNeedle, '<div className="stage-content has-amb" style={{ paddingLeft: padH, paddingRight: padH }}>\n        <Floaters/>\n        {children}');

// 3) STYLES block (from Dars28) + inject lesson CSS before the closing backtick
const stIdx = etalon.indexOf('const STYLES = `');
if (stIdx < 0) { console.error('FATAL: STYLES block not found'); process.exit(1); }
let styles = etalon.slice(stIdx);
const myCss = fs.readFileSync(path.join(__dirname, '_dars18_css.txt'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
styles = styles.replace(/`;\s*$/, '\n' + myCss + '\n`;\n');

// 4) Authored middle (META + CONTENT + helpers + visualizers + screens + root; NO STYLES)
const middle = fs.readFileSync(path.join(dir, '_dars18_middle.jsx'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');

const header = '\n\n\n// ============================================================\n'
  + '// --- UROK: frac_5_10 — Вычитание дробей с равными знаменателями / Bir xil maxrajli kasrlarni ayirish ---\n'
  + '// Infra Dars28 (baytma-bayt) + Stage fon-on-all. Keep-visible standart (PROMPT 2-B/2-C).\n'
  + '// Yangi syujet/personaj: Sevinch (sharbat), Rustam (suv). Vizualizator: LiquidJug (vertikal idish, ulush quyiladi).\n'
  + '// ============================================================\n';

const out = infra + header + middle + '\n' + styles;
fs.writeFileSync(path.join(dir, 'Dars18.jsx'), out, 'utf8');
console.log('OK: Dars18.jsx assembled (' + out.split('\n').length + ' lines).');
