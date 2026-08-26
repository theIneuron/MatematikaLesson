// Dars40 · Amaliyot 06 — Pazl · 🟡 · tag: base_to_height
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 6-pozitsiya)
//
// BITTA FIGURA, YUZI 24. Uch asos — uch balandlik:
//   a=6 -> h=4 ; a=8 -> h=3 ; a=12 -> h=2
// T3 va З84 birga: asos o'zgarsa balandlik ham o'zgaradi, YUZA esa
// o'zgarmaydi. Uchta juftlikning ko'paytmasi bir xil — yigirma to'rt.
//
// Kartalarda yozuv bo'shliqsiz (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'base_to_height', level: '🟡',
  faceSize: 14, faceSizePhone: 12,
  given: [['S = 24']],
  givenLabel: L('Yuza', 'Площадь', 'The area'),
  cards: [
    { id: 'f1', side: 0, tokens: ['a=6'] },
    { id: 'f2', side: 0, tokens: ['a=8'] },
    { id: 'f3', side: 0, tokens: ['a=12'] },
    { id: 'v1', side: 1, v: 'h=4' },
    { id: 'v2', side: 1, v: 'h=3' },
    { id: 'v3', side: 1, v: 'h=2' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Bitta parallelogramm, uning yuzi yigirma to'rt kvadrat santimetr. Uch xil tomon asos qilib olindi. Har asosga o'z balandligini topish kerak.",
    'Один параллелограмм, его площадь двадцать четыре квадратных сантиметра. За основание брали три разные стороны. К каждому основанию надо найти свою высоту.',
    'One parallelogram with an area of twenty-four square centimetres. Three different sides were taken as the base in turn. For each base its own height must be found.'),
  ask: L(
    'Asosni bosing, keyin uyani bosing.',
    'Нажми основание, потом ячейку.',
    'Tap a base, then a slot.'),
  bank: L('Asoslar', 'Основания', 'Bases'),
  correctText: L(
    "To'g'ri. Yuza o'zgarmaydi — u figuraning xossasi, tanlangan asosniki emas. Shuning uchun har juftlikning ko'paytmasi yigirma to'rt bo'lishi kerak: olti karra to'rt, sakkiz karra uch, o'n ikki karra ikki. Naqsh ko'rinib turibdi: asos qanchalik uzun bo'lsa, unga mos balandlik shunchalik qisqa. Buni tasavvur qilish oson — uzun tomonni pastga qo'yib figurani yotqizsangiz, u yassi bo'lib ko'rinadi; qisqa tomonni pastga qo'ysangiz esa u tik bo'lib ko'rinadi. Figura o'zgarmadi, faqat unga qaysi tomondan qarash o'zgardi, va yuza ham o'zgarmadi.",
    'Верно. Площадь не меняется — это свойство фигуры, а не выбранного основания. Поэтому произведение в каждой паре должно давать двадцать четыре: шестью четыре, восемью три, двенадцать на два. Закономерность видна: чем длиннее основание, тем короче соответствующая высота. Это легко представить — положи фигуру на длинную сторону, и она покажется приплюснутой; положи на короткую, и она покажется высокой. Фигура не изменилась, изменилось лишь то, с какой стороны на неё смотрят, и площадь тоже не изменилась.',
    'Correct. The area does not change — it is a property of the figure, not of the chosen base. So the product in each pair must give twenty-four: six times four, eight times three, twelve times two. The pattern is visible: the longer the base, the shorter its matching height. It is easy to picture — set the figure on its long side and it looks flat; set it on the short one and it looks tall. The figure did not change, only the side you look from did, and the area did not change either.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Eng uzun asosga eng qisqa balandlik to'g'ri keladi. O'n ikkini nechaga ko'paytirsak yigirma to'rt chiqadi — ikkiga. Naqshni eslab qoling: asos ikki barobar uzaysa, balandlik ikki barobar qisqaradi, chunki ularning ko'paytmasi o'zgarmasligi kerak. Boshqa juftliklar bilan solishtiring: olti va to'rt, sakkiz va uch, o'n ikki va ikki.",
      'Самому длинному основанию отвечает самая короткая высота. На что умножить двенадцать, чтобы вышло двадцать четыре, — на два. Запомни закономерность: если основание вдвое длиннее, высота вдвое короче, ведь их произведение должно остаться прежним. Сравни с другими парами: шесть и четыре, восемь и три, двенадцать и два.',
      'The longest base takes the shortest height. Twelve times what gives twenty-four — two. Remember the pattern: if the base doubles, the height halves, since their product must stay the same. Compare with the other pairs: six and four, eight and three, twelve and two.') },
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Bu ikki javob almashib ketdi. Har birini ko'paytirib tekshiring: olti karra uch o'n sakkiz — yigirma to'rt emas; sakkiz karra to'rt o'ttiz ikki — yana yigirma to'rt emas. To'g'ri juftlikda ko'paytma AYNAN yuzani berishi kerak. Ko'paytirish har javobni bir sekundda tekshiradi.",
      'Эти два ответа поменялись местами. Проверь каждый умножением: шестью три восемнадцать — не двадцать четыре; восемью четыре тридцать два — тоже не двадцать четыре. В верной паре произведение должно дать РОВНО площадь. Умножение проверяет каждый ответ за секунду.',
      'These two answers were swapped. Check each by multiplying: six times three is eighteen — not twenty-four; eight times four is thirty-two — not twenty-four either. In the right pair the product must give EXACTLY the area. Multiplying checks every answer in a second.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Eng qisqa asosga eng uzun balandlik to'g'ri keladi: oltini to'rtga ko'paytirsak yigirma to'rt chiqadi. Bu g'alati emas — asos qisqa bo'lsa, o'sha yuzani berish uchun figura balandroq bo'lishi kerak. Ko'paytma har doim o'zgarmaydi, chunki u figuraning yuzasi.",
      'Самому короткому основанию отвечает самая длинная высота: шестью четыре двадцать четыре. Это не странно — при коротком основании фигура должна быть выше, чтобы дать ту же площадь. Произведение всегда остаётся прежним, ведь это площадь фигуры.',
      'The shortest base takes the longest height: six times four is twenty-four. That is nothing odd — with a short base the figure must be taller to give the same area. The product always stays the same, since it is the area of the figure.') },
  ],
  wrongText: L(
    "Har juftlikning ko'paytmasi yuzaga teng bo'lishi kerak. Asos uzaysa, balandlik qisqaradi — yuza esa o'zgarmaydi.",
    'Произведение в каждой паре должно равняться площади. Основание длиннее — высота короче, а площадь не меняется.',
    'The product in each pair must equal the area. A longer base means a shorter height — and the area does not change.'),
};

export default function D40_06(props) { return <PairSlots data={DATA} {...props} />; }
