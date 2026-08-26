// Dars48 · Amaliyot 08 — Tartib · 🔴 · tag: arc_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 8-pozitsiya)
//
// DARSLIKNING MASALASI (108-bet): ∠AOB = 115°, yoy BC yoy AB ga teng,
// ∠AOC izlanadi. To'rt qadam:
//   ∠AOB = 115°     berilganni yozamiz
//   ⌒AB = 115°      kichik yoyning o'lchovi
//   ⌒ABC = 230°     ikki yoyni qo'shamiz
//   ∠AOC = 130°     230 > 180, demak 360 dan ayiriladi
// З103 oxirgi qadamda tutiladi: uni tashlab, ∠AOC = 230° deb yozish —
// markaziy burchak esa 180 dan katta bo'lolmaydi.
// Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'arc_steps', level: '🔴',
  expr: ['⌒BC = ⌒AB'], exprSize: 20,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['∠AOB = 115°'], label: L('berilganni yozamiz', 'записываем данное', 'write down what is given') },
    { id: 'l2', tokens: ['⌒AB = 115°'], label: L("kichik yoyning o'lchovi", 'мера малой дуги', 'the measure of the minor arc') },
    { id: 'l3', tokens: ['⌒ABC = 230°'], label: L("ikki yoyni qo'shamiz", 'складываем две дуги', 'add the two arcs') },
    { id: 'l4', tokens: ['∠AOC = 130°'], label: L("360° dan ayiramiz", 'вычитаем из 360°', 'subtract from 360°') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Aylanada A, B va C nuqtalari belgilangan. Markaziy burchak ∠AOB bir yuz o'n besh gradusga teng, va yoy BC yoy AB ga teng. ∠AOC ni topishning to'rt qadami aralashib ketgan.",
    'На окружности отмечены точки A, B и C. Центральный угол ∠AOB равен ста пятнадцати градусам, и дуга BC равна дуге AB. Четыре шага нахождения ∠AOC перепутаны.',
    'The points A, B and C are marked on a circle. The central angle ∠AOB is one hundred fifteen degrees and the arc BC equals the arc AB. The four steps for finding ∠AOC are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Birinchi qadam — berilganni yozish: markaziy burchak bir yuz o'n besh gradus. Ikkinchi qadam — yoyga o'tish: yoy AB yarim aylanadan kichik, ya'ni uning o'lchovi burchakka teng, bir yuz o'n besh. Uchinchi qadam — shart bo'yicha yoy BC ham bir yuz o'n besh, ya'ni A dan C gacha B orqali borsak, ikki yoy qo'shiladi: ikki yuz o'ttiz. To'rtinchi qadam eng muhimi: ikki yuz o'ttiz bir yuz saksondan KATTA, ya'ni bu katta yoy va unga mos markaziy burchak uch yuz oltmish minus ikki yuz o'ttiz, ya'ni bir yuz o'ttiz. Oxirgi qadamni tashlab ketsangiz, javob ikki yuz o'ttiz bo'lardi — bunday markaziy burchak esa yo'q.",
    'Верно. Первый шаг — записать данное: центральный угол сто пятнадцать градусов. Второй шаг — переход к дуге: дуга AB меньше полуокружности, значит её мера равна углу, сто пятнадцать. Третий шаг — по условию дуга BC тоже сто пятнадцать, значит если идти от A к C через B, две дуги складываются: двести тридцать. Четвёртый шаг самый важный: двести тридцать БОЛЬШЕ ста восьмидесяти, значит это большая дуга, и соответствующий ей центральный угол равен триста шестьдесят минус двести тридцать, то есть сто тридцать. Пропустив последний шаг, получишь ответ двести тридцать — а такого центрального угла не бывает.',
    'Correct. The first step writes down what is given: the central angle is one hundred fifteen degrees. The second moves to the arc: the arc AB is less than a semicircle, so its measure equals the angle, one hundred fifteen. The third uses the condition that the arc BC is one hundred fifteen too, so going from A to C through B the two arcs add: two hundred thirty. The fourth step matters most: two hundred thirty is GREATER than one hundred eighty, so this is a major arc and the matching central angle is three hundred sixty minus two hundred thirty, that is one hundred thirty. Skip the last step and the answer would be two hundred thirty — and no such central angle exists.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Ayirishni yoylar qo'shilishidan OLDIN bajarib bo'lmaydi: nimadan ayirish kerakligi hali ma'lum emas. Avval A dan C gacha yoyni topish kerak (ikki yuz o'ttiz), keyingina uni uch yuz oltmish bilan solishtirish va ayirish mumkin.",
      'Вычитание нельзя делать РАНЬШЕ сложения дуг: пока неизвестно, что вычитать. Сначала надо найти дугу от A до C (двести тридцать), и только потом сравнивать её с тремястами шестьюдесятью и вычитать.',
      'The subtraction cannot come BEFORE the arcs are added: it is not yet known what to subtract. First the arc from A to C must be found (two hundred thirty), and only then compared with three hundred sixty and subtracted.') },
    { when: (s) => s.pos.l2 < s.pos.l1 || s.pos.l3 < s.pos.l2, text: L(
      "Qadamlar zanjir bo'lib boradi: berilgan burchakdan yoyga o'tiladi, keyin ikki yoy qo'shiladi. Yoyni qo'shishdan oldin uning o'lchovi topilgan bo'lishi kerak, va o'lchov burchakdan chiqadi.",
      'Шаги идут цепочкой: от данного угла переходим к дуге, потом складываем две дуги. Прежде чем складывать дуги, надо найти их меру, а мера выходит из угла.',
      'The steps form a chain: from the given angle to the arc, then adding the two arcs. Before adding the arcs their measure must be found, and the measure comes from the angle.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Yechish berilgandan boshlanadi. Birinchi qadam — shartda nima aytilganini yozish: markaziy burchak bir yuz o'n besh gradus. Qolgan uch qadam shundan o'sadi.",
      'Решение начинается с данного. Первый шаг — записать, что сказано в условии: центральный угол сто пятнадцать градусов. Остальные три шага вырастают из него.',
      'A solution starts from what is given. The first step writes down what the condition says: the central angle is one hundred fifteen degrees. The other three steps grow out of it.') },
    { when: (s) => s.pos.l1 > s.pos.l2, text: L(
      "Yoyning o'lchovini berilgan burchak yozilmasdan aytib bo'lmaydi: o'lchov aynan shu burchakdan olinadi. Birinchi qadam — berilgan, ikkinchisi — undan chiqadigan yoy.",
      'Меру дуги не назвать, пока не записан данный угол: мера берётся именно из него. Первый шаг — данное, второй — дуга, выходящая из него.',
      'The measure of the arc cannot be stated before the given angle is written: the measure comes from that angle. The first step is the given, the second the arc that follows from it.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni yozish uchun qaysi son allaqachon ma'lum bo'lishi kerak?",
    'Спроси у каждого шага: какое число должно быть уже известно, чтобы его записать?',
    'Ask every step: which number must already be known to write it down?'),
};

export default function D48_08(props) { return <SwapOrder data={DATA} {...props} />; }
