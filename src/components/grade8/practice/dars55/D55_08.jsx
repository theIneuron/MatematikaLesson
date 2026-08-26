// Dars55 · Amaliyot 08 — Tartib · 🔴 · tag: dot_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 8-pozitsiya)
//
// З117 OXIRGI QADAMDA O'LADI: ikki ko'paytma yozilgandan keyin ular
// QO'SHILADI, juftlik bo'lib qolmaydi. Qo'shishni ko'paytirishdan oldin
// qo'yish mumkin emas — qo'shiladigan narsa hali yo'q.
//   a(2;3), b(4;−1):  2·4 va 3·(−1)  ->  8 va −3  ->  8 + (−3)  ->  5
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'dot_steps', level: '🔴',
  expr: ['a(2; 3) · b(4; −1)'], exprSize: 20,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['2 · 4,  3 · (−1)'],
      label: L("mos koordinatalarni ko'paytiramiz", 'перемножаем соответствующие координаты', 'multiply the matching coordinates') },
    { id: 'l2', tokens: ['8,  −3'],
      label: L('ikki natijani yozamiz', 'записываем два результата', 'write the two results') },
    { id: 'l3', tokens: ['8 + (−3)'],
      label: L("ularni qo'shamiz", 'складываем их', 'add them together') },
    { id: 'l4', tokens: ['5'],
      label: L('javob SON', 'ответ ЧИСЛО', 'the answer is a NUMBER') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Ikki vektorning skalyar ko'paytmasini to'rt qadamda topamiz, lekin qadamlar aralashib ketgan. a ning koordinatalari ikki va uch, b niki to'rt va minus bir.",
    'Скалярное произведение двух векторов находим в четыре шага, но шаги перепутаны. У a координаты два и три, у b четыре и минус один.',
    'We find the dot product of two vectors in four steps, but the steps are mixed up. The coordinates of a are two and three, those of b are four and minus one.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Oxirgi qadam ataylab alohida turibdi, chunki eng ko'p adashish aynan shu yerda. Ikkinchi qadamda ikkita son bor: sakkiz va minus uch. Shu yerda to'xtab qolsangiz, javob JUFTLIK bo'lib qolardi, ya'ni vektorga o'xshab ketardi. Lekin uchinchi qadam ularni qo'shadi, va qo'shilgandan keyin bitta son qoladi: sakkiz qo'shuv minus uch besh. Aynan shuning uchun ko'paytma SKALYAR deb ataladi.",
    'Верно. Последний шаг стоит отдельно нарочно, ведь именно здесь ошибаются чаще всего. На втором шаге два числа: восемь и минус три. Остановись на нём — и ответ остался бы ПАРОЙ, то есть выглядел бы как вектор. Но третий шаг их складывает, и после сложения остаётся одно число: восемь плюс минус три пять. Именно поэтому произведение и называется СКАЛЯРНЫМ.',
    'Correct. The last step deliberately stands apart, since this is where mistakes happen most. At the second step there are two numbers: eight and minus three. Stop there and the answer would stay a PAIR, that is, it would look like a vector. But the third step adds them, and after the addition one number remains: eight plus minus three is five. This is exactly why the product is called SCALAR.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('l3') < s.seq.indexOf('l1'), text: L(
      "Qo'shish ko'paytirishdan oldin turibdi, lekin qo'shiladigan narsa hali yo'q. Skalyar ko'paytmada avval ikki ko'paytma hisoblanadi, keyin ular qo'shiladi. Tartib teskari bo'lsa, birinchi qadamda nimani qo'shish kerakligi noma'lum.",
      'Сложение стоит раньше умножения, но складывать пока нечего. В скалярном произведении сначала считаются два произведения, потом они складываются. При обратном порядке на первом шаге непонятно, что именно складывать.',
      'The addition stands before the multiplication, but there is nothing to add yet. In a dot product the two products are computed first and then added. With the order reversed it is unclear at the first step what is being added.') },
    { when: (s) => s.seq[3] !== 'l4', text: L(
      "Javob oxirida turishi kerak, va bu shunchaki tartib emas. Uchinchi qadamdan keyin qo'shish bajariladi va IKKI son BITTA songa aylanadi. Agar javob oldinroq tursa, u ikki sondan keyin emas, ularning o'rniga chiqqandek ko'rinadi — va aynan shundan skalyar ko'paytmani vektor deb yozish odati tug'iladi.",
      'Ответ должен стоять в конце, и это не просто порядок. После третьего шага выполняется сложение, и ДВА числа превращаются в ОДНО. Если ответ стоит раньше, кажется, будто он получен не после двух чисел, а вместо них — отсюда и берётся привычка записывать скалярное произведение как вектор.',
      'The answer must stand last, and this is not mere ordering. After the third step the addition happens and TWO numbers become ONE. If the answer stands earlier, it looks as though it came instead of the two numbers rather than after them — and that is where the habit of writing a dot product as a vector comes from.') },
    { when: () => true, text: L(
      "Zanjir: ko'paytiramiz, natijalarni yozamiz, qo'shamiz, javobni olamiz. Har qadam oldingisining natijasidan foydalanadi.",
      'Цепочка: перемножаем, записываем результаты, складываем, получаем ответ. Каждый шаг опирается на результат предыдущего.',
      'The chain: multiply, write the results, add, get the answer. Each step uses the result of the one before.') },
  ],
  wrongText: L(
    "Avval ko'paytirish, keyin qo'shish. Qo'shilgandan keyin ikki son bitta songa aylanadi.",
    'Сначала умножение, потом сложение. После сложения два числа становятся одним.',
    'Multiplication first, then addition. After the addition two numbers become one.'),
};

export default function D55_08(props) { return <SwapOrder data={DATA} {...props} />; }
