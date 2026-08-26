// Dars16 · Amaliyot 09 — Ha yoki yo'q · 🔴 · tag: incomplete_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 9-pozitsiya)
//
// Ikki mulohaza — darsning ikki qimmat joyi, va ikkalasi ham SANOQ haqida:
// IKKALA JAVOB HAM «YO'Q» (metodist qarori 2026-08-25: ha-yo'q
// topshiriqlarida javob naqshi bo'lmasin — DARS07_11_AMALIYOT_SKELET.md
// §10 p. 9), va ikki qatorda BIR XIL da'vo turadi — «bitta ildizi bor»:
//   s1  З40: kvadrati o'ttiz oltiga teng ikki son bor (olti va minus olti),
//       demak ildiz bitta emas, ikkita — Yo'q;
//   s2  З42: `x² + 4x = 0` ning ildizi bitta emas, ikkita (nol va minus to'rt).
//       «Bitta» degan javob x ga bo'lishdan chiqadi — o'shanda nol yo'qoladi
//       va qolgan yolg'iz ildiz to'g'ri deb qabul qilinadi.
// Ikki mulohaza bir-birini to'ldiradi: birinchisida ildiz sonini KO'PAYTIRISH
// kerak, ikkinchisida ham — lekin sabab boshqa.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'incomplete_claims', level: '🔴',
  itemSize: 16,
  items: [
    { id: 's1', yes: false,
      tokens: ['x² = 36'],
      claim: L('bitta ildizi bor', 'имеет один корень', 'has one root') },
    { id: 's2', yes: false,
      tokens: ['x² + 4x = 0'],
      claim: L('bitta ildizi bor', 'имеет один корень', 'has one root') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglama, ikki mulohaza, va ikkalasi ham ildizlarning SONI haqida. Har birini ildizlarni topib tekshiring.",
    'Два уравнения, два утверждения, и оба про ЧИСЛО корней. Проверь каждое, найдя корни.',
    'Two equations, two claims, and both are about the NUMBER of roots. Check each by finding the roots.'),
  ask: L(
    "Mulohaza rost bo'lsa «Ha» ni, yolg'on bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ложно — «Нет».',
    'Tap «Yes» if the claim is true, «No» if it is false.'),
  correctText: L(
    "To'g'ri. Ikkalasi ham yolg'on: ikki tenglamaning ham ikki ildizi bor. Birinchisida kvadrati o'ttiz oltiga teng ikki son bor: olti va minus olti, chunki minus karra minus arti beradi. Ikkinchisida umumiy ko'paytuvchini chiqaramiz: x karra qavs ichida x qo'shuv to'rt. Ikki ko'paytuvchi, ikki ildiz: nol va minus to'rt. Tekshirish: nolda nol qo'shuv nol nol; minus to'rtda o'n olti minus o'n olti nol.",
    'Верно. Оба ложны: у обоих уравнений по два корня. В первом есть два числа, чей квадрат равен тридцати шести: шесть и минус шесть, ведь минус на минус даёт плюс. Во втором вынесем общий множитель: x на скобку x плюс четыре. Два множителя, два корня: нуль и минус четыре. Проверка: в нуле нуль плюс нуль нуль; в минус четырёх шестнадцать минус шестнадцать нуль.',
    'Correct. Both are false: each equation has two roots. In the first there are two numbers whose square is thirty six: six and minus six, since minus times minus gives plus. In the second, take out the common factor: x times the bracket x plus four. Two factors, two roots: zero and minus four. Check: at zero, zero plus zero is zero; at minus four, sixteen minus sixteen is zero.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tenglamaning ildizi bitta emas, ikkita. «Bitta» degan javob ikki tomonni x ga bo'lishdan chiqadi: o'shanda x qo'shuv to'rt qoladi va faqat minus to'rt topiladi. Lekin nolni qo'yib ko'ring: nol qo'shuv nol nol — nol ham ildiz. Bo'lish uni tekshirmasdan chetga chiqarib tashlagan.",
      'У второго уравнения не один корень, а два. Ответ «один» выходит из деления обеих частей на x: тогда остаётся x плюс четыре и находится только минус четыре. Но подставь нуль: нуль плюс нуль нуль — нуль тоже корень. Деление отбросило его без проверки.',
      'The second equation has two roots, not one. The answer «one» comes from dividing both sides by x: then x plus four remains and only minus four is found. But substitute zero: zero plus zero is zero — zero is a root as well. The division discarded it unchecked.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tenglamaning ildizi bitta emas. Kvadratga oshirilganda o'ttiz olti beradigan sonlarni izlang: olti karra olti o'ttiz olti, va minus olti karra minus olti ham o'ttiz olti — ikki minus arti beradi. Demak ildiz ikkita: olti va minus olti.",
      'У первого уравнения не один корень. Поищи числа, дающие в квадрате тридцать шесть: шесть на шесть тридцать шесть, и минус шесть на минус шесть тоже тридцать шесть — два минуса дают плюс. Значит корней два: шесть и минус шесть.',
      'The first equation does not have a single root. Look for numbers whose square is thirty six: six times six is thirty six, and minus six times minus six is thirty six too — two minuses give a plus. So there are two roots: six and minus six.') },
  ],
  wrongText: L(
    "Har tenglamada ildizlarni oxirigacha toping: birinchisida ikki tomonga ildiz olganda plyus-minus paydo bo'ladi, ikkinchisida umumiy ko'paytuvchini chiqarganda ikki ko'paytuvchi paydo bo'ladi. Keyin sanang.",
    'В каждом уравнении найди корни до конца: в первом при извлечении корня появляется плюс-минус, во втором при вынесении множителя появляются два множителя. Потом пересчитай.',
    'Find the roots to the end in each equation: taking a root in the first brings a plus-or-minus, factoring the second brings two factors. Then count them.'),
};

export default function D16_09(props) { return <TrueFalse data={DATA} {...props} />; }
