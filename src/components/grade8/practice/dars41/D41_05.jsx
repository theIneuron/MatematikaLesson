// Dars41 · Amaliyot 05 — Test · 🟡 · tag: which_formula
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 5-pozitsiya)
//
// `Choice` NING VARIANTI SO'Z: `label` massiv bo'lmasa, u `tr()` dan o'tadi
// (`kit.jsx`), ya'ni uch tilda to'g'ri chiqadi. Shu sababli formulani SO'Z
// bilan tanlash topshirig'i aynan shu mexanikada (skelet §0a.4).
//
// Uch xato variant — uch adashish: З86 (gipotenuza hisobga kirdi), З85
// (ikkiga bo'lish yo'q), perimetr bilan chalkashtirish. Razbor har birini
// 9-12-15 uchburchagida SON bilan rad etadi: to'g'ri javob ellik to'rt.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_formula', level: '🟡',
  correct: 0, optCols: 1, optSize: 14,
  given: [['a = 9, b = 12'], ['c = 15']],
  givenLabel: L('Katetlar va gipotenuza', 'Катеты и гипотенуза', 'The legs and the hypotenuse'),
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "To'g'ri burchakli uchburchakning uchala tomoni berilgan. To'rt ifodadan faqat bittasi uning yuzini beradi.",
    'Даны все три стороны прямоугольного треугольника. Из четырёх выражений только одно даёт его площадь.',
    'All three sides of a right triangle are given. Of the four expressions only one gives its area.'),
  ask: L(
    "Qaysi ifoda to'g'ri burchakli uchburchakning yuzini beradi?",
    'Какое выражение даёт площадь прямоугольного треугольника?',
    'Which expression gives the area of a right triangle?'),
  opts: [
    { label: L("ikki katetning yarim ko'paytmasi", 'половина произведения двух катетов', 'half the product of the two legs') },
    { label: L("gipotenuza bilan katetning yarim ko'paytmasi", 'половина произведения гипотенузы и катета', 'half the product of the hypotenuse and a leg') },
    { label: L("ikki katetning ko'paytmasi", 'произведение двух катетов', 'the product of the two legs') },
    { label: L("uchala tomon yig'indisining yarmi", 'половина суммы всех трёх сторон', 'half the sum of all three sides') },
  ],
  correctText: L(
    "To'g'ri. Yuza uchun bir-biriga PERPENDIKULYAR ikki uzunlik kerak, va to'g'ri burchakli uchburchakda ular tayyor turadi: katetlar. Biri asos, ikkinchisi unga mos balandlik. To'qqiz karra o'n ikki bir yuz sakkiz, yarmi ellik to'rt. Gipotenuzaga mos balandlik esa uchburchakning ichidan o'tadi va u berilmagan — shuning uchun uni ishlatib bo'lmaydi.",
    'Верно. Для площади нужны две ПЕРПЕНДИКУЛЯРНЫЕ друг другу длины, и в прямоугольном треугольнике они уже готовы: катеты. Один основание, второй соответствующая ему высота. Девять на двенадцать — сто восемь, половина пятьдесят четыре. А высота, соответствующая гипотенузе, проходит внутри треугольника и не дана — поэтому её не используешь.',
    'Correct. The area needs two lengths PERPENDICULAR to each other, and in a right triangle they are ready made: the legs. One is the base, the other the matching height. Nine times twelve is one hundred eight, half is fifty four. The height matching the hypotenuse runs inside the triangle and is not given — so it cannot be used.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Gipotenuza bilan katet bir-biriga perpendikulyar EMAS: ular to'g'ri burchakning uchida uchrashadi, lekin orasidagi burchak to'g'ri emas. Shu ikkisini ko'paytirsangiz o'n ikki karra o'n besh, yarmi to'qson chiqadi — bu haqiqiy yuzadan ancha katta. Yuza faqat perpendikulyar juftlikdan chiqadi.",
      'Гипотенуза и катет НЕ перпендикулярны друг другу: они сходятся в вершине, но угол между ними не прямой. Перемножив их, получишь двенадцать на пятнадцать, половина девяносто — это заметно больше настоящей площади. Площадь получается только из перпендикулярной пары.',
      'The hypotenuse and a leg are NOT perpendicular to each other: they meet at a vertex, but the angle between them is not right. Multiplying them gives twelve times fifteen, half of which is ninety — well above the true area. The area comes only from a perpendicular pair.') },
    { when: (s) => s.picked === 2, text: L(
      "Ikki katetning ko'paytmasi bir yuz sakkiz, va bu shu katetlarga qurilgan TO'G'RI TO'RTBURCHAKNING yuzi. Uchburchak esa uning yarmi: diagonal to'rtburchakni ikkita teng uchburchakka bo'ladi. Demak ellik to'rt.",
      'Произведение двух катетов — сто восемь, и это площадь ПРЯМОУГОЛЬНИКА, построенного на этих катетах. А треугольник его половина: диагональ делит прямоугольник на два равных треугольника. Значит пятьдесят четыре.',
      'The product of the two legs is one hundred eight, and that is the area of the RECTANGLE built on those legs. The triangle is half of it: a diagonal splits the rectangle into two equal triangles. So fifty four.') },
    { when: (s) => s.picked === 3, text: L(
      "Tomonlarning yig'indisi — bu perimetr, va u yuza emas: perimetr chiziqning uzunligini o'lchaydi, yuza esa ichidagi joyni. Bu uchburchakda yig'indi o'ttiz olti, yarmi o'n sakkiz — haqiqiy yuza ellik to'rt bo'lgani holda.",
      'Сумма сторон — это периметр, а не площадь: периметр измеряет длину линии, а площадь место внутри. В этом треугольнике сумма тридцать шесть, половина восемнадцать — при настоящей площади пятьдесят четыре.',
      'The sum of the sides is the perimeter, not the area: the perimeter measures the length of a line, the area the room inside. In this triangle the sum is thirty six, half is eighteen — while the true area is fifty four.') },
  ],
  wrongText: L(
    "Uchburchakda bir-biriga perpendikulyar ikki uzunlikni toping — yuza faqat shulardan chiqadi.",
    'Найди в треугольнике две перпендикулярные друг другу длины — площадь получается только из них.',
    'Find the two lengths in the triangle that are perpendicular to each other — the area comes only from those.'),
};

export default function D41_05(props) { return <Choice data={DATA} {...props} />; }
