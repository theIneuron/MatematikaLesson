// Dars14 · Amaliyot 07 — Aniq va yaqin · 🟡 · tag: exact_and_near · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 7-pozitsiya), §2
//
// BU DARSNING YAGONA CHIZMASI (skelet §2). Sabab: darsning mavzusi yozuvi
// tugamaydigan son, va so'z bilan aytilganda bu «yo'q narsa» bo'lib
// ko'rinadi. Son o'qida esa nuqta BOR — u bir va ikki orasida, `?` bilan
// belgilangan. Yaqinlashish o'sha nuqtaning QO'SHNISI, o'zi emas (З37).
// Chizma `given` qatorida turadi: u yozuvning bo'lagi, yangi mexanika emas.
//
// Uch juftlikda tuzoq bitta: yaqinlashishlarni «kattaligi bo'yicha»
// taxminlash. Har razbor kvadratga oshirib rad etadi — bir butun qirq bir
// ning kvadrati ikkiga yaqin, ikki butun yigirma uch ning kvadrati beshga.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'exact_and_near', level: '🟡',
  faceSize: 13,
  given: [[{ fig: 'axis', from: 1, to: 2, step: 0.5, w: 150, h: 46, marks: [{ at: 1.4142, q: true }] }]],
  givenLabel: L("Ikkidan ildiz", 'Корень из двух', 'The root of two'),
  cards: [
    { id: 'f1', side: 0, tokens: [{ r: '2' }] },
    { id: 'f2', side: 0, tokens: [{ r: '5' }] },
    { id: 'f3', side: 0, tokens: [{ r: '10' }] },
    { id: 'v1', side: 1, v: '1,41…' },
    { id: 'v2', side: 1, v: '2,23…' },
    { id: 'v3', side: 1, v: '3,16…' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Aniq va yaqin', 'Точное и близкое', 'Exact and near'),
  setup: L(
    "Yuqoridagi o'qda ikkidan ildizning joyi savol belgisi bilan turadi: yozuvi tugamaydi, lekin nuqtasi bor. Pastda uch ildiz va ularning yaqinlashishlari.",
    'На оси сверху место корня из двух отмечено знаком вопроса: запись не заканчивается, но точка есть. Снизу три корня и их приближения.',
    'On the axis above, the place of the root of two is marked with a question mark: its record never ends, yet the point is there. Below are three roots and their approximations.'),
  ask: L(
    "Ildizni bosing, keyin uyani bosing. Har ildiz o'z yaqinlashishi bilan juftlanadi.",
    'Нажми корень, потом ячейку. Каждый корень встаёт в пару со своим приближением.',
    'Tap a root, then a slot. Each root pairs with its own approximation.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  // RAZBOR QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — chizma va uch
  // juftlik ustiga uzun razbor kelib, telefonda 39px panel ostida qolardi.
  correctText: L(
    "To'g'ri. Har juftlikni kvadratga oshirib tekshirdingiz: bir butun qirq bir ning kvadrati ikkiga yaqin, ikki butun yigirma uch ning kvadrati beshga, uch butun o'n olti ning kvadrati o'nga. Hech biri ANIQ chiqmadi, chiqishi ham mumkin emas — shuning uchun yozuvda uch nuqta turadi. Yaqinlashish o'qda qo'shni nuqta, ildizning o'zi emas.",
    'Верно. Каждую пару ты проверил возведением в квадрат: один и сорок один в квадрате близко к двум, два и двадцать три — к пяти, три и шестнадцать — к десяти. Ни одно не вышло ТОЧНО, и выйти не может — потому в записи и стоит троеточие. Приближение — соседняя точка на оси, а не сам корень.',
    'Correct. You checked each pair by squaring: one point four one squared is close to two, two point two three to five, three point one six to ten. None came out EXACTLY, and none can — that is why the records end in dots. An approximation is a neighbouring point on the axis, not the root itself.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ikki yaqinlashish o'rin almashdi. Kvadratga oshirib tekshiring: bir butun qirq bir ning kvadrati ikkiga yaqin, ikki butun yigirma uch ning kvadrati esa beshga yaqin. Yaqinlashishni ham xuddi aniq javobdek tekshirish mumkin — kvadratga oshirib.",
      'Два приближения поменялись местами. Проверь возведением в квадрат: один и сорок один в квадрате близко к двум, а два и двадцать три в квадрате близко к пяти. Приближение проверяется так же, как точный ответ — возведением в квадрат.',
      'Two approximations swapped places. Check by squaring: one point four one squared is close to two, while two point two three squared is close to five. An approximation is checked just like an exact answer — by squaring.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "O'ndan ildiz eng kattasi: uchning kvadrati to'qqiz, to'rtning kvadrati o'n olti, demak u uch va to'rt orasida turadi. Uch butun o'n olti aynan shu oraliqda. Bir butun qirq bir va ikki butun yigirma uch esa uchdan kichik.",
      'Корень из десяти самый большой: три в квадрате девять, четыре в квадрате шестнадцать, значит он между тремя и четырьмя. Три и шестнадцать как раз в этом промежутке. А один и сорок один и два и двадцать три меньше трёх.',
      'The root of ten is the biggest: three squared is nine, four squared is sixteen, so it lies between three and four. Three point one six is exactly in that range. One point four one and two point two three are both below three.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Kattaliklar almashdi. Har ildizni ikki butun son orasiga qo'yib ko'ring: ikkidan ildiz bir va ikki orasida, beshdan ildiz ikki va uch orasida, o'ndan ildiz uch va to'rt orasida. Chizmada aynan shu ko'rinadi — savol belgisi bir va ikki oralig'ida turadi.",
      'Величины перепутаны. Помести каждый корень между двумя целыми: корень из двух между одним и двумя, из пяти между двумя и тремя, из десяти между тремя и четырьмя. На чертеже это и видно — знак вопроса стоит между одним и двумя.',
      'The sizes got mixed up. Place each root between two whole numbers: the root of two between one and two, of five between two and three, of ten between three and four. The plot shows exactly that — the question mark stands between one and two.') },
  ],
  wrongText: L(
    "Har yaqinlashishni kvadratga oshiring va ildiz ostidagi son bilan solishtiring. Aniq teng chiqmaydi — yaqin bo'lsa kifoya, va eng yaqini o'sha juftlikni beradi.",
    'Возведи каждое приближение в квадрат и сравни с подкоренным числом. Точного равенства не будет — достаточно близости, и самое близкое и даёт пару.',
    'Square each approximation and compare with the radicand. There will be no exact match — closeness is enough, and the closest one gives the pair.'),
};

export default function D14_07(props) { return <PairSlots data={DATA} {...props} />; }
