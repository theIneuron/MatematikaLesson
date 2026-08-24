// Dars12 · Amaliyot 07 — Tartib · 🟡 · tag: compute_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 7-pozitsiya)
//
// DARSNING UCHINCHI TASDIG'I: xossa katta sonni QULAY ko'paytuvchilarga
// ajratib hisoblash imkonini beradi. To'rt ming to'qqiz yuzdan ildizni yoddan
// olish qiyin, lekin uni yuz to'qsan olti karra yigirma beshga ajratsangiz
// ikki ildizning ikkalasi ham butun chiqadi.
//
// Buzilishning eng ko'p uchraydigan shakli — javobni ildiz olishdan OLDIN
// qo'yish, ya'ni «yetmish» kartasini yuqoriga surish: o'shanda yozuv javobni
// isbotlamaydi, faqat e'lon qiladi.
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas: aralashtirish ba'zan
// to'g'ri tartibni berib qo'yardi va topshiriq bir bosishda yopilardi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'compute_steps', level: '🟡',
  expr: [{ r: '4900' }], exprSize: 30,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['4900 = 196 · 25'],
      label: L("qulay ko'paytuvchilarga ajratamiz", 'разбиваем на удобные множители', 'split into convenient factors') },
    { id: 'l2', tokens: [{ r: '196' }, '·', { r: '25' }],
      label: L('har biridan alohida ildiz olamiz', 'берём корень из каждого', 'take the root of each') },
    { id: 'l3', tokens: ['14 · 5'],
      label: L('ikki ildizni hisoblaymiz', 'считаем два корня', 'compute the two roots') },
    { id: 'l4', tokens: ['70'],
      label: L('javobni yozamiz', 'записываем ответ', 'write the answer') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "To'rt ming to'qqiz yuzdan ildizni yoddan olish qiyin. Xossa yo'l ochadi: sonni to'liq kvadratlarga ajratib, har biridan alohida ildiz olish mumkin. To'rt qadam bir qatorda turadi, lekin tartibi buzilgan.",
    'Корень из четырёх тысяч девятисот в уме не возьмёшь. Свойство открывает путь: число разбивается на полные квадраты, и корень берётся из каждого. Четыре шага стоят в одну строку, но порядок нарушен.',
    'The root of four thousand nine hundred is hard to take in your head. The property opens a way: split the number into perfect squares and take the root of each. The four steps stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval ajratish: to'rt ming to'qqiz yuz bu yuz to'qsan olti karra yigirma besh, va ikkalasi ham to'liq kvadrat — shuning uchun ajratish QULAY. Keyin xossa ishlaydi: ildiz ikkiga bo'linadi. Undan keyin ikki ildiz hisoblanadi — o'n to'rt va besh. Faqat oxirida ko'paytma yoziladi: yetmish. Tekshiring: yetmishni kvadratga oshirsangiz to'rt ming to'qqiz yuz chiqadi.",
    'Верно. Сначала разбиение: четыре тысячи девятьсот это сто девяносто шесть на двадцать пять, и оба полные квадраты — потому разбиение и УДОБНОЕ. Потом работает свойство: корень раздаётся на два. Затем считаются два корня — четырнадцать и пять. И только в конце пишется произведение: семьдесят. Проверь: семьдесят в квадрате даёт четыре тысячи девятьсот.',
    'Correct. First the split: four thousand nine hundred is one hundred ninety six times twenty five, and both are perfect squares — that is what makes the split CONVENIENT. Then the property works: the root divides in two. Then the two roots are computed — fourteen and five. Only at the end is the product written: seventy. Check: seventy squared is four thousand nine hundred.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Javobdan boshlab bo'lmaydi: yetmish qaydan chiqqani hali ko'rsatilmagan. Javob — oxirgi qadam, birinchisi emas. Yozuv javobni ISBOTLASHI kerak, e'lon qilishi emas.",
      'Начинать с ответа нельзя: откуда взялось семьдесят, ещё не показано. Ответ — последний шаг, а не первый. Запись должна ДОКАЗЫВАТЬ ответ, а не объявлять его.',
      'You cannot start from the answer: where seventy came from has not been shown yet. The answer is the last step, not the first. The record must PROVE the answer, not announce it.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Yetmish ikki ildizning KO'PAYTMASI: o'n to'rt karra besh. Demak o'n to'rt va besh oldin turishi kerak. Ularsiz yetmish qaydan olinadi?",
      'Семьдесят это ПРОИЗВЕДЕНИЕ двух корней: четырнадцать на пять. Значит четырнадцать и пять должны стоять раньше. Откуда взять семьдесят без них?',
      'Seventy is the PRODUCT of the two roots: fourteen times five. So fourteen and five must come earlier. Without them, where would seventy come from?') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Ildizni ikkiga ajratish uchun ikki ko'paytuvchi allaqachon topilgan bo'lishi kerak. Birinchi qadam aynan shu: to'rt ming to'qqiz yuzni yuz to'qsan olti karra yigirma besh deb yozish. Ko'paytuvchisiz ajratadigan narsa yo'q.",
      'Чтобы раздать корень на два, два множителя должны быть уже найдены. Первый шаг именно в этом: записать четыре тысячи девятьсот как сто девяносто шесть на двадцать пять. Без множителей раздавать нечего.',
      'To split the root in two, the two factors must already be found. That is exactly the first step: writing four thousand nine hundred as one hundred ninety six times twenty five. Without factors there is nothing to split.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "O'n to'rt va besh — bu ikki ildizning qiymatlari, demak ildizlar oldin yozilishi kerak. Aks holda o'n to'rt qaysi sondan chiqqani ko'rinmaydi.",
      'Четырнадцать и пять — значения двух корней, значит корни должны быть записаны раньше. Иначе не видно, из какого числа вышло четырнадцать.',
      'Fourteen and five are the values of the two roots, so the roots must be written first. Otherwise it is not visible which number fourteen came from.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak? Javobi yo'q qadam birinchi turadi, javobning o'zi esa oxirida.",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать? Шаг без такого требования стоит первым, а сам ответ последним.',
    'Ask every step: what must already be written to do it? The step with no such requirement stands first, and the answer itself last.'),
};

export default function D12_07(props) { return <SwapOrder data={DATA} {...props} />; }
