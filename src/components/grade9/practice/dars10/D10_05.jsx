// Dars10 · Amaliyot 05 — Guruhlar · 🟡 · teg: faqat-bir-chiziqda-tekshirish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// MATEMATIKA. Chiziq y = x + 1, parabola y = x² − 1.
//   ikkalasi:  (2; 3), (−1; 0)          — kesishishlar
//   faqat chiziq: (0; 1), (1; 2)
//   faqat parabola: (3; 8), (−2; 3)
// Aynan shu saralash «bitta grafikda tekshirish» adashishini ochadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'faqat-bir-chiziqda-tekshirish', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Oltita nuqta berilgan. Har birini ikkala tenglamada ham tekshiring.",
    'Даны шесть точек. Проверь каждую в обоих уравнениях.',
    'Six points are given. Check each one in both equations.'),
  ask: L(
    'Nuqtani bosing, keyin guruhni bosing.',
    'Нажми точку, потом нажми группу.',
    'Tap a point, then tap a group.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = x + 1'], ['y = x² − 1']],
  zones: [
    { id: 'a', label: L('Ikkalasida ham', 'На обоих', 'On both') },
    { id: 'b', label: L('Faqat chiziqda', 'Только на прямой', 'On the line only') },
    { id: 'c', label: L('Faqat parabolada', 'Только на параболе', 'On the parabola only') },
  ],
  items: [
    { id: 'i1', tokens: ['(2; 3)'], zone: 'a' },
    { id: 'i2', tokens: ['(−1; 0)'], zone: 'a' },
    { id: 'i3', tokens: ['(0; 1)'], zone: 'b' },
    { id: 'i4', tokens: ['(1; 2)'], zone: 'b' },
    { id: 'i5', tokens: ['(3; 8)'], zone: 'c' },
    { id: 'i6', tokens: ['(−2; 3)'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Birinchi guruhdagi ikki nuqta ikkala tenglamani ham qanoatlantiradi — bular kesishishlar, ya'ni sistemaning yechimlari. Qolgan to'rttasi faqat bitta grafikda yotadi: ikki-uch bilan minus bir-nol ikkalasida ham to'g'ri chiqadi, nol-bir esa parabolada emas, uch-sakkiz chiziqda emas. Nuqtani BITTA tenglamada tekshirib qo'yish ana shu farqni ko'rsatmaydi.",
    'Верно. Две точки первой группы удовлетворяют обоим уравнениям — это пересечения, то есть решения системы. Остальные четыре лежат только на одном графике: два-три и минус один-нуль верны в обоих, а нуль-один не на параболе, три-восемь не на прямой. Проверка точки в ОДНОМ уравнении этой разницы не показывает.',
    'Correct. The two points in the first group satisfy both equations — they are the crossings, that is, the solutions of the system. The other four lie on one graph only: two-three and minus one-zero hold in both, while zero-one is off the parabola and three-eight is off the line. Checking a point in ONE equation does not reveal this difference.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Bu nuqtalar chiziqning tenglamasini qanoatlantiradi, lekin parabolanikini yo'q. Nol-birni parabolaga qo'ying: nol kvadrat minus bir minus birga teng, birga emas.",
      'Эти точки удовлетворяют уравнению прямой, но не параболы. Подставь нуль-один в параболу: нуль в квадрате минус один равно минус одному, а не одному.',
      'These points satisfy the line but not the parabola. Put zero-one into the parabola: zero squared minus one is minus one, not one.') },
    { when: (s) => s.place.i5 === 'a' || s.place.i6 === 'a', text: L(
      "Bu nuqtalar parabolada yotadi, lekin chiziqda emas. Uch-sakkizni chiziqqa qo'ying: uch qo'shuv bir to'rt, sakkiz emas.",
      'Эти точки лежат на параболе, но не на прямой. Подставь три-восемь в прямую: три плюс один — четыре, а не восемь.',
      'These points lie on the parabola but not on the line. Put three-eight into the line: three plus one is four, not eight.') },
    { when: (s) => s.place.i1 !== 'a' || s.place.i2 !== 'a', text: L(
      "Ikki-uchni ikkala tenglamada tekshiring: ikki qo'shuv bir uch, ikki kvadrat minus bir ham uch. Ikkalasi ham bajarilsa, nuqta ikkala grafikda yotadi.",
      'Проверь два-три в обоих уравнениях: два плюс один — три, два в квадрате минус один — тоже три. Если верно и то и другое, точка лежит на обоих графиках.',
      'Check two-three in both equations: two plus one is three, two squared minus one is three as well. If both hold, the point lies on both graphs.') },
    { when: (s) => s.place.i3 === 'c' || s.place.i4 === 'c' || s.place.i5 === 'b' || s.place.i6 === 'b', text: L(
      "Guruhlar almashib ketdi. Chiziq — igrek iks qo'shuv bir, parabola — igrek iks kvadrat minus bir. Har nuqtani ikkalasiga alohida qo'yib ko'ring.",
      'Группы перепутаны. Прямая — игрек равен икс плюс один, парабола — игрек равен икс в квадрате минус один. Подставь каждую точку в обе по очереди.',
      'The groups got swapped. The line is y equals x plus one, the parabola is y equals x squared minus one. Put each point into both in turn.') },
  ],
  wrongText: L(
    "Har bir nuqta uchun ikkita tekshiruv qiling: avval chiziqqa qo'ying, keyin parabolaga. Ikkalasi ham to'g'ri chiqsa — birinchi guruh.",
    'Для каждой точки делай две проверки: сначала подставь в прямую, потом в параболу. Верно и там и там — первая группа.',
    'Make two checks for every point: put it into the line, then into the parabola. Both true — the first group.'),
};

export default function D10_05(props) { return <Zones data={DATA} {...props} />; }
