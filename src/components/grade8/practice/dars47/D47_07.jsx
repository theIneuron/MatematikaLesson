// Dars47 · Amaliyot 07 — Juftlash · 🟡 · tag: figures_to_answer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 7-pozitsiya)
//
// TO'RT FIGURA, HAR BIRIDA TO'G'RI BURCHAKLI UCHBURCHAKNI KO'RISH KERAK:
//   to'g'ri burchakli: 9 va 40      -> c = 41
//   to'g'ri trapetsiya, 17 va 9, h = 15       -> yon tomon 17
//        (katetlar: asoslar ayirmasi 8 va balandlik 15 -> 8-15-17)
//   teng tomonli, tomoni 6                    -> h = 3√3
//        (katetlar: yarim asos 3 va balandlik; gipotenuza 6)
//   kvadrat: a=6                         -> d = 6√2
//        (katetlar: ikki tomon)
// CHAP USTUN SO'Z BILAN (`items[].label`, skelet §0a.4), o'ng ustun belgi.
// Ildiz `frac.jsx` ning `{ r: ... }` tokeni bilan (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'figures_to_answer', level: '🟡',
  connect: true,
  targetSize: 18,
  items: [
    { id: 'm1', label: L("to'g'ri burchakli: 9 va 40", 'прямоугольный: 9 и 40', 'right-angled: 9 and 40') },
    { id: 'm2', label: L("to'g'ri trapetsiya: 17, 9, h=15", 'прямоугольная трапеция: 17, 9, h=15', 'a right trapezoid: 17, 9, h=15') },
    { id: 'm3', label: L('teng tomonli: a=6', 'равносторонний: a=6', 'equilateral: a=6') },
    { id: 'm4', label: L('kvadrat: a=6', 'квадрат: a=6', 'a square: a=6') },
  ],
  targets: [
    { id: 't1', tokens: ['c = 41'] },
    // «yon tomon» so'zi kartaga chiqmaydi (skelet §0a.4): u ham kichik
    // uchburchakning GIPOTENUZASI, shuning uchun yozuvi `c` bilan.
    { id: 't2', tokens: ['c = 17'] },
    { id: 't3', tokens: ['h = 3', { r: '3' }] },
    { id: 't4', tokens: ['d = 6', { r: '2' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt figura. Uchtasida to'g'ri burchakli uchburchak YASHIRINGAN: uni topib, Pifagor teoremasini shunga qo'llash kerak.",
    'Четыре фигуры. В трёх из них прямоугольный треугольник СПРЯТАН: его надо найти и применить теорему Пифагора к нему.',
    'Four figures. In three of them a right triangle is HIDDEN: it must be found and the Pythagorean theorem applied to it.'),
  ask: L(
    "Chapdan figurani bosing, keyin o'ngdan uning javobini bosing.",
    'Нажми фигуру слева, потом её ответ справа.',
    'Tap a figure on the left, then its answer on the right.'),
  correctText: L(
    "To'g'ri. Birinchi figurada uchburchak tayyor: sakson bir qo'shuv bir ming olti yuz bir ming olti yuz sakson bir, ildizi qirq bir. Ikkinchisida uchburchakni ko'rish kerak: to'g'ri trapetsiyada balandlikni tushirsak, katetlari asoslar AYIRMASI (o'n yetti minus to'qqiz, ya'ni sakkiz) va balandlik (o'n besh) bo'lgan uchburchak chiqadi; oltmish to'rt qo'shuv ikki yuz yigirma besh ikki yuz sakson to'qqiz, ildizi o'n yetti — bu yon tomon. Uchinchisida balandlik yarim asosga qo'llanadi: o'ttiz olti minus to'qqiz yigirma yetti, ildizi uch karra ildiz uch. To'rtinchisida kvadratning ikki tomoni katet bo'ladi: o'ttiz olti qo'shuv o'ttiz olti yetmish ikki, ildizi olti karra ildiz ikki. Diqqat qiladigan joy: sakkiz, o'n besh, o'n yetti uchligi bu darsda ikki marta uchraydi — trapetsiyada va 09-topshiriqning rombida.",
    'Верно. В первой фигуре треугольник готов: восемьдесят один плюс тысяча шестьсот — тысяча шестьсот восемьдесят один, корень сорок один. Во второй треугольник надо увидеть: опустив в прямоугольной трапеции высоту, получаем треугольник с катетами РАЗНОСТЬ оснований (семнадцать минус девять, то есть восемь) и высота (пятнадцать); шестьдесят четыре плюс двести двадцать пять — двести восемьдесят девять, корень семнадцать, это боковая сторона. В третьей теорема применяется к половине основания: тридцать шесть минус девять — двадцать семь, корень три на корень из трёх. В четвёртой катетами служат две стороны квадрата: тридцать шесть плюс тридцать шесть — семьдесят два, корень шесть на корень из двух. На что стоит обратить внимание: тройка восемь, пятнадцать, семнадцать встречается в этом уроке дважды — в трапеции и в ромбе задания 09.',
    'Correct. In the first figure the triangle is ready: eighty one plus one thousand six hundred is one thousand six hundred eighty one, the root is forty one. In the second the triangle must be seen: dropping the height in a right trapezoid gives a triangle whose legs are the DIFFERENCE of the bases (seventeen minus nine, that is eight) and the height (fifteen); sixty four plus two hundred twenty five is two hundred eighty nine, the root is seventeen, the leg. In the third the theorem applies to half the base: thirty six minus nine is twenty seven, whose root is three times the root of three. In the fourth two sides of the square serve as legs: thirty six plus thirty six is seventy two, whose root is six times the root of two. Worth noticing: the triple eight, fifteen, seventeen appears twice in this lesson — in the trapezoid and in the rhombus of task 09.'),
  wrongs: [
    { when: (s) => s.pair.m2 && s.pair.m2 !== 't2', text: L(
      "Trapetsiyada uchburchakni yasash kerak: balandlikni tushirsangiz, uning katetlari balandlik (o'n besh) va asoslarning AYIRMASI (o'n yetti minus to'qqiz, sakkiz) bo'ladi. Asoslarning yig'indisi emas, ayirmasi — chunki yuqori asos pastki asosning ustida turadi va faqat chetdagi bo'lak qoladi. Oltmish to'rt qo'shuv ikki yuz yigirma besh ning ildizi o'n yetti.",
      'В трапеции треугольник надо построить: опустив высоту, получим катеты высота (пятнадцать) и РАЗНОСТЬ оснований (семнадцать минус девять, восемь). Не сумма, а разность — верхнее основание стоит над нижним, и остаётся только крайний кусок. Корень из шестидесяти четырёх плюс двухсот двадцати пяти равен семнадцати.',
      'In the trapezoid the triangle must be built: dropping the height gives legs of the height (fifteen) and the DIFFERENCE of the bases (seventeen minus nine, eight). Not the sum but the difference — the upper base sits above the lower one and only the end piece remains. The root of sixty four plus two hundred twenty five is seventeen.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki figuraning tomoni bir xil (olti), lekin ish boshqa. Teng tomonli uchburchakda gipotenuza BERILGAN (yon tomon olti), ya'ni kvadratlar ayiriladi: o'ttiz olti minus to'qqiz yigirma yetti. Kvadratda esa ikki katet berilgan (tomonlar), ya'ni kvadratlar qo'shiladi: o'ttiz olti qo'shuv o'ttiz olti yetmish ikki. Shuning uchun bittasida javob kichikroq, ikkinchisida kattaroq.",
      'У этих двух фигур сторона одинаковая (шесть), но работа разная. В равностороннем треугольнике гипотенуза ДАНА (боковая сторона шесть), значит квадраты вычитаются: тридцать шесть минус девять — двадцать семь. А в квадрате даны два катета (стороны), значит квадраты складываются: тридцать шесть плюс тридцать шесть — семьдесят два. Поэтому в одном ответ меньше, в другом больше.',
      'These two figures share the side (six) but the work differs. In the equilateral triangle the hypotenuse is GIVEN (the side, six), so the squares are subtracted: thirty six minus nine is twenty seven. In the square two legs are given (the sides), so the squares are added: thirty six plus thirty six is seventy two. Hence one answer is smaller and the other larger.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har figurada bitta savol bering: to'g'ri burchak qayerda va uning tomonlari qanday uzunlikda? Uchburchak topilgandan keyin qolgani oddiy hisob.",
      'В каждой фигуре задай один вопрос: где прямой угол и какой длины его стороны? Когда треугольник найден, остальное — обычный счёт.',
      'Ask one question of every figure: where is the right angle and how long are its sides? Once the triangle is found the rest is plain arithmetic.') },
  ],
  wrongText: L(
    "Har figurada to'g'ri burchakli uchburchakni toping. Gipotenuza berilgan bo'lsa ayiring, katetlar berilgan bo'lsa qo'shing.",
    'В каждой фигуре найди прямоугольный треугольник. Дана гипотенуза — вычитай, даны катеты — складывай.',
    'Find the right triangle in every figure. If the hypotenuse is given, subtract; if the legs are given, add.'),
};

export default function D47_07(props) { return <MatchPairs data={DATA} {...props} />; }
