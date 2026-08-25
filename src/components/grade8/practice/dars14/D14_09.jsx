// Dars14 · Amaliyot 09 — Isbot · 🔴 · tag: proof_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 9-pozitsiya)
//
// DARSNING 7-EKRANIDAGI ISBOT (`Dars14.jsx`): ikkidan ildiz kasr ko'rinishida
// yozilmaydi. Isbot teskaridan boradi va uning tartibi buzilsa, isbot
// isbot bo'lmay qoladi — faqat da'vo qolib ketadi.
//
// ENG KO'P UCHRAYDIGAN BUZILISH: xulosani juftlik qadamidan OLDIN qo'yish.
// O'shanda «faraz yolg'on» degan gap hech narsaga tayanmaydi: qarama-qarshilik
// aynan juftlikdan chiqadi — qisqarmas kasrda surat ham, maxraj ham juft
// bo'lolmaydi, chunki juft sonlarni ikkiga qisqartirish mumkin bo'lardi.
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'proof_steps', level: '🔴',
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: [{ r: '2' }, '=', { n: 'p', d: 'q' }],
      label: L("qisqarmas kasr deb faraz qilamiz", 'предполагаем: несократимая дробь', 'assume a reduced fraction') },
    { id: 'l2', tokens: ['2q² = p²'],
      label: L('ikki tomonni kvadratga oshiramiz', 'возводим обе части в квадрат', 'square both sides') },
    { id: 'l3', tokens: ['p — juft, q — juft'],
      label: L('ikkisi ham juft chiqadi', 'оба выходят чётными', 'both come out even') },
    { id: 'l4', tokens: ['p/q — qisqaradi'],
      label: L("faraz yolg'on: kasr qisqaradi", 'предположение ложно: дробь сократима', 'the assumption is false') },
  ],
  start: ['l4', 'l1', 'l3', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Isbot', 'Доказательство', 'Proof'),
  setup: L(
    "Ikkidan ildizni kasr ko'rinishida yozib bo'lmaydi, va buni isbotlash mumkin. Isbot teskaridan boradi: kasr bor deb faraz qilinadi va faraz o'zini yiqitadi. To'rt qadam bir qatorda turadi, lekin tartibi buzilgan.",
    'Корень из двух нельзя записать дробью, и это доказывается. Доказательство идёт от противного: предполагается, что дробь есть, и предположение само себя опрокидывает. Четыре шага стоят в одну строку, но порядок нарушен.',
    'The root of two cannot be written as a fraction, and that can be proved. The proof goes by contradiction: a fraction is assumed to exist and the assumption topples itself. The four steps stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  // RAZBOR QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — telefonda RU
  // matni 47px panel ostida qolardi. Juftlikning chiqarilishi `wrongs` da bor.
  correctText: L(
    "To'g'ri. Avval faraz: ikkidan ildiz p bo'lingan q ga teng va kasr qisqarmas. Keyin ikki tomon kvadratga oshiriladi: ikki karra q kvadrati p kvadratiga teng. Undan keyin juftlik chiqadi: avval p, keyin q ham juft bo'lib qoladi. Va faqat oxirida xulosa: ikkalasi juft bo'lgan kasr ikkiga qisqaradi, bu esa farazga qarshi — demak bunday kasr yo'q.",
    'Верно. Сначала предположение: корень из двух равен p делить на q, и дробь несократима. Потом обе части возводятся в квадрат: два на q в квадрате равно p в квадрате. Затем выходит чётность: сначала p, потом и q оказываются чётными. И только в конце вывод: дробь, где оба чётны, сокращается на два, а это противоречит предположению — значит такой дроби нет.',
    'Correct. First the assumption: the root of two equals p over q and the fraction is reduced. Then both sides are squared: two times q squared equals p squared. Then evenness follows: first p, then q turn out even. And only at the end the conclusion: a fraction with both parts even reduces by two, contradicting the assumption — so no such fraction exists.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Xulosadan boshlab bo'lmaydi: «faraz yolg'on» degan gap hali hech narsaga tayanmaydi. Isbot teskaridan borganda avval FARAZ qilinadi, keyin undan qarama-qarshilik chiqariladi. Boshida turgan xulosa isbot emas, da'vo.",
      'Начинать с вывода нельзя: слова «предположение ложно» пока ни на что не опираются. В доказательстве от противного сначала делается ПРЕДПОЛОЖЕНИЕ, потом из него выводится противоречие. Вывод в начале — не доказательство, а заявление.',
      'You cannot start with the conclusion: the words «the assumption is false» rest on nothing yet. In a proof by contradiction the ASSUMPTION comes first, then the contradiction is derived from it. A conclusion placed first is a claim, not a proof.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosa juftlikdan KEYIN turishi kerak: qarama-qarshilik aynan shu yerda paydo bo'ladi. Surat ham, maxraj ham juft bo'lsa, kasr ikkiga qisqaradi — faraz esa qisqarmas kasr degan edi. Juftlik aytilmasa, qisqarish qaydan chiqqani ko'rinmaydi.",
      'Вывод должен стоять ПОСЛЕ чётности: противоречие возникает именно там. Если и числитель, и знаменатель чётны, дробь сокращается на два — а предположение говорило о несократимой. Без чётности не видно, откуда взялось сокращение.',
      'The conclusion must come AFTER the evenness: that is where the contradiction appears. If both numerator and denominator are even, the fraction reduces by two — while the assumption said it was reduced. Without the evenness step there is no visible source for that reduction.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Juftlik kvadratga oshirilgan tenglikdan chiqadi: ikki karra q kvadrati p kvadratiga teng, chap tomon juft, demak p kvadrati ham juft, demak p juft. Kvadratga oshirishdan oldin bunday xulosa chiqaradigan yozuv yo'q.",
      'Чётность выходит из возведённого в квадрат равенства: два на q в квадрате равно p в квадрате, левая часть чётна, значит p в квадрате чётно, значит p чётно. До возведения в квадрат такой вывод делать не из чего.',
      'The evenness follows from the squared equality: two times q squared equals p squared, the left side is even, so p squared is even, so p is even. Before squaring there is nothing from which to draw that conclusion.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Kvadratga oshirish uchun TENGLIK kerak, tenglikni esa faraz beradi. Birinchi qadam aynan shu: ikkidan ildizni p bo'lingan q deb yozish. Farazsiz kvadratga oshiradigan narsa yo'q.",
      'Чтобы возводить в квадрат, нужно РАВЕНСТВО, а равенство даёт предположение. Первый шаг именно в этом: записать корень из двух как p делить на q. Без предположения возводить нечего.',
      'To square something you need an EQUALITY, and the assumption is what provides it. That is the first step: writing the root of two as p over q. Without the assumption there is nothing to square.') },
  ],
  wrongText: L(
    "Isbot teskaridan boradi: faraz, undan chiqadigan tenglik, tenglikdan chiqadigan xossa, va faqat oxirida qarama-qarshilik. Har qadamdan so'rang: buni aytish uchun nima allaqachon ma'lum?",
    'Доказательство идёт от противного: предположение, вытекающее из него равенство, вытекающее из равенства свойство, и лишь в конце противоречие. Спроси у каждого шага: что должно быть уже известно, чтобы это сказать?',
    'The proof goes by contradiction: the assumption, the equality it yields, the property that equality yields, and only at the end the contradiction. Ask every step: what must already be known to say this?'),
};

export default function D14_09(props) { return <SwapOrder data={DATA} {...props} />; }
