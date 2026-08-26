// Dars42 · Amaliyot 09 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 9-pozitsiya)
//
// Bu yerda kartalar SO'Z, ya'ni `L()` ICHIDA (skelet §0a.4). `parts` uch
// tilda bir xil TARTIBDA: yig'indi, ikkiga bo'lish, balandlik — shu sababli
// bo'shliqlarning ma'nosi UZ, RU va EN da mos tushadi.
//
// Bankdagi tuzoqlar: «ko'paytmasini» (З87), «yon tomoniga» (З88), «to'rtga»
// (yarim o'rniga chorak).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L('Trapetsiyaning yuzi: asoslarning', 'Площадь трапеции: берём', 'The area of a trapezoid: take the') },
    { slot: 0 },
    { text: L('olamiz,', 'оснований, делим на', 'of the bases, divide by') },
    { slot: 1 },
    { text: L("bo'lamiz va", 'и умножаем на', 'and multiply by the') },
    { slot: 2 },
    { text: L("ko'paytiramiz.", '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L("yig'indisini", 'сумму', 'sum') },
    { id: 'w2', label: L('ikkiga', 'два', 'two') },
    { id: 'w3', label: L('balandligiga', 'высоту', 'height') },
    { id: 'w4', label: L("ko'paytmasini", 'произведение', 'product') },
    { id: 'w5', label: L('yon tomoniga', 'боковую сторону', 'leg') },
    { id: 'w6', label: L("to'rtga", 'четыре', 'four') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Qoida yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta, va ularning hammasi gapga tili bo'yicha bemalol tushadi — farqni faqat ma'no beradi.",
    'Правило записано, но три слова выпали. В банке шесть карточек, и все они по языку встают в предложение совершенно спокойно — различие даёт только смысл.',
    'The rule is written down, but three words fell out. The bank holds six cards, and every one of them fits the sentence as language — only the meaning tells them apart.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uch qadamning har biri o'z ishini qiladi. Asoslar QO'SHILADI, chunki trapetsiya ikkisining orasida turadi: yuzasi ham ular orasidagi biror qiymatga tayanadi. Yig'indi IKKIGA bo'linadi, chunki bu ikki asosning o'rtacha uzunligini beradi — u o'rta chiziq deb ataladi. Va oxirida BALANDLIKKA ko'paytiriladi, chunki yuza ikki asos orasidagi joyni o'lchaydi, va bu masofa aynan balandlik.",
    'Верно. Каждый из трёх шагов делает своё дело. Основания СКЛАДЫВАЮТСЯ, ведь трапеция лежит между ними: её площадь опирается на некоторое значение между двумя основаниями. Сумма делится на ДВА, потому что это даёт среднюю длину двух оснований — она называется средней линией. И в конце умножается на ВЫСОТУ, ведь площадь измеряет место между основаниями, а это расстояние и есть высота.',
    'Correct. Each of the three steps does its own job. The bases are ADDED, since the trapezoid lies between them: its area rests on some value between the two. The sum is divided by TWO, because that gives the average length of the two bases — it is called the midline. And finally it is multiplied by the HEIGHT, since the area measures the room between the bases, and that distance is exactly the height.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "«Ko'paytmasi» formulani buzadi. Ikki uzunlikni ko'paytirsangiz allaqachon yuza chiqadi, keyin uni yana balandlikka ko'paytirish uch o'lchovli narsani beradi. Sonlarda tekshiring: asoslar yetti va besh, balandligi to'rt bo'lsa, ko'paytma yo'li bir yuz qirqni beradi, to'g'ri javob esa yigirma to'rt.",
      '«Произведение» ломает формулу. Перемножив две длины, ты уже получаешь площадь, а умножив её ещё и на высоту — нечто трёхмерное. Проверь на числах: при основаниях семь и пять и высоте четыре путь через произведение даёт сто сорок, а верный ответ двадцать четыре.',
      'The product breaks the formula. Multiplying two lengths already gives an area, and multiplying that by the height gives something three dimensional. Check with numbers: with bases seven and five and height four the product route gives one hundred forty, while the right answer is twenty four.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "Yon tomon balandlik o'rnini bosolmaydi: u qiya turadi va ikki asos orasidagi eng qisqa masofani o'lchamaydi. Faqat to'g'ri burchakli trapetsiyada bitta yon tomon balandlikka teng bo'ladi, qolgan hamma holatda u undan uzun.",
      'Боковая сторона высоту не заменяет: она наклонена и не измеряет кратчайшее расстояние между основаниями. Только в прямоугольной трапеции одна боковая сторона равна высоте, во всех остальных случаях она длиннее.',
      'A leg cannot stand in for the height: it is slanted and does not measure the shortest distance between the bases. Only in a right trapezoid does one leg equal the height; in every other case it is longer.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "To'rtga bo'lish yuzani ikki barobar kichraytiradi. Ikkiga bo'lish O'RTACHA qiymatni beradi: ikki asosning o'rtasi. Ikkitaning o'rtachasini topish uchun ikkiga bo'linadi, to'rtga emas.",
      'Деление на четыре уменьшает площадь вдвое. Деление на два даёт СРЕДНЕЕ значение: середину между двумя основаниями. Чтобы найти среднее двух чисел, делят на два, а не на четыре.',
      'Dividing by four halves the area. Dividing by two gives the AVERAGE: the middle between the two bases. To average two numbers you divide by two, not by four.') },
    { when: (s) => s.slots[0] === 'w4' && s.slots[1] === 'w2', text: L(
      "Birinchi bo'shliqqa asoslarni bir-biriga QO'SHADIGAN so'z kerak. Trapetsiya ikki asos orasida yotadi va yuza ikkisining o'rtacha uzunligiga tayanadi — o'rtacha esa yig'indidan chiqadi.",
      'В первый пропуск нужно слово, которое СКЛАДЫВАЕТ основания. Трапеция лежит между двумя основаниями, и площадь опирается на их среднюю длину — а среднее берётся из суммы.',
      'The first gap needs the word that ADDS the bases. A trapezoid lies between its two bases and the area rests on their average length — and an average comes from a sum.') },
  ],
  wrongText: L(
    "Uch qadam: qo'shish, ikkiga bo'lish, balandlikka ko'paytirish. Har qadamni sonlarda tekshirib ko'ring.",
    'Три шага: сложить, разделить на два, умножить на высоту. Проверь каждый шаг на числах.',
    'Three steps: add, halve, multiply by the height. Check each step with numbers.'),
};

export default function D42_09(props) { return <ClozeBank data={DATA} {...props} />; }
