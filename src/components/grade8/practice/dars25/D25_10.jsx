// Dars25 · Amaliyot 10 — Tartib · 🔴 · tag: solve_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 10-pozitsiya)
//
// DARSNING BUTUN YO'LI BIR QATORDA: hadni ko'chirish (T3), manfiy songa
// bo'lish va ishorani burish (З52), javob, tekshirish (З16).
//
// Ikkala qoida ham bitta misolda ishlaydi: beshni o'ngga ko'chirganda u
// MINUS besh bo'lib chiqadi (o'n bir minus besh olti), keyin esa minus
// ikkiga bo'lishda ishora buriladi.
// Kartada SO'Z asosiy, matematika qisqa dalil, yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_steps', level: '🔴',
  expr: ['5 − 2x < 11'], exprSize: 26,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['−2x<6'],
      label: L("hadni o'ngga ko'chiramiz", 'переносим член вправо', 'move the term to the right') },
    { id: 'l2', tokens: [':(−2), >'],
      label: L("−2 ga bo'lib ishorani buramiz", 'делим на −2 и переворачиваем знак', 'divide by −2 and flip the sign') },
    { id: 'l3', tokens: ['x>−3'],
      label: L('javobni yozamiz', 'записываем ответ', 'write the answer') },
    { id: 'l4', tokens: ['x=0: 5<11'],
      label: L('son bilan tekshiramiz', 'проверяем числом', 'check with a number') },
  ],
  start: ['l2', 'l1', 'l4', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Tengsizlikni yechish to'rt qadamdan iborat, lekin qadamlar aralashib ketgan. Bu misolda darsning ikkala qoidasi ham ishlaydi.",
    'Решение неравенства состоит из четырёх шагов, но шаги перепутаны. В этом примере работают оба правила урока.',
    'Solving the inequality takes four steps, but the steps are mixed up. Both rules of the lesson are at work in this example.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval hadni ko'chiramiz: besh o'ngga o'tadi va ishorasini almashtiradi — minus ikki x oltidan kichik. Keyin minus ikkiga bo'lamiz va ishorani buramiz: x minus uchdan katta. Oxirida tekshiramiz: nolda besh o'n birdan kichik.",
    'Верно. Сначала переносим член: пятёрка уходит вправо и меняет знак — минус два x меньше шести. Потом делим на минус два и переворачиваем знак: x больше минус трёх. В конце проверяем: при нуле пять меньше одиннадцати.',
    'Correct. First move the term: the five goes right and changes sign — minus two x is less than six. Then divide by minus two and flip the sign: x is greater than minus three. At the end check: at zero, five is less than eleven.'),
  wrongs: [
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Bo'lish HADNI KO'CHIRGANDAN keyin bo'ladi. Hozircha chap tomonda ikki had turibdi: besh va minus ikki x. Ikkalasini birdan minus ikkiga bo'lish mumkin, lekin o'shanda kasr chiqadi va yechim chalkashadi. Avval x li had yolg'iz qoldiriladi.",
      'Деление идёт ПОСЛЕ переноса члена. Пока в левой части два слагаемых: пять и минус два x. Разделить на минус два можно и их, но тогда выйдет дробь и решение запутается. Сначала член с x оставляют один.',
      'The division comes AFTER moving the term. So far the left side has two terms: five and minus two x. They could be divided by minus two together, but that produces a fraction and tangles the solution. First the term with x is left alone.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Tekshirish JAVOBDAN keyin turadi: nolni qayerdan olish kerakligi javobsiz noma'lum. Avval x minus uchdan katta degan xulosa chiqadi, keyin undan biror son olinadi va dastlabki tengsizlikka qo'yiladi.",
      'Проверка идёт ПОСЛЕ ответа: без ответа непонятно, откуда брать нуль. Сначала выходит вывод, что x больше минус трёх, потом из него берут число и подставляют в исходное неравенство.',
      'The check comes AFTER the answer: without the answer it is unclear where the zero should come from. First the conclusion that x is greater than minus three, then a number is taken from it and substituted into the original inequality.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l4', text: L(
      "Javobdan yoki tekshirishdan boshlab bo'lmaydi — ular ishning natijasi. Yechim har doim yozuvni SODDALASHTIRISHDAN boshlanadi: bu yerda x li hadni yolg'iz qoldirish.",
      'Начинать с ответа или с проверки нельзя — они результат работы. Решение всегда начинается с УПРОЩЕНИЯ записи: здесь это оставить член с x одному.',
      'You cannot start with the answer or the check — they are the result of the work. A solution always starts by SIMPLIFYING the record: here, leaving the term with x alone.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Javob BO'LISHDAN keyin yoziladi, aks holda ishora burilmay qoladi. Minus ikki x oltidan kichik degan yozuvdan to'g'ridan-to'g'ri x oltidan kichik deb yozib bo'lmaydi: bo'luvchi manfiy, ya'ni ikkala tomon ham o'zgaradi va belgi buriladi.",
      'Ответ пишется ПОСЛЕ деления, иначе знак останется неперевёрнутым. Из записи минус два x меньше шести нельзя сразу написать, что x меньше шести: делитель отрицателен, значит меняются обе части и знак переворачивается.',
      'The answer is written AFTER the division, otherwise the sign stays unflipped. From the record minus two x is less than six you cannot write straight away that x is less than six: the divisor is negative, so both sides change and the sign flips.') },
  ],
  wrongText: L(
    "Avval hadni ko'chiring, keyin koeffitsiyentga bo'ling va ishorani buring, keyin javobni yozing, oxirida son bilan tekshiring.",
    'Сначала перенеси член, потом раздели на коэффициент и переверни знак, потом запиши ответ, в конце проверь числом.',
    'First move the term, then divide by the coefficient and flip the sign, then write the answer, and check with a number at the end.'),
};

export default function D25_10(props) { return <SwapOrder data={DATA} {...props} />; }
