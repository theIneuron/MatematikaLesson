// Dars41 · Amaliyot 03 — Figuralar · 🟢 🖼 · tag: equal_area_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 3-pozitsiya)
//
// T3 KO'Z BILAN. Kadr 94x64 (telefonda razbor bilan sig'ishi uchun kichraytirildi).
// Uch uchburchakning asosi bir xil (chapdan o'ngga bir xil
// kenglik) va uchi bir xil balandlikda turadi, faqat uch YON tomonga surilgan:
// uchinchisida u asosdan chetga chiqib ketadi, ya'ni balandlik figuradan
// tashqarida tushadi — bu ham tengdoshlikni buzmaydi.
//
// Rad etilganlar uch xil: uchi balandda (balandlik katta), asosi qisqa,
// hamda keng va past (asos katta, balandlik kichik). Oxirgi ikkisining yuzi
// bir-biriga yaqin, lekin ikkalasi ham tanlanadigan uchtadan boshqa.
//
// CHIZMADA BELGI YO'Q (skelet §2): balandlik chizilsa yoki shtrix qo'yilsa,
// javob oldindan aytilgan bo'lardi. Figura faqat SHAKLI bilan hukm qilinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const F = { fig: 'poly', w: 94, h: 64 };

const DATA = {
  tag: 'equal_area_marked', level: '🟢',
  col: 102, itemSize: 14,
  items: [
    // uchtasining asosi bir xil kenglikda, uchi esa bir xil balandlikda
    { id: 'i1', hit: true, tokens: [{ ...F, pts: [[12, 54], [28, 16], [74, 54]] }] },
    // uchi balandda: balandlik katta, yuza katta
    { id: 'i2', tokens: [{ ...F, pts: [[12, 54], [43, 6], [74, 54]] }] },
    { id: 'i3', hit: true, tokens: [{ ...F, pts: [[12, 54], [57, 16], [74, 54]] }] },
    // asosi qisqa
    { id: 'i4', tokens: [{ ...F, pts: [[12, 54], [28, 16], [52, 54]] }] },
    // uch asosdan chetda: balandlik tashqarida tushadi, yuza esa o'sha
    { id: 'i5', hit: true, tokens: [{ ...F, pts: [[12, 54], [82, 16], [74, 54]] }] },
    // keng va past
    { id: 'i6', tokens: [{ ...F, pts: [[7, 54], [47, 36], [88, 54]] }] },
  ],
  eyebrow: L('Figuralar', 'Фигуры', 'Figures'),
  setup: L(
    "Olti uchburchak chizilgan. Uchtasining yuzi bir xil, uchtasining boshqa. Yuza ikki narsadan yig'iladi: asos va unga mos balandlik. Uchburchakning qiyaligi ularning hech biri emas.",
    'Начерчены шесть треугольников. У трёх площадь одинаковая, у трёх другая. Площадь складывается из двух вещей: основания и соответствующей высоты. Наклон треугольника не относится ни к одной из них.',
    'Six triangles are drawn. Three have the same area, three do not. The area is built from two things: the base and the matching height. The slant of the triangle is neither of them.'),
  ask: L(
    "Yuzi teng bo'lgan 3 ta uchburchakni belgilang.",
    'Отметь 3 треугольника с равной площадью.',
    'Mark the 3 triangles with equal area.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchalasining asosi bir xil uzunlikda va uchi bir xil balandlikda turadi — faqat uch yon tomonga surilgan. Uchinchisida u asosdan chetga chiqib ketadi va balandlik figuradan tashqarida tushadi, lekin balandlikning O'ZI o'zgarmaydi: u ikki parallel chiziq orasidagi masofa. Rad etilganlar uch xil sababdan: birinchisining uchi balandda, ikkinchisining asosi qisqa, uchinchisi esa keng va past. Oxirgi ikkitasining yuzi bir-biriga yaqin, lekin tanlanadigan uchtadan farq qiladi.",
    'Верно. У всех трёх основание одной длины и вершина на одной высоте — сдвинута только вершина. У третьего она уходит за край основания, и высота падает вне фигуры, но САМА высота не меняется: это расстояние между двумя параллельными прямыми. Отвергнутые отличаются по трём разным причинам: у первого вершина выше, у второго короче основание, третий широкий и низкий. У двух последних площади близки друг к другу, но отличаются от выбранных трёх.',
    'Correct. All three have a base of the same length and an apex at the same height — only the apex is slid sideways. In the third it goes past the end of the base and the height falls outside the figure, but the height ITSELF does not change: it is the distance between two parallel lines. The rejected ones differ for three separate reasons: the first has a higher apex, the second a shorter base, the third is wide and low. The last two have areas close to each other, but different from the three that were chosen.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu uchburchakning asosi to'g'ri, lekin uchi balandroq turadi. Uchni ko'z bilan boshqa figuralarning uchi bilan bir chiziqqa solib ko'ring — u ancha yuqorida. Balandlik katta bo'lsa, yuza ham katta.",
      'У этого треугольника основание верное, но вершина стоит выше. Сравни вершину на глаз с вершинами других фигур — она заметно выше. Больше высота — больше площадь.',
      'The base of this triangle is right, but its apex stands higher. Line the apex up by eye with the apexes of the other figures — it is clearly above them. A greater height means a greater area.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu uchburchakning uchi to'g'ri balandlikda, lekin asosi qisqa. Ikki narsa bir vaqtda to'g'ri bo'lishi kerak: asos ham, balandlik ham. Bittasi kichik bo'lsa, yuza kichrayadi.",
      'У этого треугольника вершина на верной высоте, но основание короче. Верными должны быть обе вещи сразу: и основание, и высота. Если одна меньше, площадь уменьшается.',
      'This triangle has its apex at the right height, but its base is shorter. Both things must be right at once: the base and the height. If one is smaller, the area shrinks.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu uchburchak eng keng, lekin eng past. Kengligi yuzani oshiradi, balandligining kichikligi esa kamaytiradi — va natijada yuza tanlanadigan uchtasidan boshqa chiqadi. Faqat kenglikka qarab hukm qilib bo'lmaydi.",
      'Этот треугольник самый широкий, но самый низкий. Ширина увеличивает площадь, а малая высота уменьшает — в итоге площадь выходит другой, не как у выбранных трёх. По одной ширине судить нельзя.',
      'This triangle is the widest but the lowest. Its width raises the area while its small height lowers it — and the result differs from the three that are chosen. Width alone cannot decide.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Uchi chetga chiqib ketgan uchburchak chetlab o'tildi, lekin uning yuzi ham o'sha. Uch yon tomonga surilganda asos o'zgarmaydi, balandlik ham o'zgarmaydi — u faqat figuradan tashqarida tushadi. Bu qiyalik, ya'ni yuzaga aloqasi yo'q narsa.",
      'Треугольник с вынесенной вершиной пропущен, а его площадь такая же. При сдвиге вершины в сторону основание не меняется, высота тоже — она лишь падает вне фигуры. Это наклон, то есть то, к площади отношения не имеющее.',
      'The triangle with the apex pushed outside was skipped, yet its area is the same. Sliding the apex sideways changes neither the base nor the height — the height merely falls outside the figure. That is slant, which has nothing to do with the area.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta figura kerak. Har uchburchakka ikki savol bering: asosi qanchalik keng va uchi qanchalik baland? Ikkala javob ham bir xil bo'lgan uchtasi topiladi.",
      'Нужно ровно три фигуры. К каждому треугольнику задай два вопроса: насколько широко основание и насколько высока вершина? Найдутся три, у которых оба ответа одинаковы.',
      'Exactly three figures are needed. Ask two questions of every triangle: how wide is the base and how high is the apex? Three will be found where both answers are the same.') },
  ],
  wrongText: L(
    "Asos va balandlikni alohida solishtiring, qiyalikka qaramang.",
    'Сравнивай основание и высоту по отдельности, на наклон не смотри.',
    'Compare the base and the height separately, ignore the slant.'),
};

export default function D41_03(props) { return <MarkAll data={DATA} {...props} />; }
