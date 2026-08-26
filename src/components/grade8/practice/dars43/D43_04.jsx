// Dars43 · Amaliyot 04 — So'zlar · 🟡 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 4-pozitsiya)
//
// Kartalar SO'Z, ya'ni `L()` ICHIDA (skelet §0a.4). `parts` uch tilda bir xil
// TARTIBDA: o'rtalar, parallel, yarim.
//
// Bankdagi tuzoqlar: «uchlarini» (mediana bilan chalkashtirish),
// «perpendikulyar» (balandlik bilan chalkashtirish), «ikkilanganiga» (З90:
// yarim noto'g'ri tomonga).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🟡',
  parts: [
    { text: L("Uchburchakning o'rta chizig'i ikki tomonning", 'Средняя линия треугольника соединяет', 'The midline of a triangle joins the') },
    { slot: 0 },
    { text: L('tutashtiradi, uchinchi tomonga', 'двух сторон, третьей стороне она', 'of two sides; to the third side it is') },
    { slot: 1 },
    { text: L("va uning", 'и равна её', ', and it equals') },
    { slot: 2 },
    { text: L('teng.', '.', 'of it.') },
  ],
  cards: [
    { id: 'w1', label: L("o'rtalarini", 'середины', 'midpoints') },
    { id: 'w2', label: L('parallel', 'параллельна', 'parallel') },
    { id: 'w3', label: L('yarmiga', 'половине', 'half') },
    { id: 'w4', label: L('uchlarini', 'вершины', 'vertices') },
    { id: 'w5', label: L('perpendikulyar', 'перпендикулярна', 'perpendicular') },
    { id: 'w6', label: L('ikkilanganiga', 'двойной длине', 'twice the length') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Uchburchakning o'rta chizig'i haqidagi qoida yozilgan, lekin uchta so'z tushib qolgan. Bankda oltita karta: hammasi gapga tili bo'yicha tushadi, farqni faqat ma'no beradi.",
    'Записано правило про среднюю линию треугольника, но три слова выпали. В банке шесть карточек: все по языку встают в предложение, различие даёт только смысл.',
    'The rule about the midline of a triangle is written down, but three words fell out. The bank holds six cards: all of them fit the sentence as language, only the meaning tells them apart.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Qoidada uch narsa bor va ularning har biri alohida ishlaydi. Birinchisi — o'rta chiziq nimani tutashtiradi: ikki tomonning O'RTALARINI, ya'ni ikki uchi ham o'rtada. Ikkinchisi — u uchinchi tomonga qanday joylashgan: PARALLEL. Uchinchisi — uzunligi qanday: uchinchi tomonning YARMIGA teng. Uchtasi birga o'rta chiziqni boshqa hamma kesmadan ajratadi: medianada birinchi shart buziladi, balandlikda ikkinchisi.",
    'Верно. В правиле три вещи, и каждая работает отдельно. Первая — что соединяет средняя линия: СЕРЕДИНЫ двух сторон, то есть оба конца в серединах. Вторая — как она расположена к третьей стороне: ПАРАЛЛЕЛЬНА. Третья — какова её длина: равна ПОЛОВИНЕ третьей стороны. Все три вместе отделяют среднюю линию от любого другого отрезка: у медианы нарушено первое условие, у высоты второе.',
    'Correct. The rule has three things and each works on its own. The first is what the midline joins: the MIDPOINTS of two sides, that is, both ends at midpoints. The second is how it lies to the third side: PARALLEL. The third is its length: equal to HALF the third side. Together the three separate the midline from every other segment: a median breaks the first condition, a height the second.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('w4') !== -1, text: L(
      "«Uchlarini» boshqa kesmani ta'riflaydi: uchni qarama-qarshi tomonning o'rtasiga tutashtirgan kesma MEDIANA deyiladi. O'rta chiziqning esa ikki uchi ham tomonlarning o'rtasida, uchda hech qanday uchi yo'q.",
      '«Вершины» описывают другой отрезок: отрезок от вершины к середине противоположной стороны называется МЕДИАНОЙ. У средней линии оба конца в серединах сторон, в вершине нет ни одного.',
      'Vertices describe a different segment: the one from a vertex to the midpoint of the opposite side is a MEDIAN. The midline has both ends at midpoints of sides and neither at a vertex.') },
    { when: (s) => s.slots.indexOf('w5') !== -1, text: L(
      "Perpendikulyarlik balandlikning belgisi, o'rta chiziqning emas. O'rta chiziq uchinchi tomon bilan bir yo'nalishda ketadi va u bilan hech qachon kesishmaydi — bu parallellik.",
      'Перпендикулярность — признак высоты, а не средней линии. Средняя линия идёт в одном направлении с третьей стороной и никогда с ней не пересекается — это параллельность.',
      'Perpendicularity is the mark of a height, not of a midline. The midline runs in the same direction as the third side and never meets it — that is parallelism.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Ikkilanganiga» yarimni noto'g'ri tomonga qo'yadi. O'rta chiziq uchburchakning ICHIDA yotadi, ya'ni u uchinchi tomondan uzun bo'lolmaydi. Uchinchi tomon o'n bo'lsa, o'rta chiziq besh — teskarisi emas.",
      '«Двойная длина» приписывает половину не туда. Средняя линия лежит ВНУТРИ треугольника, значит длиннее третьей стороны она быть не может. Если третья сторона десять, средняя линия пять, а не наоборот.',
      'Twice the length puts the half on the wrong side. The midline lies INSIDE the triangle, so it cannot be longer than the third side. If the third side is ten, the midline is five, not the other way round.') },
    { when: (s) => s.slots[1] === 'w3' || s.slots[2] === 'w2', text: L(
      "Ikki so'z joyini almashtirdi. Ikkinchi bo'shliq JOYLASHUV haqida (parallel yoki perpendikulyar), uchinchisi esa UZUNLIK haqida (yarmiga yoki ikkilanganiga). Gapni o'qib ko'ring — ikki savol boshqa.",
      'Два слова поменялись местами. Второй пропуск про РАСПОЛОЖЕНИЕ (параллельна или перпендикулярна), а третий про ДЛИНУ (половине или двойной длине). Прочитай предложение — это два разных вопроса.',
      'Two words swapped places. The second gap is about POSITION (parallel or perpendicular), the third about LENGTH (half or twice). Read the sentence — those are two different questions.') },
  ],
  wrongText: L(
    "Uch bo'shliq uch savolga javob beradi: nimani tutashtiradi, qanday joylashgan, qanday uzunlikda.",
    'Три пропуска отвечают на три вопроса: что соединяет, как расположена, какой длины.',
    'The three gaps answer three questions: what it joins, how it lies, and how long it is.'),
};

export default function D43_04(props) { return <ClozeBank data={DATA} {...props} />; }
