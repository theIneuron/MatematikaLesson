// Assembler for Dars02.jsx (nat_5_02) — keep-visible rebuild.
// Final = [Dars28 etalon infra] + [Dars02 META+CONTENT verbatim] + [authored middle].
// Run: node build_dars02.cjs
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

const etalon = fs.readFileSync(path.join(dir, 'Dars28.jsx'), 'utf8').replace(/\r\n/g, '\n');
const em = etalon.match(/\n\/\/ ={10,}\n\/\/ --- (?:POD )?UROK/);
if (!em) { console.error('FATAL: UROK marker not found in Dars28.jsx'); process.exit(1); }
const infra = etalon.slice(0, em.index).replace(/\s+$/, '');

// Reuse ONLY the CONTENT object verbatim (reviewed text) from Dars02.jsx; the assembled output
// keeps the CONTENT block, so this is idempotent. LESSON_META / SCREEN_META / TOTAL_SCREENS are
// re-authored in the middle (structure changed: 17 -> 14 screens, sequential blocks).
const src = fs.readFileSync(path.join(dir, 'Dars02.jsx'), 'utf8').replace(/\r\n/g, '\n');
const cStart = src.indexOf('const CONTENT = {');
const cEnd = src.search(/\n\/\/ ={10,}\n\/\/ SCREEN-/);
if (cStart < 0 || cEnd < 0) { console.error('FATAL: cannot locate CONTENT block', cStart, cEnd); process.exit(1); }
const content = src.slice(cStart, cEnd).replace(/\s+$/, '');

const middle = fs.readFileSync(path.join(dir, '_dars02_middle.jsx'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');

const header = '\n\n\n// ============================================================\n// --- UROK: nat_5_02 — Сравнение и округление / Taqqoslash va yaxlitlash ---\n// Infra Dars28 (baytma-bayt). Keep-visible standart (PROMPT 2-B/2-C).\n// ============================================================\n';
const out = infra + header + content + '\n' + middle;
fs.writeFileSync(path.join(dir, 'Dars02.jsx'), out, 'utf8');
console.log('OK: Dars02.jsx assembled (' + out.split('\n').length + ' lines).');
