// Dars48 · Amaliyot 09 — Pazl · 🔴 · tag: arc_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 9-pozitsiya)
//
// UCH JUFTLIK, UCH XIL YO'NALISH:
//   ∠O = 75°  -> ⌒ = 285°   (burchakdan KATTA yoyga: ayirish)
//   ⌒ = 200°  -> ∠O = 160°  (katta yoydan burchakka: ayirish)
//   ⌒ = 140°  -> ∠O = 140°  (kichik yoydan burchakka: TENGLIK)
// Uchinchi juftlik tuzoq: yoy 180 dan kichik, ya'ni ayirish KERAK EMAS.
// «Har doim ayirish» degan odat aynan shu yerda buziladi (З103 ning teskarisi).
// `⌒` belgisi uch tilda bir xil o'qiladi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'arc_pairs', level: '🔴',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['∠O = 75°'] },
    { id: 'f2', side: 0, tokens: ['⌒ = 200°'] },
    { id: 'f3', side: 0, tokens: ['⌒ = 140°'] },
    { id: 'v1', side: 1, v: '⌒ = 285°' },
    { id: 'v2', side: 1, v: '∠O = 160°' },
    { id: 'v3', side: 1, v: '∠O = 140°' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Oltita karta. Birinchi shartda markaziy burchak berilgan va KATTA yoy izlanadi; qolgan ikkitasida yoy berilgan va markaziy burchak izlanadi. Yoyning o'lchoviga qarab yo'l boshqa bo'ladi.",
    'Шесть карточек. В первом условии дан центральный угол и ищется БОЛЬШАЯ дуга; в двух других дана дуга и ищется центральный угол. Путь зависит от меры дуги.',
    'Six cards. The first condition gives a central angle and asks for the MAJOR arc; the other two give an arc and ask for the central angle. The route depends on the measure of the arc.'),
  ask: L(
    'Shartni bosing, keyin uyani bosing.',
    'Нажми условие, потом ячейку.',
    'Tap a condition, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida burchak yetmish besh, katta yoy esa uch yuz oltmish minus yetmish besh, ya'ni ikki yuz sakson besh. Ikkinchisida yoy ikki yuz — bu bir yuz saksondan KATTA, demak u katta yoy va markaziy burchak uch yuz oltmish minus ikki yuz, ya'ni bir yuz oltmish. Uchinchisida esa yoy bir yuz qirq — bu bir yuz saksondan KICHIK, demak u kichik yoy va markaziy burchak unga TENG: bir yuz qirq. Bu yerda hech narsa ayirilmaydi. Ikki qoidani ajratadigan narsa bitta: yoy yarim aylanadan kichikmi yoki kattami.",
    'Верно. В первом угол семьдесят пять, а большая дуга — триста шестьдесят минус семьдесят пять, то есть двести восемьдесят пять. Во втором дуга двести — это БОЛЬШЕ ста восьмидесяти, значит она большая, и центральный угол равен триста шестьдесят минус двести, то есть сто шестьдесят. А в третьем дуга сто сорок — это МЕНЬШЕ ста восьмидесяти, значит она малая, и центральный угол РАВЕН ей: сто сорок. Здесь ничего не вычитается. Два правила различает одно: меньше дуга полуокружности или больше.',
    'Correct. In the first the angle is seventy five, so the major arc is three hundred sixty minus seventy five, that is two hundred eighty five. In the second the arc is two hundred — GREATER than one hundred eighty, so it is a major arc and the central angle is three hundred sixty minus two hundred, that is one hundred sixty. In the third the arc is one hundred forty — LESS than one hundred eighty, so it is a minor arc and the central angle EQUALS it: one hundred forty. Nothing is subtracted here. One thing separates the two rules: whether the arc is less or greater than a semicircle.'),
  wrongs: [
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Uchinchi shartda yoy bir yuz qirq gradus, ya'ni bir yuz saksondan KICHIK. Bunday yoy kichik yoy, va uning o'lchovi markaziy burchakka to'g'ridan-to'g'ri teng — ayirish kerak emas. Agar ayirsangiz, ikki yuz yigirma chiqadi, va bu markaziy burchak bo'lolmaydi: burchak bir yuz saksondan oshmaydi.",
      'В третьем условии дуга сто сорок градусов, то есть МЕНЬШЕ ста восьмидесяти. Такая дуга малая, и её мера равна центральному углу напрямую — вычитать не надо. Если вычесть, выйдет двести двадцать, а центральным углом это быть не может: угол не превышает ста восьмидесяти.',
      'In the third condition the arc is one hundred forty degrees, LESS than one hundred eighty. Such an arc is minor and its measure equals the central angle directly — no subtraction. Subtracting would give two hundred twenty, which cannot be a central angle: an angle never exceeds one hundred eighty.') },
    { when: (s) => s.mate.f1 && s.mate.f1 !== 'v1', text: L(
      "Birinchi shartda BURCHAK berilgan va KATTA yoy so'ralgan, ya'ni javob uch yuz oltmish minus yetmish besh. Ikki yuz sakson besh — bu yoy, burchak emas: markaziy burchak bunchalik katta bo'lolmaydi. Javob kartalarining yozuvi ham buni aytadi: bittasida yoy belgisi, ikkitasida burchak belgisi.",
      'В первом условии дан УГОЛ и спрашивается БОЛЬШАЯ дуга, значит ответ — триста шестьдесят минус семьдесят пять. Двести восемьдесят пять — это дуга, а не угол: центральный угол таким большим быть не может. Записи на карточках ответов об этом и говорят: на одной знак дуги, на двух знак угла.',
      'The first condition gives an ANGLE and asks for the MAJOR arc, so the answer is three hundred sixty minus seventy five. Two hundred eighty five is an arc, not an angle: a central angle cannot be that large. The answer cards say so too: one carries the arc sign, two the angle sign.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har kartada ikki savolga javob bering: nima berilgan (burchakmi yoki yoy) va yoy bir yuz saksondan kichikmi. Kichik yoy bilan burchak TENG, katta yoy bilan esa ayirish bajariladi.",
      'В каждой карточке ответь на два вопроса: что дано (угол или дуга) и меньше ли дуга ста восьмидесяти. С малой дугой угол РАВЕН ей, с большой выполняется вычитание.',
      'Answer two questions in every card: what is given (an angle or an arc) and whether the arc is under one hundred eighty. With a minor arc the angle EQUALS it; with a major one a subtraction is done.') },
  ],
  wrongText: L(
    "Yoyni 180 bilan solishtiring: kichik bo'lsa burchak unga teng, katta bo'lsa 360 dan ayiriladi.",
    'Сравни дугу со 180: меньше — угол равен ей, больше — вычитается из 360.',
    'Compare the arc with 180: less means the angle equals it, greater means subtracting from 360.'),
};

export default function D48_09(props) { return <PairSlots data={DATA} {...props} />; }
