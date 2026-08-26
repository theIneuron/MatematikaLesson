// Dars34 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: data_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 3-pozitsiya)
//
// JAVOB: HA, YO'Q (skelet §0a.3). З69 eng qisqa shaklda: ikki da'voda
// AYNAN o'sha ikki son turadi — ikkilik va to'rt, — farq esa faqat
// ATAMADA. Chastota to'rt, nisbiy chastota esa nol butun to'rt o'ndan.
//
// Nisbiy chastotaning birdan katta bo'lolmasligi — eng tez tekshiruv, va
// razbor aynan shundan boshlaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'data_claims', level: '🟢',
  itemSize: 16,
  given: [['2, 3, 2, 4, 2, 3, 5, 3, 2, 4']],
  givenLabel: L('Tanlanma', 'Выборка', 'The sample'),
  items: [
    { id: 's1', yes: true, tokens: ['2'], at: '→ 4',
      claim: L("ikkilikning chastotasi to'rt", 'частота двойки равна четырём', 'the frequency of the two is four') },
    { id: 's2', yes: false, tokens: ['2'], at: '→ 4',
      claim: L("ikkilikning nisbiy chastotasi to'rt", 'относительная частота двойки равна четырём', 'the relative frequency of the two is four') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki da'voda bir xil ikki son turibdi — ikkilik va to'rt. Farq faqat bitta so'zda: birinchisida «chastota», ikkinchisida «nisbiy chastota».",
    'В двух утверждениях стоят одни и те же два числа — двойка и четвёрка. Различие в одном слове: в первом «частота», во втором «относительная частота».',
    'The two claims hold the same two numbers — the two and the four. They differ in one word: «frequency» in the first, «relative frequency» in the second.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Chastota — SANOQ: ikkilik tanlanmada to'rt marta uchraydi, ya'ni uning chastotasi to'rt. Nisbiy chastota esa ULUSH: chastotani tanlanma hajmiga bo'lish kerak, to'rt bo'lingan o'n — nol butun to'rt o'ndan. Ikki atama bitta sondan chiqadi, lekin ular butunlay boshqa narsani o'lchaydi. Eng tez tekshiruv: nisbiy chastota hech qachon birdan katta bo'lolmaydi, chunki hech bir variant tanlanmadan ko'p marta uchrolmaydi. To'rt esa birdan katta, ya'ni ikkinchi da'vo darhol rad etiladi.",
    'Верно. Частота — это ПОДСЧЁТ: двойка встречается в выборке четыре раза, значит её частота четыре. А относительная частота — это ДОЛЯ: частоту надо разделить на объём выборки, четыре делить на десять — нуль целых четыре десятых. Оба термина выходят из одного числа, но измеряют совершенно разное. Самая быстрая проверка: относительная частота никогда не больше единицы, ведь ни один вариант не может встретиться чаще, чем есть наблюдений. А четыре больше единицы, значит второе утверждение отвергается сразу.',
    'Correct. A frequency is a COUNT: the two occurs four times in the sample, so its frequency is four. A relative frequency is a SHARE: the frequency divided by the sample size, four divided by ten — zero point four. Both terms come from one number, yet they measure quite different things. The fastest check: a relative frequency is never above one, since no variant can occur more often than there are observations. Four exceeds one, so the second claim is rejected at once.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1 && s.bad.indexOf('s2') !== -1, text: L(
      "Ikkala javob ham teskari. Ikki atamani ajrating: chastota — necha MARTA, nisbiy chastota — qaysi ULUSH. Birinchisi butun son bo'ladi va u tanlanma hajmigacha yetishi mumkin; ikkinchisi kasr bo'ladi va u birdan oshmaydi. Ikkilik uchun: chastota to'rt, nisbiy chastota nol butun to'rt o'ndan.",
      'Оба ответа перевёрнуты. Раздели два термина: частота — сколько РАЗ, относительная частота — какая ДОЛЯ. Первая целое число и может дойти до объёма выборки; вторая дробь и единицы не превышает. Для двойки: частота четыре, относительная частота нуль целых четыре десятых.',
      'Both answers are inverted. Separate the two terms: a frequency is how many TIMES, a relative frequency is what SHARE. The first is a whole number and may reach the sample size; the second is a fraction and never exceeds one. For the two: frequency four, relative frequency zero point four.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo ROST. Chastota — bu shunchaki sanoq, va ikkilik tanlanmada to'rt marta turibdi: birinchi, uchinchi, beshinchi va to'qqizinchi o'rinlarda. Chastota butun son bo'ladi va u birdan katta bo'lishi mutlaqo normal — u ulush emas, sanoq. Uni tanlanma hajmiga bo'lish keyingi qadam, va u boshqa atamani beradi.",
      'Первое утверждение ВЕРНО. Частота — это просто подсчёт, а двойка стоит в выборке четыре раза: на первом, третьем, пятом и девятом местах. Частота — целое число, и то, что она больше единицы, совершенно нормально: это не доля, а счёт. Деление на объём выборки — следующий шаг, и он даёт другой термин.',
      'The first claim is TRUE. A frequency is simply a count, and the two stands in the sample four times: in the first, third, fifth and ninth places. A frequency is a whole number, and its being above one is perfectly normal — it is a count, not a share. Dividing by the sample size is the next step, and it yields a different term.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo YOLG'ON. Nisbiy chastota — chastotaning tanlanma hajmiga NISBATI, ya'ni to'rt bo'lingan o'n, va bu nol butun to'rt o'ndan. To'rt bo'lishi mumkin emas: nisbiy chastota birdan katta bo'lsa, variant tanlanmada mavjud javoblardan ko'proq marta uchragan bo'lardi. Buni tekshirish sekundlik ish: ulush har doim noldan birgacha.",
      'Второе утверждение ЛОЖНО. Относительная частота — это ОТНОШЕНИЕ частоты к объёму выборки, то есть четыре делить на десять, а это нуль целых четыре десятых. Четвёркой она быть не может: если относительная частота больше единицы, значит вариант встретился чаще, чем всего ответов. Проверка занимает секунду: доля всегда от нуля до единицы.',
      'The second claim is FALSE. A relative frequency is the RATIO of the frequency to the sample size, that is four divided by ten, which is zero point four. It cannot be four: a relative frequency above one would mean the variant occurred more often than there are answers at all. The check takes a second: a share always lies between zero and one.') },
  ],
  wrongText: L(
    "Chastota — necha marta, nisbiy chastota — qaysi ulush. Ulush hech qachon birdan katta bo'lmaydi, va bu eng tez tekshiruv.",
    'Частота — сколько раз, относительная частота — какая доля. Доля никогда не больше единицы, и это самая быстрая проверка.',
    'A frequency is how many times, a relative frequency is what share. A share is never above one, and that is the fastest check.'),
};

export default function D34_03(props) { return <TrueFalse data={DATA} {...props} />; }
