// Dars09 · Amaliyot 07 — Kichik son · 🟡 · teg: vieta-teskari-notogri
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `point` rejimida.
//
// Yig'indi va ko'paytmadan sonlarning o'zi topiladi: z² − 10z + 21 = 0 →
// z = 3 va z = 7. Kichigi uchga teng.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'vieta-teskari-notogri', level: '🟡',
  eyebrow: L('Kichik son', 'Меньшее число', 'The smaller number'),
  setup: L(
    "Yig'indi va ko'paytmadan sonlarning o'zini topish mumkin: ular kvadrat tenglamaning ildizlari.",
    'По сумме и произведению можно найти сами числа: они — корни квадратного уравнения.',
    'The numbers themselves can be found from the sum and the product: they are the roots of a quadratic equation.'),
  ask: L(
    "Ikki sondan KICHIGINI o'qda belgilang.",
    'Отметь на оси МЕНЬШЕЕ из двух чисел.',
    'Mark the SMALLER of the two numbers on the axis.'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['x + y = 10'], ['xy = 21']],
  mode: 'point',
  axis: { from: -2, to: 12 },
  answer: { at: 3, closed: true },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Yig'indi va ko'paytmadan kvadrat tenglama tuziladi: zet kvadrat minus o'n zet qo'shuv yigirma bir nolga teng. Uning ildizlari uch va yetti, kichigi esa uch. Nuqta bo'yalgan: bu son javobning o'zi.",
    'Верно. По сумме и произведению составляется квадратное уравнение: зет в квадрате минус десять зет плюс двадцать один равно нулю. Его корни — три и семь, меньший из них три. Точка закрашена: это число и есть ответ.',
    'Correct. The sum and the product give a quadratic equation: z squared minus ten z plus twenty-one equals zero. Its roots are three and seven, and the smaller is three. The point is filled: this number is the answer itself.'),
  wrongs: [
    { when: (s) => s.at === 7, text: L(
      "Ikkala ildiz ham to'g'ri topilgan, lekin savolda KICHIGI so'ralgan. Uch bilan yettini solishtiring.",
      'Оба корня найдены верно, но в вопросе спрашивают МЕНЬШЕЕ. Сравни тройку и семёрку.',
      'Both roots are found correctly, but the question asks for the SMALLER one. Compare three and seven.') },
    { when: (s) => s.at === 10, text: L(
      "Bu berilgan sonlarning o'zi — yig'indi yoki ko'paytma. Sonlarni topish uchun ulardan kvadrat tenglama tuziladi.",
      'Это сами данные числа — сумма или произведение. Чтобы найти числа, из них составляют квадратное уравнение.',
      'Those are the given numbers themselves — the sum or the product. To find the numbers you build a quadratic equation from them.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Bu son javobning o'zi, u albatta javobga kiradi. Bo'sh nuqta chiqarib tashlangan sonni bildiradi.",
      'Это число и есть ответ, оно безусловно в него входит. Пустая точка означает исключённое число.',
      'This number is the answer itself, so it certainly belongs. A hollow point means an excluded number.') },
    { when: (s) => !s.atOk, text: L(
      "Ko'paytmasi yigirma bir, yig'indisi o'n bo'lgan ikki sonni qidiring. Yigirma birning bo'luvchilarini sanab chiqing.",
      'Ищи два числа с произведением двадцать один и суммой десять. Перебери делители двадцати одного.',
      'Look for two numbers with product twenty-one and sum ten. Go through the divisors of twenty-one.') },
  ],
  wrongText: L(
    "Ko'paytmasi yigirma bir bo'lgan sonlar juftini toping, keyin ulardan yig'indisi o'nga tengini tanlang va kichigini belgilang.",
    'Найди пары чисел с произведением двадцать один, выбери ту, где сумма равна десяти, и отметь меньшее.',
    'Find the pairs with product twenty-one, choose the one whose sum is ten, and mark the smaller number.'),
};

export default function D09_07(props) { return <DomainAxis data={DATA} {...props} />; }
