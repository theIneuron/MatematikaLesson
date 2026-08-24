// Dars08 · Amaliyot 09 — Tartib · 🔴 · tag: power_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 9-pozitsiya)
//
// 32 ning uch beshdan bir ko'rsatkichli darajasi. To'rt qadam, va tartib
// AMALIY ma'noga ega: agar avval kubga oshirilsa, o'ttiz ikkining kubi —
// o'ttiz ikki ming yetti yuz oltmish sakkiz, undan beshinchi darajali ildiz
// olish qo'lda hisoblanmaydi. Ildizni oldin olish esa ikki bilan ishlashga
// olib keladi. Javob bir xil, mehnat esa boshqacha — bu tartibning sababi.
//
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'power_steps', level: '🔴',
  expr: [{ b: '32', e: { n: '3', d: '5' } }], exprSize: 30,
  itemSize: 14,
  cards: [
    { id: 'l1', tokens: [{ r: '32³', deg: '5' }],
      label: L('ildiz sifatida yozamiz', 'записываем корнем', 'write it as a root') },
    { id: 'l2', tokens: ['(', { r: '32', deg: '5' }, ')³'],
      label: L('darajani tashqariga olamiz', 'выносим степень наружу', 'move the power outside') },
    { id: 'l3', tokens: ['2³'],
      label: L('ildizni hisoblaymiz', 'считаем корень', 'compute the root') },
    { id: 'l4', tokens: ['8'],
      label: L('darajani hisoblaymiz', 'считаем степень', 'compute the power') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Kasr ko'rsatkichli darajani hisoblashning to'rt qadami bir qatorda turadi, lekin tartibi buzilgan.",
    'Четыре шага вычисления степени с дробным показателем стоят в одну строку, но порядок нарушен.',
    'The four steps of computing a power with a fractional exponent stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval kasr ko'rsatkich ildizga o'tadi: maxraj besh — beshinchi darajali ildiz, surat uch — ildiz ostida o'ttiz ikkining kubi. Keyin daraja ildizdan tashqariga chiqadi, shunda ildiz ostida o'ttiz ikkining o'zi qoladi. Ikki karra ikki karra ikki karra ikki karra ikki o'ttiz ikki, demak ildiz ikkiga teng. Oxirida ikkining kubi — sakkiz. Tartibni almashtirsa ham javob o'sha, lekin o'ttiz ikkining kubi o'ttiz ikki ming yetti yuz oltmish sakkiz bo'lib, uni qo'lda hisoblash og'ir.",
    'Верно. Сначала дробный показатель переходит в корень: знаменатель пять — корень пятой степени, числитель три — под корнем куб тридцати двух. Потом степень выносится за корень, и под корнем остаются сами тридцать два. Два на два на два на два на два тридцать два, значит корень равен двум. В конце куб двух — восемь. Порядок можно и поменять, ответ тот же, но куб тридцати двух это тридцать две тысячи семьсот шестьдесят восемь, и считать это вручную тяжело.',
    'Correct. First the fractional exponent becomes a root: the denominator five gives a fifth root, the numerator three puts the cube of thirty two under it. Then the power moves outside the root, leaving thirty two itself under it. Two times two times two times two times two is thirty two, so the root is two. Finally the cube of two is eight. The order can be swapped and the answer stays the same, but the cube of thirty two is thirty two thousand seven hundred sixty eight, which is hard to compute by hand.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Javobdan boshlab bo'lmaydi: sakkiz — natija, birinchi qadam emas. Undan oldin ildiz ham, daraja ham hisoblanishi kerak.",
      'Начинать с ответа нельзя: восемь это результат, а не первый шаг. До него надо посчитать и корень, и степень.',
      'You cannot start from the answer: eight is the result, not the first step. Both the root and the power come before it.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ildizni hisoblash uchun ildiz ostida faqat o'ttiz ikki qolishi kerak. Kub ildiz ostida turganda beshinchi darajali ildizni qo'lda olib bo'lmaydi: o'ttiz ikkining kubi o'ttiz ikki mingdan oshadi.",
      'Чтобы посчитать корень, под корнем должны остаться только тридцать два. Пока куб стоит под корнем, корень пятой степени вручную не взять: куб тридцати двух больше тридцати двух тысяч.',
      'To compute the root, only thirty two must be left under it. While the cube stays under the root, a fifth root cannot be taken by hand: the cube of thirty two is over thirty two thousand.') },
    { when: (s) => s.seq[0] === 'l3', text: L(
      "Ikkining kubi qaydan keldi? Ikki — bu o'ttiz ikkidan olingan beshinchi darajali ildiz, ya'ni undan oldin yozuvni ildizga o'tkazish kerak. Birinchi qadam — kasr ko'rsatkichni ildiz bilan yozish.",
      'Откуда взялся куб двух? Два это корень пятой степени из тридцати двух, значит до него запись надо перевести в корень. Первый шаг — записать дробный показатель корнем.',
      'Where did the cube of two come from? Two is the fifth root of thirty two, so the record must be turned into a root first. The first step is writing the fractional exponent as a root.') },
    { when: (s) => s.pos.l1 > s.pos.l2, text: L(
      "Darajani tashqariga chiqarish uchun yozuv allaqachon ildiz ko'rinishida bo'lishi kerak. Avval kasr ko'rsatkichdan ildizga o'tiladi.",
      'Чтобы вынести степень наружу, запись уже должна быть корнем. Сначала переходят от дробного показателя к корню.',
      'To move the power outside, the record must already be a root. The move from the fractional exponent to the root comes first.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak? Javobi yo'q qadam birinchi turadi.",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать? Шаг без такого требования и стоит первым.',
    'Ask every step: what must already be written to do it? The step with no such requirement stands first.'),
};

export default function D08_09(props) { return <SwapOrder data={DATA} {...props} />; }
