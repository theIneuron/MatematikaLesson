// Dars46 · Amaliyot 10 — Ha yoki yo'q · 🔴 · tag: heron_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 10-pozitsiya)
//
// JAVOB: YO'Q, YO'Q (skelet §0a.1). Ikkala da'vo ham yolg'on, lekin ular
// IKKI xil adashish — З97 va З98, — va bu ataylab: darsning ikki qoq xatosi
// bir ekranda yonma-yon turadi. Razbor har birini alohida SON bilan rad
// etadi.
//
// Ikkinchi da'voda balandlik `h(12)` ko'rinishida yozilgan: bu «o'n ikki
// tomoniga mos balandlik» degani. Pastki indeks ishlatilmadi — u ba'zi
// shriftlarda chizilmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'heron_claims', level: '🔴',
  itemSize: 15,
  given: [['9, 12, 15'], ['S = 54']],
  givenLabel: L('Uchburchak va uning yuzi', 'Треугольник и его площадь', 'The triangle and its area'),
  items: [
    { id: 's1', yes: false, tokens: ['p = a + b + c'],
      claim: L("yarim perimetrning ta'rifi shunday", 'таково определение полупериметра', 'such is the definition of the semi-perimeter') },
    { id: 's2', yes: false, tokens: ['h(12) > h(9)'],
      claim: L('shu uchburchakda shunday', 'так в этом треугольнике', 'so in this triangle') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Uchburchakning tomonlari to'qqiz, o'n ikki va o'n besh, yuzasi ellik to'rt. Ikkinchi da'voda h dan keyingi qavs ichidagi son tomonni ko'rsatadi: h o'n ikki — o'n ikki tomoniga mos balandlik.",
    'Стороны треугольника девять, двенадцать и пятнадцать, площадь пятьдесят четыре. Во втором утверждении число в скобках после h означает сторону: h от двенадцати — высота к стороне двенадцать.',
    'The sides of a triangle are nine, twelve and fifteen, its area fifty four. In the second claim the number in brackets after h names the side: h of twelve is the height to the side twelve.'),
  ask: L(
    "Da'vo to'g'ri bo'lsa «Ha» ni, xato bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ошибочно — «Нет».',
    'Tap «Yes» if the claim is right, «No» if it is wrong.'),
  correctText: L(
    "To'g'ri, ikkalasi ham yolg'on, va ular darsning ikki qoq xatosi. Birinchisi: yarim perimetr uchala tomonning yig'indisi EMAS, uning yarmi. Shu uchburchakda yig'indi o'ttiz olti, yarim perimetr esa o'n sakkiz. Ikkinchisi: katta tomonga KICHIK balandlik mos keladi. Sonlar bilan tekshiring — yuza ellik to'rt. O'n ikki tomoniga mos balandlik: ikki karra ellik to'rt bir yuz sakkiz, uni o'n ikkiga bo'lsak to'qqiz. To'qqiz tomoniga mos balandlik: bir yuz sakkizni to'qqizga bo'lsak o'n ikki. Ya'ni h o'n ikki to'qqizga, h to'qqiz esa o'n ikkiga teng — birinchisi ikkinchisidan KICHIK. Sabab oddiy: ko'paytma o'zgarmaydi, ya'ni asos o'sganda balandlik kamayadi.",
    'Верно, оба ложны, и это две главные ошибки урока. Первое: полупериметр — НЕ сумма трёх сторон, а её половина. В этом треугольнике сумма тридцать шесть, а полупериметр восемнадцать. Второе: большей стороне соответствует МЕНЬШАЯ высота. Проверь числами — площадь пятьдесят четыре. Высота к стороне двенадцать: дважды пятьдесят четыре — сто восемь, разделить на двенадцать — девять. Высота к стороне девять: сто восемь разделить на девять — двенадцать. То есть h от двенадцати равно девяти, а h от девяти — двенадцати, и первое МЕНЬШЕ второго. Причина проста: произведение не меняется, значит с ростом основания высота убывает.',
    'Correct, both are false, and they are the two chief errors of the lesson. The first: the semi-perimeter is NOT the sum of the three sides but half of it. In this triangle the sum is thirty six and the semi-perimeter eighteen. The second: the longer side matches the SMALLER height. Check with numbers — the area is fifty four. The height to the side twelve: twice fifty four is one hundred eight, divided by twelve is nine. The height to the side nine: one hundred eight divided by nine is twelve. So h of twelve is nine and h of nine is twelve, the first being SMALLER than the second. The reason is simple: the product does not change, so as the base grows the height shrinks.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'voda ikkiga bo'lish yo'q. Yarim perimetrning nomining o'zi shuni aytadi: u perimetrning YARMI. Bu uchburchakda to'qqiz qo'shuv o'n ikki qo'shuv o'n besh o'ttiz olti, ya'ni yarim perimetr o'n sakkiz. Geron formulasida bu farq halokatli: ayirmalar butunlay boshqa chiqadi va yuza xato bo'ladi.",
      'В первом утверждении нет деления на два. Само название полупериметра об этом и говорит: это ПОЛОВИНА периметра. В этом треугольнике девять плюс двенадцать плюс пятнадцать — тридцать шесть, значит полупериметр восемнадцать. В формуле Герона это различие губительно: разности выходят совсем другими, и площадь оказывается неверной.',
      'The first claim has no halving. The very name says it: the semi-perimeter is HALF the perimeter. In this triangle nine plus twelve plus fifteen is thirty six, so the semi-perimeter is eighteen. In Heron formula that difference is fatal: the differences come out entirely wrong and so does the area.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'voni sonlar bilan tekshiring. Yuza ellik to'rt, ya'ni ikkilangan yuza bir yuz sakkiz. O'n ikki tomoniga mos balandlik: bir yuz sakkizni o'n ikkiga bo'lsak to'qqiz. To'qqiz tomoniga mos balandlik: bir yuz sakkizni to'qqizga bo'lsak o'n ikki. Katta tomonga kichik balandlik tushdi — da'vo esa teskarisini aytadi. Sabab: yuza o'zgarmaydi, ya'ni asos bilan balandlikning ko'paytmasi ham o'zgarmaydi.",
      'Проверь второе утверждение числами. Площадь пятьдесят четыре, значит удвоенная площадь сто восемь. Высота к стороне двенадцать: сто восемь разделить на двенадцать — девять. Высота к стороне девять: сто восемь разделить на девять — двенадцать. Большей стороне досталась меньшая высота, а утверждение говорит наоборот. Причина: площадь не меняется, значит и произведение основания на высоту не меняется.',
      'Check the second claim with numbers. The area is fifty four, so twice the area is one hundred eight. The height to the side twelve: one hundred eight divided by twelve is nine. The height to the side nine: one hundred eight divided by nine is twelve. The longer side got the smaller height, while the claim says the opposite. The reason: the area does not change, so neither does the product of base and height.') },
  ],
  wrongText: L(
    "Har da'voni SON bilan tekshiring: yarim perimetrni hisoblang, va ikki balandlikni yuzadan chiqarib solishtiring.",
    'Проверяй каждое утверждение ЧИСЛОМ: посчитай полупериметр и найди две высоты через площадь.',
    'Test each claim with a NUMBER: compute the semi-perimeter, and find the two heights from the area.'),
};

export default function D46_10(props) { return <TrueFalse data={DATA} {...props} />; }
