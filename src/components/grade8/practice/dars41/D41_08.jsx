// Dars41 · Amaliyot 08 — Tartib · 🔴 · tag: double_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 8-pozitsiya)
//
// FORMULANING CHIQISHI (`Dars41.jsx`, 3-ekran): uchburchak diagonal bo'yicha
// ikkilanib parallelogrammga to'ldiriladi, 40-darsning formulasi ishlatiladi,
// keyin natija ikkiga bo'linadi.
//
// З85 aynan TARTIBDA yashiringan: yarmini parallelogrammning yuzasidan OLDIN
// qo'ysangiz, yarim qayerdan kelgani ko'rinmaydi va formula yodlanadigan
// yozuvga aylanadi. To'ldirishni oxirga surish ham xato: solishtiradigan
// figura shundan paydo bo'ladi.
//
// Boshlang'ich tartib QAT'IY (`start`), tasodifiy emas: aralashtirish ba'zan
// to'g'ri tartibni berib qo'yardi (D01_09 dagi sabab).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'double_steps', level: '🔴',
  expr: ['ABC'], exprSize: 26,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['ABDC'], label: L("uchburchakni parallelogrammga to'ldiramiz", 'дополняем треугольник до параллелограмма', 'complete the triangle to a parallelogram') },
    { id: 'l2', tokens: ['a, h'], label: L("asos va balandlik o'zgarmaydi", 'основание и высота не меняются', 'the base and the height stay the same') },
    { id: 'l3', tokens: ['S = a·h'], label: L('parallelogrammning yuzi', 'площадь параллелограмма', 'the area of the parallelogram') },
    { id: 'l4', tokens: ['S = ½a·h'], label: L('uchburchak uning yarmi', 'треугольник его половина', 'the triangle is half of it') },
  ],
  start: ['l4', 'l2', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Uchburchakning yuzi formulasi qanday chiqqanini to'rt qadam ko'rsatadi, lekin qadamlar aralashib ketgan. Har qadam oldingisining natijasiga tayanadi.",
    'Четыре шага показывают, как получена формула площади треугольника, но шаги перепутаны. Каждый шаг опирается на результат предыдущего.',
    'Four steps show how the formula for the area of a triangle was obtained, but the steps are mixed up. Each step rests on the result of the one before.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Birinchi qadamda uchburchak ikkilanadi: uni diagonal bo'yicha aylantirib qo'shsak, parallelogramm hosil bo'ladi. Ikkinchi qadam muhim va ko'pincha tashlab ketiladi — bu parallelogrammning asosi ham, balandligi ham uchburchakdagi bilan bir xil qoladi. Uchinchi qadamda o'tgan darsning formulasi ishlatiladi: parallelogrammning yuzi asos karra balandlik. Va faqat shundan keyin oxirgi qadam yoziladi: uchburchak parallelogrammning yarmi, demak yuzasi ham yarmi. Yarim shu yerda PAYDO BO'LADI, yodlanmaydi.",
    'Верно. На первом шаге треугольник удваивается: повернём его вокруг диагонали и приложим — получится параллелограмм. Второй шаг важен и его часто пропускают — у этого параллелограмма и основание, и высота такие же, как у треугольника. На третьем шаге используется формула прошлого урока: площадь параллелограмма это основание на высоту. И только после этого пишется последний шаг: треугольник половина параллелограмма, значит и площадь его половина. Половина здесь ПОЯВЛЯЕТСЯ, а не запоминается.',
    'Correct. In the first step the triangle is doubled: turn it about the diagonal and join it, and a parallelogram appears. The second step matters and is often skipped — that parallelogram has the same base and the same height as the triangle. In the third step the formula of the previous lesson is used: the area of a parallelogram is base times height. And only after that comes the last step: the triangle is half the parallelogram, so its area is half too. The half APPEARS here, it is not memorised.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Xulosadan boshlab bo'lmaydi: yarim qaysi sondan olinishi kerakligi hali ma'lum emas. Ikkiga bo'linadigan narsa oldin paydo bo'lishi kerak, ya'ni parallelogrammning yuzi.",
      'Начинать с вывода нельзя: пока неизвестно, от какого числа берётся половина. Сначала должно появиться то, что делится на два, то есть площадь параллелограмма.',
      'You cannot start from the conclusion: it is not yet known what the half is taken of. What gets halved must appear first — the area of the parallelogram.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Yarmini parallelogrammning yuzasidan OLDIN qo'yib bo'lmaydi. Yarim mustaqil qoida emas, u ikkilashning natijasi: parallelogrammning yuzi topilgandan keyin uni ikkiga bo'lish mumkin bo'ladi.",
      'Половину нельзя ставить РАНЬШЕ площади параллелограмма. Половина не отдельное правило, а следствие удвоения: разделить надвое можно после того, как площадь параллелограмма найдена.',
      'The half cannot come BEFORE the area of the parallelogram. The half is not a rule of its own but the consequence of the doubling: you can halve only once the area of the parallelogram is found.') },
    { when: (s) => s.pos.l3 < s.pos.l1, text: L(
      "Parallelogrammning yuzini uni yasashdan oldin yozib bo'lmaydi: hali parallelogramm yo'q. Birinchi qadam — uchburchakni to'ldirish.",
      'Площадь параллелограмма не записать раньше его построения: параллелограмма ещё нет. Первый шаг — дополнить треугольник.',
      'The area of the parallelogram cannot be written before it is built: there is no parallelogram yet. The first step is to complete the triangle.') },
    { when: (s) => s.pos.l2 > s.pos.l3, text: L(
      "Asos va balandlikning o'zgarmaganini AYTMASDAN o'tib ketdingiz, va shu bilan isbotning bo'g'ini uzildi. Parallelogrammning formulasiga uchburchakning asosi va balandligini qo'yish uchun ular bir xil ekanini bilish kerak.",
      'Шаг о том, что основание и высота не изменились, оказался позже, и связка доказательства порвалась. Чтобы подставить в формулу параллелограмма основание и высоту треугольника, надо знать, что они те же.',
      'The step saying the base and height are unchanged ended up later, and the link of the argument broke. To put the triangle base and height into the parallelogram formula you must know they are the same.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon ma'lum bo'lishi kerak?",
    'Спроси у каждого шага: что должно быть уже известно, чтобы его сделать?',
    'Ask every step: what must already be known to do it?'),
};

export default function D41_08(props) { return <SwapOrder data={DATA} {...props} />; }
