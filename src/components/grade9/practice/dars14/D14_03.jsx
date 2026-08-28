// Dars14 · Amaliyot 03 — Ha/yo'q · 🟢 · teg: diskriminant-manfiy-holati
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// MATEMATIKA: x² + 4x + 7, D = 16 − 28 = −12 < 0. Tarmoqlar yuqoriga,
// Ox bilan umumiy nuqta yo'q, demak funksiya HAR QANDAY iksda musbat.
// Uchala hukm ham shu bitta xulosaning uch tomonini tekshiradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'diskriminant-manfiy-holati', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Bu uch hadning diskriminanti minus o'n ikkiga teng, tarmoqlari esa yuqoriga qaragan.",
    'У этого трёхчлена дискриминант равен минус двенадцати, а ветви направлены вверх.',
    'This trinomial has discriminant minus twelve, and its branches point upwards.'),
  ask: L(
    "Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Uch had', 'Трёхчлен', 'Trinomial'),
  given: [['x² + 4x + 7']],
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['x² + 4x + 7 > 0'], yes: true, claim: L(
      "— har qanday iksda to'g'ri.",
      '— верно при любом иксе.',
      'holds for every x.') },
    { id: 's2', tokens: ['x² + 4x + 7 < 0'], yes: false, claim: L(
      "— yechimi bor.",
      '— имеет решения.',
      'has solutions.') },
    { id: 's3', tokens: ['D = −12'], yes: false, claim: L(
      "bo'lsa ham, grafik Ox ga bitta nuqtada tegadi.",
      '— и всё же график касается Ox в одной точке.',
      'and yet the graph touches Ox at one point.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri. Diskriminant manfiy bo'lgani uchun grafik Ox ni umuman kesmaydi va unga tegmaydi ham — umumiy nuqta yo'q. Grafik uzluksiz, demak u o'qning FAQAT bitta tomonida turadi; tarmoqlari yuqoriga qaragani uchun bu yuqori tomon. Shundan ikkita javob chiqadi: musbatlik tengsizligining yechimi — barcha sonlar, manfiylik tengsizligining yechimi esa umuman yo'q. Ikkalasi ham to'liq javob.",
    'Верно. Так как дискриминант отрицателен, график вообще не пересекает Ox и не касается её — общих точек нет. График непрерывен, значит он лежит ТОЛЬКО с одной стороны от оси; а поскольку ветви направлены вверх, это верхняя сторона. Отсюда два ответа: у неравенства «больше нуля» решение — любое число, а у неравенства «меньше нуля» решений нет вовсе. И то и другое — полноценный ответ.',
    'Correct. Since the discriminant is negative, the graph neither crosses nor touches Ox — there are no common points. The graph is continuous, so it lies on ONLY one side of the axis; and since the branches point upwards, that is the upper side. Two answers follow: the "greater than zero" inequality is satisfied by all numbers, while the "less than zero" one has no solution at all. Both are complete answers.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Urinish faqat diskriminant NOLGA teng bo'lganda bo'ladi. Manfiy diskriminantda umumiy nuqta umuman yo'q: na kesishish, na urinish.",
      'Касание бывает только при дискриминанте, равном НУЛЮ. При отрицательном дискриминанте общих точек нет вовсе: ни пересечения, ни касания.',
      'Tangency happens only when the discriminant is ZERO. With a negative discriminant there are no common points at all: neither crossing nor touching.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Grafik butunlay o'qdan yuqorida turibdi, demak funksiya hech qachon manfiy bo'lmaydi. Bir nechta iks qo'yib ko'ring: nolda yetti, minus ikkida uch, minus to'rtda yetti — hammasi musbat.",
      'График целиком лежит выше оси, значит функция никогда не бывает отрицательной. Подставь несколько иксов: в нуле семь, в минус двух три, в минус четырёх семь — всё положительно.',
      'The graph lies entirely above the axis, so the function is never negative. Try a few values: at zero it is seven, at minus two three, at minus four seven — all positive.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Ildiz yo'q va tarmoqlar yuqoriga — demak grafik butunlay o'qdan yuqorida. Bunday funksiya har qanday iksda musbat.",
      'Корней нет и ветви вверх — значит график целиком выше оси. Такая функция положительна при любом иксе.',
      'No roots and branches upwards — so the graph lies entirely above the axis. Such a function is positive for every x.') },
  ],
  wrongText: L(
    "Grafikni ko'z oldingizga keltiring: ildiz yo'q, tarmoqlar yuqoriga. Bunday egri chiziq o'qning qaysi tomonida turadi va qaysi tomoniga o'tishi mumkin?",
    'Представь график: корней нет, ветви вверх. С какой стороны оси лежит такая кривая и может ли она перейти на другую?',
    'Picture the graph: no roots, branches upwards. Which side of the axis does such a curve lie on, and can it get to the other side?'),
};

export default function D14_03(props) { return <TrueFalse data={DATA} {...props} />; }
