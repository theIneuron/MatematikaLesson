// Dars11 · Amaliyot 07 — Kod · 🔴 · tag: code_integer_part
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 7-pozitsiya)
//
// Uch ildizning BUTUN QISMI: ildizdan oshmaydigan eng katta butun son.
//   √8  : 4 < 8 < 9    → 2
//   √27 : 25 < 27 < 36 → 5
//   √50 : 49 < 50 < 64 → 7
// Bu darsning uchinchi xossasini uch marta ishlatadi: ildiz osti katta bo'lsa
// ildiz ham katta, ya'ni chegara kvadratlar bilan qidiriladi (З33).
// Bankdagi tuzoqlar: 4 (8 : 2), 13 (27 : 2), 3 (√8 ni yuqoriga yaxlitlash).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_integer_part', level: '🔴',
  expr: [{ r: '8' }, ',', { r: '27' }, ',', { r: '50' }], exprSize: 26,
  cards: ['2', '3', '4', '5', '7', '13'],
  answer: ['2', '5', '7'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Seyfning kodi uch xonali. Har ildizning butun qismi kerak — ya'ni ildizdan oshmaydigan eng katta butun son.",
    'Код сейфа трёхзначный. Нужна целая часть каждого корня — наибольшее целое, не превышающее корень.',
    'The safe code has three places. The whole part of each root is needed — the largest integer not exceeding the root.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch ildizning butun qismini toping va kodga o'sha tartibda yozing.",
    'Найди целую часть трёх корней и запиши их в код в том же порядке.',
    'Find the whole part of the three roots and write them into the code in that order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Har birida yaqin kvadratlar qidiriladi. Sakkiz to'rt bilan to'qqiz orasida, demak ildiz ikki bilan uch orasida va butun qismi ikki. Yigirma yetti yigirma besh bilan o'ttiz olti orasida — butun qismi besh. Ellik qirq to'qqiz bilan oltmish to'rt orasida — butun qismi yetti. Ellik qirq to'qqizga juda yaqin, shuning uchun ildiz yettidan bir oz katta.",
    'Верно. В каждом ищутся близкие квадраты. Восемь между четырьмя и девятью, значит корень между двумя и тремя, целая часть два. Двадцать семь между двадцатью пятью и тридцатью шестью — целая часть пять. Пятьдесят между сорока девятью и шестьюдесятью четырьмя — целая часть семь. Пятьдесят очень близко к сорока девяти, поэтому корень чуть больше семи.',
    'Correct. In each case the nearby squares are found. Eight lies between four and nine, so the root lies between two and three and the whole part is two. Twenty seven lies between twenty five and thirty six — the whole part is five. Fifty lies between forty nine and sixty four — the whole part is seven. Fifty is very close to forty nine, so the root is just over seven.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('3') !== -1, text: L(
      "Uch — yuqoridagi chegara, butun qism esa PASTDAGI. Uchning kvadrati to'qqiz, va to'qqiz sakkizdan katta — demak ildiz uchdan kichik. Butun qism ildizdan oshmasligi kerak.",
      'Три — это верхняя граница, а целая часть НИЖНЯЯ. Квадрат трёх девять, и девять больше восьми — значит корень меньше трёх. Целая часть не должна превышать корень.',
      'Three is the upper bound, while the whole part is the LOWER one. Three squared is nine, and nine is more than eight, so the root is less than three. The whole part must not exceed the root.') },
    { when: (s) => s.slots.indexOf('4') !== -1, text: L(
      "To'rt — sakkizning yarmi, ildiz esa bo'lish emas. To'rtning kvadrati o'n olti, sakkizdan ikki barobar katta. Kvadrati sakkizga yaqin son ikki bilan uch orasida.",
      'Четыре — половина восьми, а корень это не деление. Квадрат четырёх шестнадцать, вдвое больше восьми. Число, чей квадрат близок к восьми, лежит между двумя и тремя.',
      'Four is half of eight, and a root is not division. Four squared is sixteen, twice as much as eight. The number whose square is near eight lies between two and three.') },
    { when: (s) => s.slots.indexOf('13') !== -1, text: L(
      "O'n uch — yigirma yettining yarmi. Kvadratga oshirib tekshiring: o'n uch karra o'n uch bir yuz oltmish to'qqiz, yigirma yettidan olti barobar katta. Yigirma yettining ildizi besh bilan olti orasida.",
      'Тринадцать — половина двадцати семи. Проверь квадратом: тринадцать на тринадцать сто шестьдесят девять, в шесть раз больше двадцати семи. Корень из двадцати семи между пятью и шестью.',
      'Thirteen is half of twenty seven. Check with the square: thirteen times thirteen is one hundred sixty nine, six times more than twenty seven. The root of twenty seven lies between five and six.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. Kodga ildizlar yozuvdagi tartibda kiritiladi: sakkiz, yigirma yetti, ellik.",
      'Числа найдены верно, а порядок нет. В код корни вносятся в том порядке, в каком стоят в записи: восемь, двадцать семь, пятьдесят.',
      'The numbers are right, the order is not. The roots go into the code in the order of the record: eight, twenty seven, fifty.') },
    { when: (s) => s.slots.indexOf('7') === -1, text: L(
      "Uchinchi ildizning butun qismi tushib qolgan. Qirq to'qqiz ellikdan kichik, oltmish to'rt esa katta — demak butun qism yetti.",
      'Целая часть третьего корня потерялась. Сорок девять меньше пятидесяти, а шестьдесят четыре больше — значит целая часть семь.',
      'The whole part of the third root is missing. Forty nine is less than fifty and sixty four is more, so the whole part is seven.') },
  ],
  wrongText: L(
    "Har ildiz uchun kvadratlarni sanab chiqing va ildiz ostidan oshmaydigan eng kattasini toping. Uning asosi butun qism bo'ladi.",
    'Для каждого корня перечисли квадраты и найди наибольший, не превышающий подкоренное. Его основание и есть целая часть.',
    'For every root list the squares and find the largest one not exceeding the radicand. Its base is the whole part.'),
};

export default function D11_07(props) { return <CodeLock data={DATA} {...props} />; }
