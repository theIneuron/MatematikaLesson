// Dars15 · Amaliyot 06 — Pazl · 🟡 · tag: abc_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 6-pozitsiya)
//
// TENGLAMA `given` QATORIDA TURADI, kartalarda esa faqat harf va son.
// Sabab o'lchovda: `PairSlots` ning kartasi kvadrat (telefonda 54px), unga
// «3x² − 8x + 5 = 0» sig'maydi, «a» va «−8» esa bemalol sig'adi.
//
// Tuzoq juftlashning O'ZIDA: b ning ishorasi (minus sakkiz, sakkiz emas —
// З39) va a bilan c ni almashtirish. Uchta karta va uchta son, ya'ni
// «ortib qolgan» karta yo'q — xato faqat mazmunda bo'ladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'abc_pairs', level: '🟡',
  faceSize: 15,
  given: [['3x² − 8x + 5 = 0']],
  givenLabel: L('Tenglama', 'Уравнение', 'Equation'),
  cards: [
    { id: 'f1', side: 0, v: 'a' },
    { id: 'f2', side: 0, v: 'b' },
    { id: 'f3', side: 0, v: 'c' },
    { id: 'v1', side: 1, v: '3' },
    { id: 'v2', side: 1, v: '−8' },
    { id: 'v3', side: 1, v: '5' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Yuqorida bitta tenglama turadi. Uch harf va uch son juftlanadi: har koeffitsiyent o'z qiymatini oladi.",
    'Сверху одно уравнение. Три буквы и три числа собираются в пары: каждый коэффициент получает своё значение.',
    'One equation stands above. Three letters and three numbers pair up: each coefficient takes its own value.'),
  ask: L(
    "Harfni bosing, keyin uyani bosing. Har harf o'z qiymati bilan juftlanadi.",
    'Нажми букву, потом ячейку. Каждая буква встаёт в пару со своим значением.',
    'Tap a letter, then a slot. Each letter pairs with its own value.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. a — x kvadratning oldidagi son, ya'ni uch. b — x ning oldidagi son ISHORASI bilan: yozuvda minus sakkiz x turadi, demak b minus sakkiz. c — harfsiz son, ya'ni besh. Tekshirish: uchala koeffitsiyentni ta'rifning yozuviga qo'ysangiz, dastlabki tenglama qaytadi.",
    'Верно. a — число перед икс квадрат, то есть три. b — число перед иксом ВМЕСТЕ со знаком: в записи стоит минус восемь икс, значит b минус восемь. c — число без буквы, то есть пять. Проверка: подставь все три коэффициента в запись определения — вернётся исходное уравнение.',
    'Correct. a is the number in front of x squared, that is three. b is the number in front of x together with its sign: the record shows minus eight x, so b is minus eight. c is the number without a letter, that is five. Check: put all three coefficients into the definition and the original equation comes back.'),
  wrongs: [
    { when: (s) => s.mate.f2 === 'v3' || s.mate.f3 === 'v2', text: L(
      "b va c almashdi. b — x ning oldidagi son, c — harfsiz son. Yozuvni chapdan o'ngga o'qing: uch x kvadrat, minus sakkiz x, arti besh. Ikkinchi o'rinda minus sakkiz turadi, uchinchisida besh.",
      'b и c поменялись местами. b — число перед иксом, c — число без буквы. Читай запись слева направо: три икс квадрат, минус восемь икс, плюс пять. На втором месте стоит минус восемь, на третьем пять.',
      'b and c swapped. b is the number in front of x, c is the number without a letter. Read the record left to right: three x squared, minus eight x, plus five. Minus eight is in second place, five in third.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "a va c almashdi. a — kvadrat hadning koeffitsiyenti, u yozuvning BOSHIDA turadi; c esa oxirida. Uch x kvadrat degani a uchga teng, arti besh degani c beshga teng.",
      'a и c поменялись местами. a — коэффициент квадратного слагаемого, он стоит в НАЧАЛЕ записи; c — в конце. Три икс квадрат значит a равно трём, плюс пять значит c равно пяти.',
      'a and c swapped. a is the coefficient of the squared term and stands at the START of the record; c stands at the end. Three x squared means a is three, plus five means c is five.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "b ning ishorasini tekshiring: yozuvda minus sakkiz x turadi, demak koeffitsiyent minus sakkiz. Sakkiz degan son bu yozuvda yo'q — minus belgisi koeffitsiyentning bir qismi.",
      'Проверь знак b: в записи стоит минус восемь икс, значит коэффициент минус восемь. Числа восемь в этой записи нет — минус часть коэффициента.',
      'Check the sign of b: the record shows minus eight x, so the coefficient is minus eight. There is no number eight in this record — the minus is part of the coefficient.') },
  ],
  wrongText: L(
    "Yozuvni chapdan o'ngga o'qing: kvadrat hadning koeffitsiyenti, x ning koeffitsiyenti, harfsiz son. Har birini ISHORASI bilan oling.",
    'Читай запись слева направо: коэффициент квадратного слагаемого, коэффициент икса, число без буквы. Каждый бери вместе со знаком.',
    'Read the record left to right: the coefficient of the squared term, the coefficient of x, the number without a letter. Take each with its sign.'),
};

export default function D15_06(props) { return <PairSlots data={DATA} {...props} />; }
