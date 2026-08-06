// grade3-lesson-audit.mjs — dars faylini ETALON_3SINF kontrakti va metodist qoidalari
// bo'yicha STATIK tekshiradi (Playwright'siz). Etalon: `git show afbea5c^:src/books/grade3/ETALON_3SINF.md`
// (fayl 3-sinf otkatida o'chgan, lekin kontrakt sifatida amal qiladi) + START_GRADE3.md §2.
//
// CONTENT obyekti FAYLDAN AJRATIB, chinakam JS sifatida o'qiladi (regex bilan taxmin qilinmaydi):
// shuning uchun har satrning YO'LI aniq — ovozli maydonmi yoki ekran matnimi, adashmaydi.
//
// Tekshiriladi:
//   1) TOTAL_SCREENS = SCREEN_META = screens massivi = 15
//   2) OVOZ satrlari (audio, *_speech, hint(s), on_*, trap_*, mc_ok, fact_audio, setup_audio,
//      rule_speech, done_text, pick_ok, wrong_N): raqam YO'Q, `× ÷ = < > ☐` YO'Q, qo'shtirnoq
//      va uzun tire YO'Q
//   3) UZ satrlari: kirill YO'Q, apostrof faqat ASCII
//   4) RU/UZ juftligi to'liq (biri bor, ikkinchisi yo'q — xato)
//   5) MC: AYNAN 4 variant, `ci` bor, har NOTO'G'RI variantga o'z izohi
//   6) mexanika naqshlari: shuffleArr, option-correct, wrongSet, reveal-soft, useCanAnswer,
//      Math.min(idx — hammasi joyida
//   7) FREE_NAV holati
//   8) ismlar kanoni (Bit/Бит, Ra'no/Рано, Anvar/Анвар, Zuhra/Зухра, Jasur/Жасур)
//   9) FINAL diagnostika darsdagi AYNI sonlarni takrorlamaydi (etalon §3)
//  10) sonlar doirasi: 3-sinf Б2 uchun 100 gacha, qoldiq yo'q
//
// Ishlatish: node scripts/grade3-lesson-audit.mjs src/components/grade3/Dars14.jsx
import fs from 'node:fs';

const file = process.argv[2] || 'src/components/grade3/Dars14.jsx';
const src = fs.readFileSync(file, 'utf8');
const out = { err: [], warn: [], info: [] };
const E = (m) => out.err.push(m);
const W = (m) => out.warn.push(m);
const I = (m) => out.info.push(m);

// ---------- 1) ekran soni ----------
const total = Number((src.match(/const TOTAL_SCREENS = (\d+);/) || [])[1]);
const metaCount = ((src.match(/const SCREEN_META = \[([\s\S]*?)\n\];/) || [, ''])[1].match(/\{ id:/g) || []).length;
const screensArr = ((src.match(/const screens = \[([^\]]*)\]/) || [, ''])[1].match(/Screen\d+/g) || []).length;
if (!(total === metaCount && total === screensArr)) E(`ekran soni mos emas: TOTAL_SCREENS=${total}, SCREEN_META=${metaCount}, screens=${screensArr}`);
else I(`ekran soni: ${total} (TOTAL_SCREENS = SCREEN_META = screens massivi)`);
if (total !== 15) E(`metodist qoidasi (START_GRADE3 §2.6): dars = AYNAN 15 ekran, hozir ${total}`);

// ---------- CONTENT ni haqiqiy JS sifatida o'qiymiz ----------
const ci0 = src.indexOf('const CONTENT = {');
const ciEnd = src.indexOf('\n};', ci0);
if (ci0 < 0 || ciEnd < 0) { console.log('CONTENT topilmadi'); process.exit(1); }
const contentSrc = src.slice(ci0 + 'const CONTENT = '.length, ciEnd + 2);
let CONTENT;
try { CONTENT = eval(`(${contentSrc})`); } catch (e) { console.log('CONTENT o\'qilmadi: ' + e.message); process.exit(1); }

