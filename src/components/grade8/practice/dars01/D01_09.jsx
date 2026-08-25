// Dars01 · Amaliyot 09 — Tartib · 🔴 · tag: order_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder (yangi, 26-tip).
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §09
//
// Darsning uch qadami (DARS01_SKELET §3) to'rt kartaga yozilgan: chiziq
// tagini ajratish, nolga tenglash, yechish, shartni yozish. Eng ko'p
// uchraydigan buzilish — xulosani (a = 5) tenglamadan OLDIN qo'yish.
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas: aralashtirish
// ba'zan to'g'ri tartibni berib qo'yardi va topshiriq bir bosishda yopilardi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'order_steps', level: '🔴',
  expr: [{ n: '15', d: '4a − 20' }], exprSize: 26,
  itemSize: 15,
  cards: [
    { id: 'l1', tokens: ['4a − 20'], label: L('chiziq tagini ajratamiz', 'выделяем то, что под чертой', 'single out what is below the bar') },
    { id: 'l2', tokens: ['4a − 20 = 0'], label: L('maxrajni nolga tenglaymiz', 'приравниваем знаменатель к нулю', 'set the denominator to zero') },
    { id: 'l3', tokens: ['a = 5'], label: L('tenglamani yechamiz', 'решаем уравнение', 'solve the equation') },
    { id: 'l4', tokens: ['a ≠ 5'], label: L('shartni yozamiz', 'записываем условие', 'write the condition') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Kasr qaysi qiymatda ma'noga ega emasligini topishning to'rt yo'li bir qatorda turadi, lekin tartibi buzilgan.",
    'Четыре шага поиска значения, при котором дробь не имеет смысла, стоят в одну строку, но порядок нарушен.',
    'The four steps for finding where a fraction has no value stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Tartib har doim shunday: chiziq tagini ajratamiz, uni nolga tenglaymiz, tenglamani yechamiz va shartni yozamiz. Beshni qo'yib tekshiring: to'rt karra besh yigirma, yigirma minus yigirma nol — demak beshda kasr ma'noga ega emas.",
    'Верно. Порядок всегда такой: выделяем то, что под чертой, приравниваем к нулю, решаем уравнение и записываем условие. Проверь подстановкой: четыре на пять — двадцать, двадцать минус двадцать — нуль, значит при пяти дробь не имеет смысла.',
    'Correct. The order is always this: single out what is below the bar, set it to zero, solve the equation and write the condition. Check by substituting: four times five is twenty, twenty minus twenty is zero, so at five the fraction has no value.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l3', text: L(
      "Xulosadan boshlab bo'lmaydi: a beshga teng degan natija tenglamadan CHIQADI, undan oldin turmaydi.",
      'Начинать с вывода нельзя: результат a равно пяти ВЫХОДИТ из уравнения, а не стоит перед ним.',
      'You cannot start from the conclusion: the result a equals five COMES OUT of the equation, it does not stand before it.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Shartni yechimdan oldin yozib bo'lmaydi: taqiqlanadigan sonni bilmasdan a nolga teng emas degan yozuvni to'ldirish mumkin emas.",
      'Условие не записать раньше решения: не зная запрещённого числа, нечего поставить в запись a не равно.',
      'The condition cannot be written before the solution: without knowing the forbidden number there is nothing to put into a is not equal to.') },
    { when: (s) => s.seq[0] === 'l2', text: L(
      "Nolga tenglashdan oldin NIMANI tenglashni ajratib olish kerak. Birinchi qadam — chiziqning tagiga qarash.",
      'Прежде чем приравнивать к нулю, надо выделить ЧТО приравнивать. Первый шаг — посмотреть под черту.',
      'Before setting something to zero you must single out WHAT to set. The first step is to look below the bar.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Yozuvni nolga tenglash uchun avval o'sha yozuvni ajratib olish kerak. Ikki qadamning o'rnini almashtiring.",
      'Чтобы приравнять запись к нулю, эту запись сначала надо выделить. Поменяй эти два шага местами.',
      'To set a record to zero, that record has to be singled out first. Swap these two steps.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon ma'lum bo'lishi kerak? Javobi yo'q qadam birinchi turadi.",
    'Спроси у каждого шага: что должно быть уже известно, чтобы его сделать? Шаг без такого требования и стоит первым.',
    'Ask every step: what must already be known to do it? The step with no such requirement stands first.'),
};

export default function D01_09(props) { return <SwapOrder data={DATA} {...props} />; }
