// Dars46 · Amaliyot 05 — Juftlash · 🟡 · tag: sides_to_area
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 5-pozitsiya)
//
// TO'RT UCHBURCHAK, GERON FORMULASI BILAN:
//   10, 17, 21 -> p=24, 24·14·7·3 = 7056,  S = 84
//   9, 12, 15  -> p=18, 18·9·6·3  = 2916,  S = 54   (to'g'ri burchakli!)
//   25, 29, 6  -> p=30, 30·5·1·24 = 3600,  S = 60   (cho'zilgan)
//   45, 39, 12 -> p=48, 48·3·9·36 = 46656, S = 216
//
// PERIMETR BO'YICHA TARTIBLAB BO'LMAYDI, va bu ataylab: 25, 29, 6 ning
// perimetri 10, 17, 21 dan KATTA, yuzasi esa KICHIK — u cho'zilgan.
// Ikkinchi uchburchak to'g'ri burchakli, ya'ni javobni 41-darsning formulasi
// bilan ham tekshirish mumkin: yarim o'n ikki karra to'qqiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'sides_to_area', level: '🟡',
  connect: true,
  targetSize: 17, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['10, 17, 21'] },
    { id: 'm2', tokens: ['9, 12, 15'] },
    { id: 'm3', tokens: ['25, 29, 6'] },
    { id: 'm4', tokens: ['45, 39, 12'] },
  ],
  targets: [
    { id: 't1', tokens: ['S = 84'] },
    { id: 't2', tokens: ['S = 54'] },
    { id: 't3', tokens: ['S = 60'] },
    { id: 't4', tokens: ['S = 216'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt uchburchakning uchala tomoni berilgan, yuzalari esa o'ngda. Yuza Geron formulasi bilan topiladi: yarim perimetr va uchta ayirmaning ko'paytmasidan ildiz chiqariladi.",
    'Даны все три стороны четырёх треугольников, а площади справа. Площадь находится по формуле Герона: из произведения полупериметра и трёх разностей извлекается корень.',
    'All three sides of four triangles are given, with the areas on the right. The area comes from Heron formula: take the root of the product of the semi-perimeter and the three differences.'),
  ask: L(
    "Chapdan uchburchakni bosing, keyin o'ngdan uning yuzasini bosing.",
    'Нажми треугольник слева, потом его площадь справа.',
    'Tap a triangle on the left, then its area on the right.'),
  correctText: L(
    "To'g'ri. Birinchisi: yarim perimetr yigirma to'rt, ayirmalar o'n to'rt, yetti va uch; ko'paytma 7056, ildizi sakson to'rt. Ikkinchisi: yarim perimetr o'n sakkiz, ayirmalar to'qqiz, olti va uch; ko'paytma 2916, ildizi ellik to'rt. Bu uchburchak to'g'ri burchakli (to'qqiz, o'n ikki, o'n besh), ya'ni javobni osonroq yo'l bilan ham tekshirish mumkin: to'qqiz karra o'n ikki ning yarmi ellik to'rt. Uchinchisi: yarim perimetr o'ttiz, ayirmalar besh, bir va yigirma to'rt; ko'paytma 3600, ildizi oltmish. Diqqat qiladigan joy: uchinchi uchburchakning perimetri birinchisidan KATTA (oltmish va qirq sakkiz), yuzasi esa KICHIK — u juda cho'zilgan, va bir ayirmasi bittaga teng. Ya'ni yuzani perimetr bo'yicha taxmin qilib bo'lmaydi.",
    'Верно. Первый: полупериметр двадцать четыре, разности четырнадцать, семь и три; произведение 7056, корень восемьдесят четыре. Второй: полупериметр восемнадцать, разности девять, шесть и три; произведение 2916, корень пятьдесят четыре. Этот треугольник прямоугольный (девять, двенадцать, пятнадцать), значит ответ можно проверить и проще: половина от девяти на двенадцать — пятьдесят четыре. Третий: полупериметр тридцать, разности пять, один и двадцать четыре; произведение 3600, корень шестьдесят. На что стоит обратить внимание: у третьего треугольника периметр БОЛЬШЕ, чем у первого (шестьдесят и сорок восемь), а площадь МЕНЬШЕ — он сильно вытянут, и одна разность равна единице. То есть по периметру площадь не угадать.',
    'Correct. The first: semi-perimeter twenty four, differences fourteen, seven and three; the product 7056, the root eighty four. The second: semi-perimeter eighteen, differences nine, six and three; the product 2916, the root fifty four. That triangle is right-angled (nine, twelve, fifteen), so the answer can be checked more simply: half of nine times twelve is fifty four. The third: semi-perimeter thirty, differences five, one and twenty four; the product 3600, the root sixty. Worth noticing: the third triangle has a LARGER perimeter than the first (sixty against forty eight) yet a SMALLER area — it is very stretched and one difference equals one. So the area cannot be guessed from the perimeter.'),
  wrongs: [
    { when: (s) => s.pair.m3 === 't1' || s.pair.m1 === 't3', text: L(
      "Bu ikki juftlik almashib ketdi, va sabab perimetrda: uchinchi uchburchakning perimetri kattaroq bo'lgani uchun uning yuzi ham kattaroq bo'ladi deb o'ylash oson. Aslida teskari: yigirma besh, yigirma to'qqiz, olti uchburchagi juda cho'zilgan, uning ayirmalari besh, bir va yigirma to'rt — bir ayirmaning bittaga tengligi ko'paytmani va yuzani kichraytiradi. Ikkalasini alohida hisoblang.",
      'Эти две пары поменялись местами, и причина в периметре: у третьего треугольника периметр больше, и легко подумать, что и площадь больше. На самом деле наоборот: треугольник двадцать пять, двадцать девять, шесть сильно вытянут, его разности пять, один и двадцать четыре — единица среди разностей уменьшает и произведение, и площадь. Посчитай оба отдельно.',
      'These two pairs were swapped, and the perimeter is the reason: the third triangle has the larger perimeter, so it is easy to assume the larger area. In fact the opposite: the triangle twenty five, twenty nine, six is very stretched, its differences being five, one and twenty four — a difference of one shrinks both the product and the area. Compute the two separately.') },
    { when: (s) => s.pair.m2 && s.pair.m2 !== 't2', text: L(
      "Ikkinchi uchburchak to'g'ri burchakli: to'qqiz, o'n ikki, o'n besh — bu tanish uchlik. Uning yuzini Geron formulasidan tashqari 41-darsning formulasi bilan ham topish mumkin: katetlar to'qqiz va o'n ikki, ya'ni yuza to'qqiz karra o'n ikki ning yarmi, ellik to'rt. Ikki yo'l bir xil javob beradi.",
      'Второй треугольник прямоугольный: девять, двенадцать, пятнадцать — знакомая тройка. Его площадь можно найти не только по формуле Герона, но и формулой урока 41: катеты девять и двенадцать, значит площадь — половина от девяти на двенадцать, пятьдесят четыре. Два пути дают один ответ.',
      'The second triangle is right-angled: nine, twelve, fifteen — the familiar triple. Its area can be found not only by Heron formula but by the formula of lesson 41: the legs are nine and twelve, so the area is half of nine times twelve, fifty four. Two routes give one answer.') },
    { when: (s) => s.pair.m4 && s.pair.m4 !== 't4', text: L(
      "To'rtinchi uchburchak eng kattasi: yarim perimetr qirq sakkiz, ayirmalar uch, to'qqiz va o'ttiz olti. Ko'paytma 46656, ildizi ikki yuz o'n olti. Bu uchburchakning tomonlari o'n beshning uchligiga o'xshaydi: qirq besh, o'ttiz to'qqiz, o'n ikki — uchtasi ham uchga bo'linadi.",
      'Четвёртый треугольник самый большой: полупериметр сорок восемь, разности три, девять и тридцать шесть. Произведение 46656, корень двести шестнадцать. Стороны этого треугольника все делятся на три: сорок пять, тридцать девять, двенадцать.',
      'The fourth triangle is the largest: semi-perimeter forty eight, differences three, nine and thirty six. The product is 46656 and the root two hundred sixteen. All its sides divide by three: forty five, thirty nine, twelve.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har uchburchakda to'rt qadam: yarim perimetrni topish, uchta ayirmani chiqarish, to'rttasini ko'paytirish, ildizni chiqarish. Perimetrga qarab tartiblab bo'lmaydi — cho'zilgan uchburchakning yuzi kichik bo'ladi.",
      'В каждом треугольнике четыре шага: найти полупериметр, взять три разности, перемножить все четыре, извлечь корень. По периметру упорядочить нельзя — у вытянутого треугольника площадь мала.',
      'Four steps in every triangle: find the semi-perimeter, take the three differences, multiply all four, take the root. Ordering by perimeter does not work — a stretched triangle has a small area.') },
  ],
  wrongText: L(
    "Har uchburchak uchun yarim perimetr va uchta ayirmani chiqarib ko'paytiring, keyin ildiz oling.",
    'Для каждого треугольника найди полупериметр и три разности, перемножь, потом извлеки корень.',
    'For every triangle find the semi-perimeter and the three differences, multiply, then take the root.'),
};

export default function D46_05(props) { return <MatchPairs data={DATA} {...props} />; }
