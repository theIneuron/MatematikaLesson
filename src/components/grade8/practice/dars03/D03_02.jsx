// Dars03 · Amaliyot 02 — Ha yoki yo'q · 🟢 · tag: cancel_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade8/DARS03_AMALIYOT_KONTENT_V2.md §02
//
// Ilgari bu o'rinda `MatchPairs` turgan (u endi 04 da). Metodist qarori
// 2026-08-24: mexanikalar 1-darsdan, ketma-ketlik esa har darsda boshqacha.
//
// IKKI mulohaza, biri «ha», biri «yo'q» — javob naqshi o'z-o'zidan chiqmaydi:
//   s1 — kvadratlar ayirmasi qisqaradi, natija b minus uch (HA);
//   s2 — qo'shiluvchi sonlar qisqarmaydi, 5/7 chiqmaydi (YO'Q).
// Ikkalasi ham darsning bitta chegarasini ikki tomondan ushlaydi:
// ko'paytuvchi qisqaradi, qo'shiluvchi yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'cancel_claims', level: '🟢',
  itemSize: 15,
  items: [
    { id: 's1', tokens: [{ n: 'b² − 9', d: 'b + 3' }, '=', 'b − 3'], yes: true,
      claim: L("qisqartirish to'g'ri", 'сокращение верно', 'the cancelling is right') },
    { id: 's2', tokens: [{ n: 'b + 5', d: 'b + 7' }, '=', { n: '5', d: '7' }], yes: false,
      claim: L("qisqartirish to'g'ri", 'сокращение верно', 'the cancelling is right') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglik. Ikkalasida ham kasr qisqartirilgan, lekin bittasida qoida buzilgan.",
    'Два равенства. В обоих дробь сокращали, но в одном правило нарушено.',
    'Two equalities. In both the fraction was cancelled, but in one the rule is broken.'),
  ask: L(
    "Qisqartirish to'g'ri bo'lsa «Ha» ni, noto'g'ri bo'lsa «Yo'q» ni bosing.",
    'Если сокращение верно — нажми «Да», если неверно — «Нет».',
    'Tap «Yes» if the cancelling is right, «No» if it is wrong.'),
  correctText: L(
    "To'g'ri. Birinchisida surat kvadratlar ayirmasi: b minus uch karra b qo'shuv uch. b qo'shuv uch ikkala qavatda ham KO'PAYTUVCHI, shuning uchun qisqaradi va b minus uch qoladi. Ikkinchisida esa besh va yetti QO'SHILUVCHI: b ni birga teng qo'ying — chapda olti bo'linadi sakkizga, ya'ni uch to'rtdan, o'ngda esa besh yettidan.",
    'Верно. В первом числитель — разность квадратов: b минус три на b плюс три. b плюс три на обоих этажах МНОЖИТЕЛЬ, поэтому сокращается и остаётся b минус три. Во втором пять и семь — СЛАГАЕМЫЕ: подставь b равное одному — слева шесть делить на восемь, то есть три четвёртых, а справа пять седьмых.',
    'Correct. In the first the numerator is a difference of squares: b minus three times b plus three. b plus three is a FACTOR on both floors, so it cancels and b minus three is left. In the second, five and seven are TERMS: put b equal to one — on the left six over eight, that is three quarters, on the right five sevenths.'),
  wrongs: [
    { when: (s) => s.ans.s2 === true, text: L(
      "Qo'shiluvchini qisqartirib bo'lmaydi. b ni birga teng qo'ying: chapda olti bo'linadi sakkizga — uch to'rtdan, o'ngda esa besh yettidan. Teng emas.",
      'Слагаемое сократить нельзя. Подставь b равное одному: слева шесть делить на восемь — три четвёртых, справа пять седьмых. Не равно.',
      'A term cannot be cancelled. Put b equal to one: on the left six over eight, that is three quarters, on the right five sevenths. Not equal.') },
    { when: (s) => s.ans.s1 === false, text: L(
      "Bu yerda qisqartirish qonuniy: b kvadrat minus to'qqiz — bu b minus uch karra b qo'shuv uch, va b qo'shuv uch ikkala qavatda ko'paytuvchi. b ni nolga teng qo'ying: chapda minus to'qqiz bo'linadi uchga, ya'ni minus uch, o'ngda ham minus uch.",
      'Здесь сокращение законно: b в квадрате минус девять — это b минус три на b плюс три, и b плюс три на обоих этажах множитель. Подставь b равное нулю: слева минус девять делить на три, то есть минус три, и справа минус три.',
      'Here the cancelling is legitimate: b squared minus nine is b minus three times b plus three, and b plus three is a factor on both floors. Put b equal to zero: on the left minus nine over three, that is minus three, and on the right minus three.') },
  ],
  wrongText: L(
    "Bitta savol hal qiladi: qisqartirilayotgan narsa KO'PAYTUVCHIMI yoki QO'SHILUVCHI? Shubha bo'lsa, ikkala tomonga bitta son qo'yib solishtiring.",
    'Решает один вопрос: то, что сокращают, — МНОЖИТЕЛЬ или СЛАГАЕМОЕ? Если сомневаешься, подставь одно число в обе части и сравни.',
    'One question decides it: is the thing being cancelled a FACTOR or a TERM? If in doubt, substitute one number into both sides and compare.'),
};

export default function D03_02(props) { return <TrueFalse data={DATA} {...props} />; }
