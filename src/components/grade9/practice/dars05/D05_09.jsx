// Dars05 · Amaliyot 09 — So'zlar · 🔴 · teg: a-joyni-ozgartirmaydi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §09
//
// Uchinchi bo'shliqning tuzog'i alohida: gapning oxirida «o'rnini emas»
// allaqachon turibdi, ya'ni «o'rnini» kartasini qo'ysa, gap o'zini o'zi
// inkor qiladi. Razbor shuni ko'rsatadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'a-joyni-ozgartirmaydi', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      'Qavs ichidagi son ishorasi',
      'Знак числа в скобке работает',
      'The sign of the number in the bracket works') },
    { slot: 0 },
    { text: L(
      'ishlaydi: qavsda minus tursa, parabola',
      ': если в скобке минус, парабола сдвигается',
      ': a minus in the bracket shifts the parabola') },
    { slot: 1 },
    { text: L(
      'siljiydi. a koeffitsienti esa parabolaning',
      '. А коэффициент a меняет',
      '. The coefficient a changes the') },
    { slot: 2 },
    { text: L(
      "o'zgartiradi, o'rnini emas.",
      'параболы, а не её место.',
      'of the parabola, not its place.') },
  ],
  cards: [
    { id: 'w1', label: L('teskari', 'наоборот', 'the other way') },
    { id: 'w2', label: L("o'ngga", 'вправо', 'to the right') },
    { id: 'w3', label: L('shaklini', 'форму', 'shape') },
    { id: 'w4', label: L("to'g'ri", 'так же', 'the same way') },
    { id: 'w5', label: L('chapga', 'влево', 'to the left') },
    { id: 'w6', label: L("o'rnini", 'место', 'place') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoidada darsning uchta ishi turibdi: qavsdagi ishoraning teskari ishlashi, siljish yo'nalishi va a ning ta'siri. Uchtasi bitta gapga yig'ilganda ko'rinadi: qayerda turishini qavs hal qiladi, qanday ko'rinishini esa a.",
    'Верно, все три слова на месте. В правиле стоят три дела урока: обратная работа знака в скобке, направление сдвига и влияние a. Все три видны вместе: где парабола стоит, решает скобка, а как она выглядит — a.',
    'Correct, all three words are in place. The rule holds the three jobs of the lesson: the reversed sign in the bracket, the direction of the shift, and what a affects. Together they show it: the bracket decides where the parabola stands, a decides how it looks.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Qavsni nolga tenglashtiring: iks minus uch nolga teng bo'lsa, iks musbat uchga teng. Qavsda minus, natijada esa musbat son — demak ishora teskari ishlaydi.",
      'Приравняй скобку к нулю: если икс минус три равно нулю, икс равен плюс трём. В скобке минус, а в результате положительное число — значит знак работает наоборот.',
      'Set the bracket to zero: if x minus three is zero, x is plus three. A minus in the bracket and a positive result — so the sign works the other way.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Qavsda minus turgan holni oling: uchi musbat sonda chiqadi, ya'ni noldan o'ngda. Chapga siljish esa qavsda qo'shuv turganda bo'ladi.",
      'Возьми случай с минусом в скобке: вершина получается при положительном числе, то есть правее нуля. А влево сдвигает плюс в скобке.',
      'Take the case with a minus in the bracket: the vertex lands at a positive number, to the right of zero. A plus in the bracket is what shifts left.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Gapning oxiri «o'rnini emas» deb turibdi — bitta so'z ikki marta ishlatilmaydi. a ni ikki barobar kattalashtiring va uchining o'rnini tekshiring: u qimirlaydimi?",
      'В конце предложения уже стоит «а не её место» — одно слово дважды не используют. Увеличь a вдвое и проверь место вершины: сдвинется ли оно?',
      'The end of the sentence already says "not its place" — one word is not used twice. Double a and check the place of the vertex: does it move?') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi ishora haqida, ikkinchisi yo'nalish haqida, uchinchisi esa a nimani o'zgartirishi haqida.",
    'Проверяй каждую клетку самим предложением: первое про знак, второе про направление, третье про то, что меняет a.',
    'Check each blank against the sentence itself: the first is about the sign, the second about direction, the third about what a changes.'),
};

export default function D05_09(props) { return <ClozeBank data={DATA} {...props} />; }
