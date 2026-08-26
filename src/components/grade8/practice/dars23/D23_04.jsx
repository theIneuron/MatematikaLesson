// Dars23 · Amaliyot 04 — Tartib · 🟡 · tag: compare_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 4-pozitsiya)
//
// T3 NING YO'LI. Taqqoslash to'rt qadamda: ayirmani yozish, umumiy
// maxrajga keltirish, hisoblash, ishoraga qarash. Xulosa OXIRIDA turadi va
// bu tasodifiy emas: agar u boshida tursa, qolgan uch qadam javobni
// tekshirishga aylanadi, holbuki ular uni TOPADI.
//
// Kartada SO'Z asosiy, matematika qisqa dalil (telefonda ustun ~85px),
// shuning uchun yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'compare_steps', level: '🟡',
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: [{ n: '4', d: '5' }, '−', { n: '3', d: '4' }],
      label: L('ayirmani yozamiz', 'записываем разность', 'write the difference') },
    { id: 'l2', tokens: [{ n: '16', d: '20' }, '−', { n: '15', d: '20' }],
      label: L('umumiy maxrajga keltiramiz', 'приводим к общему знаменателю', 'bring to a common denominator') },
    { id: 'l3', tokens: [{ n: '1', d: '20' }],
      label: L('ayirmani hisoblaymiz', 'вычисляем разность', 'compute the difference') },
    { id: 'l4', tokens: [{ n: '4', d: '5' }, '>', { n: '3', d: '4' }],
      label: L('ishoraga qaraymiz', 'смотрим на знак', 'look at the sign') },
  ],
  start: ['l2', 'l1', 'l4', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "To'rt beshdan va uch to'rtdan taqqoslanmoqda. Yechim to'rt qadamdan iborat, lekin qadamlar aralashib ketgan.",
    'Сравниваются четыре пятых и три четвёртых. Решение состоит из четырёх шагов, но шаги перепутаны.',
    'Four fifths and three quarters are being compared. The solution has four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval ayirmani yozamiz: to'rt beshdan minus uch to'rtdan — hali hisoblanmagan, faqat yozilgan. Keyin umumiy maxraj: besh va to'rt uchun u yigirma, ya'ni o'n olti yigirmadan minus o'n besh yigirmadan. Undan keyin hisoblash: bir yigirmadan. Va faqat oxirida xulosa: ayirma musbat, demak to'rt beshdan katta. Xulosa oxirida turadi, chunki uni ayirmaning ishorasi beradi — oldindan aytilsa, u taxmin bo'lardi.",
    'Верно. Сначала записываем разность: четыре пятых минус три четвёртых — пока не вычислена, только записана. Потом общий знаменатель: для пяти и четырёх это двадцать, то есть шестнадцать двадцатых минус пятнадцать двадцатых. Затем вычисление: одна двадцатая. И только в конце вывод: разность положительна, значит четыре пятых больше. Вывод стоит в конце, потому что его даёт знак разности — сказанный заранее, он был бы догадкой.',
    'Correct. First write the difference: four fifths minus three quarters — not yet computed, only written. Then the common denominator: for five and four it is twenty, so sixteen twentieths minus fifteen twentieths. Then the computation: one twentieth. And only at the end the conclusion: the difference is positive, so four fifths is greater. The conclusion comes last because the sign of the difference gives it — stated in advance it would be a guess.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Xulosa AYIRMADAN keyin turadi. Ishoraga qarash uchun avval ayirmaning o'zi kerak: bir yigirmadan hali topilmagan bo'lsa, qaysi kasr katta ekanini aytish taxmin bo'ladi. Darsning butun mag'zi shu — taqqoslash hisobga tayanadi, ko'rinishga emas.",
      'Вывод идёт ПОСЛЕ разности. Чтобы посмотреть на знак, сначала нужна сама разность: если одна двадцатая ещё не найдена, сказать, какая дробь больше, значит угадать. В этом весь смысл урока — сравнение опирается на вычисление, а не на вид.',
      'The conclusion comes AFTER the difference. To look at the sign you first need the difference itself: if one twentieth has not been found, saying which fraction is greater is a guess. That is the whole point of the lesson — comparison rests on computation, not on appearance.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Umumiy maxrajga keltirish AYIRMA yozilgandan keyin bo'ladi: nimani keltirish kerakligi hali aytilmagan bo'lsa, o'n olti yigirmadan degan yozuv qayerdan chiqqani noma'lum. Birinchi qadam — taqqoslashni ayirmaga aylantirish.",
      'Приведение к общему знаменателю идёт после того, как РАЗНОСТЬ записана: если ещё не сказано, что именно приводят, откуда взялось шестнадцать двадцатых, непонятно. Первый шаг — превратить сравнение в разность.',
      'Bringing to a common denominator comes after the DIFFERENCE is written: if it has not been said what is being converted, it is unclear where sixteen twentieths came from. The first step is to turn the comparison into a difference.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Javobdan yoki tayyor ayirmadan boshlab bo'lmaydi — ular ishning natijasi. Taqqoslash har doim BIR YOZUVDAN boshlanadi: birinchi sondan ikkinchisini ayirish.",
      'Начинать с ответа или с готовой разности нельзя — они результат работы. Сравнение всегда начинается с ОДНОЙ записи: из первого числа вычесть второе.',
      'You cannot start with the answer or with the finished difference — they are the result of the work. A comparison always starts with ONE record: subtract the second number from the first.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Bir yigirmadan degan natija umumiy maxrajdan chiqadi: besh va to'rtli kasrlarni to'g'ridan-to'g'ri ayirib bo'lmaydi. Avval ikkalasini yigirmalik kasrga aylantirish kerak.",
      'Результат одна двадцатая выходит из общего знаменателя: дроби с пятёркой и четвёркой напрямую не вычитаются. Сначала обе надо превратить в двадцатые доли.',
      'The result one twentieth comes from the common denominator: fractions with five and four cannot be subtracted directly. Both must first be turned into twentieths.') },
  ],
  wrongText: L(
    "Ayirmani yozish birinchi, xulosa oxirgi. Har qadam oldingisining natijasidan foydalanadi, va xulosani faqat hisoblangan ayirmaning ishorasi beradi.",
    'Запись разности первая, вывод последний. Каждый шаг пользуется результатом предыдущего, а вывод даёт только знак вычисленной разности.',
    'Writing the difference comes first, the conclusion last. Each step uses the result of the previous one, and only the sign of the computed difference gives the conclusion.'),
};

export default function D23_04(props) { return <SwapOrder data={DATA} {...props} />; }
