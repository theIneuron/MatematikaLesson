// Dars38 · Amaliyot 07 — Tartib · 🟡 · tag: square_proof_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 7-pozitsiya)
//
// TO'RT QADAM, VA BIRINCHISI ENG KO'P TASHLAB KETILADIGANI:
//   teng ikkiga bo'linadi -> PARALLELOGRAMM
//   teng                  -> TO'G'RI TO'RTBURCHAK
//   perpendikulyar        -> ROMB
//   ikkalasi birga        -> KVADRAT
// З79 aynan shu: «diagonallari teng va perpendikulyar» degan shart
// o'z-o'zidan kvadratni bermaydi — avval figura PARALLELOGRAMM ekanini
// ko'rsatish kerak, va buni diagonallarning teng ikkiga bo'linishi beradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'square_proof_steps', level: '🟡',
  expr: ['AC = BD,  AC ⊥ BD,  AO = OC = BO = OD'], exprSize: 15,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['AO = OC = BO = OD'],
      label: L('parallelogramm', 'параллелограмм', 'a parallelogram') },
    { id: 'l2', tokens: ['AC = BD'],
      label: L("to'g'ri to'rtburchak", 'прямоугольник', 'a rectangle') },
    { id: 'l3', tokens: ['AC ⊥ BD'],
      label: L('romb', 'ромб', 'a rhombus') },
    { id: 'l4', tokens: ['□'],
      label: L('kvadrat', 'квадрат', 'a square') },
  ],
  start: ['l2', 'l3', 'l4', 'l1'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "To'rtburchakning diagonallari teng, o'zaro perpendikulyar va kesishish nuqtasida teng ikkiga bo'linadi. Bu to'rtburchak kvadrat ekanini to'rt qadamda ko'rsatamiz, lekin qadamlar aralashib ketgan.",
    'Диагонали четырёхугольника равны, взаимно перпендикулярны и делятся точкой пересечения пополам. Покажем в четыре шага, что этот четырёхугольник квадрат, но шаги перепутаны.',
    'The diagonals of a quadrilateral are equal, mutually perpendicular, and bisect each other. We show in four steps that this quadrilateral is a square, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Birinchi qadam eng ko'p tashlab ketiladigani: diagonallar kesishish nuqtasida teng ikkiga bo'linsa, to'rtburchak PARALLELOGRAMM bo'ladi. Bu asos, chunki keyingi ikki xulosa faqat parallelogramm uchun ishlaydi. Undan keyin diagonallarning tengligidan to'g'ri to'rtburchak chiqadi, perpendikulyarligidan esa romb. Va oxirida ikkovi birga kvadratni beradi. Birinchi qadamni tashlab ketsangiz xulosa yolg'on bo'lib qoladi: diagonallari teng va perpendikulyar, lekin teng ikkiga bo'linmaydigan to'rtburchak chizish mumkin, va u kvadrat emas — hatto parallelogramm ham emas.",
    'Верно. Первый шаг чаще всего и пропускают: если диагонали делятся точкой пересечения пополам, четырёхугольник — ПАРАЛЛЕЛОГРАММ. Это фундамент, потому что два следующих вывода работают только для параллелограмма. Дальше из равенства диагоналей выходит прямоугольник, из перпендикулярности — ромб. И в конце оба вместе дают квадрат. Если пропустить первый шаг, вывод окажется ложным: можно начертить четырёхугольник с равными и перпендикулярными диагоналями, которые пополам не делятся, и он не квадрат — и даже не параллелограмм.',
    'Correct. The first step is the one most often skipped: if the diagonals bisect each other, the quadrilateral is a PARALLELOGRAM. This is the foundation, because the next two conclusions work only for a parallelogram. Then equal diagonals give a rectangle and perpendicular ones a rhombus. And at the end the two together give a square. Skip the first step and the conclusion turns false: a quadrilateral can be drawn with equal, perpendicular diagonals that do not bisect each other, and it is no square — not even a parallelogram.'),
  wrongs: [
    { when: (s) => s.pos.l1 !== 1, text: L(
      "Birinchi qadam tushib qoldi, va bu darsning eng qimmat xatosi. Diagonallarning teng ikkiga bo'linishi figurani PARALLELOGRAMM qiladi, va faqat undan keyin qolgan ikki shartni qo'llash mumkin. Bu asossiz xulosa qanday ko'rinishini tasavvur qiling: teng va perpendikulyar ikki kesma chizing, lekin ularni turli nuqtalarda kesishtiring — hosil bo'lgan to'rtburchak na kvadrat, na parallelogramm bo'ladi.",
      'Первый шаг выпал, и это самая дорогая ошибка урока. Деление диагоналей пополам делает фигуру ПАРАЛЛЕЛОГРАММОМ, и лишь после этого можно применять два остальных условия. Представь, как выглядит вывод без основания: начерти два равных перпендикулярных отрезка, но пересеки их не в серединах — получившийся четырёхугольник не будет ни квадратом, ни параллелограммом.',
      'The first step dropped out, and this is the costliest error of the lesson. The diagonals bisecting each other is what makes the figure a PARALLELOGRAM, and only then can the other two conditions be applied. Picture the conclusion without its foundation: draw two equal perpendicular segments but cross them away from their midpoints — the resulting quadrilateral is neither a square nor a parallelogram.') },
    { when: (s) => s.pos.l4 !== 4, text: L(
      "Kvadrat ENG OXIRGI xulosa: u ikki oldingi xulosaning kesishmasi. Uni oldinga surish «kvadrat, chunki kvadrat» degan aylanma dalil beradi. To'g'ri yo'l teskari: avval figura to'g'ri to'rtburchak ekanini, keyin romb ekanini ko'rsatish, va faqat shundan keyin ikki nomni bir joyga qo'yish.",
      'Квадрат — САМЫЙ ПОСЛЕДНИЙ вывод: он пересечение двух предыдущих. Сдвинув его вперёд, получишь круговое рассуждение «квадрат, потому что квадрат». Верный путь обратный: сначала показать, что фигура прямоугольник, потом что ромб, и только затем свести два названия вместе.',
      'The square is the VERY LAST conclusion: it is the intersection of the two before it. Moving it forward gives the circular argument «a square because a square». The right route is the reverse: first show the figure is a rectangle, then that it is a rhombus, and only then bring the two names together.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ikkinchi va uchinchi qadam o'rin almashdi. Shartlarni xossalari bilan solishtiring: diagonallarning TENGLIGI to'g'ri to'rtburchakni beradi, PERPENDIKULYARLIGI esa rombni. Bu ikki xossani almashtirish ikki figurani almashtirish demakdir, va oxirgi xulosa buzilmasa ham, yo'l noto'g'ri bo'ladi.",
      'Второй и третий шаги поменялись местами. Сопоставь условия со свойствами: РАВЕНСТВО диагоналей даёт прямоугольник, а ПЕРПЕНДИКУЛЯРНОСТЬ — ромб. Поменять эти два свойства значит поменять две фигуры, и хотя итоговый вывод уцелеет, путь окажется неверным.',
      'The second and third steps changed places. Match the conditions to the properties: EQUAL diagonals give the rectangle, PERPENDICULAR ones the rhombus. Swapping these two properties means swapping two figures, and though the final conclusion survives, the route is wrong.') },
  ],
  wrongText: L(
    "Avval figura parallelogramm ekanini ko'rsating — buni diagonallarning teng ikkiga bo'linishi beradi. Keyin tenglik va perpendikulyarlik, va oxirida kvadrat.",
    'Сначала покажи, что фигура параллелограмм, — это даёт деление диагоналей пополам. Потом равенство и перпендикулярность, и в конце квадрат.',
    'First show the figure is a parallelogram — the bisecting diagonals give that. Then equality and perpendicularity, and the square at the end.'),
};

export default function D38_07(props) { return <SwapOrder data={DATA} {...props} />; }
