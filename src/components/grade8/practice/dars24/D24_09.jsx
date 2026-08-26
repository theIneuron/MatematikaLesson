// Dars24 · Amaliyot 09 — Juftlash · 🔴 · tag: operation_to_result
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 9-pozitsiya)
//
// TO'RT AMAL, TO'RT NATIJA, VA HAMMASIDA O'SHA SONLAR. Farq ikki joyda:
// ko'paytuvchining ishorasida va tengsizlik belgisida.
//   ×3      -> 3x > 6        ishora saqlanadi
//   ×(−3)   -> −3x < −6      ishora buriladi (З52)
//   :2      -> x : 2 > 1     bo'lish ham xossa (T3)
//   :(−2)   -> x : (−2) < −1 manfiyga bo'lish ham buradi
//
// Ya'ni bitta jadvalda З52 (burmaslik) va З53 (ortiqcha burish) birga
// tekshiriladi: ikki natijada belgi saqlangan, ikkitasida burilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'operation_to_result', level: '🔴',
  connect: true,
  targetSize: 15,
  items: [
    { id: 'm1', label: L("3 ga ko'paytirildi", 'умножили на 3', 'multiplied by 3') },
    { id: 'm2', label: L("−3 ga ko'paytirildi", 'умножили на −3', 'multiplied by −3') },
    { id: 'm3', label: L("2 ga bo'lindi", 'разделили на 2', 'divided by 2') },
    { id: 'm4', label: L("−2 ga bo'lindi", 'разделили на −2', 'divided by −2') },
  ],
  targets: [
    { id: 't1', tokens: ['3x > 6'] },
    { id: 't2', tokens: ['−3x < −6'] },
    { id: 't3', tokens: ['x : 2 > 1'] },
    { id: 't4', tokens: ['x : (−2) < −1'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "x soni 2 dan katta. Tengsizlikning ikkala qismi ustida to'rt xil amal bajarildi. To'rt natijada o'sha sonlar turadi, farq esa ishoralarda.",
    'Число x больше 2. Над обеими частями неравенства выполнили четыре разных действия. В четырёх результатах стоят те же числа, а различие в знаках.',
    'The number x is greater than 2. Four different operations were applied to both sides. The four results hold the same numbers; the difference lies in the signs.'),
  ask: L(
    "Chapdan amalni bosing, keyin o'ngdan uning natijasini bosing.",
    'Нажми действие слева, потом его результат справа.',
    'Tap an operation on the left, then its result on the right.'),
  correctText: L(
    "To'g'ri. Musbat songa ko'paytirish va bo'lish belgini saqlaydi, manfiy son esa uni buradi — bo'lishda ham. Tekshiring: x to'rt bo'lsa, o'n ikki oltidan katta, minus o'n ikki minus oltidan kichik.",
    'Верно. Умножение и деление на положительное сохраняют знак, а отрицательное число его переворачивает — и при делении тоже. Проверь: при x равном четырём двенадцать больше шести, минус двенадцать меньше минус шести.',
    'Correct. Multiplying and dividing by a positive keep the sign; a negative number flips it — in division as well. Check: at x equal to four, twelve is greater than six and minus twelve is less than minus six.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki natijada bir xil sonlar turibdi, farq esa ISHORALARDA. Uchga ko'paytirilganda hamma narsa musbat qoladi va belgi saqlanadi. Minus uchga ko'paytirilganda esa ikkala tomon ham manfiy bo'ladi va belgi buriladi — manfiy sonlar orasida tartib teskari.",
      'В этих двух результатах стоят одинаковые числа, а различие в ЗНАКАХ. При умножении на три всё остаётся положительным и знак сохраняется. А при умножении на минус три обе части становятся отрицательными и знак переворачивается — среди отрицательных чисел порядок обратный.',
      'These two results hold the same numbers; the difference lies in the SIGNS. Multiplying by three keeps everything positive and keeps the sign. Multiplying by minus three makes both sides negative and flips the sign — among negative numbers the order is reversed.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bo'lishda ham hal qiluvchi narsa — bo'luvchining ishorasi. Ikkiga bo'lganda belgi saqlanadi, minus ikkiga bo'lganda esa buriladi. Bo'lish ko'paytirishdan farq qilmaydi: minus ikkiga bo'lish — minus yarimga ko'paytirish bilan bir xil ish.",
      'В делении тоже решает знак делителя. При делении на два знак сохраняется, а при делении на минус два переворачивается. Деление от умножения не отличается: делить на минус два — то же, что умножать на минус одну вторую.',
      'In division the sign of the divisor decides as well. Dividing by two keeps the sign, dividing by minus two flips it. Division does not differ from multiplication: dividing by minus two is the same work as multiplying by minus one half.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m1 === 't4' || s.pair.m2 === 't3' || s.pair.m2 === 't4', text: L(
      "Avval AMALGA qarang: ko'paytirishda x ning oldida son turadi (uch x), bo'lishda esa x SONGA bo'linadi. Ikkinchi qadamda ishorani tekshiring: manfiy son har ikki holda ham belgini buradi.",
      'Сначала смотри на ДЕЙСТВИЕ: при умножении перед x стоит число (три x), а при делении x делится на число. Вторым шагом проверяй знак: отрицательное число в обоих случаях переворачивает знак.',
      'Look at the OPERATION first: in multiplication a number stands before x (three x), in division x is divided by a number. As a second step check the sign: a negative number flips the sign in either case.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har amalda ikki savol bering: bu ko'paytirishmi yoki bo'lish, va son musbatmi yoki manfiy. Birinchisi natijaning ko'rinishini, ikkinchisi belgisini beradi. Javobni x teng to'rt bilan tekshiring.",
      'В каждом действии задай два вопроса: это умножение или деление, и число положительное или отрицательное. Первое даёт вид результата, второе — знак. Проверь ответ при x равном четырём.',
      'Ask two questions of every operation: is it multiplication or division, and is the number positive or negative. The first gives the shape of the result, the second its sign. Check your answer at x equal to four.') },
  ],
  wrongText: L(
    "Avval amalning turini aniqlang, keyin sonning ishorasiga qarang. Manfiy son ko'paytirishda ham, bo'lishda ham belgini buradi. Javobni x teng to'rt bilan tekshiring.",
    'Сначала определи вид действия, потом посмотри на знак числа. Отрицательное число переворачивает знак и при умножении, и при делении. Проверь ответ при x равном четырём.',
    'First identify the operation, then look at the sign of the number. A negative number flips the sign in multiplication and in division alike. Check your answer at x equal to four.'),
};

export default function D24_09(props) { return <MatchPairs data={DATA} {...props} />; }
