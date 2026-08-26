// Dars46 · Amaliyot 04 — Pazl · 🟡 · tag: p_minus_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 4-pozitsiya)
//
// GERON FORMULASINING KO'PAYTUVCHILARI. Birinchi juftlikda yarim perimetr
// izlanadi, qolgan ikkitasida esa `p − a` ko'rinishidagi ayirma — formulaning
// eng ko'p buziladigan joyi.
//
// Uchinchi juftlikda ayirma juda kichik (to'rt): cho'zilgan uchburchakda
// shunday bo'ladi, va bu xato emas — aynan shu kichik ko'paytuvchi yuzani
// kichik qiladi.
// Kartalarda yozuv bo'shliqsiz (telefonda karta 54px, skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'p_minus_side', level: '🟡',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['17, 25, 26'] },
    { id: 'f2', side: 0, tokens: ['p=18, a=7'] },
    { id: 'f3', side: 0, tokens: ['p=36, c=32'] },
    { id: 'v1', side: 1, v: 'p = 34' },
    { id: 'v2', side: 1, v: 'p − a = 11' },
    { id: 'v3', side: 1, v: 'p − c = 4' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Geron formulasida to'rt ko'paytuvchi bor: yarim perimetr va uchta ayirma. Bu yerda birinchi kartada yarim perimetrning o'zi izlanadi, qolgan ikkitasida esa ayirma.",
    'В формуле Герона четыре множителя: полупериметр и три разности. Здесь в первой карточке ищется сам полупериметр, а в двух других разность.',
    'Heron formula has four factors: the semi-perimeter and three differences. Here the first card asks for the semi-perimeter itself, the other two for a difference.'),
  ask: L(
    'Shartni bosing, keyin uyani bosing.',
    'Нажми условие, потом ячейку.',
    'Tap a condition, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida yig'indi o'n yetti qo'shuv yigirma besh qo'shuv yigirma olti, ya'ni oltmish sakkiz; yarmi o'ttiz to'rt. Ikkinchisida ayirma: o'n sakkiz minus yetti o'n bir. Uchinchisida: o'ttiz olti minus o'ttiz ikki to'rt. Uchinchi ayirmaning kichikligi diqqatga sazovor: agar bir tomon yarim perimetrga juda yaqin bo'lsa, uchburchak cho'zilgan bo'ladi va uning yuzi kichik chiqadi — Geron formulasida bu ko'paytuvchi bo'lib turadi. Agar tomon yarim perimetrdan KATTA bo'lsa, bunday uchburchak umuman bo'lolmaydi.",
    'Верно. В первой сумма семнадцать плюс двадцать пять плюс двадцать шесть, то есть шестьдесят восемь; половина тридцать четыре. Во второй разность: восемнадцать минус семь — одиннадцать. В третьей: тридцать шесть минус тридцать два — четыре. Малость третьей разности примечательна: если сторона близка к полупериметру, треугольник вытянут и площадь его мала — в формуле Герона это стоит множителем. А если сторона БОЛЬШЕ полупериметра, такого треугольника не существует вовсе.',
    'Correct. In the first the sum is seventeen plus twenty five plus twenty six, that is sixty eight; half is thirty four. In the second the difference: eighteen minus seven is eleven. In the third: thirty six minus thirty two is four. The smallness of the third difference is worth noting: if a side is close to the semi-perimeter the triangle is stretched and its area comes out small — in Heron formula that sits as a factor. And if a side EXCEEDS the semi-perimeter, no such triangle exists at all.'),
  wrongs: [
    { when: (s) => s.mate.f1 && s.mate.f1 !== 'v1', text: L(
      "Birinchi kartada uchala TOMON berilgan, ya'ni izlanadigan narsa yarim perimetrning o'zi: o'n yetti qo'shuv yigirma besh qo'shuv yigirma olti oltmish sakkiz, yarmi o'ttiz to'rt. Bu kartada ayirma yo'q — ayirma uchun yarim perimetr allaqachon ma'lum bo'lishi kerak.",
      'В первой карточке даны все три СТОРОНЫ, значит искать надо сам полупериметр: семнадцать плюс двадцать пять плюс двадцать шесть — шестьдесят восемь, половина тридцать четыре. В этой карточке разности нет — для разности полупериметр должен быть уже известен.',
      'The first card gives all three SIDES, so the semi-perimeter itself is sought: seventeen plus twenty five plus twenty six is sixty eight, half is thirty four. There is no difference in this card — a difference needs the semi-perimeter already known.') },
    { when: (s) => s.mate.f2 === 'v3' || s.mate.f3 === 'v2', text: L(
      "Bu ikki natija almashib ketdi. Har birini alohida hisoblang: o'n sakkiz minus yetti o'n bir, o'ttiz olti minus o'ttiz ikki to'rt. Natijaning yozuvidagi harfga ham qarang: bittasida a ayriladi, ikkinchisida c.",
      'Эти два результата поменялись местами. Посчитай каждый отдельно: восемнадцать минус семь — одиннадцать, тридцать шесть минус тридцать два — четыре. Смотри и на букву в записи результата: в одном вычитается a, в другом c.',
      'These two results swapped places. Compute each on its own: eighteen minus seven is eleven, thirty six minus thirty two is four. Look at the letter in the result too: one subtracts a, the other c.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har kartada nima berilganini o'qing. Uchala tomon berilgan bo'lsa — yarim perimetr izlanadi. Yarim perimetr va bitta tomon berilgan bo'lsa — ayirma izlanadi, ya'ni yarim perimetrdan o'sha tomonni ayirish kerak.",
      'В каждой карточке читай, что дано. Даны все три стороны — ищется полупериметр. Даны полупериметр и одна сторона — ищется разность, то есть из полупериметра надо вычесть эту сторону.',
      'Read what each card gives. All three sides mean the semi-perimeter is sought. A semi-perimeter and one side mean a difference is sought: subtract that side from the semi-perimeter.') },
  ],
  wrongText: L(
    "Uchala tomon berilsa — yig'indini ikkiga bo'ling. Yarim perimetr va tomon berilsa — ayiring.",
    'Даны три стороны — раздели сумму на два. Даны полупериметр и сторона — вычти.',
    'Three sides given: halve the sum. A semi-perimeter and a side given: subtract.'),
};

export default function D46_04(props) { return <PairSlots data={DATA} {...props} />; }
