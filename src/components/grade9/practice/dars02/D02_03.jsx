// Dars02 · Amaliyot 03 — Ha yoki yo'q · 🟢 · teg: bitta-tarmoq
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse,
// grafik esa `asboblar9.jsx` -> FuncGraph (`Given` ning `fig` sloti orqali).
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §03
//
// UCHTA hukm: birinchisi yo'nalishni oraliq bilan bog'laydi, ikkinchisi
// «butun sohada o'suvchi» degan xatoni tutadi (burilish nuqtasi ko'rilmadi),
// uchinchisi esa simmetriyani qo'shadi — bu boshqa xossa, u yo'nalish
// haqida hech nima demaydi.
//
// FUNKSIYA: f(x) = x²/4 − 2, aniqlanish sohasi [−4; 4]. Chetlari (−4; 2)
// va (4; 2), burilish nuqtasi (0; −2). Grafik Oy ga nisbatan simmetrik.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';
import { FuncGraph } from '../asboblar9.jsx';

const F = (x) => (x * x) / 4 - 2;

const DATA = {
  tag: 'bitta-tarmoq', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Grafikda y = f(x) chizilgan, aniqlanish sohasi minus to'rtdan to'rtgacha.",
    'На графике построена y = f(x), область определения от минус четырёх до четырёх.',
    'The graph shows y = f(x), the domain runs from minus four to four.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  fig: <FuncGraph f={F} domain={[-4, 4]} plane={{ x0: -5, x1: 5, y0: -3, y1: 4 }} step={14} />,
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['[0; 4]'], yes: true, claim: L(
      "oralig'ida funksiya o'suvchi.",
      'на этом промежутке функция возрастает.',
      'on this interval the function is increasing.') },
    { id: 's2', tokens: ['[−4; 4]'], yes: false, claim: L(
      "oralig'ining hammasida funksiya o'suvchi.",
      'на всём этом промежутке функция возрастает.',
      'on the whole of this interval the function is increasing.') },
    { id: 's3', tokens: ['Oy'], yes: true, claim: L(
      "o'qiga nisbatan grafik simmetrik.",
      'относительно этой оси график симметричен.',
      'the graph is symmetric about this axis.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Grafikda burilish nuqtasi bor: undan chapda chiziq pastga ketadi, o'ngda ko'tariladi. Shuning uchun «o'suvchi» so'zi har doim oraliq bilan aytiladi. Simmetriya esa boshqa xossa — u ikki tarmoq bir xil ekanini bildiradi, yo'nalish haqida hech nima demaydi.",
    'Верно, все три. На графике есть точка поворота: слева от неё линия идёт вниз, справа поднимается. Поэтому слово «возрастает» всегда говорят про промежуток. А симметрия — другое свойство: она говорит, что две ветви одинаковы, и ничего не говорит про направление.',
    'Correct, all three. The graph has a turning point: to the left of it the line goes down, to the right it rises. That is why the word "increasing" is always said about an interval. Symmetry is a different property — it says the two branches are alike and says nothing about direction.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Grafikning chap yarmiga qarang: u yerda chiziq pastga ketyapti. Bitta oraliqda o'sishi butun sohada o'sishini bildirmaydi.",
      'Посмотри на левую половину графика: там линия идёт вниз. Возрастание на одном промежутке не означает возрастания на всей области.',
      'Look at the left half of the graph: the line goes down there. Increasing on one interval does not mean increasing on the whole domain.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Noldan o'ngga qarab yuring va chiziqni kuzating: u ko'tarilyaptimi yoki tushyaptimi?",
      'Иди от нуля вправо и следи за линией: она поднимается или опускается?',
      'Walk from zero to the right and watch the line: does it rise or fall?') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Grafikni tik o'q bo'ylab bukib ko'ring: ikki yarim ustma-ust tushadimi?",
      'Согни график по вертикальной оси: совпадут ли две половины?',
      'Fold the graph along the vertical axis: do the two halves match?') },
  ],
  wrongText: L(
    "Grafikni burilish nuqtasidan ikkiga bo'ling. Har qismda yo'nalish alohida qaraladi.",
    'Раздели график точкой поворота на две части. В каждой части направление смотрят отдельно.',
    'Split the graph at the turning point. Direction is judged separately in each part.'),
};

export default function D02_03(props) { return <TrueFalse data={DATA} {...props} />; }
