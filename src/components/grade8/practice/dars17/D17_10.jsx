// Dars17 · Amaliyot 10 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 10-pozitsiya)
//
// FORMULANING UCH JOYI VA UCH TUZOQ — har biri aniq bir adashish:
//   «b»       — З44: suratda b ning O'ZI turadi deb o'ylash;
//   «plyus»   — З40: plyus-minus o'rniga faqat plyus, ya'ni bitta ildiz;
//   «a»       — З38: maxrajda a turadi deb o'ylash. Maxraj ikki a, va bu
//               joyda a nolga teng bo'lolmasligi ham ko'rinadi — nolga
//               bo'lish yo'q.
// Uch tuzoq gapga mukammal tushadi, shuning uchun har birini SON bilan rad
// etish kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      'Ildizlar formulasining suratida',
      'В числителе формулы корней стоит',
      'The numerator of the root formula holds') },
    { slot: 0 },
    { text: L(
      "turadi, undan keyin",
      ', затем идёт знак',
      ', then the sign') },
    { slot: 1 },
    { text: L(
      "belgisi va ildiz. Maxrajda esa",
      'и корень. А в знаменателе стоит',
      'and a root. And the denominator holds') },
    { slot: 2 },
    { text: L('turadi.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('minus b', 'минус b', 'minus b') },
    { id: 'w2', label: L('plyus-minus', 'плюс-минус', 'plus-or-minus') },
    { id: 'w3', label: L('ikki a', 'два a', 'two a') },
    { id: 'w4', label: L('b', 'b', 'b') },
    { id: 'w5', label: L('plyus', 'плюс', 'plus') },
    { id: 'w6', label: L('a', 'a', 'a') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Formula so'z bilan yozilgan, lekin uchta joyi tushib qolgan. Bankdagi uch tuzoq gapga mukammal tushadi — har birini son bilan tekshirish kerak.",
    'Формула записана словами, но три места выпали. Три ловушки в банке ложатся в предложение идеально — каждую надо проверить числом.',
    'The formula is written in words, but three places fell out. The three traps in the bank fit the sentence perfectly — each must be tested with numbers.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Suratda minus b turadi: x kvadrat minus besh x qo'shuv olti nolga teng tenglamada b minus besh, demak surat arti beshdan boshlanadi va ildizlar ikki bilan uch chiqadi. Plyus-minus belgisi ikki ildizni beradi: bittasi qo'shishdan, ikkinchisi ayirishdan. Maxrajda ikki a turadi, va aynan shu joyda a nolga teng bo'lolmasligi ko'rinadi — nolga bo'lish yo'q.",
    'Верно. В числителе стоит минус b: в уравнении x квадрат минус пять x плюс шесть равно нулю b минус пять, значит числитель начинается с плюс пяти и корни выходят два и три. Знак плюс-минус даёт два корня: один от сложения, другой от вычитания. В знаменателе стоит два a, и именно здесь видно, что a не может быть нулём — деления на нуль не существует.',
    'Correct. The numerator holds minus b: in x squared minus five x plus six equals zero, b is minus five, so the numerator starts with plus five and the roots come out two and three. The plus-or-minus sign yields two roots: one from adding, one from subtracting. The denominator holds two a, and it is exactly there that a cannot be zero — division by zero does not exist.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Suratda b ning O'ZI emas, MINUS b turadi. x kvadrat minus besh x qo'shuv olti misolida tekshiring: b minus besh, va agar suratga minus beshni qo'ysangiz ildizlar minus ikki bilan minus uch chiqadi. Ularni tenglamaga qo'ying: to'rt qo'shuv o'n qo'shuv olti yigirma — nol emas.",
      'В числителе стоит не САМО b, а МИНУС b. Проверь на примере x квадрат минус пять x плюс шесть: b минус пять, и если в числитель поставить минус пять, корни выйдут минус два и минус три. Подставь их в уравнение: четыре плюс десять плюс шесть двадцать — не нуль.',
      'The numerator holds not b ITSELF but MINUS b. Check on x squared minus five x plus six: b is minus five, and putting minus five in the numerator gives roots minus two and minus three. Substitute them: four plus ten plus six is twenty — not zero.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Faqat plyus qolsa, bitta ildiz chiqadi — holbuki kvadrat tenglamaning ikki ildizi bo'lishi mumkin. Plyus-minus ikki hisobni bildiradi: birida ildiz qo'shiladi, ikkinchisida ayiriladi. Misolda: besh qo'shuv bir bo'lingan ikki uch, besh minus bir bo'lingan ikki ikki.",
      'Если остался только плюс, выйдет один корень — а у квадратного уравнения их может быть два. Плюс-минус означает два вычисления: в одном корень прибавляется, в другом вычитается. На примере: пять плюс один делить на два три, пять минус один делить на два два.',
      'With only a plus, one root comes out — while a quadratic equation may have two. Plus-or-minus means two computations: in one the root is added, in the other subtracted. On the example: five plus one over two is three, five minus one over two is two.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Maxrajda a emas, IKKI a turadi. Misolda tekshiring: a birga teng bo'lsa farq ko'rinmaydi, lekin ikki x kvadrat qo'shuv besh x minus uch nolga teng tenglamada maxraj to'rtga teng bo'ladi. a ga bo'lsangiz ildizlar ikki barobar katta chiqadi va tenglamaga to'g'ri kelmaydi.",
      'В знаменателе не a, а ДВА a. Проверь на примере: при a равном единице разницы не видно, но в уравнении два x квадрат плюс пять x минус три равно нулю знаменатель равен четырём. Если делить на a, корни выйдут в два раза больше и уравнению не подойдут.',
      'The denominator is not a but TWO a. Check on an example: when a is one the difference is invisible, but in two x squared plus five x minus three equals zero the denominator is four. Dividing by a would make the roots twice too big and they would not fit the equation.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni x kvadrat minus besh x qo'shuv olti misolida tekshiring: ildizlari ikki va uch.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере x квадрат минус пять x плюс шесть: его корни два и три.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on x squared minus five x plus six: its roots are two and three.') },
  ],
  wrongText: L(
    "Har so'zni qo'ygandan keyin formulani x kvadrat minus besh x qo'shuv olti misolida bajarib ko'ring. To'g'ri yozuv ikki va uchni beradi.",
    'Поставив каждое слово, прогони формулу на примере x квадрат минус пять x плюс шесть. Верная запись даёт два и три.',
    'After placing each word, run the formula on x squared minus five x plus six. The right record gives two and three.'),
};

export default function D17_10(props) { return <ClozeBank data={DATA} {...props} />; }
