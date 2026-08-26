// Dars36 · Amaliyot 01 — Belgilash · 🟢 · tag: no_repeat_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §8 (36-dars, 1-pozitsiya)
//
// З73 NING KO'ZGA KO'RINADIGAN SHAKLI. 1, 2, 3 raqamlaridan tuzilgan olti
// ikki xonali sondan uchtasining raqamlari takrorlanmaydi, uchtasida esa
// bir xil raqam ikki marta turibdi.
//
// Bu topshiriq keyingi ikkitasiga tayyorgarlik: 02-topshiriqda takrorli va
// takrorsiz holatlarning SONI solishtiriladi, va o'quvchi bu yerda
// «takrorlanish» degan so'z aslida nimani anglatishini ko'radi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'no_repeat_marked', level: '🟢',
  col: 96, itemSize: 20,
  given: [['1, 2, 3']],
  givenLabel: L('Raqamlar', 'Цифры', 'The digits'),
  items: [
    { id: 'i1', tokens: ['12'], hit: true },
    { id: 'i2', tokens: ['11'] },
    { id: 'i3', tokens: ['23'], hit: true },
    { id: 'i4', tokens: ['22'] },
    { id: 'i5', tokens: ['31'], hit: true },
    { id: 'i6', tokens: ['33'] },
  ],
  eyebrow: L('Belgilash', 'Отметь', 'Mark'),
  setup: L(
    "Bir, ikki va uch raqamlaridan ikki xonali sonlar tuzilgan. Ba'zilarida ikkala xona ham har xil raqam bilan to'lgan, ba'zilarida esa bitta raqam ikki marta ishlatilgan.",
    'Из цифр один, два и три составлены двузначные числа. В одних оба разряда заняты разными цифрами, в других одна цифра использована дважды.',
    'Two-digit numbers are built from the digits one, two and three. In some, the two places hold different digits; in others, one digit is used twice.'),
  ask: L(
    'Raqamlari TAKRORLANMAYDIGAN 3 ta sonni belgilang.',
    'Отметь 3 числа, цифры которых НЕ ПОВТОРЯЮТСЯ.',
    'Mark the 3 numbers whose digits do NOT repeat.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Raqamlari takrorlanmaydigan sonlarda birinchi xonada bitta raqam, ikkinchi xonada esa BOSHQA raqam turadi. O'n ikki, yigirma uch va o'ttiz birda shunday. O'n bir, yigirma ikki va o'ttiz uchda esa bitta raqam ikki marta ishlatilgan. Bu farq keyingi topshiriqlarda sanoqni ikki barobar o'zgartiradi: takrorlanishga ruxsat berilsa, ikkinchi xonaga yana uchta raqamning har biri tushishi mumkin; ruxsat berilmasa, birinchi xonada ishlatilgani chiqib ketadi va ikkinchi xonaga faqat ikkita raqam qoladi.",
    'Верно. У чисел без повтора в первом разряде стоит одна цифра, а во втором ДРУГАЯ. Так в двенадцати, двадцати трёх и тридцати одном. А в одиннадцати, двадцати двух и тридцати трёх одна цифра использована дважды. Это различие в следующих заданиях меняет счёт вдвое: если повтор разрешён, во второй разряд может попасть любая из трёх цифр; если запрещён, то использованная в первом разряде выбывает и во втором остаётся лишь две.',
    'Correct. In numbers without repetition the first place holds one digit and the second a DIFFERENT one. So it is in twelve, twenty-three and thirty-one. In eleven, twenty-two and thirty-three one digit is used twice. This difference changes the count in the next tasks by half: if repetition is allowed, any of the three digits may go into the second place; if it is forbidden, the one used in the first place drops out and only two remain for the second.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu sonda bitta raqam IKKI marta ishlatilgan: ikkala xonada ham o'sha raqam turibdi. Bunday sonlar «raqamlari takrorlanmaydigan» sonlar emas. Ularni tekshirish oson — sonning ikki raqamini yonma-yon qo'yib ko'ring: agar ular bir xil bo'lsa, takror bor.",
      'В этом числе одна цифра использована ДВАЖДЫ: в обоих разрядах стоит одна и та же. Такие числа не относятся к числам «без повторения цифр». Проверить просто — поставь две цифры числа рядом: если они одинаковы, повтор есть.',
      'In this number one digit is used TWICE: the same digit stands in both places. Such numbers are not «numbers without repeated digits». The check is simple — put the two digits side by side: if they are the same, there is a repeat.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "O'ttiz bir chetlab o'tildi, lekin uning raqamlari har xil: uch va bir. Sonning kattaligi yoki raqamlarning tartibi ahamiyatsiz — faqat ular BIR XILMI degan savol muhim. O'ttiz bir ham, o'n uch ham takrorsiz sonlar, garchi ular boshqa-boshqa sonlar bo'lsa ham.",
      'Тридцать один пропущено, а цифры у него разные: три и один. Величина числа и порядок цифр не важны — важен только вопрос, ОДИНАКОВЫ ли они. И тридцать один, и тринадцать — числа без повтора, хотя это разные числа.',
      'Thirty-one was skipped, yet its digits differ: three and one. The size of the number and the order of the digits do not matter — only whether they are the SAME. Both thirty-one and thirteen are numbers without repetition, though they are different numbers.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta son kerak. Har songa bitta savol bering: uning ikki raqami bir xilmi. Bir xil bo'lsa — takror bor; har xil bo'lsa — takror yo'q.",
      'Нужно ровно три числа. К каждому задай один вопрос: одинаковы ли его две цифры. Одинаковы — повтор есть; разные — повтора нет.',
      'Exactly three numbers are needed. Ask one question of each: are its two digits the same. The same means a repeat; different means none.') },
  ],
  wrongText: L(
    "Har sonning ikki raqamini solishtiring: bir xil bo'lsa takror bor, har xil bo'lsa yo'q. Sonning kattaligi ahamiyatsiz.",
    'Сравни две цифры каждого числа: одинаковые — повтор есть, разные — нет. Величина числа не важна.',
    'Compare the two digits of each number: the same means a repeat, different means none. The size of the number does not matter.'),
};

export default function D36_01(props) { return <MarkAll data={DATA} {...props} />; }
