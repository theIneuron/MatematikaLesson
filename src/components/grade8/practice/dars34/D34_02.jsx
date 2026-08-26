// Dars34 · Amaliyot 02 — Belgilash · 🟢 · tag: frequency_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §6 (34-dars, 2-pozitsiya)
//
// KARTADA SO'Z YO'Q, faqat belgi: `2 → 4` degani «ikki varianti to'rt
// marta uchradi» (skelet §0a.5, kartalar tarjima qilinmaydi). O'qish
// usulini `setup` aytadi, va u uch tilda ham chiqadi.
//
// Uch xato karta uch xil: `4 → 3` (aslida 2), `2 → 2` va `3 → 4` — hammasi
// QO'SHNI variantning chastotasi. Sanoqda qator surilib ketishi eng
// ko'p uchraydigan xato, va u aynan shunday ko'rinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'frequency_marked', level: '🟢',
  col: 100, itemSize: 18,
  given: [['2, 3, 2, 4, 2, 3, 5, 3, 2, 4']],
  givenLabel: L('Tanlanma', 'Выборка', 'The sample'),
  items: [
    { id: 'i1', tokens: ['2 → 4'], hit: true },
    { id: 'i2', tokens: ['3 → 3'], hit: true },
    { id: 'i3', tokens: ['4 → 3'] },
    { id: 'i4', tokens: ['5 → 1'], hit: true },
    { id: 'i5', tokens: ['2 → 2'] },
    { id: 'i6', tokens: ['3 → 4'] },
  ],
  eyebrow: L('Belgilash', 'Отметь', 'Mark'),
  setup: L(
    "Kartada «variant o'q chastota» yozilgan: masalan uch o'q ikki degani «uchlik ikki marta uchradi». Oltita kartadan uchtasi tanlanmaga to'g'ri keladi.",
    'На карточке написано «вариант стрелка частота»: например три стрелка два значит «тройка встретилась два раза». Три карточки из шести соответствуют выборке.',
    'A card reads «variant arrow frequency»: for instance three arrow two means «the three occurred twice». Three of the six cards match the sample.'),
  ask: L(
    "Chastotasi TO'G'RI yozilgan 3 ta kartani belgilang.",
    'Отметь 3 карточки, где частота записана ВЕРНО.',
    'Mark the 3 cards where the frequency is written CORRECTLY.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Chastota — variant necha marta uchragani, ya'ni oddiy sanoq: ikkilik to'rt marta, uchlik uch marta, beshlik bir marta. Tekshirishning ishonchli yo'li bor: chastotalar yig'indisi tanlanma hajmiga teng bo'lishi kerak. To'rt qo'shuv uch qo'shuv ikki qo'shuv bir o'n. Yig'indi o'nga chiqmasa, sanoq surilib ketgan.",
    'Верно. Частота — это сколько раз встретился вариант, обычный подсчёт: двойка четыре раза, тройка три, пятёрка один. Есть надёжная проверка: сумма частот должна равняться объёму выборки. Четыре плюс три плюс два плюс один десять. Если сумма не даёт десяти, счёт сбился.',
    'Correct. A frequency is how many times a variant occurs, plain counting: the two four times, the three three times, the five once. There is a safe check: the sum of the frequencies must equal the sample size. Four plus three plus two plus one is ten. If the sum falls short, the count slipped.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i3') !== -1, text: L(
      "To'rtlikning chastotasi uch emas, IKKI. Tanlanmani boshidan oxirigacha yuring va faqat to'rtliklarni sanang: ular yettinchi va o'ninchi o'rinda turibdi — jami ikkita. Uchta bo'lgani uchlik, va u boshqa karta. Sanashda barmoq bilan har topilgan sonni belgilab borish qatorning surilib ketishidan saqlaydi.",
      'У четвёрки частота не три, а ДВА. Пройди выборку от начала до конца и считай только четвёрки: они стоят на седьмом и десятом местах — всего две. Три раза встречается тройка, и это другая карточка. При счёте отмечай каждое найденное число — это спасает от сбоя.',
      'The frequency of the four is not three but TWO. Walk the sample from start to end counting only fours: they stand in the seventh and tenth places — two in all. It is the three that occurs three times, and that is another card. Marking each number as you find it protects the count from slipping.') },
    { when: (s) => s.extra.indexOf('i5') !== -1, text: L(
      "Ikkilikning chastotasi ikki emas, TO'RT. Ikkilik tanlanmada eng ko'p uchraydigan son: u birinchi, uchinchi, beshinchi va to'qqizinchi o'rinda turibdi. Bu kartani belgilash tanlanmaning yarmini yo'qotadi — chastotalar yig'indisi o'n emas, sakkiz bo'lib qoladi.",
      'У двойки частота не два, а ЧЕТЫРЕ. Двойка — самое частое число выборки: она стоит на первом, третьем, пятом и девятом местах. Отметив эту карточку, теряешь половину выборки — сумма частот станет восемь вместо десяти.',
      'The frequency of the two is not two but FOUR. The two is the most common number in the sample: it stands in the first, third, fifth and ninth places. Marking this card loses half the sample — the sum of the frequencies becomes eight instead of ten.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Uchlikning chastotasi to'rt emas, UCH. To'rt marta uchraydigan son — ikkilik, va u qo'shni karta. Ikki qo'shni variantning chastotasi almashib ketishi eng ko'p uchraydigan xato: sanoq bir qator surilib ketadi. Har variantni ALOHIDA sanang, oldingisining natijasiga suyanmang.",
      'У тройки частота не четыре, а ТРИ. Четыре раза встречается двойка, и это соседняя карточка. Перепутать частоты двух соседних вариантов — самая частая ошибка: счёт сбивается на строку. Считай каждый вариант ОТДЕЛЬНО, не опираясь на результат предыдущего.',
      'The frequency of the three is not four but THREE. It is the two that occurs four times, and that is the neighbouring card. Swapping the frequencies of two neighbouring variants is the commonest error: the count slips by a row. Count each variant SEPARATELY, not leaning on the previous result.') },
    { when: (s) => s.miss.indexOf('i4') !== -1, text: L(
      "Beshlik chetlab o'tildi, lekin uning chastotasi to'g'ri yozilgan: bir. Chastota bir bo'lishi g'alati emas — variant tanlanmada bir marta uchrasa ham u variant bo'lib qolaveradi va jadvalga kiradi. Uni tashlab ketsangiz chastotalar yig'indisi to'qqiz bo'ladi, tanlanma hajmi esa o'n.",
      'Пятёрка осталась в стороне, а её частота записана верно: один. Частота, равная единице, — не странность: вариант, встретившийся один раз, всё равно вариант и входит в таблицу. Если его отбросить, сумма частот станет девять, а объём выборки десять.',
      'The five was left out, yet its frequency is written correctly: one. A frequency of one is nothing odd — a variant that occurs once is still a variant and belongs in the table. Drop it and the sum of the frequencies becomes nine while the sample size is ten.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta karta kerak. Har variantni alohida sanang va oxirida yig'indini tekshiring: to'rt qo'shuv uch qo'shuv ikki qo'shuv bir o'nga teng bo'lishi kerak.",
      'Нужно ровно три карточки. Считай каждый вариант отдельно и в конце проверь сумму: четыре плюс три плюс два плюс один должно дать десять.',
      'Exactly three cards are needed. Count each variant separately and check the sum at the end: four plus three plus two plus one must give ten.'),
    },
  ],
  wrongText: L(
    "Har variantni alohida sanang, keyin chastotalar yig'indisini tanlanma hajmi bilan solishtiring — ular teng bo'lishi kerak.",
    'Считай каждый вариант отдельно, потом сравни сумму частот с объёмом выборки — они должны совпасть.',
    'Count each variant separately, then compare the sum of the frequencies with the sample size — they must agree.'),
};

export default function D34_02(props) { return <MarkAll data={DATA} {...props} />; }
