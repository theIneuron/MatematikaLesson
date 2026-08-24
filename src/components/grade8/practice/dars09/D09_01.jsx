// Dars09 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: root_exists_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 1-pozitsiya)
//
// Ikki mulohaza — ikki adashish:
//   s1  З30: ildiz faqat to'liq kvadratda bor deb o'ylash. O'n uch to'liq
//       kvadrat emas, lekin ildizi bor: uch butun uchdan katta, to'rtdan kichik;
//   s2  З29: ildiz belgisi ikki son beradi deb o'ylash. Qirq to'qqizdan ildiz
//       bitta son — yetti.
// Ildiz USTKI CHIZIQ bilan (`frac.jsx` -> Root).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'root_exists_claims', level: '🟢',
  itemSize: 19,
  items: [
    { id: 's1', tokens: [{ r: '13' }], yes: false,
      claim: L("qiymati yo'q", 'значения нет', 'has no value') },
    { id: 's2', tokens: [{ r: '49' }], yes: true,
      claim: L('qiymati 7 ga teng', 'значение равно 7', 'its value is 7') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki yozuv. Har biri yonida shu yozuv haqida bitta da'vo turadi.",
    'Две записи. Рядом с каждой стоит одно утверждение о ней.',
    'Two records. Next to each stands one claim about it.'),
  ask: L(
    "Mulohaza rost bo'lsa «Ha» ni, yolg'on bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ложно — «Нет».',
    'Tap «Yes» if the claim is true, «No» if it is false.'),
  correctText: L(
    "To'g'ri. O'n uch to'liq kvadrat emas, lekin qiymat bor: uch karra uch to'qqiz, to'rt karra to'rt o'n olti, demak ildiz uch bilan to'rt orasida turadi. Har qanday nomanfiy sondan ildiz bor, u faqat har doim butun chiqmaydi. Qirq to'qqizdan ildiz esa aynan bitta son — yetti: yetti karra yetti qirq to'qqiz va yetti manfiy emas.",
    'Верно. Тринадцать не полный квадрат, но значение есть: три на три девять, четыре на четыре шестнадцать, значит корень лежит между тремя и четырьмя. Корень есть у любого неотрицательного числа, он просто не всегда целый. А корень из сорока девяти это ровно одно число — семь: семь на семь сорок девять, и семь не отрицательно.',
    'Correct. Thirteen is not a perfect square, but the value exists: three times three is nine, four times four is sixteen, so the root lies between three and four. Every non-negative number has a root, it just is not always whole. And the root of forty nine is exactly one number — seven: seven times seven is forty nine, and seven is not negative.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuvda ildiz bor, faqat u butun emas. Chegaralarni topib ko'ring: to'qqiz o'n uchdan kichik, o'n olti esa katta — demak ildiz uch bilan to'rt orasida. Butun bo'lmaslik yo'q bo'lish degani emas.",
      'В первой записи корень есть, просто он не целый. Найди границы: девять меньше тринадцати, шестнадцать больше — значит корень между тремя и четырьмя. Не целый не значит не существует.',
      'In the first record the root does exist, it simply is not whole. Find the bounds: nine is less than thirteen, sixteen is more, so the root lies between three and four. Not whole does not mean not there.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuvni tekshiring: yetti karra yetti qirq to'qqiz, va yetti manfiy emas — ta'rifning ikki sharti ham bajarildi. Minus yetti ham kvadratda qirq to'qqiz beradi, lekin ildiz belgisi nomanfiy sonni tanlaydi, ya'ni javob bitta.",
      'Проверь вторую запись: семь на семь сорок девять, и семь не отрицательно — оба условия определения выполнены. Минус семь в квадрате тоже даёт сорок девять, но знак корня выбирает неотрицательное число, значит ответ один.',
      'Check the second record: seven times seven is forty nine, and seven is not negative — both conditions of the definition hold. Minus seven squared also gives forty nine, but the root sign picks the non-negative number, so the answer is single.') },
  ],
  wrongText: L(
    "Har yozuv uchun ikki savol bering: ildiz osti manfiymi va javobning kvadrati ildiz ostiga tengmi.",
    'Задай к каждой записи два вопроса: отрицательно ли подкоренное и равен ли квадрат ответа подкоренному.',
    'Ask two questions about each record: is the radicand negative, and does the square of the answer equal the radicand.'),
};

export default function D09_01(props) { return <TrueFalse data={DATA} {...props} />; }
