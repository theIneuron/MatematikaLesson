// grade3-keep-last-compare.mjs — `grade3-keep-last-question.mjs` ning davomi, faqat
// TAQQOSLASH raundlari uchun (belgi tanlanadigan ekranlar: Dars01 s11, Dars04 CompareRound).
// U yerda javob `okPick` emas, `picked` da turadi va oxirgi savol javobidan keyin
// `setPicked(null)` belgini o'chirib yuborardi — saqlangan savol «?» bilan qolardi.
// Endi: oxirgi savolda belgi QOLADI, qaytib kelganda `storedAnswer` dan tiklanadi.
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('src/components/grade3');
const OLD_RESET = 'setTimeout(() => { setPicked(null); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1400);';
const NEW_RESET = 'setTimeout(() => { if (idx + 1 < items.length) setPicked(null); setWrongSet(new Set()); setIdx((n) => n + 1); }, 1400);';
const OLD_INIT = 'const [picked, setPicked] = useState(null);';
const NEW_INIT = 'const [picked, setPicked] = useState(props.storedAnswer && items.length ? items[items.length - 1].sign : null);';

let n = 0;
for (const file of fs.readdirSync(DIR).filter((f) => /^Dars\d+\.jsx$/.test(f)).sort()) {
  const full = path.join(DIR, file);
  let src = fs.readFileSync(full, 'utf8');
  if (!src.includes('picked === it.sign')) continue;              // taqqoslash raundi yo'q
  if (!src.includes(OLD_RESET) && !src.includes(NEW_RESET)) continue;
  const before = src;
  src = src.split(OLD_RESET).join(NEW_RESET);
  // `picked` init faqat taqqoslash komponentida: `picked === it.sign` dan ORTGA qarab
  // eng yaqin init qatori olinadi (faylda boshqa `picked` lar ham bor, ular tegilmaydi).
  for (let j = src.indexOf('picked === it.sign'); j >= 0; j = src.indexOf('picked === it.sign', j + 1)) {
    const i = src.lastIndexOf(OLD_INIT, j);
    if (i >= 0 && j - i < 900) { src = src.slice(0, i) + NEW_INIT + src.slice(i + OLD_INIT.length); j += NEW_INIT.length - OLD_INIT.length; }
  }
  if (src !== before) { fs.writeFileSync(full, src, 'utf8'); n += 1; console.log(`${file}: taqqoslash raundi tuzatildi`); }
}
console.log(`\nJami fayl: ${n}`);
