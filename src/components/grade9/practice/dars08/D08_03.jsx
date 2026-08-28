// Dars08 · Amaliyot 03 — Ha yoki yo'q · 🟢 · teg: maxraj-nolga-teng
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'maxraj-nolga-teng', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Tenglama va uning yechimi haqida uch mulohaza.",
    'Три суждения об уравнении и его решении.',
    'Three claims about an equation and its solution.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [[{ n: '9', d: 'x − 3' }, '= 3']],
  itemSize: 16,
  items: [
    { id: 's1', tokens: ['x ≠ 3'], yes: true, claim: L(
      "ODZ shunday yoziladi.", 'ОДЗ записывается так.', 'the domain is written like this.') },
    { id: 's2', tokens: ['x = 6'], yes: true, claim: L(
      'ildiz ODZ ga kiradi.', 'корень входит в ОДЗ.', 'the root belongs to the domain.') },
    { id: 's3', tokens: ['x = 3'], yes: false, claim: L(
      'ham ildiz bo\'lishi mumkin.', 'тоже может быть корнем.', 'could also be a root.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Maxraj uchda nolga aylanadi, shuning uchun uch ODZ dan chiqariladi — va u hech qanday holatda ildiz bo'lolmaydi. Tenglamani yechsak, maxraj uchga teng bo'lishi kerak, ya'ni iks oltiga teng; olti esa ODZ da bor, demak ildiz haqiqiy.",
    'Верно, все три. Знаменатель обращается в нуль при трёх, поэтому тройка исключается из ОДЗ — и корнем быть не может ни при каких условиях. Решив уравнение, получим, что знаменатель равен трём, то есть икс равен шести; шестёрка в ОДЗ есть, значит корень настоящий.',
    'Correct, all three. The denominator becomes zero at three, so three is excluded from the domain — and it can never be a root. Solving the equation gives a denominator of three, that is x equals six; six is in the domain, so the root is genuine.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Uchni maxrajga qo'ying: uch minus uch nolga teng. Nolga bo'lish esa ta'riflanmagan — bunday son hech qachon ildiz bo'lolmaydi.",
      'Подставь тройку в знаменатель: три минус три равно нулю. Деление на нуль не определено — такое число корнем быть не может никогда.',
      'Put three into the denominator: three minus three is zero. Division by zero is undefined — such a number can never be a root.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "ODZ maxrajni nolga aylantiradigan sonni chiqarib tashlaydi. Iks minus uch qaysi sonda nolga aylanadi?",
      'ОДЗ исключает число, при котором знаменатель обращается в нуль. При каком числе икс минус три равно нулю?',
      'The domain excludes the number that makes the denominator zero. At which number does x minus three become zero?') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Oltini tenglamaga qo'ying: maxraj uchga aylanadi, to'qqizni uchga bo'lsak uch chiqadi — tenglik bajariladi. Olti ODZ dan chiqarilmagan.",
      'Подставь шесть в уравнение: знаменатель станет тройкой, девять делить на три — три, равенство выполняется. Шестёрка из ОДЗ не исключена.',
      'Put six into the equation: the denominator becomes three, nine divided by three is three, and the equality holds. Six is not excluded from the domain.') },
  ],
  wrongText: L(
    "Ikki savol: maxraj qaysi sonda nolga aylanadi, va topilgan ildiz o'sha sonmi yoki boshqami?",
    'Два вопроса: при каком числе знаменатель обращается в нуль и совпадает ли с ним найденный корень?',
    'Two questions: at which number does the denominator become zero, and is the root you found that same number or a different one?'),
};

export default function D08_03(props) { return <TrueFalse data={DATA} {...props} />; }