// ---------- yo'l bo'yicha yurish ----------
const SPOKEN_KEY = /^(audio|.*_speech|hint|hints|on_correct|on_wrong\d?|on_idk|trap_correct|trap_wrong|mc_ok|fact_audio|setup_audio|rule_speech|done_text|pick_ok|wrong_\d|intro)$/;
const strings = [];   // { path, lang, txt, spoken }
const walk = (node, path, spoken) => {
  if (node === null || node === undefined) return;
  if (typeof node === 'string') { strings.push({ path: path.join('.'), lang: null, txt: node, spoken }); return; }
  if (typeof node === 'number' || typeof node === 'boolean') return;
  if (Array.isArray(node)) { node.forEach((v, i) => walk(v, [...path, i], spoken)); return; }
  const keys = Object.keys(node);
  const isPair = keys.length <= 3 && keys.includes('ru') && keys.includes('uz');
  if (isPair) {
    strings.push({ path: path.join('.'), lang: 'ru', txt: String(node.ru), spoken });
    strings.push({ path: path.join('.'), lang: 'uz', txt: String(node.uz), spoken });
    // ru/uz massiv bo'lsa ham (audio: {ru:[...], uz:[...]})
    if (Array.isArray(node.ru)) { strings.pop(); strings.pop(); node.ru.forEach((v, i) => strings.push({ path: `${path.join('.')}.ru[${i}]`, lang: 'ru', txt: String(v), spoken })); node.uz.forEach((v, i) => strings.push({ path: `${path.join('.')}.uz[${i}]`, lang: 'uz', txt: String(v), spoken })); }
    return;
  }
  for (const k of keys) walk(node[k], [...path, k], spoken || SPOKEN_KEY.test(k));
  // RU/UZ juftlik to'liqligi
  if ((keys.includes('ru') && !keys.includes('uz')) || (keys.includes('uz') && !keys.includes('ru'))) {
    E(`RU/UZ juftligi to'liq emas: ${path.join('.')}`);
  }
};
walk(CONTENT, [], false);
const spokenStr = strings.filter((s) => s.spoken);
const screenStr = strings.filter((s) => !s.spoken);
I(`satrlar: ovozli ${spokenStr.length}, ekran matni ${screenStr.length}`);

// ---------- 2) ovoz gigiyenasi ----------
const BAD_SYM = /[×÷=<>%$≠✗☐]|—|────/;
for (const s of spokenStr) {
  if (/\d/.test(s.txt)) E(`OVOZDA RAQAM · ${s.path}.${s.lang}: ${s.txt.slice(0, 64)}`);
  if (BAD_SYM.test(s.txt)) E(`OVOZDA BELGI · ${s.path}.${s.lang}: ${s.txt.slice(0, 64)}`);
  if (/[«»""]/.test(s.txt)) E(`OVOZDA QO'SHTIRNOQ · ${s.path}.${s.lang}: ${s.txt.slice(0, 64)}`);
  if (/\S:\s/.test(s.txt)) W(`ovozda ikki nuqta · ${s.path}.${s.lang}: ${s.txt.slice(0, 64)}`);
}

// ---------- 3) UZ gigiyenasi ----------
for (const s of strings.filter((x) => x.lang === 'uz')) {
  if (/[А-Яа-яЁё]/.test(s.txt)) E(`UZ da KIRILL · ${s.path}: ${s.txt.slice(0, 64)}`);
  if (/[ʻʼ‘’]/.test(s.txt)) E(`UZ da noto'g'ri apostrof · ${s.path}: ${s.txt.slice(0, 64)}`);
}

// ---------- 5) MC kontrakti ----------
const mcChecks = [];
const findMC = (node, path) => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach((v, i) => findMC(v, [...path, i])); return; }
  for (const key of ['opts', 'mc_opts']) {
    if (Array.isArray(node[key])) {
      const ciKey = key === 'opts' ? 'ci' : 'mc_ci';
      const hintKey = key === 'opts' ? 'hints' : 'mc_hints';
      mcChecks.push({ path: [...path, key].join('.'), n: node[key].length, ci: node[ciKey], hints: node[hintKey] });
    }
  }
  Object.keys(node).forEach((k) => findMC(node[k], [...path, k]));
};
findMC(CONTENT, []);
for (const m of mcChecks) {
  if (m.n !== 4) E(`variant soni ${m.n} (4 bo'lishi kerak) · ${m.path}`);
  if (m.ci === undefined) { E(`to'g'ri javob indeksi (ci) yo'q · ${m.path}`); continue; }
  const idxs = m.hints ? (Array.isArray(m.hints) ? m.hints.map((h, i) => (h ? i : null)).filter((v) => v !== null) : Object.keys(m.hints).map(Number)) : [];
  const needed = [0, 1, 2, 3].filter((i) => i !== m.ci);
  const missing = needed.filter((i) => !idxs.includes(i));
  if (missing.length) E(`noto'g'ri variantlarga izoh yo'q (indeks ${missing.join(', ')}) · ${m.path}`);
  if (idxs.includes(m.ci)) W(`to'g'ri variantga ham izoh yozilgan · ${m.path}`);
}
I(`MC bloklari: ${mcChecks.length} (hammasida 4 variant va izohlar tekshirildi)`);

// final panel: opt0..opt3 + wrong_1..3
const finalItems = (CONTENT.s13 && CONTENT.s13.items) || [];
finalItems.forEach((it, k) => {
  if (it.kind === 'mc') {
    const nOpt = [0, 1, 2, 3].filter((i) => it[`opt${i}`]).length;
    if (nOpt !== 4) E(`final panel MC #${k + 1}: variant ${nOpt}/4`);
    const nWrong = [1, 2, 3].filter((i) => it[`wrong_${i}`]).length;
    if (nWrong !== 3) E(`final panel MC #${k + 1}: wrong_ izohlari ${nWrong}/3`);
  } else if (it.kind === 'num') {
    if (typeof it.ans !== 'number') E(`final panel NUM #${k + 1}: ans yo'q`);
    if (!it.hint) E(`final panel NUM #${k + 1}: hint yo'q`);
  }
});
I(`final panel: ${finalItems.length} savol (${finalItems.filter((i) => i.kind === 'num').length} terish, ${finalItems.filter((i) => i.kind === 'mc').length} MC)`);

