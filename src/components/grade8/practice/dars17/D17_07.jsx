// Dars17 · Amaliyot 07 — Tartib · 🟡 · tag: square_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 7-pozitsiya)
//
// T1: FORMULA CHIQADIGAN USUL. To'rt qadam — 5-ekrandagi `squarecut` ning
// yozuv ko'rinishi: ozod hadni o'ngga, ikki tomonga bir xil son qo'shish,
// chap tomonni kvadratga yig'ish, keyin ildiz olish.
//
// OXIRGI QADAMDA PLYUS-MINUS PAYDO BO'LADI (З40): ikki tomondan ildiz
// olinganda o'ng tomon ikki ishorani beradi, va shundan ikki ildiz chiqadi.
// Ildiz olish qadami — Б2 ning ishi (oldingi blokdan, TIPLAR §6).
// Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'square_steps', level: '🟡',
  expr: ['x² + 8x − 9 = 0'], exprSize: 26,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['x² + 8x = 9'],
      label: L("ozod hadni o'ngga o'tkazamiz", 'переносим свободный член', 'move the constant term') },
    { id: 'l2', tokens: ['x² + 8x + 16 = 25'],
      label: L("ikki tomonga 16 qo'shamiz", 'прибавляем 16 к обеим частям', 'add 16 to both sides') },
    { id: 'l3', tokens: ['(x + 4)² = 25'],
      label: L("chap tomon to'la kvadrat", 'слева полный квадрат', 'the left side is a square') },
    { id: 'l4', tokens: ['x + 4 = ±5'],
      label: L('ikki tomondan ildiz olamiz', 'извлекаем корень', 'take the root of both sides') },
  ],
  start: ['l2', 'l4', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Formula shu usuldan chiqadi. To'rt qadam bir qatorda turadi, lekin tartibi buzilgan. Oxirgi qadamda plyus-minus paydo bo'ladi — shundan ikki ildiz chiqadi.",
    'Формула выводится этим методом. Четыре шага стоят в одну строку, но порядок нарушен. На последнем шаге появляется плюс-минус — из него и получаются два корня.',
    'The formula is derived by this method. The four steps stand in one row with their order broken. The last step brings a plus-or-minus — and from it the two roots.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval ozod had o'ngga o'tadi va ishorasini almashtiradi: minus to'qqiz arti to'qqiz bo'ladi. Keyin ikki tomonga o'n olti qo'shiladi — bu sakkizning yarmi to'rt, uning kvadrati. Chap tomon endi x qo'shuv to'rtning kvadrati, o'ng tomon yigirma besh. Oxirida ikki tomondan ildiz olinadi va plyus-minus paydo bo'ladi: x qo'shuv to'rt arti besh yoki minus besh, ya'ni x bir yoki minus to'qqiz.",
    'Верно. Сначала свободный член переходит вправо и меняет знак: минус девять становится плюс девять. Потом к обеим частям прибавляется шестнадцать — это квадрат половины восьми, то есть четырёх. Слева теперь квадрат x плюс четыре, справа двадцать пять. В конце извлекается корень из обеих частей и появляется плюс-минус: x плюс четыре равно плюс пяти или минус пяти, то есть x равен одному или минус девяти.',
    'Correct. First the constant term moves right and flips its sign: minus nine becomes plus nine. Then sixteen is added to both sides — the square of half of eight, that is four. The left side is now x plus four squared, the right side twenty five. Finally the root is taken of both sides and a plus-or-minus appears: x plus four is plus five or minus five, so x is one or minus nine.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Ildiz olishdan boshlab bo'lmaydi: ildiz KVADRATDAN olinadi, kvadrat esa hali yig'ilmagan. Dastlabki yozuvda chap tomon uchhad, uning ildizini olib bo'lmaydi.",
      'Начинать с извлечения корня нельзя: корень извлекается ИЗ КВАДРАТА, а квадрат ещё не собран. В исходной записи слева трёхчлен, из него корень не извлечёшь.',
      'You cannot start by taking a root: a root is taken OF A SQUARE, and the square is not assembled yet. In the original record the left side is a trinomial, and no root can be taken of it.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "O'n oltini qo'shishdan oldin ozod hadni o'ngga o'tkazish kerak: aks holda chap tomonda minus to'qqiz ham, arti o'n olti ham qolib, kvadrat yig'ilmaydi. Avval yozuvni tozalash, keyin to'ldirish.",
      'Прежде чем прибавлять шестнадцать, надо перенести свободный член вправо: иначе слева останутся и минус девять, и плюс шестнадцать, и квадрат не соберётся. Сначала очистить запись, потом дополнять.',
      'Before adding sixteen the constant term must move right: otherwise both minus nine and plus sixteen stay on the left and the square never assembles. First clear the record, then complete it.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Chap tomon to'la kvadrat bo'lishi uchun avval o'n oltini QO'SHISH kerak. x kvadrat qo'shuv sakkiz x o'zi to'la kvadrat emas: unga to'rtning kvadrati yetmayapti. Qo'shilgandan keyin esa u x qo'shuv to'rtning kvadratiga aylanadi.",
      'Чтобы слева получился полный квадрат, надо сначала ПРИБАВИТЬ шестнадцать. Само x квадрат плюс восемь x полным квадратом не является: ему не хватает квадрата четырёх. А после прибавления оно становится квадратом x плюс четыре.',
      'For the left side to be a perfect square, sixteen must be ADDED first. On its own, x squared plus eight x is not a perfect square: it lacks four squared. Once added, it becomes x plus four squared.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Ildiz olish qadami kvadratdan KEYIN turadi: x qo'shuv to'rtning kvadrati yigirma beshga teng bo'lgandan so'ng, ikki tomondan ildiz olish mumkin. Va aynan shu qadamda plyus-minus paydo bo'ladi.",
      'Шаг извлечения корня идёт ПОСЛЕ квадрата: только когда квадрат x плюс четыре равен двадцати пяти, можно извлечь корень из обеих частей. И именно на этом шаге появляется плюс-минус.',
      'The root-taking step comes AFTER the square: only once x plus four squared equals twenty five can the root be taken of both sides. And it is precisely there that the plus-or-minus appears.') },
  ],
  wrongText: L(
    "Har qadamdan so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak? Ildiz kvadratdan olinadi, kvadrat esa qo'shishdan keyin paydo bo'ladi.",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать? Корень извлекается из квадрата, а квадрат появляется после прибавления.',
    'Ask every step: what must already be written to do it? A root is taken of a square, and the square appears after the addition.'),
};

export default function D17_07(props) { return <SwapOrder data={DATA} {...props} />; }
