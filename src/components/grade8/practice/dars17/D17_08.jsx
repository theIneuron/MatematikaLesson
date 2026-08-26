// Dars17 · Amaliyot 08 — Juftlash · 🔴 · tag: equation_to_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 8-pozitsiya)
//
// TO'RT TENGLAMADA BIR XIL SONLAR: 5, 6, 1. Farqi faqat ISHORALARDA, va
// ildizlar ham faqat ishora bilan farq qiladi. Shuning uchun formulani
// «taxminan» bajarish ishlamaydi — minus b ning ishorasi javobni butunlay
// almashtiradi (З44).
//
// Hamma to'rttasida diskriminant bir xil: yigirma besh minus yigirma to'rt
// yoki bir qo'shuv yigirma to'rt. Bu ataylab shunday — farq faqat suratning
// birinchi sonida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'equation_to_roots', level: '🔴',
  connect: true,
  targetSize: 14,
  items: [
    { id: 'm1', label: L('2 va 3', '2 и 3', '2 and 3') },
    { id: 'm2', label: L('−2 va −3', '−2 и −3', '−2 and −3') },
    { id: 'm3', label: L('−2 va 3', '−2 и 3', '−2 and 3') },
    { id: 'm4', label: L('2 va −3', '2 и −3', '2 and −3') },
  ],
  targets: [
    { id: 't1', tokens: ['x² − 5x + 6 = 0'] },
    { id: 't2', tokens: ['x² + 5x + 6 = 0'] },
    { id: 't3', tokens: ['x² − x − 6 = 0'] },
    { id: 't4', tokens: ['x² + x − 6 = 0'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt tenglamada bir xil sonlar qatnashadi, farqi faqat ishoralarda. Ildizlar ham shunday: ikki va uch, faqat ishoralari boshqa-boshqa.",
    'В четырёх уравнениях участвуют одни и те же числа, различаются только знаки. И корни такие же: два и три, но с разными знаками.',
    'The same numbers appear in all four equations, only the signs differ. The roots are alike too: two and three, with differing signs.'),
  ask: L(
    "Chapdan ildizlarni bosing, keyin o'ngdan uning tenglamasini bosing.",
    'Нажми корни слева, потом его уравнение справа.',
    'Tap the roots on the left, then its equation on the right.'),
  correctText: L(
    "To'g'ri. Birinchi ikkisida diskriminant yigirma besh minus yigirma to'rt, ya'ni bir. Suratdagi birinchi son minus b: birinchisida arti besh, ikkinchisida minus besh — shuning uchun ildizlar ishorasi almashadi. Oxirgi ikkisida diskriminant bir qo'shuv yigirma to'rt yigirma besh, ildizi besh: uchinchisida arti bir plyus-minus besh, to'rtinchisida minus bir plyus-minus besh. Har javobni tenglamaga qo'yib tekshirish mumkin.",
    'Верно. В первых двух дискриминант двадцать пять минус двадцать четыре, то есть один. Первое число в числителе — это минус b: в первом плюс пять, во втором минус пять, поэтому знаки корней меняются. В последних двух дискриминант один плюс двадцать четыре, двадцать пять, корень пять: в третьем плюс один плюс-минус пять, в четвёртом минус один плюс-минус пять. Каждый ответ можно проверить подстановкой.',
    'Correct. In the first two the discriminant is twenty five minus twenty four, that is one. The first number in the numerator is minus b: plus five in the first, minus five in the second — which is why the signs of the roots swap. In the last two the discriminant is one plus twenty four, twenty five, with root five: plus one plus or minus five in the third, minus one plus or minus five in the fourth. Every answer can be checked by substitution.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki tenglamada faqat b ning ishorasi farq qiladi, va shu ishora ildizlarni to'liq almashtiradi. Suratda MINUS b turadi: b arti besh bo'lsa surat minus beshdan boshlanadi va ildizlar manfiy chiqadi. Ikkini birinchi tenglamaga qo'yib tekshiring: to'rt minus o'n qo'shuv olti nol.",
      'В этих двух уравнениях различается только знак b, и этот знак полностью меняет корни. В числителе стоит МИНУС b: если b плюс пять, числитель начинается с минус пяти и корни выходят отрицательными. Подставь два в первое уравнение: четыре минус десять плюс шесть нуль.',
      'These two equations differ only in the sign of b, and that sign flips the roots entirely. The numerator holds MINUS b: if b is plus five the numerator starts with minus five and the roots come out negative. Substitute two into the first equation: four minus ten plus six is zero.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki tenglamada ozod had manfiy, demak ildizlar har xil ishorada. Qaysi ildiz katta ekanini b hal qiladi: uchinchisida b minus bir, ya'ni surat arti birdan boshlanadi va katta ildiz MUSBAT chiqadi — uch. To'rtinchisida teskarisi.",
      'В этих двух уравнениях свободный член отрицателен, значит корни разных знаков. Какой корень больше, решает b: в третьем b минус один, то есть числитель начинается с плюс один и больший корень ПОЛОЖИТЕЛЕН — три. В четвёртом наоборот.',
      'In these two the constant term is negative, so the roots have different signs. Which root is larger is decided by b: in the third b is minus one, so the numerator starts with plus one and the larger root is POSITIVE — three. In the fourth it is the other way round.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m1 === 't4' || s.pair.m2 === 't3' || s.pair.m2 === 't4', text: L(
      "Ozod hadga qarang: arti olti bo'lsa ildizlarning KO'PAYTMASI musbat, ya'ni ular bir xil ishorada; minus olti bo'lsa ko'paytma manfiy va ishoralar har xil. Ikki va uch bir xil ishorada, minus ikki bilan uch esa har xil.",
      'Смотри на свободный член: плюс шесть — ПРОИЗВЕДЕНИЕ корней положительно, значит знаки одинаковы; минус шесть — произведение отрицательно и знаки разные. Два и три одного знака, а минус два и три разных.',
      'Look at the constant term: plus six means the PRODUCT of the roots is positive, so the signs match; minus six means the product is negative and the signs differ. Two and three share a sign, minus two and three do not.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har tenglamada formulani to'liq bajaring, yoki tezroq yo'ldan boring: chap ustundagi ikki ildizni qo'shib va ko'paytirib ko'ring — yig'indi minus b ga, ko'paytma esa c ga teng bo'lishi kerak.",
      'В каждом уравнении пройди формулу до конца — или иди путём короче: сложи и перемножь два корня из левого столбца, сумма должна дать минус b, а произведение c.',
      'Run the formula to the end in every equation — or take the shorter route: add and multiply the two roots on the left, the sum must give minus b and the product c.') },
  ],
  wrongText: L(
    "Suratdagi birinchi son b ning O'ZI emas, minus b. Har juftlikni tekshirish uchun ildizlarni tenglamaga qo'ying: yig'indi nol chiqishi kerak.",
    'Первое число в числителе — не САМО b, а минус b. Для проверки каждой пары подставь корни в уравнение: должен выйти нуль.',
    'The first number in the numerator is not b ITSELF but minus b. To check a pair, substitute the roots into the equation: zero must come out.'),
};

export default function D17_08(props) { return <MatchPairs data={DATA} {...props} />; }
