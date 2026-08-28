// 9-sinf amaliyoti: RASKLADKA — qaysi mexanika qaysi pozitsiyada.
//
// NEGA SKRIPT. `TIPLAR_AMALIYOT_9SINF.md` §3 p. 1: raskladka DARS NOMERI
// bilan aniqlanadi, ya'ni qayta yig'ilsa o'sha chiqadi. Ko'z bilan
// tanlansa, 52 darsda tartib ham tasodifiy, ham qayta tiklab bo'lmaydigan
// bo'lardi. Bu yerda qoida yozilgan, natija esa hisoblanadi.
//
// QOIDA. O'nta mexanika uchta guruhga bo'lingan — qiyinlik o'qi bo'yicha
// (`🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴`):
//
//   yashil (1-3)  Test · Jadval · Ha/yo'q
//   sariq  (4-7)  Belgilash · Saralash · Javobni kiritish · Sonlar o'qi
//   qizil  (8-10) Tartib · Xato qator · So'zlar
//
// Har guruh O'Z ICHIDA aralashadi, guruhdan guruhga o'tmaydi. Shu bitta
// qaror ikkita qoidani avtomatik bajaradi:
//   §3 p. 3 — 1-pozitsiyada boshqaruvi tushuntirishni talab qilmaydigan
//             mexanika turadi (yashil guruhning uchalasi ham shunday);
//   §3 p. 4 — «Xato qator» 7-10 pozitsiyalarda (u qizil guruhda).
// §3 p. 2 (yonma-yon bir xil tip yo'q) o'z-o'zidan bajariladi: o'nta
// mexanika, o'nta pozitsiya, takror yo'q.
//
// ARALASHTIRISH DARS NOMERIDAN. Yashil va qizil guruhda (uchtadan) tartib
// shunday tanlanadiki, BIRINCHI element har darsda almashsin — aks holda
// ketma-ket ikki darsda amaliyot bir xil mexanikadan boshlanardi. Sariq
// guruhda (to'rtta) o'rin almashtirish indeksi `(n−1)·7 mod 24`: 7 va 24
// o'zaro tub, demak indeks 24 darsda hammasini aylanib chiqadi.
//
// 1-DARS AYNAN QAYTADAN CHIQADI. n = 1 da uchala indeks ham nol, ya'ni
// asosiy tartib: Test · Jadval · Ha/yo'q · Belgilash · Saralash ·
// Javobni kiritish · Sonlar o'qi · Tartib · Xato qator · So'zlar —
// yig'ilgan 1-dars amaliyoti bilan bir xil.
//
// Ishlatish:
//   node scripts/grade9-practice-layout.mjs          — 1-12 darslar
//   node scripts/grade9-practice-layout.mjs 2 3 4    — aniq darslar
//   node scripts/grade9-practice-layout.mjs --all    — 52 darsning hammasi

export const GREEN = ['Test', 'Jadval', "Ha/yo'q"];
export const YELLOW = ['Belgilash', 'Saralash', 'Javobni kiritish', "Sonlar o'qi"];
export const RED = ['Tartib', 'Xato qator', "So'zlar"];

// Mexanikaning KOMPONENTI — sborka shu jadvaldan oladi, nomdan emas.
export const COMPONENT = {
  'Test': 'Choice',
  'Jadval': 'RowTable',
  "Ha/yo'q": 'TrueFalse',
  'Belgilash': 'PlacePoint',
  'Saralash': 'Zones',
  'Javobni kiritish': 'TypeSet',
  "Sonlar o'qi": 'DomainAxis',
  'Tartib': 'OrderLines',
  'Xato qator': 'AuditLines',
  "So'zlar": 'ClozeBank',
};

// k elementning barcha o'rin almashtirishlari, LEKSIKOGRAFIK tartibda.
// Indeks bo'yicha olinadi, ya'ni natija dars nomeridan bir qiymatli chiqadi.
function permutations(arr) {
  if (arr.length <= 1) return [arr.slice()];
  const out = [];
  for (let i = 0; i < arr.length; i += 1) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of permutations(rest)) out.push([arr[i]].concat(p));
  }
  return out;
}

// Uchtalik guruh uchun: birinchi element HAR DARSDA almashadi.
// Uch elementning oltita tartibi ikkitadan uch juftga bo'linadi (birinchi
// element bo'yicha), shuning uchun indeks shu juftlarni aylanib chiqadi.
const tripleIndex = (n) => 2 * ((n - 1) % 3) + (Math.floor((n - 1) / 3) % 2);

export function layoutFor(n) {
  const g = permutations(GREEN)[tripleIndex(n)];
  const y = permutations(YELLOW)[((n - 1) * 7) % 24];
  const r = permutations(RED)[tripleIndex(n)];
  const names = g.concat(y).concat(r);
  const level = ['🟢', '🟢', '🟢', '🟡', '🟡', '🟡', '🟡', '🔴', '🔴', '🔴'];
  return names.map((name, i) => ({
    pos: i + 1,
    name,
    component: COMPONENT[name],
    level: level[i],
  }));
}

// Qoidalarni HAR CHAQIRUVDA tekshiramiz: qoida hujjatda emas, kodda ham
// turishi kerak, aks holda u qoida emas, niyat bo'lib qoladi.
export function violations(rows) {
  const bad = [];
  const first = rows[0].name;
  if (!GREEN.includes(first)) bad.push(`1-pozitsiyada «${first}» — §3 p. 3 buzildi`);
  const audit = rows.find((r) => r.name === 'Xato qator').pos;
  if (audit < 7) bad.push(`«Xato qator» ${audit}-pozitsiyada — §3 p. 4 buzildi`);
  const seen = new Set(rows.map((r) => r.name));
  if (seen.size !== 10) bad.push('mexanika takrorlandi — §3 p. 2 buzildi');
  return bad;
}

const argv = process.argv.slice(2);
if (argv.length || process.argv[1].endsWith('grade9-practice-layout.mjs')) {
  const list = argv.includes('--all')
    ? Array.from({ length: 52 }, (_, i) => i + 1)
    : (argv.filter((a) => /^\d+$/.test(a)).map(Number).length
      ? argv.filter((a) => /^\d+$/.test(a)).map(Number)
      : Array.from({ length: 12 }, (_, i) => i + 1));
  let bad = 0;
  for (const n of list) {
    const rows = layoutFor(n);
    const v = violations(rows);
    bad += v.length;
    process.stdout.write(`\n${n}-dars\n`);
    rows.forEach((r) => process.stdout.write(`  ${String(r.pos).padStart(2)} ${r.level} ${r.name.padEnd(18)} ${r.component}\n`));
    v.forEach((x) => process.stdout.write(`  XATO: ${x}\n`));
  }
  process.stdout.write(bad ? `\n${bad} ta qoida buzilishi.\n` : '\nQoidalar bajarildi.\n');
}
