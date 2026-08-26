// Dars23 · Amaliyot 06 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 6-pozitsiya)
//
// DARSNING UCH TASDIG'I BITTA GAPDA. Bankdagi tuzoqlar:
//   «yig'indisi»        — taqqoslash ayirmaga tayanadi, yig'indiga emas;
//   «katta yoki teng»,
//   «kichik yoki teng»  — 27-darsning QAT'IY BO'LMAGAN tengsizligi. Bu yerda
//                         ular yolg'on: ayirma noldan qat'iy farq qilyapti,
//                         ya'ni tenglik holi allaqachon chiqarib tashlangan.
// `parts` uch tilda BIR XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L(
      "Ikki sonni taqqoslash uchun ularning",
      'Чтобы сравнить два числа, находят их',
      'To compare two numbers one finds their') },
    { slot: 0 },
    { text: L(
      "topiladi. Ayirma musbat bo'lsa, birinchi son ikkinchisidan",
      '. Если разность положительна, первое число второго',
      '. If the difference is positive, the first number is') },
    { slot: 1 },
    { text: L(
      ", manfiy bo'lsa esa",
      ', а если отрицательна, то',
      'than the second, and if it is negative, it is') },
    { slot: 2 },
    { text: L('.', '.', 'than the second.') },
  ],
  cards: [
    { id: 'w1', label: L('ayirmasi', 'разность', 'difference') },
    { id: 'w2', label: L('katta', 'больше', 'greater') },
    { id: 'w3', label: L('kichik', 'меньше', 'smaller') },
    { id: 'w4', label: L("yig'indisi", 'сумму', 'sum') },
    { id: 'w5', label: L('katta yoki teng', 'больше или равно', 'greater than or equal') },
    { id: 'w6', label: L('kichik yoki teng', 'меньше или равно', 'smaller than or equal') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch tasdig'i bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: uchtasi joyiga tushadi, uchtasi esa gapga mos kelib, matematikaga mos kelmaydi.",
    'Три утверждения урока записаны в одном предложении, но три слова выпали. В банке шесть карточек: три встают на место, а три подходят по языку, но не по математике.',
    'The three statements of the lesson are written in one sentence, but three words fell out. The bank holds six cards: three fit, and three fit the sentence but not the mathematics.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Taqqoslash AYIRMAGA tayanadi: a dan b ni ayirasiz va natijaning ishorasiga qaraysiz. Musbat chiqsa a katta, manfiy chiqsa kichik, nol chiqsa esa ular teng. Bu usulning qimmati shundaki, u sonlarning ko'rinishiga umuman qaramaydi: kasr, o'nli kasr, manfiy son — hammasi bir xil tekshiriladi. To'rt beshdan va uch to'rtdan ni ko'z bilan taqqoslab bo'lmaydi, ayirma esa bir yigirmadan berib qo'yadi.",
    'Верно. Сравнение опирается на РАЗНОСТЬ: вычитаешь из a число b и смотришь на знак результата. Положительный — a больше, отрицательный — меньше, нуль — они равны. Ценность способа в том, что он вовсе не смотрит на вид чисел: дробь, десятичная дробь, отрицательное число — всё проверяется одинаково. Четыре пятых и три четвёртых глазом не сравнить, а разность сразу даёт одну двадцатую.',
    'Correct. Comparison rests on the DIFFERENCE: subtract b from a and look at the sign of the result. Positive means a is greater, negative means smaller, zero means they are equal. The value of the method is that it pays no attention to how the numbers look: a fraction, a decimal, a negative number — all are tested the same way. Four fifths and three quarters cannot be compared by eye, but the difference gives one twentieth at once.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Yig'indi taqqoslash haqida hech narsa aytmaydi. Ikki sonning yig'indisi musbat bo'lishi mumkin, lekin qaysi biri katta ekani noma'lum qoladi: besh qo'shuv uch va uch qo'shuv besh — bir xil sakkiz, holbuki birinchi juftlikda birinchi son katta. Aynan AYIRMA tartibga sezgir, shuning uchun u taqqoslaydi.",
      'Сумма о сравнении ничего не говорит. Сумма двух чисел может быть положительной, а какое из них больше, останется неизвестным: пять плюс три и три плюс пять — одинаковые восемь, хотя в первой паре первое число больше. Именно РАЗНОСТЬ чувствительна к порядку, поэтому она и сравнивает.',
      'A sum says nothing about comparison. The sum of two numbers may be positive while which one is greater stays unknown: five plus three and three plus five are both eight, although in the first pair the first number is larger. It is the DIFFERENCE that is sensitive to order, and that is why it compares.') },
    { when: (s) => s.slots[1] === 'w5' || s.slots[2] === 'w6', text: L(
      "«Katta yoki teng» va «kichik yoki teng» bu yerda ortiqcha. Ayirma MUSBAT deyilgan, ya'ni u noldan qat'iy farq qiladi — tenglik holi allaqachon chiqarib tashlangan. Tenglik faqat ayirma NOL bo'lganda paydo bo'ladi. Bu ikki so'z 27-darsning yozuvi, u yerda chegara to'plamga kiradi.",
      '«Больше или равно» и «меньше или равно» здесь лишние. Сказано, что разность ПОЛОЖИТЕЛЬНА, то есть она строго отлична от нуля — случай равенства уже исключён. Равенство возникает только при НУЛЕВОЙ разности. Эти два слова — запись урока 27, где граница входит в множество.',
      '«Greater than or equal» and «smaller than or equal» are excessive here. The difference is said to be POSITIVE, that is strictly non-zero — the case of equality is already excluded. Equality appears only when the difference is ZERO. These two words belong to lesson 27, where the boundary is included.') },
    { when: (s) => s.slots[1] === 'w3' || s.slots[2] === 'w2', text: L(
      "Ikki so'z o'rin almashgan. Musbat ayirma degani a dan b ni ayirganda ORTIQCHA qoldi, ya'ni a katta. Manfiy ayirma esa yetishmaslik, ya'ni a kichik. Sonlarda tekshiring: yetti minus to'rt uch, va yetti to'rtdan katta.",
      'Два слова поменялись местами. Положительная разность значит, что при вычитании b из a осталось ЛИШНЕЕ, то есть a больше. Отрицательная разность — нехватка, то есть a меньше. Проверь числами: семь минус четыре три, и семь больше четырёх.',
      'Two words have swapped places. A positive difference means that subtracting b from a left something OVER, so a is greater. A negative difference means a shortfall, so a is smaller. Check with numbers: seven minus four is three, and seven is greater than four.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1 || s.slots.indexOf('w6') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni yetti va to'rt misolida tekshiring.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на примере семи и четырёх.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on the example of seven and four.') },
  ],
  wrongText: L(
    "Taqqoslash ayirmaga tayanadi. Musbat ayirma birinchi sonning katta ekanini, manfiysi esa kichik ekanini aytadi. Tenglik faqat nolda.",
    'Сравнение опирается на разность. Положительная разность говорит, что первое число больше, отрицательная — что меньше. Равенство только при нуле.',
    'Comparison rests on the difference. A positive difference says the first number is greater, a negative one that it is smaller. Equality only at zero.'),
};

export default function D23_06(props) { return <ClozeBank data={DATA} {...props} />; }