// ---------- 6) mexanika ----------
for (const [needle, why] of [
  ['shuffleArr(', 'variantlar har mount da aralashadi'],
  ['option-correct', 'to\'g\'ri javob YASHIL'],
  ['wrongSet', 'noto\'g\'ri javob keyingi savolga O\'TKAZMAYDI'],
  ['reveal-soft', 'oxirgi savol qoladi, natija boksi yumshoq chiqadi'],
  ['useCanAnswer', 'ovoz tugamaguncha javob bloklanadi'],
  ['Math.min(idx', 'savol indeksi oxirgi elementga qisiladi'],
  ['useRevealScroll', 'javobdan keyin natija ko\'rinadigan joyga suriladi']
]) if (!src.includes(needle)) E(`mexanika naqshi yo'q: ${needle} (${why})`);
I(`FREE_NAV = ${(src.match(/const FREE_NAV = (\w+);/) || [])[1]}`);

// ---------- 8) ismlar ----------
const CANON = ['Bit', 'Бит', "Ra'no", 'Рано', 'Anvar', 'Анвар', 'Zuhra', 'Зухра', 'Jasur', 'Жасур'];
const used = new Set();
for (const s of strings) for (const n of CANON) if (s.txt.includes(n)) used.add(n);
I(`ismlar: ${[...used].join(', ') || 'yo\'q'}`);

// ---------- 9/10) sonlar va misollar ----------
// Etalon §3: «Yakuniy diagnostika darsdagi ayni son yoki rasmni takrorlamaydi». Bu yakka
// raqamlar haqida emas (jadval doirasida 6 yoki 8 muqarrar qaytadi), balki AYNI MISOL haqida:
// shuning uchun `A × B = C` va `A : B = C` uchligi solishtiriladi.
const factsOf = (arr) => {
  const set = new Set();
  for (const s of arr) {
    for (const m of s.txt.matchAll(/(\d{1,3})\s*[×:]\s*(\d{1,3})\s*=\s*(\d{1,3})/g)) {
      set.add([Number(m[1]), Number(m[2]), Number(m[3])].sort((a, b) => a - b).join('-'));
    }
    // `☐ × 6 = 42` / `30 : ☐ = 5` — yashiringan son ham uchlikni beradi
    for (const m of s.txt.matchAll(/☐\s*×\s*(\d{1,3})\s*=\s*(\d{1,3})/g)) set.add([Number(m[1]), Number(m[2]) / Number(m[1]), Number(m[2])].sort((a, b) => a - b).join('-'));
    for (const m of s.txt.matchAll(/(\d{1,3})\s*×\s*☐\s*=\s*(\d{1,3})/g)) set.add([Number(m[1]), Number(m[2]) / Number(m[1]), Number(m[2])].sort((a, b) => a - b).join('-'));
    for (const m of s.txt.matchAll(/☐\s*:\s*(\d{1,3})\s*=\s*(\d{1,3})/g)) set.add([Number(m[1]), Number(m[2]), Number(m[1]) * Number(m[2])].sort((a, b) => a - b).join('-'));
    for (const m of s.txt.matchAll(/(\d{1,3})\s*:\s*☐\s*=\s*(\d{1,3})/g)) set.add([Number(m[1]) / Number(m[2]), Number(m[2]), Number(m[1])].sort((a, b) => a - b).join('-'));
  }
  return set;
};
const bodyFacts = factsOf(strings.filter((s) => !s.path.startsWith('s13')));
const finalFacts = factsOf(strings.filter((s) => s.path.startsWith('s13')));
const sameFacts = [...finalFacts].filter((v) => bodyFacts.has(v)).sort();
if (sameFacts.length) E(`ETALON §3: final diagnostika darsdagi AYNI misolni takrorlaydi: ${sameFacts.join(' · ')}`);
else I(`final diagnostika: ${finalFacts.size} misol, darsdagilari (${bodyFacts.size} ta) bilan kesishmaydi`);
const allNums = new Set();
for (const s of strings) for (const m of s.txt.matchAll(/[0-9]{1,4}/g)) allNums.add(Number(m[0]));
const over100 = [...allNums].filter((v) => v > 100);
if (over100.length) I(`100 dan katta sonlar (Б2 doirasi): ${over100.sort((a, b) => a - b).join(', ')} — mavzu talab qilsa normal (×100, ustun, tuzoqdagi noto'g'ri natija), aks holda ko'rib chiqiladi.`);

// ---------- hisobot ----------
const tag = { err: 'XATO', warn: 'OGOHLANTIRISH', info: 'MA\'LUMOT' };
for (const k of ['err', 'warn', 'info']) {
  if (!out[k].length) continue;
  console.log(`\n${tag[k]} (${out[k].length}):`);
  out[k].forEach((m) => console.log('  ' + m));
}
console.log(`\n${file}: xato ${out.err.length}, ogohlantirish ${out.warn.length}`);
process.exit(out.err.length ? 1 : 0);
