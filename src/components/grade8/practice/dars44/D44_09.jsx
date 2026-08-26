// Dars44 · Amaliyot 09 — Tartib · 🔴 · tag: proof_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §6 (44-dars, 9-pozitsiya)
//
// ISBOTNING TO'RT QADAMI (`Dars44.jsx`, `SquareSwap` pribori, darslikning
// 174-rasmi): tomoni a qo'shuv b bo'lgan bitta kvadrat, to'rt bir xil
// uchburchak IKKI xil joylashtiriladi. Birinchisida o'rtada c kvadrat,
// ikkinchisida ikki burchakda a kvadrat va b kvadrat ochiq qoladi. Katta
// kvadrat va to'rt uchburchak o'zgarmagani uchun ochiq yuzalar teng.
//
// З78 naqshi: xulosani ikki joylashtirishdan OLDIN qo'yish — o'shanda tenglik
// hech narsadan chiqadi. Katta kvadratni oxirga surish ham xato: u ikki
// joylashtirishning UMUMIY o'lchovi, ya'ni solishtirish shunga tayanadi.
// Boshlang'ich tartib QAT'IY (`start`). Amaliyot chizmani takrorlamaydi —
// u faqat qadamlarning TARTIBINI tekshiradi (skelet §2).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'proof_steps', level: '🔴',
  expr: ['(a + b)²'], exprSize: 24,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['a + b'], label: L("tomoni shunday kvadratni olamiz", 'берём квадрат с такой стороной', 'take a square with this side') },
    { id: 'l2', tokens: ['c²'], label: L("to'rt uchburchak, o'rtada ochiq joy", 'четыре треугольника, в середине свободное место', 'four triangles, an empty space in the middle') },
    { id: 'l3', tokens: ['a² + b²'], label: L("o'sha to'rttasi boshqacha joylashtirildi", 'те же четыре уложены иначе', 'the same four laid out differently') },
    { id: 'l4', tokens: ['c² = a² + b²'], label: L('ochiq yuzalar teng', 'свободные площади равны', 'the empty areas are equal') },
  ],
  start: ['l4', 'l2', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Pifagor teoremasining isboti to'rt qadamda boradi: bitta katta kvadrat va to'rt bir xil to'g'ri burchakli uchburchak ikki xil joylashtiriladi. Qadamlar aralashib ketgan.",
    'Доказательство теоремы Пифагора идёт в четыре шага: один большой квадрат и четыре одинаковых прямоугольных треугольника укладываются двумя способами. Шаги перепутаны.',
    'The proof of the Pythagorean theorem takes four steps: one large square and four identical right triangles are laid out in two ways. The steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Isbot bitta o'lchovga tayanadi: katta kvadratning tomoni a qo'shuv b, va u ikki joylashtirishda ham O'ZGARMAYDI. Birinchi joylashtirishda to'rt uchburchak chetlarga tiziladi va o'rtada tomoni c bo'lgan kvadrat ochiq qoladi. Ikkinchisida o'sha to'rt uchburchak boshqacha suriladi va endi ikki burchakda a kvadrat bilan b kvadrat ochiq qoladi. Katta kvadrat bir xil, olib qo'yilgan uchburchaklar ham bir xil — demak qolgan ochiq yuzalar ham teng bo'lishi kerak. Shundan c kvadrat a kvadrat qo'shuv b kvadratga teng ekani chiqadi. Xulosani oldinga surib bo'lmaydi: u ikki joylashtirishning SOLISHTIRISHIDAN keladi.",
    'Верно. Доказательство опирается на одну величину: сторона большого квадрата a плюс b, и в двух укладках она НЕ МЕНЯЕТСЯ. В первой укладке четыре треугольника выстраиваются по краям, а в середине остаётся свободным квадрат со стороной c. Во второй те же четыре сдвинуты иначе, и теперь в двух углах свободны квадрат a и квадрат b. Большой квадрат один и тот же, убранные треугольники тоже одни и те же — значит и оставшиеся свободные площади равны. Отсюда и выходит, что c в квадрате равно a в квадрате плюс b в квадрате. Вывод вперёд не сдвинуть: он приходит из СРАВНЕНИЯ двух укладок.',
    'Correct. The proof rests on one quantity: the side of the large square is a plus b, and it does NOT change between the two layouts. In the first layout the four triangles line the edges and a square of side c is left empty in the middle. In the second the same four are shifted and now a square on a and a square on b are left empty in two corners. The large square is the same and the triangles removed are the same — so the empty areas left over must be equal too. From that c squared equals a squared plus b squared. The conclusion cannot be moved forward: it comes from COMPARING the two layouts.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Xulosadan boshlab bo'lmaydi: solishtiriladigan ikki joylashtirish hali yo'q. Tenglik ikki rasmni yonma-yon qo'yishdan chiqadi, va shu sababli u oxirgi qadam.",
      'Начинать с вывода нельзя: двух укладок для сравнения ещё нет. Равенство выходит из того, что две картины поставлены рядом, и поэтому это последний шаг.',
      'You cannot start from the conclusion: there are no two layouts to compare yet. The equality comes from setting the two pictures side by side, and that is why it is the last step.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosa ikkinchi joylashtirishdan OLDIN turolmaydi: a kvadrat bilan b kvadrat aynan shu joylashtirishda paydo bo'ladi. Undan oldin faqat c kvadrat bor, ya'ni tenglikning bir tomoni.",
      'Вывод не может стоять РАНЬШЕ второй укладки: квадрат a и квадрат b появляются именно в ней. До неё есть только квадрат c, то есть одна сторона равенства.',
      'The conclusion cannot stand BEFORE the second layout: the square on a and the square on b appear precisely there. Before it only the square on c exists, that is, one side of the equality.') },
    { when: (s) => s.pos.l1 > s.pos.l2 || s.pos.l1 > s.pos.l3, text: L(
      "Uchburchaklarni joylashtirish uchun avval joylashtiriladigan JOY kerak. Katta kvadrat — isbotning kadri, va uning tomoni a qo'shuv b ekani ikki rasmni solishtirish imkonini beradi. Shuning uchun u birinchi turadi.",
      'Чтобы укладывать треугольники, сначала нужно МЕСТО, куда их укладывать. Большой квадрат — рамка доказательства, и то, что его сторона равна a плюс b, и позволяет сравнить две картины. Поэтому он стоит первым.',
      'To lay out the triangles you first need the PLACE to lay them in. The large square is the frame of the proof, and the fact that its side is a plus b is what makes the two pictures comparable. That is why it comes first.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ikki joylashtirishning tartibi almashdi. Isbot c kvadratdan boshlanadi va a kvadrat bilan b kvadratga o'tadi: birinchi rasmda tenglikning chap tomoni, ikkinchisida o'ng tomoni paydo bo'ladi. Yozuvga qarang — kartalarda ham shu tartib turadi.",
      'Порядок двух укладок поменялся. Доказательство начинается с квадрата c и переходит к квадратам a и b: в первой картине появляется левая часть равенства, во второй правая. Посмотри на запись — в карточках стоит тот же порядок.',
      'The order of the two layouts was swapped. The proof starts from the square on c and moves to the squares on a and b: the first picture yields the left side of the equality, the second the right. Look at the records — the cards hold the same order.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni ko'rish uchun nima allaqachon chizilgan bo'lishi kerak?",
    'Спроси у каждого шага: что должно быть уже нарисовано, чтобы это увидеть?',
    'Ask every step: what must already be drawn for this to be seen?'),
};

export default function D44_09(props) { return <SwapOrder data={DATA} {...props} />; }
