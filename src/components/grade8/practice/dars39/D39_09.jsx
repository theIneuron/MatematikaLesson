// Dars39 · Amaliyot 09 — Juftlash · 🔴 · tag: three_angles_to_fourth
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 9-pozitsiya)
//
// TO'RT TRAPETSIYA, HAR BIRIDA UCH BURCHAK BERILGAN. Hisob bitta —
// yig'indi uch yuz oltmish, — lekin figuralar boshqa-boshqa:
//   70, 110, 65   -> 115   oddiy trapetsiya
//   90, 90, 50    -> 130   TO'G'RI BURCHAKLI (ikkita to'g'ri burchak)
//   60, 120, 100  ->  80   oddiy trapetsiya
//   75, 105, 105  ->  75   TENG YONLI (ikki juft teng burchak)
// Ikkinchisi З82 ni ko'rsatadi, to'rtinchisi esa T3 ni.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'three_angles_to_fourth', level: '🔴',
  connect: true,
  targetSize: 19, itemSize: 14,
  items: [
    { id: 'm1', tokens: ['70°, 110°, 65°'] },
    { id: 'm2', tokens: ['90°, 90°, 50°'] },
    { id: 'm3', tokens: ['60°, 120°, 100°'] },
    { id: 'm4', tokens: ['75°, 105°, 105°'] },
  ],
  targets: [
    { id: 't1', tokens: ['115°'] },
    { id: 't2', tokens: ['130°'] },
    { id: 't3', tokens: ['80°'] },
    { id: 't4', tokens: ['75°'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt trapetsiya, har birida uch burchak berilgan. To'rtinchi burchakni topish kerak. Hisob to'rt joyda ham bir xil, figuralar esa turlicha.",
    'Четыре трапеции, в каждой даны три угла. Надо найти четвёртый. Вычисление во всех четырёх одинаково, а фигуры разные.',
    'Four trapezoids, each with three angles given. The fourth must be found. The computation is the same in all four, but the figures differ.'),
  ask: L(
    "Chapdan uch burchakni bosing, keyin o'ngdan to'rtinchisini bosing.",
    'Нажми три угла слева, потом четвёртый справа.',
    'Tap the three angles on the left, then the fourth on the right.'),
  correctText: L(
    "To'g'ri. Har to'rtburchakda burchaklar yig'indisi uch yuz oltmish gradus, ya'ni to'rtinchi burchak har safar bir xil yo'l bilan topiladi: uchtasini qo'shib, uch yuz oltmishdan ayirish. Lekin figuralarning o'zi turlicha, va buni ko'rish foydali. Ikkinchisida ikkita to'qson gradus bor — bu to'g'ri burchakli trapetsiya, va uning to'g'ri burchaklari juft bo'lib turadi. To'rtinchisida ikki juft teng burchak bor: yetmish besh, yetmish besh va bir yuz besh, bir yuz besh — bu teng yonli trapetsiya, uning asosidagi burchaklari teng. Birinchi va uchinchisida esa hech qanday tenglik yo'q — bular oddiy trapetsiyalar.",
    'Верно. В любом четырёхугольнике сумма углов триста шестьдесят градусов, значит четвёртый угол каждый раз находится одинаково: сложить три и вычесть из трёхсот шестидесяти. Но сами фигуры разные, и это полезно заметить. Во второй два угла по девяносто — это прямоугольная трапеция, и прямые углы у неё стоят парой. В четвёртой две пары равных углов: семьдесят пять, семьдесят пять и сто пять, сто пять — это равнобедренная трапеция, у неё равны углы при основании. А в первой и третьей никаких равенств нет — это обычные трапеции.',
    'Correct. In any quadrilateral the angles sum to three hundred sixty degrees, so the fourth angle is found the same way every time: add the three and subtract from three hundred sixty. But the figures themselves differ, and that is worth noticing. The second has two angles of ninety — a right trapezoid, whose right angles come in a pair. The fourth has two pairs of equal angles: seventy-five, seventy-five and one hundred five, one hundred five — an isosceles trapezoid, whose base angles are equal. The first and third have no equalities at all — ordinary trapezoids.'),
  wrongs: [
    { when: (s) => s.pair.m2 !== 't2', text: L(
      "Ikkinchi trapetsiyada ikkita to'qson gradus bor, va bu to'g'ri burchakli trapetsiya. Hisob esa o'zgarmaydi: to'qson qo'shuv to'qson qo'shuv ellik ikki yuz o'ttiz, uch yuz oltmish minus ikki yuz o'ttiz bir yuz o'ttiz. Ikki to'g'ri burchakning yonma-yon turgani g'alati emas — to'g'ri burchakli trapetsiyada ular har doim juft.",
      'Во второй трапеции два угла по девяносто, и это прямоугольная трапеция. Вычисление при этом не меняется: девяносто плюс девяносто плюс пятьдесят двести тридцать, триста шестьдесят минус двести тридцать сто тридцать. То, что два прямых угла стоят рядом, не странно — в прямоугольной трапеции они всегда парой.',
      'The second trapezoid has two angles of ninety, making it a right trapezoid. The computation is unchanged: ninety plus ninety plus fifty is two hundred thirty, three hundred sixty minus two hundred thirty is one hundred thirty. Two right angles side by side is nothing odd — in a right trapezoid they always come in a pair.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "To'rtinchi trapetsiyada javob berilgan burchaklardan biriga TENG chiqadi: yetmish besh qo'shuv bir yuz besh qo'shuv bir yuz besh ikki yuz sakson besh, uch yuz oltmish minus ikki yuz sakson besh yetmish besh. Bu tasodif emas — bu teng yonli trapetsiya, va unda asosidagi burchaklar teng, ya'ni yetmish besh ikki marta, bir yuz besh ikki marta.",
      'В четвёртой трапеции ответ оказывается РАВЕН одному из данных углов: семьдесят пять плюс сто пять плюс сто пять двести восемьдесят пять, триста шестьдесят минус двести восемьдесят пять семьдесят пять. Это не совпадение — это равнобедренная трапеция, у неё углы при основании равны, то есть семьдесят пять дважды и сто пять дважды.',
      'In the fourth trapezoid the answer comes out EQUAL to one of the given angles: seventy-five plus one hundred five plus one hundred five is two hundred eighty-five, three hundred sixty minus two hundred eighty-five is seventy-five. This is no coincidence — it is an isosceles trapezoid, whose base angles are equal, so seventy-five appears twice and one hundred five twice.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Bu ikki javob almashib ketdi. Har birini alohida hisoblang: yetmish qo'shuv yuz o'n qo'shuv oltmish besh ikki yuz qirq besh, javob bir yuz o'n besh; oltmish qo'shuv yuz yigirma qo'shuv yuz ikki yuz sakson, javob sakson. Uchta burchakning yig'indisi qanchalik katta bo'lsa, to'rtinchisi shunchalik kichik.",
      'Эти два ответа поменялись местами. Посчитай каждый отдельно: семьдесят плюс сто десять плюс шестьдесят пять двести сорок пять, ответ сто пятнадцать; шестьдесят плюс сто двадцать плюс сто двести восемьдесят, ответ восемьдесят. Чем больше сумма трёх углов, тем меньше четвёртый.',
      'These two answers were swapped. Compute each on its own: seventy plus one hundred ten plus sixty-five is two hundred forty-five, giving one hundred fifteen; sixty plus one hundred twenty plus one hundred is two hundred eighty, giving eighty. The larger the sum of the three angles, the smaller the fourth.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har qatorda bitta hisob: uch burchakni qo'shing va uch yuz oltmishdan ayiring. Javobni tekshiring — to'rt burchakning yig'indisi aynan uch yuz oltmish chiqishi kerak. Figuraning turi hisobni o'zgartirmaydi, u faqat natijani tushuntiradi.",
      'В каждой строке одно вычисление: сложи три угла и вычти из трёхсот шестидесяти. Проверь ответ — сумма четырёх углов должна дать ровно триста шестьдесят. Тип фигуры вычисление не меняет, он лишь объясняет результат.',
      'One computation in every row: add the three angles and subtract from three hundred sixty. Check the answer — the four angles must sum to exactly three hundred sixty. The kind of figure does not change the computation, it only explains the result.') },
  ],
  wrongText: L(
    "Uch burchakni qo'shing va 360 dan ayiring. Javobni to'rt burchakning yig'indisi bilan tekshiring.",
    'Сложи три угла и вычти из 360. Проверь ответ суммой четырёх углов.',
    'Add the three angles and subtract from 360. Check the answer with the sum of the four angles.'),
};

export default function D39_09(props) { return <MatchPairs data={DATA} {...props} />; }
