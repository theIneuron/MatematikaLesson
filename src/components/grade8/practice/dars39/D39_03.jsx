// Dars39 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: trapezoid_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §11 (39-dars, 3-pozitsiya)
//
// IKKALA DA'VO HAM YOLG'ON (skelet §0a.3), va ular ikki xil sababdan:
//   «yon tomonlar doim teng» — teng yonli trapetsiyani HAMMA trapetsiyaga
//     yoyish, ya'ni turni oilaga aylantirish;
//   «asoslar teng»           — o'z-o'zini rad etadigan da'vo: asoslar teng
//     bo'lsa figura parallelogrammga aylanadi va trapetsiya bo'lmay qoladi.
// Ikkinchisi З81 ning eng kuchli shakli.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'trapezoid_claims', level: '🟢',
  itemSize: 15,
  given: [['BC ∥ AD']],
  givenLabel: L('Trapetsiya ABCD', 'Трапеция ABCD', 'The trapezoid ABCD'),
  items: [
    { id: 's1', yes: false, tokens: ['AB = CD'],
      claim: L('har trapetsiyada shunday', 'так в любой трапеции', 'so in every trapezoid') },
    { id: 's2', yes: false, tokens: ['BC = AD'],
      claim: L('har trapetsiyada shunday', 'так в любой трапеции', 'so in every trapezoid') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "ABCD trapetsiyada BC va AD asoslar, AB va CD esa yon tomonlar. Ikki da'vo tomonlarning tengligi haqida: birinchisi yon tomonlar, ikkinchisi asoslar haqida.",
    'В трапеции ABCD стороны BC и AD — основания, а AB и CD — боковые. Оба утверждения о равенстве сторон: первое о боковых, второе об основаниях.',
    'In the trapezoid ABCD the sides BC and AD are the bases, while AB and CD are the legs. Both claims concern equal sides: the first the legs, the second the bases.'),
  ask: L(
    "Da'vo har trapetsiyada bajarilsa «Ha», bajarilmasa «Yo'q».",
    'Если утверждение выполняется в любой трапеции — «Да», если нет — «Нет».',
    'If the claim holds in every trapezoid, «Yes»; if not, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham yolg'on, lekin sabablari boshqa. Birinchi da'vo yon tomonlar haqida: ular teng bo'lgan trapetsiya bor va u TENG YONLI deb ataladi, lekin bu bitta TUR, hamma trapetsiya emas. Yon tomonlari har xil bo'lgan trapetsiyani chizish oson — bittasi tik, ikkinchisi qiya. Ikkinchi da'vo esa kuchliroq xato: asoslar teng bo'lsa, ular parallel HAM, teng HAM bo'ladi, va o'shanda qolgan ikki tomon ham parallel bo'lib qoladi — ya'ni figura parallelogrammga aylanadi va trapetsiya bo'lmay qoladi. Demak bu da'vo shunchaki yolg'on emas: u trapetsiyaning ta'rifini buzadi.",
    'Верно, оба ложны, но по разным причинам. Первое утверждение о боковых сторонах: трапеция с равными боковыми существует и называется РАВНОБЕДРЕННОЙ, но это один ВИД, а не все трапеции. Начертить трапецию с разными боковыми легко — одна отвесная, другая наклонная. Второе утверждение — ошибка посильнее: если основания равны, то они и параллельны, и равны, а тогда и вторая пара сторон окажется параллельной — то есть фигура превратится в параллелограмм и перестанет быть трапецией. Значит это утверждение не просто ложно: оно разрушает определение трапеции.',
    'Correct, both are false, but for different reasons. The first claim concerns the legs: a trapezoid with equal legs exists and is called ISOSCELES, but that is one KIND, not every trapezoid. A trapezoid with unequal legs is easy to draw — one upright, the other slanted. The second claim is a stronger error: if the bases are equal they are both parallel and equal, and then the other pair of sides turns out parallel too — the figure becomes a parallelogram and stops being a trapezoid. So this claim is not merely false: it destroys the definition of the trapezoid.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo o'z-o'zini rad etadi. Asoslar allaqachon PARALLEL — bu ta'rifda aytilgan. Agar ular ustiga TENG ham bo'lsa, to'rtburchakning bir jufti parallel va teng bo'ladi, va bunday to'rtburchak har doim parallelogramm bo'lib chiqadi: qolgan ikki tomon ham parallel bo'lib qoladi. Trapetsiyada esa ikkinchi juft parallel BO'LMASLIGI kerak. Ya'ni asoslari teng trapetsiya umuman mavjud emas.",
      'Второе утверждение само себя опровергает. Основания уже ПАРАЛЛЕЛЬНЫ — это сказано в определении. Если они вдобавок ещё и РАВНЫ, то у четырёхугольника есть пара параллельных и равных сторон, а такой четырёхугольник всегда оказывается параллелограммом: вторая пара сторон тоже становится параллельной. В трапеции же вторая пара параллельной быть НЕ должна. То есть трапеции с равными основаниями не существует вовсе.',
      'The second claim refutes itself. The bases are already PARALLEL — the definition says so. If they are also EQUAL, the quadrilateral has a pair of sides both parallel and equal, and such a quadrilateral always turns out to be a parallelogram: the other pair becomes parallel too. But in a trapezoid the second pair must NOT be parallel. So a trapezoid with equal bases does not exist at all.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo har trapetsiyada bajarilmaydi. Yon tomonlari teng bo'lgan trapetsiya bor — u teng yonli deyiladi, — lekin bu maxsus TUR. Umumiy holda yon tomonlar har xil: to'g'ri burchakli trapetsiyani eslang, unda bitta yon tomon asosga perpendikulyar, ikkinchisi esa qiya, va ular teng bo'lolmaydi. Turning xossasini butun oilaga yoyish — eng ko'p uchraydigan xato.",
      'Первое утверждение выполняется не в любой трапеции. Трапеция с равными боковыми сторонами существует — она называется равнобедренной, — но это особый ВИД. В общем случае боковые стороны разные: вспомни прямоугольную трапецию, у неё одна боковая перпендикулярна основанию, а другая наклонная, и равными они быть не могут. Распространять свойство вида на всё семейство — самая частая ошибка.',
      'The first claim does not hold in every trapezoid. A trapezoid with equal legs exists — it is called isosceles — but that is a special KIND. In general the legs differ: recall the right trapezoid, where one leg is perpendicular to the base and the other slanted, and they cannot be equal. Extending the property of a kind to the whole family is the commonest error.') },
    { when: (s) => s.bad.length === 0, text: L(
      "Ikkala da'vo ham yolg'on edi. Har birini alohida tekshiring va CHIZIB ko'ring: yon tomonlari har xil trapetsiya bemalol chiziladi, asoslari teng trapetsiya esa umuman chizilmaydi — u parallelogramm bo'lib chiqadi.",
      'Оба утверждения были ложны. Проверяй каждое отдельно и НАЧЕРТИ: трапеция с разными боковыми чертится спокойно, а трапеция с равными основаниями не чертится вовсе — она оказывается параллелограммом.',
      'Both claims were false. Check each on its own and DRAW it: a trapezoid with unequal legs draws easily, while a trapezoid with equal bases does not draw at all — it turns out to be a parallelogram.') },
  ],
  wrongText: L(
    "Har da'voni chizib tekshiring. Yon tomonlarning tengligi faqat bitta turda bo'ladi, asoslarning tengligi esa figurani parallelogrammga aylantiradi.",
    'Проверяй каждое утверждение чертежом. Равенство боковых бывает лишь у одного вида, а равенство оснований превращает фигуру в параллелограмм.',
    'Check each claim by drawing. Equal legs occur only in one kind, and equal bases turn the figure into a parallelogram.'),
};

export default function D39_03(props) { return <TrueFalse data={DATA} {...props} />; }
