// Dars15 · Amaliyot 05 — Tartib · 🟡 · tag: standard_form_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 5-pozitsiya)
//
// KOEFFITSIYENTLARNI FAQAT STANDART SHAKLDAN O'QISH MUMKIN. Bu darsning
// 5-ekrani (`twosides`) shu haqda, va eng ko'p uchraydigan buzilish —
// koeffitsiyentlarni o'xshash hadlarni yig'ishdan OLDIN aytish: o'shanda
// b minus olti bo'lib chiqadi, holbuki o'ng tomondan kelgan minus x bilan
// birga u minus besh bo'ladi (З39).
//
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'standard_form_steps', level: '🟡',
  expr: ['2z(z − 3) = 5 − z'], exprSize: 24,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['2z² − 6z = 5 − z'],
      label: L('qavsni ochamiz', 'раскрываем скобку', 'expand the bracket') },
    { id: 'l2', tokens: ['2z² − 6z + z − 5 = 0'],
      label: L("hamma hadni chapga o'tkazamiz", 'переносим всё влево', 'move everything to the left') },
    { id: 'l3', tokens: ['2z² − 5z − 5 = 0'],
      label: L("o'xshash hadlarni yig'amiz", 'приводим подобные', 'collect like terms') },
    { id: 'l4', tokens: ['a = 2, b = −5, c = −5'],
      label: L('koeffitsiyentlarni yozamiz', 'записываем коэффициенты', 'write the coefficients') },
  ],
  start: ['l4', 'l2', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Bu tenglama kvadrat, lekin koeffitsiyentlarini hozircha o'qib bo'lmaydi: yozuv standart shaklda emas. To'rt qadam bir qatorda turadi, tartibi buzilgan.",
    'Это уравнение квадратное, но коэффициенты пока не прочитать: запись не в стандартном виде. Четыре шага стоят в одну строку, порядок нарушен.',
    'This equation is quadratic, but its coefficients cannot be read yet: the record is not in standard form. The four steps stand in one row with their order broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval qavs ochiladi: ikki z karra z ikki z kvadrat, ikki z karra minus uch minus olti z. Keyin o'ng tomondagi hadlar chapga o'tadi va ISHORASINI almashtiradi: besh minus besh bo'ladi, minus z esa arti z. Undan keyin o'xshash hadlar yig'iladi: minus olti z qo'shuv z minus besh z. Va faqat oxirida koeffitsiyentlar o'qiladi: a ikki, b minus besh, c minus besh.",
    'Верно. Сначала раскрывается скобка: два z на z даёт два z квадрат, два z на минус три даёт минус шесть z. Потом слагаемые справа переходят влево и МЕНЯЮТ знак: пять становится минус пять, а минус z становится плюс z. Затем приводятся подобные: минус шесть z плюс z равно минус пять z. И только в конце читаются коэффициенты: a два, b минус пять, c минус пять.',
    'Correct. First the bracket is expanded: two z times z gives two z squared, two z times minus three gives minus six z. Then the terms on the right move left and CHANGE sign: five becomes minus five, minus z becomes plus z. Then like terms are collected: minus six z plus z is minus five z. And only at the end are the coefficients read: a is two, b is minus five, c is minus five.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Koeffitsiyentlardan boshlab bo'lmaydi: dastlabki yozuvda x kvadratli had qavs ichida turadi va o'ng tomonda ham hadlar bor. Koeffitsiyent standart shakldan o'qiladi, standart shakl esa hali yo'q.",
      'Начинать с коэффициентов нельзя: в исходной записи квадратное слагаемое стоит в скобке, и справа тоже есть слагаемые. Коэффициент читается из стандартного вида, а стандартного вида пока нет.',
      'You cannot start with the coefficients: in the original record the squared term sits inside a bracket and there are terms on the right as well. Coefficients are read from the standard form, and the standard form does not exist yet.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Koeffitsiyentlar o'xshash hadlar yig'ilgandan KEYIN o'qiladi. Aks holda x ning oldida minus olti z qoladi va b minus olti deb yozilib ketadi — holbuki o'ng tomondan kelgan arti z bilan birga u minus besh bo'ladi.",
      'Коэффициенты читаются ПОСЛЕ приведения подобных. Иначе перед иксом останется минус шесть z и b запишется как минус шесть — хотя вместе с плюс z, пришедшим справа, он равен минус пяти.',
      'The coefficients are read AFTER like terms are collected. Otherwise minus six z stays in front of x and b gets written as minus six — while together with the plus z that came from the right it is minus five.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Hadni ko'chirish uchun avval qavsni ochish kerak: qavs ichidagi ikki had alohida ko'rinmasa, ularni ko'chirib bo'lmaydi. Ikki z karra z minus uch degan yozuvdan bitta had emas, ikkita had chiqadi.",
      'Чтобы переносить слагаемые, сначала надо раскрыть скобку: пока два слагаемых внутри не видны по отдельности, переносить нечего. Из записи два z на z минус три выходит не одно слагаемое, а два.',
      'To move terms you must expand the bracket first: while the two terms inside are not visible separately there is nothing to move. Two z times z minus three yields not one term but two.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "O'xshash hadlarni yig'ish uchun ular BIR TOMONDA turishi kerak. Minus olti z chapda, minus z esa o'ngda — ular hali uchrashmagan. Avval ko'chirish, keyin yig'ish.",
      'Чтобы привести подобные, они должны стоять В ОДНОЙ части. Минус шесть z слева, минус z справа — они ещё не встретились. Сначала перенос, потом приведение.',
      'To collect like terms they must stand on the SAME side. Minus six z is on the left, minus z on the right — they have not met yet. First the move, then the collecting.') },
  ],
  wrongText: L(
    "Har qadamdan so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak? Koeffitsiyentlar esa har doim oxirida — ular faqat standart shakldan o'qiladi.",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать? А коэффициенты всегда последние — они читаются только из стандартного вида.',
    'Ask every step: what must already be written to do it? And the coefficients always come last — they can only be read from the standard form.'),
};

export default function D15_05(props) { return <SwapOrder data={DATA} {...props} />; }
