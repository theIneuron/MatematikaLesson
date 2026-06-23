// Assembler for Dars23.jsx (frac_5_15 — Aralash sonlarni qo'shish va ayirish) — keep-visible from-scratch rebuild.
// Final = [Dars28 etalon infra, baytma-bayt + Stage fon-on-all patch] + [authored _dars23_middle.jsx] + [Dars28 STYLES + _dars23_css.txt].
// Run: node build_dars23.cjs
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

const etalon = fs.readFileSync(path.join(dir, 'Dars28.jsx'), 'utf8').replace(/\r\n/g, '\n');

// 1) Infra slice [0 .. POD UROK marker]
const em = etalon.match(/\n\/\/ ={10,}\n\/\/ --- (?:POD )?UROK/);
if (!em) { console.error('FATAL: UROK marker not found in Dars28.jsx'); process.exit(1); }
let infra = etalon.slice(0, em.index).replace(/\s+$/, '');

// 2) Patch Stage -> fon-on-all (Floaters + has-amb inside .stage-content). Floaters defined in middle (module scope).
const stageNeedle = '<div className="stage-content" style={{ paddingLeft: padH, paddingRight: padH }}>\n        {children}';
if (!infra.includes(stageNeedle)) { console.error('FATAL: stage-content needle not found'); process.exit(1); }
infra = infra.replace(stageNeedle, '<div className="stage-content has-amb" style={{ paddingLeft: padH, paddingRight: padH }}>\n        <Floaters/>\n        {children}');

// 3) STYLES block (from Dars28) + inject lesson CSS before the closing backtick
const stIdx = etalon.indexOf('const STYLES = `');
if (stIdx < 0) { console.error('FATAL: STYLES block not found'); process.exit(1); }
let styles = etalon.slice(stIdx);
const myCss = fs.readFileSync(path.join(__dirname, '_dars23_css.txt'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
styles = styles.replace(/`;\s*$/, '\n' + myCss + '\n`;\n');

// 4) Authored middle (META + CONTENT + helpers + visualizers + screens + root; NO STYLES)
const middle = fs.readFileSync(path.join(dir, '_dars23_middle.jsx'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');

const header = '\n\n\n// ============================================================\n'
  + "// --- UROK: frac_5_15 — Сложение и вычитание смешанных чисел / Aralash sonlarni qo'shish va ayirish ---\n"
  + '// Infra Dars28 (baytma-bayt) + Stage fon-on-all. Keep-visible standart (PROMPT 2-B/2-C). Etalon 9/28/37.\n'
  + "// Vizualizator: MixedBar (butun plitka + qisman plitka; carry=ko'chirish, borrow=qarz olish/sinish).\n"
  + '// Personajsiz hook (nega-ramka); case Nilufar (lenta), yakuniy Saida (masofa). Drag: mixfill + dragbin(3-savat).\n'
  + '// ============================================================\n';

const out = infra + header + middle + '\n' + styles;
fs.writeFileSync(path.join(dir, 'Dars23.jsx'), out, 'utf8');
console.log('OK: Dars23.jsx assembled (' + out.split('\n').length + ' lines).');
