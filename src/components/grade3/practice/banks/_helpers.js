// Umumiy yordamchilar amaliyot banklari uchun. Bitta nusxa — hamma banklarga.
// Kontrakt: src/books/grade3/TIPLAR_AMALIYOT_3SINF.md §6.
//
// tx — UZ/RU/EN matnlarini QuestionFactory kutgan shaklga o'giradi. Qisqartmalar:
//   e eyebrow · s setup · a ask · o options · y to'g'ri javob izohi · n maslahat
//   r qoida · v visual · p placeholder · by — har bir noto'g'ri variantga alohida tahlil
// Mexanikaga oid maydonlar: left/right (match), tokens/zones/dndHint (dnd), gridHint (grid).
//
// EN ixtiyoriy: berilmasa, ingliz tili RU matnini oladi. Shu tufayli EN tugmasi
// birinchi kundan ishlaydi, banklar esa navbat bilan to'ldiriladi (metodist qarori
// 2026-08-10 «dobav i angliyskiy yazik»).

const PREFIX = {
  uz: { correct: "To'g'ri!", wrong: 'Maslahat', order: 'Kartalarni kerakli tartibda bosing.' },
  ru: { correct: 'Верно!', wrong: 'Подсказка', order: 'Нажимай карточки в нужном порядке.' },
  en: { correct: 'Correct!', wrong: 'Hint', order: 'Tap the cards in the right order.' },
};

const block = (t, lang) => {
  const p = PREFIX[lang];
  return {
    eyebrow: t.e,
    setup: t.s,
    ask: t.a,
    options: t.o,
    correct: `${p.correct} ${t.y}`,
    wrong: `${p.wrong}: ${t.n}`,
    wrongBy: t.by && t.by.map((hint) => (hint ? `${p.wrong}: ${hint}` : undefined)),
    rule: t.r,
    visual: t.v,
    tiles: t.tiles,
    placeholder: t.p,
    orderHint: p.order,
    left: t.left,
    right: t.right,
    tokens: t.tokens,
    zones: t.zones,
    dndHint: t.dndHint,
    gridHint: t.gridHint,
  };
};

export const tx = (uz, ru, en) => ({
  uz: block(uz, 'uz'),
  ru: block(ru, 'ru'),
  en: en ? block(en, 'en') : block(ru, 'ru'),
});

// extra — mexanikaga bog'liq qo'shimcha: { grid: {...} }, { art: {...} }, { orderBy: '...' }
// va { en: {...} } — uchinchi til bloki. EN ixtiyoriy: berilmasa RU ishlatiladi.
export const q = (id, label, level, tag, type, emoji, correct, uz, ru, inputMode, extra) => {
  const { en, ...rest } = extra || {};
  return { id, label, level, tag, type, emoji, correct, inputMode, ...rest, text: tx(uz, ru, en) };
};

// Qisqa shakl: matnlar massiv bilan beriladi (eski banklar shu shaklda yozilgan).
export const cq = (id, label, level, tag, type, emoji, correct, uz, ru, inputMode) => q(
  id, label, level, tag, type, emoji, correct,
  { e: 'Mashq', s: uz[0], a: uz[1], o: uz[2], y: uz[3], n: uz[4], v: uz[5], r: uz[6], p: 'Javob' },
  { e: 'Задание', s: ru[0], a: ru[1], o: ru[2], y: ru[3], n: ru[4], v: ru[5], r: ru[6], p: 'Ответ' },
  inputMode,
);
