const fs = require('fs');
const path = require('path');
const dir = __dirname;
const src = fs.readFileSync(path.join(dir, 'src/components/Dars21.jsx'), 'utf8');

// 1) INFRA prefix: всё от начала до объявления TOTAL_SCREENS (байт-в-байт из Dars21)
const cut = src.indexOf('\nconst TOTAL_SCREENS');
if (cut < 0) throw new Error('TOTAL_SCREENS anchor not found');
let infra = src.slice(0, cut);
infra = infra.replace(
  '// УРОК: Десятичная дробь — концепт (разряды, 0,1 = 1/10) — dec_5_01',
  '// УРОК: Сравнение и округление десятичных дробей — dec_5_02'
);
if (infra.indexOf('dec_5_02') < 0) throw new Error('header comment swap failed');

// --- INFRA PATCHES (Dars22-local; methodist feedback 2026-06-15) ---
// Dars21 infra already carries yellow frame-tip hints/labels; here only item5: ✓/✗ icon
// must not stick to the label word — widen flex gap 6→9 on the 3 feedback-label <p>s.
function patch(label, from, to) {
  if (infra.indexOf(from) < 0) throw new Error('infra patch miss: ' + label);
  infra = infra.split(from).join(to);
}
patch('q-gap',
  "color: solved ? T.success : '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}",
  "color: solved ? T.success : '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 9 }}");
patch('ni-hint-gap',
  "marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}",
  "marginBottom: 6, fontWeight: 600, color: '#A07D14', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 9 }}");
patch('ni-ok-gap',
  "marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}",
  "marginBottom: 8, fontWeight: 600, color: T.success, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 9 }}");

// 2) STYLES block из Dars21 (база + dg/pt/nlp/chip/amb/fact-anim/reduced-motion — переиспользуем)
const stStart = src.indexOf('const STYLES = `');
const stEnd = src.lastIndexOf('`;') + 2;
if (stStart < 0 || stEnd < 2) throw new Error('STYLES block not found');
let styles = src.slice(stStart, stEnd);

// 3) Инъекция доп-CSS перед закрывающим бэктиком
const extra = fs.readFileSync(path.join(dir, 'dars22_css.txt'), 'utf8').replace(/\r\n/g, '\n').replace(/\s+$/, '');
styles = styles.replace(/\n`;\s*$/, '\n' + extra + '\n`;');
if (styles.indexOf('dec_5_02: JumpBars') < 0) throw new Error('extra CSS injection failed');

// 4) Middle (авторский)
const middle = fs.readFileSync(path.join(dir, 'dars22_middle.txt'), 'utf8').replace(/\r\n/g, '\n');

// 5) Сборка
let out = infra + '\n' + middle + '\n\n' + styles + '\n';
out = out.replace(/\r\n/g, '\n');

fs.writeFileSync(path.join(dir, 'src/components/Dars22.jsx'), out, { encoding: 'utf8' });
// гарантированно без BOM
const buf = fs.readFileSync(path.join(dir, 'src/components/Dars22.jsx'));
if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
  fs.writeFileSync(path.join(dir, 'src/components/Dars22.jsx'), buf.slice(3));
}
const lines = out.split('\n').length;
console.log('Dars22.jsx written:', lines, 'lines,', out.length, 'bytes');
