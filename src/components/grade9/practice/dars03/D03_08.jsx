// Dars03 · Amaliyot 08 — So'zlar · 🔴 · teg: nol-koeff-a
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §08
//
// Darsning uchala tasdig'i bir gapda. Tuzoqlar: «birga teng» (a ga
// ortiqcha shart), «uchi» (nol bilan uchi aralashadi), «kengayadi»
// (a ning ta'siri teskari).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'nol-koeff-a', level: '🔴',
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
      "y = ax² + bx + c ko'rinishidagi funksiya kvadrat funksiya deyiladi, bunda a",
      'Функция вида y = ax² + bx + c называется квадратичной, где a',
      'A function of the form y = ax² + bx + c is called quadratic, where a') },
    { slot: 0 },
    { text: L(
      '. Funksiyaning',
      '.',
      '. A') },
    { slot: 1 },
    { text: L(
      '— y nolga aylanadigan x qiymati. a soni kattalashsa parabola',
      'функции — это значение x, при котором y обращается в нуль. Чем больше число a, тем парабола',
      'of the function is a value of x at which y becomes zero. The bigger the number a, the') },
    { slot: 2 },
    { text: L('.', '.', ' the parabola.') },
  ],
  cards: [
    { id: 'w1', label: L('nolga teng emas', 'не равно нулю', 'is not zero') },
    { id: 'w2', label: L('noli', 'Нуль', 'zero') },
    { id: 'w3', label: L('torayadi', 'уже', 'narrower') },
    { id: 'w4', label: L('birga teng', 'равно единице', 'equals one') },
    { id: 'w5', label: L('uchi', 'Вершина', 'vertex') },
    { id: 'w6', label: L('kengayadi', 'шире', 'wider') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoidaning uchta gapi darsning uchta ishini yopadi: birinchisi kvadrat funksiyani chiziqlisidan ajratadi, ikkinchisi nolni ta'riflaydi, uchinchisi a ning kattaligi grafikka qanday ta'sir qilishini aytadi.",
    'Верно, все три слова на месте. Три предложения правила закрывают три дела урока: первое отделяет квадратичную функцию от линейной, второе определяет нуль, третье говорит, как величина a влияет на график.',
    'Correct, all three words are in place. The three sentences of the rule cover the three jobs of the lesson: the first separates a quadratic function from a linear one, the second defines a zero, the third says how the size of a affects the graph.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "a birga teng bo'lishi SHART emas, u faqat nolga teng bo'lmasligi kerak. Besh iks kvadrat ham, minus iks kvadrat ham kvadrat funksiya.",
      'a не ОБЯЗАНО равняться единице, оно лишь не должно быть нулём. И пять икс в квадрате, и минус икс в квадрате — квадратичные функции.',
      'a is not REQUIRED to equal one, it only must not be zero. Five x squared and minus x squared are quadratic functions too.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Uchi — grafikning burilish nuqtasi, undagi qiymat esa nolga teng bo'lishi shart emas. Ta'rifda qiymat nolga aylanadigan joy so'ralyapti.",
      'Вершина — точка поворота графика, и значение там не обязано быть нулём. В определении спрашивают место, где значение обращается в нуль.',
      'The vertex is the turning point of the graph, and the value there need not be zero. The definition asks for the place where the value becomes zero.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Ikki iks kvadrat bilan iks kvadratni bir necha iks da solishtiring: kattaroq a da qiymatlar tezroq o'sadi, demak parabola torroq bo'ladi.",
      'Сравни два икс в квадрате и икс в квадрате при нескольких икс: при большем a значения растут быстрее, значит парабола становится уже.',
      'Compare two x squared with x squared at a few x: with a bigger a the values grow faster, so the parabola gets narrower.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi a ga shart qo'yadi, ikkinchisi nomni ta'riflaydi, uchinchisi grafikning shaklini aytadi.",
    'Проверяй каждую клетку самим предложением: первое ставит условие на a, второе определяет название, третье говорит про форму графика.',
    'Check each blank against the sentence itself: the first puts a condition on a, the second defines a name, the third describes the shape of the graph.'),
};

export default function D03_08(props) { return <ClozeBank data={DATA} {...props} />; }
