// Assembler for Dars01.jsx (nat_5_01) — keep-visible rebuild.
// Final file = [Dars28 byte-exact infra sliced from current Dars01.jsx, lines 1..before "// --- UROK"]
//            + [authored lesson middle: _dars01_middle.jsx]
// Run: node build_dars01.cjs
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const darsPath = path.join(dir, 'Dars01.jsx');
const midPath = path.join(dir, '_dars01_middle.jsx');

const cur = fs.readFileSync(darsPath, 'utf8').replace(/\r\n/g, '\n');
const markerRe = /\n\/\/ ={10,}\n\/\/ --- (?:POD )?UROK/;
const m = cur.match(markerRe);
if (!m) { console.error('FATAL: UROK marker not found in Dars01.jsx — cannot locate infra boundary.'); process.exit(1); }
const infra = cur.slice(0, m.index).replace(/\s+$/, '');

const middle = fs.readFileSync(midPath, 'utf8').replace(/\r\n/g, '\n');

const out = infra + '\n\n\n' + middle.replace(/^﻿/, '');
fs.writeFileSync(darsPath, out, 'utf8');
console.log('OK: Dars01.jsx assembled (' + out.split('\n').length + ' lines). Infra cut at offset ' + m.index + '.');
