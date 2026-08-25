// Dars13 · Amaliyot 04 — Ha yoki yo'q · 🟡 · tag: add_and_sign
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 4-pozitsiya)
//
// Ikki mulohaza — darsning ikki qimmat joyi:
//   s1  T2: √18 + √2 = 4√2. Ildiz ostilari BOSHQACHA ko'rinadi, lekin
//       chiqargandan keyin bir xil bo'ladi: 3√2 va √2. Javob «Ha»;
//   s2  З32, OLDINGI BLOKDAN (10-dars): −3√2 manfiy, arifmetik ildiz esa
//       manfiy bo'lmaydi, demak u √18 ga teng bo'lolmaydi. Kattaligi to'g'ri,
//       ishorasi esa hammasini buzadi. Javob «Yo'q».
//
// Ikkinchi mulohaza manfiy koeffitsiyentni ildiz ostiga KIRITISH yo'lini ham
// yopadi: kiritishda koeffitsiyent kvadratga oshadi va minus yo'qoladi, ya'ni
// yozuvning ma'nosi o'zgaradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'add_and_sign', level: '🟡',
  itemSize: 15,
  items: [
    { id: 's1', yes: true,
      tokens: [{ r: '18' }, '+', { r: '2' }, '=', '4', { r: '2' }],
      claim: L("to'g'ri", 'верно', 'true') },
    { id: 's2', yes: false,
      tokens: ['−3', { r: '2' }, '=', { r: '18' }],
      claim: L("to'g'ri", 'верно', 'true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglikda o'n sakkiz va ikki qatnashadi. Birinchisida hadlar qo'shiladi, ikkinchisida koeffitsiyent ildiz ostiga kiritilgan — lekin ishoraga ham qarash kerak.",
    'В двух равенствах участвуют восемнадцать и два. В первом складываются слагаемые, во втором коэффициент внесён под корень — но смотреть надо и на знак.',
    'Eighteen and two appear in both equalities. The first adds terms, the second brings a coefficient under the root — but the sign matters too.'),
  ask: L(
    "Har tenglikni tekshiring: rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Проверь каждое равенство: верно — «Да», ложно — «Нет».',
    'Check each equality: true means «Yes», false means «No».'),
  correctText: L(
    "To'g'ri. Birinchisida ildiz ostilari boshqacha ko'rinadi, lekin o'n sakkiz bu to'qqiz karra ikki, ya'ni uch ikkidan ildiz. Uch ikkidan ildiz qo'shuv bir ikkidan ildiz to'rt ikkidan ildizni beradi. Ikkinchisida kattalik to'g'ri: uchning kvadrati to'qqiz, karra ikki o'n sakkiz. Lekin chap tomonda MINUS turadi, o'ng tomondagi arifmetik ildiz esa manfiy bo'lmaydi. Minus uch ikkidan ildiz taxminan minus to'rt butun yigirma to'rt, o'n sakkizdan ildiz esa arti to'rt butun yigirma to'rt. Ikki son bir xil emas.",
    'Верно. В первом подкоренные выглядят разными, но восемнадцать это девять на два, то есть три корня из двух. Три корня из двух плюс один корень из двух дают четыре корня из двух. Во втором величина верна: три в квадрате девять, на два восемнадцать. Но слева стоит МИНУС, а арифметический корень справа отрицательным не бывает. Минус три корня из двух примерно минус четыре и двадцать четыре, а корень из восемнадцати плюс четыре и двадцать четыре. Это разные числа.',
    'Correct. In the first the radicands look different, but eighteen is nine times two, that is three roots of two. Three roots of two plus one root of two give four roots of two. In the second the size is right: three squared is nine, times two is eighteen. But the left side carries a MINUS, while the arithmetic root on the right is never negative. Minus three roots of two is about minus four point two four, while the root of eighteen is plus four point two four. Those are different numbers.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tenglikda ishora tashlab ketildi. Koeffitsiyentni ildiz ostiga kiritishda u KVADRATGA oshadi, kvadrat esa minusni yo'q qiladi: minus uchning kvadrati ham to'qqiz. Ya'ni kiritish minusni yutib yuboradi, va yozuvning ma'nosi o'zgaradi. Sonlarni qo'yib ko'ring: chap tomon minus to'rt butun yigirma to'rt, o'ng tomon arti to'rt butun yigirma to'rt.",
      'Во втором равенстве потерян знак. При внесении коэффициента под корень он ВОЗВОДИТСЯ В КВАДРАТ, а квадрат убивает минус: минус три в квадрате тоже девять. То есть внесение проглатывает минус, и смысл записи меняется. Подставь числа: слева минус четыре и двадцать четыре, справа плюс четыре и двадцать четыре.',
      'The sign was dropped in the second equality. When a coefficient is brought under the root it is SQUARED, and squaring kills the minus: minus three squared is nine as well. So bringing it in swallows the minus and the meaning of the record changes. Substitute numbers: minus four point two four on the left, plus four point two four on the right.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tenglik rost, faqat ildiz ostilari darrov bir xil ko'rinmaydi. O'n sakkizdan to'liq kvadratni chiqaring: o'n sakkiz bu to'qqiz karra ikki, demak uch ikkidan ildiz. Endi ikki had bir xil: uch qo'shuv bir to'rt. Tekshiring: to'rtning kvadrati o'n olti, karra ikki o'ttiz ikki; chap tomonni ham kvadratga oshirsangiz o'ttiz ikki chiqadi.",
      'Первое равенство верно, просто подкоренные не сразу выглядят одинаково. Вынеси из восемнадцати полный квадрат: восемнадцать это девять на два, значит три корня из двух. Теперь слагаемые одинаковы: три плюс один четыре. Проверь: четыре в квадрате шестнадцать, на два тридцать два; левая часть в квадрате тоже даёт тридцать два.',
      'The first equality is true, the radicands just do not look the same at once. Take the perfect square out of eighteen: eighteen is nine times two, so it is three roots of two. Now the terms match: three plus one is four. Check: four squared is sixteen, times two is thirty two; squaring the left side gives thirty two as well.') },
  ],
  wrongText: L(
    "Ikki narsani ayrim tekshiring: ildiz ostilari chiqargandan keyin bir xil bo'ladimi, va ikki tomonning ISHORASI bir xilmi. Arifmetik ildiz hech qachon manfiy emas.",
    'Проверь две вещи по отдельности: становятся ли подкоренные одинаковыми после вынесения, и одинаков ли ЗНАК двух частей. Арифметический корень никогда не отрицателен.',
    'Check two things separately: do the radicands match once the squares are taken out, and do both sides share the same SIGN. An arithmetic root is never negative.'),
};

export default function D13_04(props) { return <TrueFalse data={DATA} {...props} />; }
