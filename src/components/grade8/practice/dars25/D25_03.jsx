// Dars25 · Amaliyot 03 — Guruhlar · 🟢 · tag: strict_or_not
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 3-pozitsiya)
//
// З54 SOF HOLDA. Kartalar juft-juft: bir xil son, bir xil yo'nalish, farq
// esa faqat belgining OSTIDAGI CHIZIQDA. Ya'ni bu topshiriqda hech qanday
// hisob yo'q — faqat yozuvni o'qish.
//
// 27-DARSGA TAYYORGARLIK: u yerda o'sha farq QAVSNING turiga ko'chadi,
// kvadrat qavs chegarani kiritadi, dumaloq qavs kiritmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'strict_or_not', level: '🟢',
  zoneSize: 14, itemSize: 16, zoneLbl: 118,
  zones: [
    { id: 'z1', label: L('CHEGARA KIRADI', 'ГРАНИЦА ВХОДИТ', 'THE BOUNDARY IS IN') },
    { id: 'z2', label: L('CHEGARA KIRMAYDI', 'ГРАНИЦА НЕ ВХОДИТ', 'THE BOUNDARY IS OUT') },
  ],
  items: [
    { id: 'i1', tokens: ['x ≥ 3'], zone: 'z1' },
    { id: 'i2', tokens: ['x > 3'], zone: 'z2' },
    { id: 'i3', tokens: ['x ≤ 3'], zone: 'z1' },
    { id: 'i4', tokens: ['x < 3'], zone: 'z2' },
    { id: 'i5', tokens: ['x ≥ −1'], zone: 'z1' },
    { id: 'i6', tokens: ['x > −1'], zone: 'z2' },
    { id: 'i7', tokens: ['x ≤ 0'], zone: 'z1' },
    { id: 'i8', tokens: ['x < 0'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz tengsizlik juft-juft turibdi: har juftlikda bir xil son va bir xil yo'nalish, farq esa faqat belgining ostidagi chiziqda.",
    'Восемь неравенств стоят парами: в каждой паре одно и то же число и одно направление, а различие только в черте под знаком.',
    'Eight inequalities stand in pairs: each pair has the same number and the same direction, differing only in the line under the sign.'),
  ask: L(
    'Tengsizlikni bosing, keyin guruhini bosing.',
    'Нажми неравенство, потом его группу.',
    'Tap an inequality, then its group.'),
  bank: L('Tengsizliklar', 'Неравенства', 'Inequalities'),
  correctText: L(
    "To'g'ri. Belgi ostidagi chiziq chegarani yechimga kiritadi, chiziqsiz belgi esa chetda qoldiradi. Yo'nalish bunga aloqasiz. Tekshirish uchun chegara sonining o'zini qo'yish kifoya.",
    'Верно. Черта под знаком включает границу в решение, а знак без черты оставляет её вне. Направление к этому отношения не имеет. Для проверки достаточно подставить само граничное число.',
    'Correct. The line under the sign includes the boundary in the solution; a sign without it leaves the boundary out. The direction has nothing to do with it. To check, substituting the boundary number itself is enough.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu belgining ostida chiziq YO'Q, ya'ni tengsizlik qat'iy va chegara kirmaydi. Chegara sonini qo'yib tekshiring: uch uchdan katta emas, u faqat unga teng — demak uch bu tengsizlikning yechimi emas.",
      'Под этим знаком черты НЕТ, значит неравенство строгое и граница не входит. Проверь подстановкой граничного числа: три не больше трёх, оно ему лишь равно — значит три решением этого неравенства не является.',
      'This sign has NO line under it, so the inequality is strict and the boundary is out. Check by substituting the boundary number: three is not greater than three, it merely equals it — so three is not a solution of this inequality.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu belgining ostida chiziq BOR, ya'ni «yoki teng» — chegara kiradi. Chegara sonini qo'ying: uch uchdan katta emas, lekin unga TENG, va belgi shu holni ham qabul qiladi.",
      'Под этим знаком есть ЧЕРТА, то есть «или равно» — граница входит. Подставь граничное число: три не больше трёх, но РАВНО ему, а знак этот случай тоже принимает.',
      'This sign HAS a line, that is «or equal» — the boundary is in. Substitute the boundary number: three is not greater than three, but it EQUALS it, and the sign accepts that case as well.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Yo'nalishga qaramang — u bu yerda hech narsani hal qilmaydi. Faqat belgining ostida chiziq bor-yo'qligiga qarang: chiziq bo'lsa chegara kiradi, bo'lmasa kirmaydi.",
      'Не смотри на направление — здесь оно ничего не решает. Смотри только на то, есть ли черта под знаком: есть — граница входит, нет — не входит.',
      'Ignore the direction — it decides nothing here. Look only at whether there is a line under the sign: with the line the boundary is in, without it the boundary is out.') },
  ],
  wrongText: L(
    "Faqat belgining ostidagi chiziqqa qarang. Tekshirish uchun chegara sonining o'zini qo'ying: tenglik chiqsa, chiziqli belgi uni qabul qiladi, chiziqsizi esa yo'q.",
    'Смотри только на черту под знаком. Для проверки подставь само граничное число: выйдет равенство — знак с чертой его принимает, а без черты нет.',
    'Look only at the line under the sign. To check, substitute the boundary number itself: if equality comes out, the sign with a line accepts it and the one without does not.'),
};

export default function D25_03(props) { return <Zones data={DATA} {...props} />; }
