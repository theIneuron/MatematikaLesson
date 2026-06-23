// Assembler for Dars20.jsx (frac_5_12) — keep-visible rebuild from scratch.
// Final = [Dars28 etalon infra, byte-exact] + [authored middle: META+CONTENT+visualizers+screens+root+STYLES].
// Run: node build_dars20.cjs
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

const etalon = fs.readFileSync(path.join(dir, 'Dars28.jsx'), 'utf8').replace(/\r\n/g, '\n');
const em = etalon.match(/\n\/\/ ={10,}\n\/\/ --- (?:POD )?UROK/);
if (!em) { console.error('FATAL: UROK marker not found in Dars28.jsx'); process.exit(1); }
const infra = etalon.slice(0, em.index).replace(/\s+$/, '');

const middle = fs.readFileSync(path.join(dir, '_dars20_middle.jsx'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');

const out = infra + '\n' + middle;
fs.writeFileSync(path.join(dir, 'Dars20.jsx'), out, 'utf8');
console.log('OK: Dars20.jsx assembled (' + out.split('\n').length + ' lines).');
