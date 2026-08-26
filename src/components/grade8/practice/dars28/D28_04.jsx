// Dars28 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 4-pozitsiya)
//
// UCH BO'SHLIQ — DARSNING UCH TASDIG'I. Bankdagi tuzoqlar:
//   «son»       — noma'lumni son bilan belgilash (21-darsning tuzog'i, va
//                 u bu yerda ham ishlaydi);
//   «tenglama»  — 21-darsning ishi: u yerda «teng» degan shart tenglama
//                 berardi, bu yerda esa «yetadi», «kamida» — tengsizlik;
//   «mos»       — З57 ning teskarisi: shartga MOS qiymatlarni tashlash.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Noma'lum kattalik",
      'Неизвестную величину обозначают',
      'The unknown quantity is denoted by') },
    { slot: 0 },
    { text: L(
      "bilan belgilanadi, masala sharti esa",
      ', а условие задачи превращают в',
      ', and the condition is turned into') },
    { slot: 1 },
    { text: L(
      "aylantiriladi. Yechimdan masala shartiga",
      '. Из решения исключают значения, условию задачи',
      '. From the solution one excludes the values that are') },
    { slot: 2 },
    { text: L(
      "qiymatlar chiqarib tashlanadi.",
      '.',
      'to the condition.') },
  ],
  cards: [
    { id: 'w1', label: L('harf', 'буквой', 'a letter') },
    { id: 'w2', label: L('tengsizlikka', 'неравенство', 'an inequality') },
    { id: 'w3', label: L('zid', 'противоречащие', 'contradictory') },
    { id: 'w4', label: L('son', 'числом', 'a number') },
    { id: 'w5', label: L('tenglamaga', 'уравнение', 'an equation') },
    { id: 'w6', label: L('mos', 'соответствующие', 'matching') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch tasdig'i bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Три утверждения урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The three statements of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch qadam har masalada takrorlanadi. Birinchisi 21-darsdan tanish: noma'lumni harf bilan belgilash. Ikkinchisi yangi: shartda «teng» emas, «yetadi», «kamida», «ko'pi bilan» degan so'zlar tursa, tenglama emas, TENGSIZLIK chiqadi. Uchinchisi esa eng ko'p tashlab ketiladigan qadam: yechimdan shartga zid qiymatlarni chiqarib tashlash. Sanoq butun bo'ladi, uzunlik musbat — bularni tengsizlikning o'zi bilmaydi, ularni MASALA aytadi.",
    'Верно. Три шага повторяются в каждой задаче. Первый знаком с урока 21: обозначить неизвестное буквой. Второй новый: если в условии стоит не «равно», а «хватит», «не менее», «не более», то выходит не уравнение, а НЕРАВЕНСТВО. Третий же пропускают чаще всего: исключить из решения значения, противоречащие условию. Количество целое, длина положительная — этого само неравенство не знает, об этом говорит ЗАДАЧА.',
    'Correct. Three steps repeat in every problem. The first is familiar from lesson 21: denote the unknown by a letter. The second is new: if the condition says not «equals» but «is enough», «at least», «at most», then an INEQUALITY comes out, not an equation. The third is the one skipped most often: exclude from the solution the values that contradict the condition. A count is whole, a length is positive — the inequality itself does not know this, the PROBLEM says it.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Noma'lum SON bilan belgilanmaydi — u hali noma'lum. Aynan shuning uchun harf qo'yiladi: harf ustida amal bajarish mumkin, va oxirida u qanday qiymatlarni qabul qilishi chiqadi. Bu qadam 21-darsdan tanish va u yerda ham xuddi shunday ishlaydi.",
      'Неизвестное не обозначают ЧИСЛОМ — оно ведь неизвестно. Именно поэтому ставят букву: с буквой можно выполнять действия, и в конце выясняется, какие значения она принимает. Этот шаг знаком с урока 21 и работает там точно так же.',
      'The unknown is not denoted by a NUMBER — it is unknown after all. That is exactly why a letter is used: operations can be carried out on a letter, and at the end it turns out which values it takes. This step is familiar from lesson 21 and works there the same way.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Bu darsda shartdan TENGSIZLIK chiqadi, tenglama emas. Farqni shartning so'zlari beradi: «narxi 20000 so'mga TENG» degan gap tenglama berardi, «puli YETISHI kerak» degan gap esa tengsizlik beradi. «Kamida», «ko'pi bilan», «dan ortiq» so'zlari ham shunday.",
      'В этом уроке из условия выходит НЕРАВЕНСТВО, а не уравнение. Разницу задают слова условия: «стоимость РАВНА 20000 сумов» дало бы уравнение, а «денег должно ХВАТИТЬ» даёт неравенство. Так же работают слова «не менее», «не более», «больше чем».',
      'In this lesson the condition yields an INEQUALITY, not an equation. The words of the condition make the difference: «the cost EQUALS 20000 soums» would give an equation, while «the money must be ENOUGH» gives an inequality. The words «at least», «at most», «more than» work the same way.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Teskarisi bo'lib qoldi. Yechimdan shartga ZID qiymatlar chiqarib tashlanadi, mos keladiganlari esa qoladi — ular javob bo'ladi. Misol: yechim x minus to'rtdan katta, x esa tomon uzunligi. Manfiy qiymatlar zid, ular ketadi; musbatlari mos, ular qoladi.",
      'Вышло наоборот. Из решения исключают значения, ПРОТИВОРЕЧАЩИЕ условию, а подходящие остаются — они и есть ответ. Пример: решение x больше минус четырёх, а x это длина стороны. Отрицательные значения противоречат и уходят; положительные подходят и остаются.',
      'It came out backwards. The values CONTRADICTING the condition are excluded, while the fitting ones stay — they are the answer. Example: the solution is x greater than minus four, and x is a side length. The negative values contradict and go; the positive ones fit and stay.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni daftar masalasida tekshiring: bitta daftar 3000 so'm, pul 20000 so'm.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на задаче про тетради: одна тетрадь 3000 сумов, денег 20000 сумов.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the notebook problem: one notebook costs 3000 soums, the money is 20000 soums.') },
  ],
  wrongText: L(
    "Har so'zni daftar masalasida tekshiring. Noma'lum harf bilan belgilanadi, shart tengsizlikka aylanadi, yechimdan esa zid qiymatlar chiqarib tashlanadi.",
    'Проверяй каждое слово на задаче про тетради. Неизвестное обозначают буквой, условие превращают в неравенство, а из решения исключают противоречащие значения.',
    'Test every word on the notebook problem. The unknown is denoted by a letter, the condition becomes an inequality, and the contradicting values are excluded from the solution.'),
};

export default function D28_04(props) { return <ClozeBank data={DATA} {...props} />; }
