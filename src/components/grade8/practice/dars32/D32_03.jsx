// Dars32 · Amaliyot 03 — Ko'rsatkich · 🟢 · tag: quotient_exponent
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 3-pozitsiya)
//
// BO'LISH — ENG SODDA HOLDA, ikkala ko'rsatkich ham musbat va natija ham
// musbat. Shu sababli u uchinchi pozitsiyada: xato uch xil qoidani
// almashtirishdan chiqadi, hisobning o'zidan emas.
//   11 — qo'shildi (З64)
//   28 — ko'paytirildi (З65)
//   −3 — ayirma teskari tartibda olindi
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'quotient_exponent', level: '🟢',
  target: 3, allowNeg: true,
  expr: ['a⁷ : a⁴ = aⁿ'], exprSize: 28,
  eyebrow: L("Ko'rsatkich", 'Показатель', 'Exponent'),
  setup: L(
    "Bir xil asosli ikki daraja bo'linyapti. Natija ham daraja bo'ladi, va uning ko'rsatkichini topish kerak.",
    'Делятся две степени с одинаковым основанием. Результат тоже степень, и надо найти её показатель.',
    'Two powers with the same base are divided. The result is also a power, and its exponent must be found.'),
  label: L("Ko'rsatkich n", 'Показатель n', 'The exponent n'),
  ask: L('n nechaga teng?', 'Чему равно n?', 'What does n equal?'),
  correctText: L(
    "To'g'ri. Bo'lishda ko'rsatkichlar AYIRILADI, va suratdagisidan maxrajdagisi ayiriladi: yetti minus to'rt uch. Ochib yozsangiz sabab ko'rinadi: suratda yettita a, maxrajda to'rtta a. To'rt juftlik qisqaradi, suratda uchta a qoladi. Son bilan tekshiring: a ikkiga teng bo'lsa, yuz yigirma sakkizni o'n oltiga bo'lsangiz sakkiz chiqadi, va sakkiz ikkining kubi.",
    'Верно. При делении показатели ВЫЧИТАЮТСЯ, причём из показателя числителя вычитается показатель знаменателя: семь минус четыре три. В раскрытом виде причина видна: в числителе семь множителей a, в знаменателе четыре. Четыре пары сокращаются, в числителе остаётся три. Проверь числом: при a равном двум сто двадцать восемь разделить на шестнадцать даёт восемь, а восемь это два в кубе.',
    'Correct. Division SUBTRACTS the exponents, and the denominator exponent is subtracted from the numerator one: seven minus four is three. Unfolding shows why: seven factors of a above, four below. Four pairs cancel, three remain above. Check with a number: at a equal to two, one hundred twenty-eight divided by sixteen is eight, and eight is two cubed.'),
  wrongs: [
    { when: (s) => s.value === 11, text: L(
      "Ko'rsatkichlar QO'SHILDI: yetti qo'shuv to'rt o'n bir. Qo'shish esa ko'paytirishga tegishli, bu yerda amal bo'lish. Belgiga qarang — ikki nuqta turibdi. Bo'lish natijani KICHRAYTIRADI, ya'ni ko'rsatkich ham o'sishi emas, kamayishi kerak. Son bilan tekshiring: a ikkiga teng bo'lsa, yuz yigirma sakkizni o'n oltiga bo'lsangiz sakkiz chiqadi, ikki ming qirq sakkiz emas.",
      'Показатели СЛОЖИЛИ: семь плюс четыре одиннадцать. Но сложение относится к умножению, а здесь деление. Посмотри на знак — стоит двоеточие. Деление УМЕНЬШАЕТ результат, значит и показатель должен не расти, а убывать. Проверь числом: при a равном двум сто двадцать восемь делить на шестнадцать даёт восемь, а не две тысячи сорок восемь.',
      'The exponents were ADDED: seven plus four is eleven. But adding belongs to multiplication, and here we divide. Look at the sign — a colon. Division makes the result SMALLER, so the exponent must fall, not grow. Check with a number: at a equal to two, one hundred twenty-eight divided by sixteen is eight, not two thousand forty-eight.') },
    { when: (s) => s.value === 28, text: L(
      "Ko'rsatkichlar KO'PAYTIRILDI: yetti karra to'rt yigirma sakkiz. Ko'paytirish esa faqat bitta holga tegishli — daraja yana darajaga ko'tarilganda, ya'ni yozuvda QAVS turganda. Bu yerda qavs yo'q, oddiy bo'lish. Ochib yozing: suratda yettita a, maxrajda to'rtta, qisqargandan keyin uchta qoladi.",
      'Показатели ПЕРЕМНОЖИЛИ: семью четыре двадцать восемь. Но умножение относится лишь к одному случаю — когда степень возводят в степень, то есть когда в записи есть СКОБКА. Здесь скобки нет, обычное деление. Распиши: в числителе семь множителей a, в знаменателе четыре, после сокращения остаётся три.',
      'The exponents were MULTIPLIED: seven times four is twenty-eight. But multiplying belongs to one case only — raising a power to a power, that is when the record has a BRACKET. There is none here, just plain division. Unfold it: seven factors of a above, four below, three remain after cancelling.') },
    { when: (s) => s.value === -3, text: L(
      "Ayirma teskari tartibda olindi: to'rt minus yetti minus uch. Bo'lishda SURATDAGI ko'rsatkichdan maxrajdagisi ayiriladi, teskarisi emas. Tartibni tekshirish oson: surat kattaroq, ya'ni bo'linma birdan katta bo'lishi kerak — a ikkiga teng bo'lsa sakkiz chiqadi, bir sakkizdan emas.",
      'Разность взята в обратном порядке: четыре минус семь минус три. При делении из показателя ЧИСЛИТЕЛЯ вычитается показатель знаменателя, а не наоборот. Порядок легко проверить: числитель больше, значит частное должно быть больше единицы — при a равном двум получается восемь, а не одна восьмая.',
      'The difference was taken the wrong way round: four minus seven is minus three. In division the denominator exponent is subtracted from the NUMERATOR one, not the reverse. The order is easy to check: the numerator is larger, so the quotient must exceed one — at a equal to two it is eight, not one eighth.') },
  ],
  wrongText: L(
    "Belgiga qarang: ikki nuqta — bo'lish, ya'ni ko'rsatkichlar ayiriladi. Suratdagisidan maxrajdagisini ayiring va javobni a = 2 da tekshiring.",
    'Смотри на знак: двоеточие — деление, значит показатели вычитаются. Вычитай из показателя числителя показатель знаменателя и проверь ответ при a = 2.',
    'Look at the sign: a colon means division, so the exponents subtract. Subtract the denominator exponent from the numerator one and check the answer at a = 2.'),
};

export default function D32_03(props) { return <TypeValue data={DATA} {...props} />; }
