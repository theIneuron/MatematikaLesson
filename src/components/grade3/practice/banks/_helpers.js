// Umumiy yordamchilar amaliyot banklari uchun. Bitta nusxa — hamma banklarga.
// Kontrakt: src/books/grade3/TIPLAR_AMALIYOT_3SINF.md §6.
//
// tx — RU/UZ matn juftini QuestionFactory kutgan shaklga o'giradi. Qisqartmalar:
//   e eyebrow · s setup · a ask · o options · y to'g'ri javob izohi · n maslahat
//   r qoida · v visual · p placeholder · by — har bir noto'g'ri variantga alohida tahlil
// Mexanikaga oid maydonlar: left/right (match), tokens/zones/dndHint (dnd), gridHint (grid).

export const tx = (uz, ru) => ({
  uz: {
    eyebrow: uz.e,
    setup: uz.s,
    ask: uz.a,
    options: uz.o,
    correct: `To'g'ri! ${uz.y}`,
    wrong: `Maslahat: ${uz.n}`,
    wrongBy: uz.by && uz.by.map((hint) => (hint ? `Maslahat: ${hint}` : undefined)),
    rule: uz.r,
    visual: uz.v,
    tiles: uz.tiles,
    placeholder: uz.p,
    orderHint: "Kartalarni kerakli tartibda bosing.",
    left: uz.left,
    right: uz.right,
    tokens: uz.tokens,
    zones: uz.zones,
    dndHint: uz.dndHint,
    gridHint: uz.gridHint,
  },
  ru: {
    eyebrow: ru.e,
    setup: ru.s,
    ask: ru.a,
    options: ru.o,
    correct: `Верно! ${ru.y}`,
    wrong: `Подсказка: ${ru.n}`,
    wrongBy: ru.by && ru.by.map((hint) => (hint ? `Подсказка: ${hint}` : undefined)),
    rule: ru.r,
    visual: ru.v,
    tiles: ru.tiles,
    placeholder: ru.p,
    orderHint: 'Нажимай карточки в нужном порядке.',
    left: ru.left,
    right: ru.right,
    tokens: ru.tokens,
    zones: ru.zones,
    dndHint: ru.dndHint,
    gridHint: ru.gridHint,
  },
});

// extra — mexanikaga bog'liq qo'shimcha: { grid: {...} }, { genre: '...' }, { hideModel: true }.
export const q = (id, label, level, tag, type, emoji, correct, uz, ru, inputMode, extra) => ({
  id, label, level, tag, type, emoji, correct, inputMode, ...extra, text: tx(uz, ru),
});

// Qisqa shakl: matnlar massiv bilan beriladi (eski banklar shu shaklda yozilgan).
export const cq = (id, label, level, tag, type, emoji, correct, uz, ru, inputMode) => q(
  id, label, level, tag, type, emoji, correct,
  { e: 'Mashq', s: uz[0], a: uz[1], o: uz[2], y: uz[3], n: uz[4], v: uz[5], r: uz[6], p: 'Javob' },
  { e: 'Задание', s: ru[0], a: ru[1], o: ru[2], y: ru[3], n: ru[4], v: ru[5], r: ru[6], p: 'Ответ' },
  inputMode,
);
