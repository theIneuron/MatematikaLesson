// Dars51 · Amaliyot 10 — Pazl · 🔴 🖼 · tag: vertex_arc_to_angle
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 10-pozitsiya)
//
// З108 NING YUZI: berilgan yoy — burchakning uchi TURGAN yoy, ya'ni
// tiralgan yoy emas. Ikki qadam kerak:
//   360 dan ayirish  ->  tiralgan yoy
//   ikkiga bo'lish   ->  burchak
// 260 -> 100 -> 50;  280 -> 80 -> 40;  200 -> 160 -> 80.
// Bitta qadamni tashlab ketish ikki xil xato beradi, va razbor ikkalasini
// alohida ajratadi. `given` da chizma: qaysi yoy nazarda tutilgani
// ko'rinib tursin.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'vertex_arc_to_angle', level: '🔴',
  faceSize: 14, faceSizePhone: 12,
  // A va C bir-biriga YAQIN (240° va 300°), B esa qarshi tomonda (90°).
  // Shu sababli B turgan yoy KATTA (300°), tiralgani esa kichik (60°) —
  // chizma «uch turgan yoy» degan iborani ko'rsatadi, sonlar esa uch xil
  // holat uchun beriladi.
  given: [[{
    fig: 'circ', plain: true, w: 58, h: 48, r: 18, cx: 29, cy: 24,
    chords: [{ a: 240, b: 90, names: ['A', 'B'] }, { a: 300, b: 90, names: ['C', null] }],
  }]],
  givenLabel: L('Chizma', 'Рисунок', 'The drawing'),
  cards: [
    { id: 'f1', side: 0, tokens: ['260°'] },
    { id: 'f2', side: 0, tokens: ['280°'] },
    { id: 'f3', side: 0, tokens: ['200°'] },
    { id: 'v1', side: 1, v: '50°' },
    { id: 'v2', side: 1, v: '40°' },
    { id: 'v3', side: 1, v: '80°' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Chizmada B uchi katta yoyda yotibdi, va uch holatda aynan SHU yoy berilgan. Burchak esa qarama-qarshi yoyga tiraladi, shuning uchun uni avval topish kerak.",
    'На рисунке вершина B лежит на большой дуге, и в трёх случаях дана именно ЭТА дуга. А угол опирается на противоположную, поэтому её сначала надо найти.',
    'In the drawing the vertex B lies on the large arc, and in three cases it is exactly THIS arc that is given. The angle subtends the opposite one, so that must be found first.'),
  ask: L(
    'Yoyni bosing, keyin uyani bosing.',
    'Нажми дугу, потом ячейку.',
    'Tap an arc, then a slot.'),
  bank: L('Yoylar', 'Дуги', 'Arcs'),
  correctText: L(
    "To'g'ri. Har holatda ikki qadam bajarildi. Avval tiralgan yoy topildi: uch yuz oltmishdan berilganini ayirdik — ikki yuz oltmishdan bir yuz, ikki yuz saksondan sakson, ikki yuzdan bir yuz oltmish qoldi. Keyin har birining yarmi olindi: ellik, qirq va sakson. Birinchi qadamni tashlab ketsangiz javob ikki barobardan ham katta chiqadi, ikkinchisini tashlasangiz esa yoyning o'zi qolib ketadi.",
    'Верно. В каждом случае сделано два шага. Сначала найдена дуга опоры: из трёхсот шестидесяти вычли данную — от двухсот шестидесяти осталось сто, от двухсот восьмидесяти восемьдесят, от двухсот сто шестьдесят. Потом взята половина каждой: пятьдесят, сорок и восемьдесят. Пропустишь первый шаг — ответ выйдет больше чем вдвое, пропустишь второй — останется сама дуга.',
    'Correct. Two steps were done in each case. First the subtended arc was found: the given arc was subtracted from three hundred and sixty — two hundred and sixty leaves a hundred, two hundred and eighty leaves eighty, two hundred leaves a hundred and sixty. Then half of each was taken: fifty, forty, and eighty. Skip the first step and the answer comes out more than twice too big; skip the second and the arc itself remains.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Ikki yuz oltmish va ikki yuz o'rin almashdi. Diqqat qiling: yoy KATTA bo'lsa, tiralgan yoy kichik bo'ladi, demak burchak ham kichik. Ikki yuz oltmishdan bir yuz qoladi va burchak ellik; ikki yuzdan esa bir yuz oltmish qoladi va burchak sakson. Berilgan son katta bo'lgani sari javob kichrayadi.",
      'Двести шестьдесят и двести поменялись местами. Заметь: чем БОЛЬШЕ данная дуга, тем меньше дуга опоры, а значит и угол. От двухсот шестидесяти остаётся сто и угол пятьдесят; от двухсот остаётся сто шестьдесят и угол восемьдесят. Чем больше данное число, тем меньше ответ.',
      'Two hundred and sixty and two hundred swapped places. Note: the LARGER the given arc, the smaller the subtended arc, and so the smaller the angle. Two hundred and sixty leaves a hundred and the angle is fifty; two hundred leaves a hundred and sixty and the angle is eighty. The bigger the given number, the smaller the answer.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikki yuz sakson uchun javob mos kelmadi. Ikki qadamni ketma-ket bajaring: uch yuz oltmishdan ikki yuz saksonni ayirsak sakson qoladi, saksonning yarmi esa qirq. Sakson — bu tiralgan yoy, qirq — burchak; ikkovini chalkashtirmaslik kerak.",
      'Для двухсот восьмидесяти ответ не подошёл. Сделай два шага подряд: триста шестьдесят минус двести восемьдесят даёт восемьдесят, а половина восьмидесяти сорок. Восемьдесят это дуга опоры, сорок это угол; путать их нельзя.',
      'The answer for two hundred and eighty did not fit. Do the two steps in a row: three hundred and sixty minus two hundred and eighty is eighty, and half of eighty is forty. Eighty is the subtended arc, forty is the angle; the two must not be confused.') },
    { when: () => true, text: L(
      "Berilgan yoy burchak TIRALGAN yoy emas, u uch TURGAN yoy. Ikki ish qiling: uch yuz oltmishdan ayiring, keyin ikkiga bo'ling. Ayirmasdan turib yarimlash darsning eng ko'p uchraydigan chalkashligi.",
      'Данная дуга это не та, на которую угол ОПИРАЕТСЯ, а та, где СТОИТ вершина. Сделай два дела: вычти из трёхсот шестидесяти, потом раздели на два. Делить пополам, не вычтя, — самая частая путаница урока.',
      'The given arc is not the one the angle SUBTENDS but the one the vertex STANDS on. Do two things: subtract from three hundred and sixty, then divide by two. Halving without subtracting first is the most common confusion of the lesson.') },
  ],
  wrongText: L(
    "Avval uch yuz oltmishdan ayiring, keyin ikkiga bo'ling. Ikki qadam ham kerak.",
    'Сначала вычти из трёхсот шестидесяти, потом раздели на два. Нужны оба шага.',
    'First subtract from three hundred and sixty, then divide by two. Both steps are needed.'),
};

export default function D51_10(props) { return <PairSlots data={DATA} {...props} />; }
