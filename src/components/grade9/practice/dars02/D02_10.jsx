// Dars02 · Amaliyot 10 — So'zlar · 🔴 · teg: oyna-vs-burilish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §10
//
// Darsning uchala tasdig'i bir gapda. Bankdagi uchta tuzoq uchta
// adashishga tegadi: yo'nalish teskari, oyna o'rniga Ox, burilish
// o'rniga uchi.
//
// Kartalar SO'Z, ya'ni `L()` ICHIDA — matematika emas. `parts` uch tilda
// bir xil shaklda: matn, uya, matn, uya, matn, uya, matn.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'oyna-vs-burilish', level: '🔴',
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
      'Agar oraliqda kattaroq x ga kattaroq y mos kelsa, funksiya shu oraliqda',
      'Если на промежутке большему x соответствует большее y, функция на нём',
      'If a larger x gives a larger y on an interval, the function there is') },
    { slot: 0 },
    { text: L(
      "Juft funksiyaning grafigi",
      '. График чётной функции симметричен относительно оси',
      '. The graph of an even function is symmetric about the') },
    { slot: 1 },
    { text: L(
      "o'qiga nisbatan simmetrik, toq funksiyaning grafigi esa koordinatalar",
      ', а график нечётной — относительно',
      'axis, and the graph of an odd one about the') },
    { slot: 2 },
    { text: L(
      'nisbatan simmetrik.',
      'координат.',
      'of coordinates.') },
  ],
  cards: [
    { id: 'w1', label: L("o'suvchi", 'возрастающая', 'increasing') },
    { id: 'w2', label: L('Oy', 'Oy', 'Oy') },
    { id: 'w3', label: L('boshiga', 'начала', 'origin') },
    { id: 'w4', label: L('kamayuvchi', 'убывающая', 'decreasing') },
    { id: 'w5', label: L('Ox', 'Ox', 'Ox') },
    { id: 'w6', label: L('uchiga', 'вершины', 'vertex') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoidada darsning uchta ishi turibdi: birinchisi yo'nalishni oraliq bilan bog'laydi, ikkinchisi juft funksiyaning oyna simmetriyasini beradi, uchinchisi esa toq funksiyaning burilish simmetriyasini. Ikki simmetriya bir xil emas: birida grafik bukiladi, ikkinchisida buriladi.",
    'Верно, все три слова на месте. В правиле стоят три дела урока: первое связывает направление с промежутком, второе даёт зеркальную симметрию чётной функции, третье — поворотную симметрию нечётной. Две симметрии не одно и то же: в одной график сгибают, в другой поворачивают.',
    'Correct, all three words are in place. The rule holds the three jobs of the lesson: the first ties direction to an interval, the second gives the mirror symmetry of an even function, the third the half-turn symmetry of an odd one. The two symmetries are not the same: in one the graph is folded, in the other it is turned.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Kattaroq iks ga kattaroq igrek mos kelyapti, ya'ni qiymat ortyapti. Kamayish bunga qarama-qarshi.",
      'Большему икс отвечает большее игрек, то есть значение растёт. Убывание — это противоположное.',
      'A larger x gives a larger y, so the value grows. Decreasing is the opposite.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Juft funksiyaning grafigini gorizontal o'q bo'ylab emas, TIK o'q bo'ylab buksangiz, ikki yarim ustma-ust tushadi.",
      'График чётной функции совпадает сам с собой, если согнуть его не по горизонтальной, а по ВЕРТИКАЛЬНОЙ оси.',
      'The graph of an even function matches itself when folded along the VERTICAL axis, not the horizontal one.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Toq funksiyada simmetriya markazi — koordinatalar boshi, ya'ni nol nuqtasi. Uchi esa parabolaning so'zi, bu darsda emas.",
      'У нечётной функции центр симметрии — начало координат, то есть точка нуль. Вершина — слово про параболу, оно не из этого урока.',
      'For an odd function the centre of symmetry is the origin, the point zero. "Vertex" is a word about a parabola, not from this lesson.') },
    { when: (s) => s.slots[1] === 'w3' || s.slots[2] === 'w2', text: L(
      "Ikki so'z joyini almashtirdi. Oyna simmetriyasi o'qqa nisbatan, burilish simmetriyasi esa NUQTAGA nisbatan bo'ladi.",
      'Два слова поменялись местами. Зеркальная симметрия бывает относительно оси, а поворотная — относительно ТОЧКИ.',
      'Two words swapped places. Mirror symmetry is about an axis, half-turn symmetry is about a POINT.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi yo'nalishni, ikkinchisi juft funksiyaning oynasini, uchinchisi toq funksiyaning burilishini aytadi.",
    'Проверяй каждую клетку самим предложением: первое про направление, второе про зеркало чётной функции, третье про поворот нечётной.',
    'Check each blank against the sentence itself: the first is about direction, the second about the mirror of an even function, the third about the turn of an odd one.'),
};

export default function D02_10(props) { return <ClozeBank data={DATA} {...props} />; }
