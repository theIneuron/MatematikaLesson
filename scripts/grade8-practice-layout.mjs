// ============================================================================
// 8-sinf amaliyoti: USULLARNING POZITSIYALARGA TAQSIMOTI.
//
// ESKIRDI 2-6 DARSLAR UCHUN (metodist qarori 2026-08-24). Endi 2-6 darslar
// 1-DARSNING o'nta mexanikasidan foydalanadi, taqsimot esa dars raqamidan
// hisoblanmaydi — u qo'lda tanlangan va `DARS02_06_AMALIYOT_SKELET.md` §2
// jadvalida turadi. Bu skript hech kim tomonidan chaqirilmaydi va tarix
// sifatida qoladi; tekshiruv `grade8-practice-plan.mjs` dan oladi.
//
// TIPLAR_AMALIYOT_8SINF.md §9 da bu 1-qadam sifatida qarz deb yozilgan edi.
// Metodist qarori 2026-08-22: 3-darsdan boshlab har amaliyotda 2-darsning
// O'NTA USULI ishlatiladi, lekin ARALASH tartibda.
//
// IKKI O'Q ALOHIDA (3 va 7-sinf ramkasi):
//   QIYINLIK o'qi HAR DOIM bir xil:  🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴
//   USULLAR o'qi esa har darsda boshqacha.
// Ya'ni aralashadigan narsa — qaysi usul qaysi pozitsiyada turishi, topshiriq
// qanchalik qiyinligi emas. Qiyinlikni MISOL beradi, mexanika emas.
//
// TAQSIMOT TASODIFIY EMAS. U dars raqamidan hisoblanadi, shuning uchun qayta
// yig'ilganda o'sha natija chiqadi va tekshiruv skripti bilan mos tushadi.
//
// QOIDALAR (§7):
//   1. taqsimot dars raqami bilan aniqlanadi — qayta yig'ish o'sha natijani beradi
//   2. yonma-yon bir xil usul turmaydi (bu yerda o'z-o'zidan bajariladi: har
//      usul bir marta ishlatiladi)
//   3. 1-pozitsiyada boshqarish tushuntirishni talab qiladigan usul turmaydi
//   7. geometriya darslarida chizma usuli ko'p joy oladi — 37-55, keyinroq
//
// Ishga tushirish:  node scripts/grade8-practice-layout.mjs [dars raqami]
// ============================================================================

// O'nta usul. Tartib — 2-darsdagi asos tartib.
export const METHODS = [
  { id: 'input', uz: 'Yozish', ru: 'Ввод', comp: 'TypeExpr' },
  { id: 'sort', uz: 'Zonalar', ru: 'Зоны', comp: 'Zones' },
  { id: 'test', uz: 'Test', ru: 'Тест', comp: 'Choice' },
  { id: 'gaps', uz: "Bo'shliqlar", ru: 'Пропуски', comp: 'SlotsBank' },
  { id: 'match', uz: 'Juftlash', ru: 'Пары', comp: 'MatchPairs' },
  { id: 'slider', uz: 'Surgich', ru: 'Ползунок', comp: 'HoleSlider' },
  { id: 'order', uz: 'Tartib', ru: 'Порядок', comp: 'OrderLines' },
  { id: 'strike', uz: 'Chizish', ru: 'Зачеркнуть', comp: 'StrikeOut' },
  { id: 'line', uz: "Son o'qi", ru: 'Ось', comp: 'NumberLine' },
  { id: 'repair', uz: 'Tuzatish', ru: 'Починка', comp: 'RepairPart' },
];

// 1-pozitsiyada tura oladigan usullar: harakati BIR QARASHDA tushunarli
// bo'lganlari. `line`, `order`, `repair`, `strike` boshqaruvni tushuntirishni
// talab qiladi va birinchi bo'lolmaydi (§7.3).
const OK_FIRST = ['input', 'sort', 'test', 'gaps', 'match', 'slider'];

// Qiyinlik o'qi — o'zgarmas.
export const LEVELS = ['🟢', '🟢', '🟢', '🟡', '🟡', '🟡', '🟡', '🔴', '🔴', '🔴'];

// Dars raqamidan taqsimot. Siljish qadami 3 — 1 bo'lsa ketma-ket darslarda
// to'plam deyarli o'sha joyida qolardi va «aralash» ko'rinmasdi.
export function layoutFor(lesson) {
  const n = METHODS.length;
  const shift = ((lesson - 2) * 3) % n;
  const order = [];
  for (let i = 0; i < n; i += 1) order.push(METHODS[(i + shift) % n]);

  // §7.3: birinchi pozitsiyani tuzatamiz — eng yaqin mos keladigani bilan
  // almashtiriladi, ya'ni tuzatish ham aniq va takrorlanadigan.
  if (OK_FIRST.indexOf(order[0].id) === -1) {
    const j = order.findIndex((m) => OK_FIRST.indexOf(m.id) !== -1);
    const t = order[0]; order[0] = order[j]; order[j] = t;
  }
  return order.map((m, i) => ({ pos: i + 1, level: LEVELS[i], ...m }));
}

// 7-dars — GRAFIK darsi. `strike` o'rniga koordinata tekisligi turadi:
// giperbolada qisqartiradigan ko'paytuvchi yo'q, tarmoq va k ning ishorasi
// esa chizmasiz tekshirilmaydi (metodist, 2026-08-22).
export const SWAP = {
  7: { from: 'strike', to: { id: 'plane', uz: 'Tekislik', ru: 'Плоскость', comp: 'PlanePoints' } },
};

export function layoutWithSwap(lesson) {
  const rows = layoutFor(lesson);
  const sw = SWAP[lesson];
  if (!sw) return rows;
  return rows.map((r) => (r.id === sw.from ? { ...r, ...sw.to } : r));
}

if (process.argv[1] && process.argv[1].endsWith('grade8-practice-layout.mjs')) {
  const only = process.argv[2] ? [Number(process.argv[2])] : [3, 4, 5, 6, 7, 8, 9, 10];
  for (const n of only) {
    const rows = layoutWithSwap(n);
    console.log(`\n${n}-dars`);
    console.log('  ' + rows.map((r) => `${r.pos}${r.level} ${r.uz}`).join('  ·  '));
  }
  // Nazorat: hech bir dars boshqasining tartibini takrorlamasin.
  const seen = new Map();
  for (let n = 2; n <= 10; n += 1) {
    const key = layoutFor(n).map((r) => r.id).join('|');
    if (seen.has(key)) console.log(`\nDIQQAT: ${n}-dars ${seen.get(key)}-dars bilan bir xil tartibda`);
    seen.set(key, n);
  }
  console.log('');
}
