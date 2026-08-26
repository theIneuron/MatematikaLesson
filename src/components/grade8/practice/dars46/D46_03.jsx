// Dars46 · Amaliyot 03 — Guruhlar · 🟢 · tag: same_p_groups
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 3-pozitsiya)
//
// Guruhlarning nomi YARIM PERIMETR: yigirma bir va o'ttiz. Perimetrlar esa
// qirq ikki va oltmish, ya'ni ikkiga bo'lmagan o'quvchi guruh nomiga hech
// qachon tushmaydi (З97).
//
// Kartalarning ko'rinishi turlicha: teng yonli, teng tomonli, cho'zilgan —
// yig'indi bir xil bo'lishi SHAKLDAN ko'rinmaydi, faqat hisobdan.
// Kartalarda faqat BELGI turadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'same_p_groups', level: '🟢',
  zoneLbl: 104, zoneSize: 18, itemSize: 14,
  zones: [
    { id: 'z1', tokens: ['p = 21'] },
    { id: 'z2', tokens: ['p = 30'] },
  ],
  items: [
    { id: 'i1', tokens: ['12, 15, 15'], zone: 'z1' },
    { id: 'i2', tokens: ['25, 25, 10'], zone: 'z2' },
    { id: 'i3', tokens: ['6, 16, 20'], zone: 'z1' },
    { id: 'i4', tokens: ['20, 20, 20'], zone: 'z2' },
    { id: 'i5', tokens: ['10, 14, 18'], zone: 'z1' },
    { id: 'i6', tokens: ['17, 18, 25'], zone: 'z2' },
    { id: 'i7', tokens: ['9, 15, 18'], zone: 'z1' },
    { id: 'i8', tokens: ['11, 24, 25'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz uchburchakning tomonlari berilgan. Ularning yarim perimetri ikki xil chiqadi. Yarim perimetr uchala tomonning yig'indisining yarmiga teng.",
    'Даны стороны восьми треугольников. Их полупериметры получаются двух видов. Полупериметр равен половине суммы всех трёх сторон.',
    'The sides of eight triangles are given. Their semi-perimeters come out in two kinds. The semi-perimeter equals half the sum of all three sides.'),
  ask: L('Kartani bosing, keyin uning guruhini bosing.', 'Нажми карточку, потом её группу.', 'Tap a card, then tap its group.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi guruhning perimetri qirq ikki, yarmi yigirma bir: o'n ikki qo'shuv o'n besh qo'shuv o'n besh; olti qo'shuv o'n olti qo'shuv yigirma; o'n qo'shuv o'n to'rt qo'shuv o'n sakkiz; to'qqiz qo'shuv o'n besh qo'shuv o'n sakkiz. Ikkinchi guruhning perimetri oltmish, yarmi o'ttiz. Uchburchaklarning SHAKLI juda boshqa: bittasi teng tomonli, bittasi teng yonli, bittasi esa cho'zilgan — olti, o'n olti, yigirma. Yig'indi esa bir xil. Ya'ni yarim perimetr uchburchakning shakliga umuman bog'liq emas, faqat tomonlarning yig'indisiga.",
    'Верно. У первой группы периметр сорок два, половина двадцать один: двенадцать плюс пятнадцать плюс пятнадцать; шесть плюс шестнадцать плюс двадцать; десять плюс четырнадцать плюс восемнадцать; девять плюс пятнадцать плюс восемнадцать. У второй группы периметр шестьдесят, половина тридцать. ФОРМА треугольников очень разная: один равносторонний, один равнобедренный, один вытянутый — шесть, шестнадцать, двадцать. А сумма одинаковая. То есть полупериметр от формы треугольника не зависит вовсе, только от суммы сторон.',
    'Correct. The first group has perimeter forty two and half of it twenty one: twelve plus fifteen plus fifteen; six plus sixteen plus twenty; ten plus fourteen plus eighteen; nine plus fifteen plus eighteen. The second group has perimeter sixty and half of it thirty. The SHAPES of the triangles differ greatly: one equilateral, one isosceles, one stretched — six, sixteen, twenty. Yet the sum is the same. So the semi-perimeter does not depend on the shape of the triangle at all, only on the sum of the sides.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu kartalarning yig'indisi qirq ikki, yarmi esa yigirma bir. Yig'indini hisoblab, keyin ikkiga bo'ling. Agar yig'indining o'zi bilan qolsangiz, guruhlar orasida hech qanday moslik topilmaydi: jadvalda qirq ikki ham, oltmish ham yo'q.",
      'У этих карточек сумма сорок два, а половина двадцать один. Посчитай сумму, потом раздели на два. Если остаться с самой суммой, соответствия с группами не найдётся: ни сорока двух, ни шестидесяти в названиях нет.',
      'These cards sum to forty two and half of that is twenty one. Compute the sum, then halve it. If you stop at the sum itself no group matches: neither forty two nor sixty appears in the names.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu kartalarning yig'indisi oltmish, yarmi o'ttiz. Teng tomonli uchburchakni tekshirish oson: yigirma karra uch oltmish, yarmi o'ttiz. Qolgan uchtasi ham xuddi shu yig'indini beradi, garchi tomonlari boshqa bo'lsa ham.",
      'У этих карточек сумма шестьдесят, половина тридцать. Равносторонний треугольник проверить легко: двадцать на три — шестьдесят, половина тридцать. Остальные три дают ту же сумму, хотя стороны у них другие.',
      'These cards sum to sixty and half of that is thirty. The equilateral one is easy to check: twenty times three is sixty, half is thirty. The other three give the same sum although their sides differ.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada bir xil ish: uchala sonni qo'shib, natijani ikkiga bo'lish. Uchburchakning shakliga qaramang — teng tomonli va cho'zilgan uchburchak bir guruhda bo'lishi mumkin.",
      'В каждой карточке одно и то же: сложить три числа и разделить результат на два. Не смотри на форму треугольника — равносторонний и вытянутый могут оказаться в одной группе.',
      'The same work in every card: add the three numbers and halve the result. Do not look at the shape of the triangle — an equilateral and a stretched one may share a group.') },
  ],
  wrongText: L(
    "Uchala tomonni qo'shib ikkiga bo'ling. Guruhning nomida yarim perimetr turadi, perimetr emas.",
    'Сложи три стороны и раздели на два. В названии группы стоит полупериметр, а не периметр.',
    'Add the three sides and halve. The group name holds the semi-perimeter, not the perimeter.'),
};

export default function D46_03(props) { return <Zones data={DATA} {...props} />; }
