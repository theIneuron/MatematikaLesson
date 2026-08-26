// Dars13 · Amaliyot 04 — Ha yoki yo'q · 🟡 · tag: add_and_sign
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 4-pozitsiya)
//
// Ikki mulohaza — darsning ikki qimmat joyi:
// IKKALA JAVOB HAM «YO'Q» (metodist qarori 2026-08-25: ha-yo'q
// topshiriqlarida javob naqshi bo'lmasin, kombinatsiya darsdan darsga
// o'zgaradi — DARS07_11_AMALIYOT_SKELET.md §10 p. 9):
//   s1  З34: √18 + √2 = √20. Ildiz ostilari QO'SHILGAN. Aslida o'n sakkizdan
//       to'liq kvadrat chiqariladi: 3√2 va √2, yig'indisi 4√2. Javob «Yo'q»;
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
    { id: 's1', yes: false,
      tokens: [{ r: '18' }, '+', { r: '2' }, '=', { r: '20' }],
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
    "To'g'ri. Ikkalasi ham yolg'on. Birinchisida ildiz ostilari qo'shilgan, ular esa qo'shilmaydi: o'n sakkiz bu to'qqiz karra ikki, ya'ni uch ikkidan ildiz, va uch ikkidan ildiz qo'shuv bir ikkidan ildiz to'rt ikkidan ildizni beradi — yigirmadan ildizni emas. Ikkinchisida kattalik to'g'ri: uchning kvadrati to'qqiz, karra ikki o'n sakkiz. Lekin chap tomonda MINUS turadi, o'ng tomondagi arifmetik ildiz esa manfiy bo'lmaydi. Minus uch ikkidan ildiz taxminan minus to'rt butun yigirma to'rt, o'n sakkizdan ildiz esa arti to'rt butun yigirma to'rt. Ikki son bir xil emas.",
    'Верно. Оба ложны. В первом сложили подкоренные, а они не складываются: восемнадцать это девять на два, то есть три корня из двух, и три корня из двух плюс один корень из двух дают четыре корня из двух — а не корень из двадцати. Во втором величина верна: три в квадрате девять, на два восемнадцать. Но слева стоит МИНУС, а арифметический корень справа отрицательным не бывает. Минус три корня из двух примерно минус четыре и двадцать четыре, а корень из восемнадцати плюс четыре и двадцать четыре. Это разные числа.',
    'Correct. Both are false. In the first the radicands were added, and they do not add: eighteen is nine times two, that is three roots of two, and three roots of two plus one root of two give four roots of two — not the root of twenty. In the second the size is right: three squared is nine, times two is eighteen. But the left side carries a MINUS, while the arithmetic root on the right is never negative. Minus three roots of two is about minus four point two four, while the root of eighteen is plus four point two four. Those are different numbers.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tenglikda ishora tashlab ketildi. Koeffitsiyentni ildiz ostiga kiritishda u KVADRATGA oshadi, kvadrat esa minusni yo'q qiladi: minus uchning kvadrati ham to'qqiz. Ya'ni kiritish minusni yutib yuboradi, va yozuvning ma'nosi o'zgaradi. Sonlarni qo'yib ko'ring: chap tomon minus to'rt butun yigirma to'rt, o'ng tomon arti to'rt butun yigirma to'rt.",
      'Во втором равенстве потерян знак. При внесении коэффициента под корень он ВОЗВОДИТСЯ В КВАДРАТ, а квадрат убивает минус: минус три в квадрате тоже девять. То есть внесение проглатывает минус, и смысл записи меняется. Подставь числа: слева минус четыре и двадцать четыре, справа плюс четыре и двадцать четыре.',
      'The sign was dropped in the second equality. When a coefficient is brought under the root it is SQUARED, and squaring kills the minus: minus three squared is nine as well. So bringing it in swallows the minus and the meaning of the record changes. Substitute numbers: minus four point two four on the left, plus four point two four on the right.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tenglikda ildiz ostilari qo'shilgan: o'n sakkiz qo'shuv ikki yigirma. Ildiz ostilari esa qo'shilmaydi. O'n sakkizdan to'liq kvadratni chiqaring: o'n sakkiz bu to'qqiz karra ikki, demak uch ikkidan ildiz, va yig'indi to'rt ikkidan ildiz bo'ladi. Son bilan tekshiring: chap tomon taxminan besh butun oltmish olti, yigirmadan ildiz esa to'rt butun qirq yetti.",
      'В первом равенстве сложили подкоренные: восемнадцать плюс два двадцать. А подкоренные не складываются. Вынеси из восемнадцати полный квадрат: восемнадцать это девять на два, значит три корня из двух, и сумма выходит четыре корня из двух. Проверь числом: слева примерно пять и шестьдесят шесть, а корень из двадцати четыре и сорок семь.',
      'In the first equality the radicands were added: eighteen plus two is twenty. But radicands do not add. Take the perfect square out of eighteen: eighteen is nine times two, so it is three roots of two, and the sum is four roots of two. Check with numbers: the left side is about five point six six, while the root of twenty is four point four seven.') },
  ],
  wrongText: L(
    "Ikki narsani ayrim tekshiring: ildiz ostilari chiqargandan keyin bir xil bo'ladimi, va ikki tomonning ISHORASI bir xilmi. Arifmetik ildiz hech qachon manfiy emas.",
    'Проверь две вещи по отдельности: становятся ли подкоренные одинаковыми после вынесения, и одинаков ли ЗНАК двух частей. Арифметический корень никогда не отрицателен.',
    'Check two things separately: do the radicands match once the squares are taken out, and do both sides share the same SIGN. An arithmetic root is never negative.'),
};

export default function D13_04(props) { return <TrueFalse data={DATA} {...props} />; }
