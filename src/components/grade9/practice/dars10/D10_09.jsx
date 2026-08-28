// Dars10 · Amaliyot 09 — So'zlar · 🔴 · teg: grafik-kesishish-nuqtasi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Qoidada darsning uchala ishi: kesishish yechim ekani, umumiy nuqtalar
// soni ikkitadan oshmasligi, va nuqtaning ikkala tenglamada tekshirilishi.
// Uchinchi kartaning matni UZUNROQ: uchala tilda ham gap grammatikasi
// buzilmasligi uchun bo'shliqqa butun ibora tushadi, yolg'iz so'z emas.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'grafik-kesishish-nuqtasi', level: '🔴',
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
      "Sistemaning grafik yechimi — ikkala grafikning",
      'Графическое решение системы — это точки',
      'The graphical solution of a system is the points where the two graphs') },
    { slot: 0 },
    { text: L(
      "nuqtalari. To'g'ri chiziq va parabolaning umumiy nuqtalari",
      'обоих графиков. Общих точек у прямой и параболы не больше',
      '. A line and a parabola have at most') },
    { slot: 1 },
    { text: L(
      "ortiq bo'lmaydi. Grafikdan o'qilgan nuqta",
      '. Точку, прочитанную с графика, проверяют',
      'common points. A point read off the graph is checked in') },
    { slot: 2 },
    { text: L('tekshiriladi.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('kesishish', 'пересечения', 'cross') },
    { id: 'w2', label: L('ikkitadan', 'двух', 'two') },
    { id: 'w3', label: L('ikkala tenglamada ham', 'в обоих уравнениях', 'both equations') },
    { id: 'w4', label: L('urinish', 'касания', 'touch') },
    { id: 'w5', label: L('bittadan', 'одной', 'one') },
    { id: 'w6', label: L('faqat bitta tenglamada', 'только в одном уравнении', 'only one equation') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: kesishish nuqtasi sistemaning yechimi; chiziq va parabolada bunday nuqta ikkitadan ortiq bo'lmaydi, lekin bittasi ham, nolta ham bo'lishi mumkin; va grafikdan o'qilgan nuqta ikkala tenglamada tekshiriladi, faqat bittasida emas.",
    'Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: точка пересечения — решение системы; у прямой и параболы таких точек не больше двух, но может быть и одна, и ни одной; и точку с графика проверяют в обоих уравнениях, а не в одном.',
    'Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: a crossing point is a solution of the system; a line and a parabola have at most two such points, though there may be one or none; and a point read off the graph is checked in both equations, not one.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Urinish — bu kesishishning maxsus holi, ikkita nuqta bittaga qo'shilib ketgani. Umumiy ta'rifda esa kesishish turishi kerak.",
      'Касание — частный случай пересечения, когда две точки слились в одну. В общем определении должно стоять пересечение.',
      'Touching is a special case of crossing, where two points merge into one. The general definition needs crossing.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Chiziqni parabolaga botiring: u ikki joyda kesib o'tadi. Demak chegara bitta emas, ikkita.",
      'Погрузи прямую в параболу: она пересечёт её в двух местах. Значит граница не одна, а две.',
      'Sink the line into the parabola: it crosses in two places. So the bound is two, not one.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Bitta tenglamani qanoatlantiradigan nuqtalar cheksiz ko'p — ular butun grafikni tashkil qiladi. Yechim bo'lishi uchun nuqta ikkalasini ham qanoatlantirishi kerak.",
      'Точек, удовлетворяющих одному уравнению, бесконечно много — из них и состоит весь график. Чтобы быть решением, точка должна удовлетворять обоим.',
      'There are infinitely many points satisfying one equation — the whole graph is made of them. To be a solution a point must satisfy both.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nuqta qanday hosil bo'lishi haqida, ikkinchisi ularning eng ko'p soni haqida, uchinchisi esa nechta tenglamada tekshirilishi haqida.",
    'Проверяй каждую клетку самим предложением: первое про то, как возникает точка, второе про их наибольшее число, третье про то, в скольких уравнениях идёт проверка.',
    'Check each blank against the sentence itself: the first is about how the point arises, the second about their largest number, the third about how many equations the check uses.'),
};

export default function D10_09(props) { return <ClozeBank data={DATA} {...props} />; }
