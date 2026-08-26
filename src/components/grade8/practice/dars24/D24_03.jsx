// Dars24 · Amaliyot 03 — Chegara · 🟢 · tag: bound_after_flip
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 3-pozitsiya)
//
// ENG QISQA HOL: ikkala tomonni minus birga ko'paytirish. Minus x minus
// beshdan katta bo'lsa, x beshdan KICHIK. Ikki ish birga bajariladi —
// ishoralar almashadi va tengsizlik ishorasi buriladi.
//
// Uch xato yo'l: minus besh (ishora saqlab qolindi — З52), nol va bir
// (chegara umuman noto'g'ri o'qildi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'bound_after_flip', level: '🟢',
  target: 5, allowNeg: true,
  expr: ['−x > −5'], exprSize: 30,
  eyebrow: L('Chegara', 'Граница', 'The bound'),
  setup: L(
    "Tengsizlikning ikkala qismini minus birga ko'paytirish kerak. Bunda ikki ish birga bo'ladi: sonlarning ishorasi almashadi va tengsizlik ishorasi buriladi.",
    'Обе части неравенства надо умножить на минус один. При этом происходит сразу две вещи: у чисел меняется знак и переворачивается знак неравенства.',
    'Both sides of the inequality must be multiplied by minus one. Two things happen at once: the numbers change sign and the inequality sign flips.'),
  label: L('x qaysi sondan kichik', 'какого числа x меньше', 'which number x is less than'),
  ask: L('x qaysi sondan kichik?', 'Какого числа меньше x?', 'Which number is x less than?'),
  correctText: L(
    "To'g'ri. Ikkala qismni minus birga ko'paytiramiz: chapda x, o'ngda besh, va ishora buriladi — x beshdan kichik. Tekshirish: x to'rt bo'lsa minus to'rt minus beshdan katta, va to'rt beshdan kichik; x olti bo'lsa ikkala yozuv ham yolg'on.",
    'Верно. Умножаем обе части на минус один: слева x, справа пять, и знак переворачивается — x меньше пяти. Проверка: при x равном четырём минус четыре больше минус пяти, и четыре меньше пяти; при x равном шести обе записи ложны.',
    'Correct. Multiply both sides by minus one: x on the left, five on the right, and the sign flips — x is less than five. Check: at x equal to four, minus four is greater than minus five and four is less than five; at x equal to six both records are false.'),
  wrongs: [
    { when: (s) => s.value === -5, text: L(
      "O'ng tomondagi son shundayligicha ko'chirilgan, lekin u ham ko'paytiriladi. Ikkala qism ham minus birga ko'paytiriladi: minus x dan x, minus beshdan esa ARTI besh chiqadi. Ko'paytirish faqat bir tomonga qo'llanilsa, tenglik buziladi.",
      'Число справа перенесено как есть, но и его умножают. Обе части умножаются на минус один: из минус x выходит x, а из минус пяти — ПЛЮС пять. Если умножить только одну часть, равновесие нарушится.',
      'The number on the right was carried over unchanged, but it gets multiplied too. Both sides are multiplied by minus one: minus x becomes x, and minus five becomes PLUS five. Multiplying only one side breaks the balance.') },
    { when: (s) => s.value === 0 || s.value === 1, text: L(
      "Bu son yozuvdan chiqmaydi. Ikkala qismni minus birga ko'paytiring va nima qolishini ko'ring: chapda x, o'ngda besh. Chegara — o'ngdagi son, ya'ni besh. Ishorani burishni unutmang: ko'paytuvchi manfiy.",
      'Это число из записи не выходит. Умножь обе части на минус один и посмотри, что останется: слева x, справа пять. Граница — число справа, то есть пять. Не забудь перевернуть знак: множитель отрицательный.',
      'That number does not come out of the record. Multiply both sides by minus one and see what remains: x on the left, five on the right. The bound is the number on the right, that is five. Do not forget to flip the sign: the multiplier is negative.') },
    { when: (s) => s.value === -1 || s.value === 6, text: L(
      "Chegara son yozuvdagi beshdan olinadi, ko'paytuvchidan emas. Minus birga ko'paytirsangiz minus besh beshga aylanadi, va tengsizlik x beshdan kichik degan ko'rinishga keladi. Javobni qo'yib tekshiring: to'rtda dastlabki yozuv ham to'g'ri chiqadi.",
      'Граничное число берётся из пятёрки в записи, а не из множителя. Умножив на минус один, минус пять превращается в пять, и неравенство принимает вид: x меньше пяти. Проверь ответ подстановкой: при четырёх исходная запись тоже верна.',
      'The bound comes from the five in the record, not from the multiplier. Multiplying by minus one turns minus five into five, and the inequality takes the form x is less than five. Check by substituting: at four the original record holds as well.') },
  ],
  wrongText: L(
    "Ikkala qismni ham minus birga ko'paytiring va ishorani buring. Javobni dastlabki yozuvga son qo'yib tekshiring.",
    'Умножь на минус один обе части и переверни знак. Проверь ответ, подставив число в исходную запись.',
    'Multiply both sides by minus one and flip the sign. Check your answer by substituting a number into the original record.'),
};

export default function D24_03(props) { return <TypeValue data={DATA} {...props} />; }
