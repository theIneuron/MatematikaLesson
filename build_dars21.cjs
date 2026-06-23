// Assembler for Dars21.jsx (frac_5_13) — keep-visible rebuild from scratch.
// Final = [Dars28 etalon infra, byte-exact] + [authored middle (META+CONTENT+helpers+visualizers+SeqMC/SeqMix+drag)]
//         + [authored tail (screens + root)] + [STYLES = Dars28 base CSS body + lesson CSS tail].
// Run: node build_dars21.cjs
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

const etalon = fs.readFileSync(path.join(dir, 'Dars28.jsx'), 'utf8').replace(/\r\n/g, '\n');
const em = etalon.match(/\n\/\/ ={10,}\n\/\/ --- (?:POD )?UROK/);
if (!em) { console.error('FATAL: UROK marker not found in Dars28.jsx'); process.exit(1); }
const infra = etalon.slice(0, em.index).replace(/\s+$/, '');

// Dars28 STYLES tanasini ajratamiz (const STYLES = ` ... `;)
const sm = etalon.match(/const STYLES = `([\s\S]*?)`;/);
if (!sm) { console.error('FATAL: STYLES not found in Dars28.jsx'); process.exit(1); }
const baseCss = sm[1].replace(/\s+$/, '');

const middle = fs.readFileSync(path.join(dir, '_dars21_middle.jsx'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
const tail = fs.readFileSync(path.join(dir, '_dars21_tail.txt'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
const lessonCss = fs.readFileSync(path.join(dir, '_dars21_css.txt'), 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');

const styles = '\n// ============================================================\n'
  + '// CSS — bazaviy qism (Dars28 etalonidan) + frac_5_13 MATH-dumi\n'
  + '// ============================================================\n'
  + 'const STYLES = `\n' + baseCss + '\n' + lessonCss + '\n`;\n';

const out = infra + '\n' + middle + '\n' + tail + '\n' + styles;
fs.writeFileSync(path.join(dir, 'Dars21.jsx'), out, 'utf8');
console.log('OK: Dars21.jsx assembled (' + out.split('\n').length + ' lines).');
