// Dars17 · Amaliyot 06 — Ha yoki yo'q · 🟡 · tag: formula_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 6-pozitsiya)
//
// Ikki mulohaza — formulaning ikki qismi:
//   s1  diskriminantning hisobi: to'qqiz qo'shuv o'n olti yigirma besh (c
//       manfiy, demak ikkinchi qo'shiluvchi musbat) — Ha;
//   s2  З44: b MUSBAT bo'lganda suratda MINUS besh turishi kerak. Yozuvda
//       arti besh turgani uchun mulohaza yolg'on.
// Ikkinchisining razbori ikki ildizni ham hisoblab ko'rsatadi: to'g'ri
// yozuvdan minus ikki va minus uch chiqadi, xato yozuvdan esa ikki va uch —
// ya'ni ISHORA butun javobni almashtiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_claims', level: '🟡',
  itemSize: 14,
  items: [
    { id: 's1', yes: true,
      tokens: ['x² − 3x − 4 = 0', '→', 'D = 25'],
      claim: L("to'g'ri", 'верно', 'true') },
    { id: 's2', yes: true,
      tokens: ['x² + 5x + 6 = 0', '→', '(−5 ± 1) : 2'],
      claim: L("to'g'ri", 'верно', 'true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki yozuv formulaning ikki qismini ko'rsatadi: birinchisi diskriminantni, ikkinchisi ildizlarning yozuvini. Har birini hisoblab tekshiring.",
    'Две записи показывают две части формулы: первая дискриминант, вторая — запись корней. Проверь каждую вычислением.',
    'Two records show two parts of the formula: the first the discriminant, the second the way the roots are written. Check each by computing.'),
  ask: L(
    "Yozuv to'g'ri bo'lsa «Ha», xato bo'lsa «Yo'q».",
    'Если запись верна — «Да», если ошибочна — «Нет».',
    'If the record is right, «Yes»; if it is wrong, «No».'),
  correctText: L(
    "To'g'ri. Birinchisida b minus uch, kvadrati to'qqiz; c minus to'rt, demak minus to'rt karra bir karra minus to'rt arti o'n olti. To'qqiz qo'shuv o'n olti yigirma besh — yozuv to'g'ri. Ikkinchisi ham rost: b arti besh, formulaning suratida esa MINUS b turadi, ya'ni minus besh. Minus besh plyus-minus bir bo'lingan ikki ildizlarni beradi — minus ikki va minus uch. Ishorani tashlab ketgan o'quvchi ikki va uchni oladi va bu yozuvni yolg'on deb belgilaydi.",
    'Верно. В первой b минус три, квадрат девять; c минус четыре, значит минус четыре на один на минус четыре плюс шестнадцать. Девять плюс шестнадцать двадцать пять — запись верна. Второе тоже верно: b плюс пять, а в числителе формулы стоит МИНУС b, то есть минус пять. Минус пять плюс-минус один, делённое на два, даёт корни минус два и минус три. Кто потерял знак, получает два и три и помечает эту запись как ложную.',
    'Correct. In the first, b is minus three and its square is nine; c is minus four, so minus four times one times minus four is plus sixteen. Nine plus sixteen is twenty five — the record is right. The second is true as well: b is plus five, while the numerator of the formula holds MINUS b, that is minus five. Minus five plus or minus one over two gives the roots minus two and minus three. A student who drops the sign gets two and three and marks this record as false.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuv rost. b arti beshga teng, formulaning suratida esa MINUS b turadi — demak minus besh, va yozuvda aynan shunday. Ildizlarni tekshirib ko'ring: minus ikkida to'rt minus o'n qo'shuv olti nol, minus uchda to'qqiz minus o'n besh qo'shuv olti ham nol. Arti besh bilan yozilganda esa ikki va uch chiqardi, ular tenglamani nolga aylantirmaydi.",
      'Вторая запись верна. b равно плюс пяти, а в числителе формулы стоит МИНУС b — значит минус пять, и в записи стоит именно это. Проверь корни: при минус двух четыре минус десять плюс шесть нуль, при минус трёх девять минус пятнадцать плюс шесть тоже нуль. А с плюс пятью вышли бы два и три, и они уравнение в нуль не обращают.',
      'The second record is right. b is plus five, while the numerator of the formula holds MINUS b — so minus five, and that is exactly what the record shows. Check the roots: at minus two, four minus ten plus six is zero; at minus three, nine minus fifteen plus six is zero as well. With plus five you would get two and three, and they do not make the equation zero.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuv to'g'ri. Diskriminantni hisoblang: b minus uch, kvadrati to'qqiz — kvadrat manfiy bo'lmaydi. c minus to'rt, va minus to'rt karra minus to'rt ARTI o'n olti, chunki ikki minus arti beradi. To'qqiz qo'shuv o'n olti yigirma besh.",
      'Первая запись верна. Посчитай дискриминант: b минус три, квадрат девять — квадрат отрицательным не бывает. c минус четыре, и минус четыре на минус четыре ПЛЮС шестнадцать, ведь два минуса дают плюс. Девять плюс шестнадцать двадцать пять.',
      'The first record is right. Compute the discriminant: b is minus three and its square is nine — a square is never negative. c is minus four, and minus four times minus four is PLUS sixteen, since two minuses give a plus. Nine plus sixteen is twenty five.') },
  ],
  wrongText: L(
    "Birinchi yozuvda diskriminantni hisoblang, ikkinchisida esa suratdagi birinchi sonni tekshiring: u b ning O'ZI emas, minus b. Javoblarni tenglamaga qo'yib ko'ring.",
    'В первой записи посчитай дискриминант, а во второй проверь первое число в числителе: это не САМО b, а минус b. Ответы подставь в уравнение.',
    'Compute the discriminant in the first record, and in the second check the first number in the numerator: it is not b ITSELF but minus b. Substitute the answers into the equation.'),
};

export default function D17_06(props) { return <TrueFalse data={DATA} {...props} />; }
