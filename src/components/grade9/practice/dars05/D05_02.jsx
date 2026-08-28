// Dars05 · Amaliyot 02 — Ha yoki yo'q · 🟢 · teg: ishora-teskari-siljish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §02
//
// Uchta hukm ikkita savolni ajratadi: parabola QAYERDA turadi (qavsdagi
// son) va QANDAY ko'rinishda (a koeffitsienti). Uchinchi hukm aynan
// `a-joyni-ozgartirmaydi` ga tegadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'ishora-teskari-siljish', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    'Bitta yozuv berilgan, uch mulohaza esa uning haqida.',
    'Дана одна запись, а три суждения — про неё.',
    'One record is given, and three claims are about it.'),
  ask: L(
    "Har bir mulohaza uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['y = 2(x + 3)² − 2']],
  itemSize: 16,
  items: [
    { id: 's1', tokens: ['y = 2x²'], yes: true, claim: L(
      'dan chapga 3 ga siljigan.',
      'сдвинута на 3 влево от этой параболы.',
      'it is shifted 3 to the left of this parabola.') },
    { id: 's2', tokens: ['(3; −2)'], yes: false, claim: L(
      'uchi shu nuqtada.',
      'вершина в этой точке.',
      'the vertex is at this point.') },
    { id: 's3', tokens: ['2'], yes: false, claim: L(
      'koeffitsienti parabolani yon tomonga siljitadi.',
      'этот коэффициент сдвигает параболу вбок.',
      'this coefficient shifts the parabola sideways.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri, uchtasi ham. Qavs ichidagi son ishorasi teskari ishlaydi: qo'shuv uch chapga siljitadi. Uchi minus uchda, uchda emas. Ikki koeffitsienti esa faqat parabolani toraytiradi — u joyni hech qachon o'zgartirmaydi, buni qavsdagi son hal qiladi.",
    'Верно, все три. Знак числа в скобке работает наоборот: плюс три сдвигает влево. Вершина в минус трёх, а не в трёх. А коэффициент два лишь сужает параболу — место он не меняет никогда, место решает число в скобке.',
    'Correct, all three. The sign of the number inside the bracket works the other way round: plus three shifts left. The vertex is at minus three, not at three. And the coefficient two only narrows the parabola — it never changes its place; the place is decided by the number in the bracket.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Qavs nolga aylanadigan sonni toping: iks qo'shuv uch nolga teng bo'lsa, iks minus uchga teng. Uchi shu yerda, ya'ni noldan chapda.",
      'Найди число, при котором скобка обращается в нуль: если икс плюс три равно нулю, то икс равен минус трём. Вершина там, то есть левее нуля.',
      'Find the number that makes the bracket zero: if x plus three is zero, then x is minus three. The vertex is there, to the left of zero.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Qavsda qo'shuv turibdi, demak uchi manfiy tomonda. Uchni emas, minus uchni qo'yib ko'ring: qavs nolga aylanadi.",
      'В скобке стоит плюс, значит вершина в отрицательной стороне. Подставь не три, а минус три: скобка обратится в нуль.',
      'The bracket has a plus, so the vertex is on the negative side. Put in minus three, not three: the bracket becomes zero.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Ikkiga ko'paytirish har bir qiymatni ikki barobar kattalashtiradi, ya'ni parabola torayadi. Lekin uning qaysi iks da eng past bo'lishi o'zgarmaydi.",
      'Умножение на два увеличивает каждое значение вдвое, то есть парабола сужается. Но то, при каком икс она самая низкая, не меняется.',
      'Multiplying by two doubles every value, so the parabola narrows. But the x at which it is lowest does not change.') },
  ],
  wrongText: L(
    "Ikkita savolni ajrating: parabola QAYERDA turadi va u QANDAY ko'rinishda. Birinchisini qavsdagi son hal qiladi, ikkinchisini a koeffitsienti.",
    'Раздели два вопроса: ГДЕ стоит парабола и КАК она выглядит. Первое решает число в скобке, второе — коэффициент a.',
    'Separate two questions: WHERE the parabola stands and HOW it looks. The first is decided by the number in the bracket, the second by the coefficient a.'),
};

export default function D05_02(props) { return <TrueFalse data={DATA} {...props} />; }
