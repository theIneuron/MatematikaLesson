// Dars24 · Amaliyot 08 — Xulosalar · 🔴 · tag: correct_conclusion_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 8-pozitsiya)
//
// DARSNING HAMMA TEOREMASI BIR JOYDA. To'g'ri uchtasi uch xil xossani
// ko'rsatadi: qo'shish, ayirish, musbat songa ko'paytirish.
//
// Uch tuzoq uch xil:
//   −2a > −2b  — manfiy songa ko'paytirilganda ishora burilmadi (З52);
//   b − a > 0  — ayirma teskari olindi (23-darsning З49 si);
//   a² > b²    — kvadratga oshirish XOSSA EMAS. Kontrprimer: a bir,
//                b minus uch. Bir minus uchdan katta, lekin bir to'qqizdan
//                kichik. Bu eng qimmat karta.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'correct_conclusion_marked', level: '🔴',
  col: 152, itemSize: 16,
  given: [['a > b']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  items: [
    { id: 'i1', tokens: ['a + 5 > b + 5'], hit: true },
    { id: 'i2', tokens: ['−2a > −2b'] },
    { id: 'i3', tokens: ['a − 4 > b − 4'], hit: true },
    { id: 'i4', tokens: ['b − a > 0'] },
    { id: 'i5', tokens: ['2a > 2b'], hit: true },
    { id: 'i6', tokens: ['a² > b²'] },
  ],
  eyebrow: L('Xulosalar', 'Выводы', 'Conclusions'),
  setup: L(
    "a soni b sonidan katta. Shundan oltita xulosa chiqarilgan, lekin faqat uchtasi HAR DOIM to'g'ri.",
    'Число a больше числа b. Из этого сделаны шесть выводов, но верны ВСЕГДА только три.',
    'The number a is greater than b. Six conclusions were drawn, but only three are ALWAYS true.'),
  ask: L(
    "Har doim to'g'ri bo'lgan 3 ta xulosani belgilang.",
    'Отметь 3 вывода, которые верны всегда.',
    'Mark the 3 conclusions that are always true.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Bir xil son qo'shilsa yoki ayirilsa, ikkala son ham bir xil masofaga siljiydi; musbat songa ko'paytirilganda ham tartib saqlanadi. Uchala xulosa a bilan b qanday son bo'lishidan qat'i nazar ishlaydi.",
    'Верно. При прибавлении или вычитании одного числа оба сдвигаются на равное расстояние; при умножении на положительное порядок тоже сохраняется. Все три вывода работают при любых a и b.',
    'Correct. Adding or subtracting the same number shifts both by an equal distance; multiplying by a positive keeps the order too. All three conclusions hold whatever a and b are.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
        "Kvadratga oshirish xossa emas. Kontrprimer: a bir, b minus uch — bir minus uchdan katta, lekin bir to'qqizdan kichik.",
        'Возведение в квадрат — не свойство. Контрпример: a один, b минус три: один больше минус трёх, но один меньше девяти.',
        'Squaring is not a property. Counterexample: a is one, b is minus three: one is greater than minus three, yet one is less than nine.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Minus ikki — MANFIY son, ya'ni ko'paytirilganda ishora burilishi kerak edi. To'g'ri xulosa: minus ikki a minus ikki b dan KICHIK. Sonlarda tekshiring: besh va uch — minus o'n va minus olti, va minus o'n minus oltidan kichik.",
      'Минус два — ОТРИЦАТЕЛЬНОЕ число, значит при умножении знак должен был перевернуться. Верный вывод: минус два a МЕНЬШЕ минус двух b. Проверь числами: пять и три — минус десять и минус шесть, и минус десять меньше минус шести.',
      'Minus two is a NEGATIVE number, so the sign should have flipped when multiplying. The right conclusion: minus two a is LESS than minus two b. Check with numbers: five and three give minus ten and minus six, and minus ten is less than minus six.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Ayirma TESKARI olingan. a b dan katta bo'lsa, MUSBAT bo'ladigan ayirma a minus b, b minus a emas. Sonlarda tekshiring: besh va uch — uch minus besh minus ikki, ya'ni noldan kichik. Bu 23-darsning ishi: ayirmaning tartibi xulosani teskari qiladi.",
      'Разность взята НАОБОРОТ. Если a больше b, то положительной будет разность a минус b, а не b минус a. Проверь числами: пять и три — три минус пять минус два, то есть меньше нуля. Это работа урока 23: порядок в разности переворачивает вывод.',
      'The difference is taken the WRONG WAY ROUND. If a is greater than b, the positive difference is a minus b, not b minus a. Check with numbers: five and three give three minus five, minus two, which is less than zero. This is the work of lesson 23: the order in a difference reverses the conclusion.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Bu xulosa chetlab o'tildi, lekin u to'g'ri. Ikkala qismdan bir xil son ayirilsa, ikkala son ham son o'qida chapga BIR XIL masofaga siljiydi, ya'ni ular orasidagi tartib o'zgarmaydi. Ayirish — manfiy son qo'shish bilan bir xil ish, va u ham xossa bo'lib qoladi.",
      'Этот вывод остался в стороне, а он верен. Если из обеих частей вычесть одно и то же число, оба числа сдвинутся влево на ОДИНАКОВОЕ расстояние, то есть порядок между ними не изменится. Вычитание — то же, что прибавление отрицательного, и свойством оно остаётся.',
      'This conclusion was left out, yet it is true. If the same number is subtracted from both sides, both numbers shift left by the SAME distance, so the order between them does not change. Subtraction is the same as adding a negative, and it remains a property.') },
    { when: (s) => s.miss.indexOf('i5') !== -1 || s.miss.indexOf('i1') !== -1, text: L(
      "Bu xulosa chetlab o'tildi, lekin u to'g'ri. Musbat songa ko'paytirish ham, bir xil son qo'shish ham tartibni buzmaydi. Sonlarda tekshiring: besh va uch — o'n va olti, hamda o'n va sakkiz. Ikkala holda ham birinchisi katta qoladi.",
      'Этот вывод остался в стороне, а он верен. Ни умножение на положительное, ни прибавление одного и того же числа порядок не нарушают. Проверь числами: пять и три — десять и шесть, а также десять и восемь. В обоих случаях первое остаётся больше.',
      'This conclusion was left out, yet it is true. Neither multiplying by a positive nor adding the same number breaks the order. Check with numbers: five and three give ten and six, and also ten and eight. In both cases the first stays greater.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta xulosa kerak. Har biri bilan bitta ish qiling: ikki juft son oling — masalan besh va uch, keyin bir va minus uch — va xulosani ikkalasida tekshiring. Bitta juftlikda buzilsa, xulosa har doim to'g'ri emas.",
      'Нужно ровно три вывода. С каждым делай одно: возьми две пары чисел — например пять и три, потом один и минус три — и проверь вывод на обеих. Нарушился хоть на одной паре — значит вывод верен не всегда.',
      'Exactly three conclusions are needed. Do one thing with each: take two pairs of numbers — say five and three, then one and minus three — and test the conclusion on both. If it fails on one pair, it is not always true.') },
  ],
  wrongText: L(
    "Har xulosani ikki juft son bilan tekshiring: besh va uch, keyin bir va minus uch. Qo'shish, ayirish va musbat songa ko'paytirish tartibni saqlaydi, manfiy songa ko'paytirish esa buradi. Kvadratga oshirish umuman xossa emas.",
    'Проверяй каждый вывод на двух парах чисел: пять и три, потом один и минус три. Сложение, вычитание и умножение на положительное сохраняют порядок, умножение на отрицательное переворачивает. А возведение в квадрат свойством не является вовсе.',
    'Test every conclusion on two pairs of numbers: five and three, then one and minus three. Addition, subtraction and multiplying by a positive keep the order, multiplying by a negative flips it. And squaring is not a property at all.'),
};

export default function D24_08(props) { return <MarkAll data={DATA} {...props} />; }
