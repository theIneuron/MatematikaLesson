// Dars41 · Amaliyot 02 — Guruhlar · 🟢 · tag: same_area_groups
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 2-pozitsiya)
//
// З85 JADVALDA KO'RINADI. Ikkiga bo'lmagan o'quvchi o'n ikkilik kartalarni
// yigirma to'rt guruhiga qo'yadi, yigirma to'rtliklariga esa joy topmaydi:
// qirq sakkiz degan guruh yo'q. Har guruhda `a` va `h` ning qiymatlari
// almashib turadi — masalan `a=8,h=6` va `a=6,h=8` bir guruhda, `a=8,h=3` va
// `a=3,h=8` ikkinchisida, — ya'ni bitta songa qarab ajratib bo'lmaydi.
// Kartalarda faqat BELGI turadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'same_area_groups', level: '🟢',
  zoneLbl: 104, zoneSize: 18, itemSize: 15,
  zones: [
    { id: 'z1', tokens: ['S = 24'] },
    { id: 'z2', tokens: ['S = 12'] },
  ],
  items: [
    { id: 'i1', tokens: ['a=8, h=6'], zone: 'z1' },
    { id: 'i2', tokens: ['a=6, h=4'], zone: 'z2' },
    { id: 'i3', tokens: ['a=12, h=4'], zone: 'z1' },
    { id: 'i4', tokens: ['a=4, h=6'], zone: 'z2' },
    { id: 'i5', tokens: ['a=16, h=3'], zone: 'z1' },
    { id: 'i6', tokens: ['a=3, h=8'], zone: 'z2' },
    { id: 'i7', tokens: ['a=6, h=8'], zone: 'z1' },
    { id: 'i8', tokens: ['a=8, h=3'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz uchburchakning asosi va balandligi berilgan. Ularning yuzi ikki xil chiqadi: bir qismi bir guruhga, qolgani ikkinchi guruhga tushadi.",
    'Даны основание и высота восьми треугольников. Их площади получаются двух видов: часть попадает в одну группу, остальные во вторую.',
    'The base and height of eight triangles are given. Their areas come out in two kinds: some fall into one group, the rest into the other.'),
  ask: L('Kartani bosing, keyin uning guruhini bosing.', 'Нажми карточку, потом её группу.', 'Tap a card, then tap its group.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Har kartada bitta ish bajariladi: asosni balandlikka ko'paytirib, natijani ikkiga bo'lish. Sakkiz karra olti qirq sakkiz, yarmi yigirma to'rt; olti karra to'rt yigirma to'rt, yarmi o'n ikki. Diqqat qiladigan joy — ko'paytirish tartibi hech narsani o'zgartirmaydi: olti karra sakkiz ham, sakkiz karra olti ham bitta ko'paytmani beradi, ya'ni bu ikki karta BIR guruhda turadi.",
    'Верно. С каждой карточкой делается одно: умножить основание на высоту и разделить надвое. Восемь на шесть — сорок восемь, половина двадцать четыре; шесть на четыре — двадцать четыре, половина двенадцать. На что стоит обратить внимание: порядок множителей ничего не меняет — шесть на восемь и восемь на шесть дают одно произведение, то есть эти две карточки стоят в ОДНОЙ группе.',
    'Correct. One thing is done with each card: multiply the base by the height and halve the result. Eight times six is forty eight, half is twenty four; six times four is twenty four, half is twelve. Worth noticing: the order of the factors changes nothing — six times eight and eight times six give the same product, so those two cards sit in the SAME group.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu kartalarda ko'paytma yigirma to'rt chiqadi, lekin yuza uning YARMI — o'n ikki. Olti karra to'rt yigirma to'rt, ikkiga bo'lsak o'n ikki. Ikkiga bo'lishni tashlab ketsangiz, yigirma to'rtlik guruhga to'rtta ortiqcha karta tushadi.",
      'У этих карточек произведение равно двадцати четырём, но площадь — его ПОЛОВИНА, двенадцать. Шесть на четыре — двадцать четыре, делим на два — двенадцать. Если пропустить деление, в группу двадцати четырёх попадут четыре лишние карточки.',
      'For these cards the product is twenty four, but the area is HALF of it, twelve. Six times four is twenty four, halved is twelve. Skip the halving and four extra cards land in the group of twenty four.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu kartalarda ko'paytma qirq sakkiz, yarmi esa yigirma to'rt. Sakkiz karra olti qirq sakkiz, ikkiga bo'lsak yigirma to'rt — ya'ni bu birinchi guruh. O'n ikki chiqishi uchun ko'paytma yigirma to'rt bo'lishi kerak edi.",
      'У этих карточек произведение сорок восемь, а половина двадцать четыре. Восемь на шесть — сорок восемь, делим на два — двадцать четыре, то есть это первая группа. Чтобы вышло двенадцать, произведение должно было быть двадцать четыре.',
      'For these cards the product is forty eight and half of it is twenty four. Eight times six is forty eight, halved is twenty four, so this is the first group. For twelve to come out the product would have to be twenty four.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Kartaning ko'rinishiga qaramang, hisoblang. Ikki sonni ko'paytiring, keyin ikkiga bo'ling — chiqqan son guruhning nomida turadi. Katta son ham kichik yuza berishi mumkin: asosi o'n olti, balandligi uch bo'lgan uchburchakning yuzi yigirma to'rt.",
      'Не смотри на вид карточки, считай. Перемножь два числа, потом раздели на два — полученное число и стоит в названии группы. Большое число тоже может дать маленькую площадь: у треугольника с основанием шестнадцать и высотой три площадь двадцать четыре.',
      'Do not judge by the look of the card, compute. Multiply the two numbers, then halve — the result is what the group name says. A large number can give a small area too: a triangle with base sixteen and height three has area twenty four.') },
  ],
  wrongText: L(
    "Har kartada asosni balandlikka ko'paytiring va natijani ikkiga bo'ling.",
    'В каждой карточке умножь основание на высоту и раздели результат на два.',
    'In every card multiply the base by the height and halve the result.'),
};

export default function D41_02(props) { return <Zones data={DATA} {...props} />; }
