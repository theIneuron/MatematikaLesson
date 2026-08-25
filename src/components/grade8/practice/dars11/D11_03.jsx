// Dars11 · Amaliyot 03 — Qaysi katta · 🟢 · tag: which_bigger
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 3-pozitsiya)
//
// Yigirma olti yigirma beshdan bittaga katta, ya'ni farq juda kichik — aynan
// shu sababdan «ko'z bilan» hal qilib bo'lmaydi va kvadratga o'tish kerak
// (З33). Variantlar SO'Z emas, TENGSIZLIK.
// To'rtinchi variant chegarani yuqoridan tekshiradi: yigirma olti o'ttiz
// oltidan kichik, demak ildiz oltidan katta bo'la olmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const R = { r: '26' };

const DATA = {
  tag: 'which_bigger', level: '🟢',
  correct: 0, optCols: 2, optSize: 20,
  eyebrow: L('Qaysi katta', 'Что больше', 'Which is bigger'),
  setup: L(
    "Ildizni hisoblamasdan taqqoslash kerak. Buning yo'li bitta: butun sonni kvadratga oshirib ildiz osti bilan solishtirish.",
    'Сравнить нужно, не вычисляя корень. Путь один: возвести целое число в квадрат и сравнить с подкоренным.',
    'The comparison must be made without computing the root. There is one way: square the whole number and compare it with the radicand.'),
  ask: L('Qaysi tengsizlik to\'g\'ri?', 'Какое неравенство верно?', 'Which inequality is true?'),
  opts: [
    { label: [R, '> 5'] },
    { label: ['5 >', R] },
    { label: ['5 =', R] },
    { label: [R, '> 6'] },
  ],
  correctText: L(
    "To'g'ri. Beshni kvadratga oshiramiz: yigirma besh. Yigirma olti yigirma beshdan katta, va ildiz osti katta bo'lsa ildiz ham katta — demak yigirma oltidan ildiz beshdan katta. Farq juda kichik: ildiz besh butun bir yuzdan bir atrofida, lekin baribir beshdan katta.",
    'Верно. Возводим пять в квадрат: двадцать пять. Двадцать шесть больше двадцати пяти, а больше подкоренное — больше корень, значит корень из двадцати шести больше пяти. Разница крошечная: корень около пяти целых одной сотой, но всё равно больше пяти.',
    'Correct. Square five: twenty five. Twenty six is more than twenty five, and a bigger radicand means a bigger root, so the root of twenty six is more than five. The difference is tiny: the root is about five point zero one, but still more than five.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Tengsizlik teskari qaragan. Beshni kvadratga oshiring: yigirma besh, va u yigirma oltidan KICHIK. Kichik ildiz osti kichik ildiz beradi, demak besh ildizdan kichik.",
      'Неравенство смотрит в другую сторону. Возведи пять в квадрат: двадцать пять, и это МЕНЬШЕ двадцати шести. Меньшее подкоренное даёт меньший корень, значит пять меньше корня.',
      'The inequality points the wrong way. Square five: twenty five, and that is LESS than twenty six. A smaller radicand gives a smaller root, so five is less than the root.') },
    { when: (s) => s.picked === 2, text: L(
      "Tenglik faqat yigirma besh bilan bo'lardi: beshning kvadrati aynan yigirma besh. Ildiz ostida esa yigirma olti turadi, bittaga ko'p — demak tenglik buzilgan.",
      'Равенство было бы только с двадцатью пятью: квадрат пяти это ровно двадцать пять. А под корнем двадцать шесть, на единицу больше — значит равенство нарушено.',
      'Equality would hold only with twenty five: five squared is exactly twenty five. Under the root stands twenty six, one more — so the equality fails.') },
    { when: (s) => s.picked === 3, text: L(
      "Chegarani yuqoridan tekshiring: oltining kvadrati o'ttiz olti, va yigirma olti o'ttiz oltidan KICHIK. Demak ildiz oltidan kichik. U besh bilan olti orasida turadi.",
      'Проверь границу сверху: квадрат шести тридцать шесть, а двадцать шесть МЕНЬШЕ тридцати шести. Значит корень меньше шести. Он лежит между пятью и шестью.',
      'Check the upper bound: six squared is thirty six, and twenty six is LESS than thirty six. So the root is less than six. It lies between five and six.') },
  ],
  wrongText: L(
    "Butun sonni kvadratga oshirib yigirma olti bilan solishtiring. Kvadrat kichik bo'lsa, butun son ildizdan ham kichik.",
    'Возведи целое число в квадрат и сравни с двадцатью шестью. Если квадрат меньше, то и само число меньше корня.',
    'Square the whole number and compare it with twenty six. If the square is smaller, the number itself is smaller than the root.'),
};

export default function D11_03(props) { return <Choice data={DATA} {...props} />; }
