// Dars41 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: area_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 1-pozitsiya)
//
// JAVOB: YO'Q, HA (skelet §0a.1). Ikki da'vo BIR narsa haqida — yuza
// formulasi haqida, — lekin biri parallelogrammning formulasi (З85), ikkinchisi
// esa darsning T3 tasdig'i. Razbor birinchisini SON bilan rad etadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'area_claims', level: '🟢',
  itemSize: 16,
  given: [['ABC']],
  givenLabel: L('Uchburchak', 'Треугольник', 'The triangle'),
  items: [
    { id: 's1', yes: false, tokens: ['S = a · h'], at: 'a = 8, h = 3',
      claim: L('har uchburchakda shunday', 'так в любом треугольнике', 'so in every triangle') },
    { id: 's2', yes: true, tokens: ['S₁ = S₂'], at: 'a₁ = a₂, h₁ = h₂',
      claim: L('asoslari va balandliklari teng ikki uchburchakda shunday',
        'так у двух треугольников с равными основаниями и равными высотами',
        'so for two triangles with equal bases and equal heights') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki da'vo ham uchburchakning yuzi haqida. Birinchisida formulaning o'zi yozilgan va tekshiriladigan qiymatlar berilgan, ikkinchisida esa ikki uchburchak solishtiriladi.",
    'Оба утверждения о площади треугольника. В первом записана сама формула и даны значения для проверки, во втором сравниваются два треугольника.',
    'Both claims are about the area of a triangle. The first writes down the formula itself with values to test, the second compares two triangles.'),
  ask: L(
    "Da'vo har uchburchakda bajarilsa «Ha», bajarilmasa «Yo'q».",
    'Если утверждение выполняется в любом треугольнике — «Да», если нет — «Нет».',
    'Tap «Yes» if the claim holds in every triangle, «No» if it does not.'),
  correctText: L(
    "To'g'ri. Birinchi formulada ikkiga bo'lish yo'q, va shu bilan u parallelogrammning formulasi bo'lib qoladi. Sakkizni uchga ko'paytirsak yigirma to'rt chiqadi, uchburchakning yuzi esa o'n ikki — yarmi. Ikkinchi da'vo esa har doim rost: yuza faqat ikki narsaga bog'liq, asos va balandlik. Ular teng bo'lsa, uchburchak qanday qiyalikda turgani ahamiyatsiz — yuza o'sha.",
    'Верно. В первой формуле нет деления на два, и из-за этого она становится формулой параллелограмма. Восемь на три — двадцать четыре, а площадь треугольника двенадцать, половина. Второе утверждение верно всегда: площадь зависит только от двух вещей, основания и высоты. Если они равны, то наклон треугольника уже не важен — площадь та же.',
    'Correct. The first formula has no division by two, and that turns it into the formula for a parallelogram. Eight times three is twenty four, while the area of the triangle is twelve, half of that. The second claim is always true: the area depends on two things only, the base and the height. If those are equal, the slant of the triangle no longer matters — the area is the same.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi formulada YARIM yo'q. Berilgan qiymatlarni qo'ying: sakkiz karra uch yigirma to'rt, uchburchakning yuzi esa o'n ikki. Yigirma to'rt — bu shu asos va shu balandlikka qurilgan PARALLELOGRAMMNING yuzi, uchburchak esa uning yarmi.",
      'В первой формуле нет ПОЛОВИНЫ. Подставь данные значения: восемь на три — двадцать четыре, а площадь треугольника двенадцать. Двадцать четыре — это площадь ПАРАЛЛЕЛОГРАММА с тем же основанием и той же высотой, а треугольник его половина.',
      'The first formula is missing the HALF. Substitute the given values: eight times three is twenty four, while the area of the triangle is twelve. Twenty four is the area of the PARALLELOGRAM on the same base and height, and the triangle is half of it.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo rost, va uni tekshirish oson: yuza asos bilan balandlikdan yig'iladi, boshqa hech narsadan emas. Uchi yon tomonga surilgan uchburchakni tasavvur qiling — asos o'sha joyda, balandlik o'sha, demak yuza ham o'zgarmaydi. Uchburchaklarning SHAKLI boshqa bo'lishi mumkin, yuzasi esa teng.",
      'Второе утверждение верно, и проверить это легко: площадь складывается из основания и высоты, больше ни из чего. Представь треугольник, у которого вершина сдвинута в сторону — основание на месте, высота та же, значит площадь не меняется. ФОРМА треугольников может быть разной, а площадь равна.',
      'The second claim is true, and it is easy to check: the area is built from the base and the height, from nothing else. Picture a triangle whose apex is slid sideways — the base stays, the height stays, so the area does not change. The SHAPE of the triangles may differ while the area is equal.') },
  ],
  wrongText: L(
    "Har da'voda bitta savol bering: ikkiga bo'lish bormi va yuza nimalarga bog'liq?",
    'В каждом утверждении задай один вопрос: есть ли деление на два и от чего зависит площадь?',
    'Ask one question of each claim: is the division by two there, and what does the area depend on?'),
};

export default function D41_01(props) { return <TrueFalse data={DATA} {...props} />; }
