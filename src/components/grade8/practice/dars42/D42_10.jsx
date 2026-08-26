// Dars42 · Amaliyot 10 — Tartib · 🔴 · tag: diagonal_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 10-pozitsiya)
//
// FORMULANING CHIQISHI (`Dars42.jsx`): diagonal trapetsiyani ikki
// uchburchakka bo'ladi, ikkisining ham BALANDLIGI BIR XIL (h), asoslari esa
// a va b. Yuzalarni qo'shsak formula chiqadi. 41-darsning formulasi shu
// yerda ikki marta ishlatiladi.
//
// З88 shu tartibda o'ladi: ikki uchburchakning balandligi bitta va o'sha —
// trapetsiyaning balandligi, yon tomon emas.
// Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'diagonal_steps', level: '🔴',
  expr: ['ABCD'], exprSize: 26,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['AC'], label: L("diagonalni o'tkazamiz", 'проводим диагональ', 'draw the diagonal') },
    { id: 'l2', tokens: ['S₁ = ½a·h'], label: L('birinchi uchburchakning yuzi', 'площадь первого треугольника', 'the area of the first triangle') },
    { id: 'l3', tokens: ['S₂ = ½b·h'], label: L('ikkinchi uchburchakning yuzi', 'площадь второго треугольника', 'the area of the second triangle') },
    { id: 'l4', tokens: ['½(a+b)h'], label: L("yuzalarni qo'shamiz", 'складываем площади', 'add the two areas') },
  ],
  start: ['l2', 'l4', 'l1', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Trapetsiyaning yuzi formulasi qanday chiqqanini to'rt qadam ko'rsatadi, lekin qadamlar aralashib ketgan. Ikki uchburchakning balandligi bir xil: u trapetsiyaning balandligi.",
    'Четыре шага показывают, как получена формула площади трапеции, но шаги перепутаны. Высота у двух треугольников одна и та же: это высота трапеции.',
    'Four steps show how the formula for the area of a trapezoid was obtained, but the steps are mixed up. The two triangles share one height: the height of the trapezoid.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Diagonal trapetsiyani ikki uchburchakka bo'ladi, va shundan keyin o'tgan darsning formulasi ishga tushadi. Birinchi uchburchakning asosi a, ikkinchisining asosi b, balandligi esa ikkisida ham BIR XIL — u trapetsiyaning balandligi, chunki ikki asos parallel chiziqlarda yotadi va ular orasidagi masofa o'zgarmaydi. Yuzalarni qo'shsak: yarim a h qo'shuv yarim b h, ya'ni yarim karra a qo'shuv b karra h. Formula shu yerda tug'iladi va yodlanmaydi.",
    'Верно. Диагональ делит трапецию на два треугольника, и после этого включается формула прошлого урока. У первого треугольника основание a, у второго b, а высота у обоих ОДНА И ТА ЖЕ — это высота трапеции, ведь основания лежат на параллельных прямых и расстояние между ними не меняется. Сложим площади: половина a h плюс половина b h, то есть половина от a плюс b на h. Формула здесь рождается, а не запоминается.',
    'Correct. The diagonal splits the trapezoid into two triangles, and then the formula of the previous lesson comes into play. The first triangle has base a, the second base b, and both share the SAME height — the height of the trapezoid, since the bases lie on parallel lines and the distance between them does not change. Add the areas: half a h plus half b h, that is half of a plus b times h. The formula is born here, not memorised.'),
  wrongs: [
    { when: (s) => s.pos.l1 > s.pos.l2 || s.pos.l1 > s.pos.l3, text: L(
      "Uchburchaklarning yuzini ular paydo bo'lishidan oldin yozib bo'lmaydi. Trapetsiyada uchburchak yo'q — u diagonal o'tkazilgandan keyin paydo bo'ladi. Birinchi qadam shu.",
      'Площади треугольников не записать раньше, чем они появятся. В трапеции треугольников нет — они появляются после того, как проведена диагональ. Это и есть первый шаг.',
      'The areas of the triangles cannot be written before the triangles exist. A trapezoid has no triangles — they appear once the diagonal is drawn. That is the first step.') },
    { when: (s) => s.seq[0] === 'l4' || s.pos.l4 < s.pos.l3, text: L(
      "Qo'shishni qo'shiladigan narsalardan oldin qo'yib bo'lmaydi. Oxirgi qadam ikki yuzaning YIG'INDISI, ya'ni undan oldin ikki yuza ham yozilgan bo'lishi kerak.",
      'Сложение нельзя ставить раньше того, что складывается. Последний шаг — СУММА двух площадей, значит перед ним должны быть записаны обе площади.',
      'The addition cannot come before what is added. The last step is the SUM of two areas, so both areas must be written before it.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ikki uchburchakning tartibi almashdi, va bu javobga xalaqit bermayotgandek ko'rinadi — lekin qadamlar shartdagi tartibda yuradi: avval a asosli uchburchak, keyin b asosli. Yozuv bilan solishtiring.",
      'Порядок двух треугольников поменялся, и кажется, будто это не мешает — но шаги идут в том порядке, в каком стоят в условии: сначала треугольник с основанием a, потом с основанием b. Сверься с записью.',
      'The order of the two triangles was swapped, and it may look harmless — but the steps run in the order of the condition: first the triangle on base a, then the one on base b. Compare with the record.') },
    { when: (s) => s.seq[0] === 'l2' || s.seq[0] === 'l3', text: L(
      "Uchburchakning yuzasidan boshlab bo'lmaydi: hali uchburchak yo'q, va uning balandligi trapetsiyaning balandligiga teng ekani ham aytilmagan. Diagonal — isbot boshlanadigan chiziq.",
      'Начинать с площади треугольника нельзя: треугольника ещё нет, и не сказано, что его высота равна высоте трапеции. Диагональ — та линия, с которой начинается вывод.',
      'You cannot start from the area of a triangle: there is no triangle yet, and nothing has said its height equals the height of the trapezoid. The diagonal is the line the derivation starts from.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon ma'lum bo'lishi kerak?",
    'Спроси у каждого шага: что должно быть уже известно, чтобы его сделать?',
    'Ask every step: what must already be known to do it?'),
};

export default function D42_10(props) { return <SwapOrder data={DATA} {...props} />; }
