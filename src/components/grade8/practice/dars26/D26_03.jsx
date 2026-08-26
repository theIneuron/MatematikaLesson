// Dars26 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: system_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 3-pozitsiya)
//
// IKKI MULOHAZA — KESISHISHNING IKKI HOLI. Birinchisida ikki nur bir
// tomonga qaraydi va TOR turgani qoladi (T3). Ikkinchisida ular
// qarama-qarshi tomonga qaraydi va kesishma BO'SH bo'ladi — bu ham javob
// (T2): sistemani yechish yechimlarning YO'QLIGINI aniqlash ham demak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'system_claims', level: '🟢',
  itemSize: 15,
  items: [
    { id: 's1', yes: false,
      tokens: ['x > 5,   x < 2'],
      claim: L('yechimi bor', 'решение существует', 'a solution exists') },
    { id: 's2', yes: true,
      tokens: ['x > 5,   x > 2'],
      claim: L('yechimi: x > 5', 'решение: x > 5', 'solution: x > 5') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki sistema va ular haqida ikki da'vo. Har birida ikki tengsizlikning yechimlarini to'g'ri chiziqda kesishtirish kerak.",
    'Две системы и два утверждения о них. В каждой надо пересечь на числовой прямой решения двух неравенств.',
    'Two systems and two claims about them. In each, the solutions of the two inequalities must be intersected on the number line.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchi sistemada shartlar qarama-qarshi: beshdan katta bo'lgan hamma son ikkidan ham katta, ya'ni kesishma bo'sh — yechim yo'q. Ikkinchisida ikki nur bir tomonga qaraydi va TOR turgani qoladi: x beshdan katta.",
    'Верно. В первой системе условия противоположны: всякое число, большее пяти, больше и двух, то есть пересечение пусто — решений нет. Во второй два луча смотрят в одну сторону и остаётся более УЗКИЙ: x больше пяти.',
    'Correct. In the first system the conditions oppose each other: every number greater than five is greater than two, so the intersection is empty — no solutions. In the second the two rays point the same way and the NARROWER one remains: x greater than five.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo rost. Ikki nur bir tomonga qaraydi, ya'ni bittasi ikkinchisining ichida turadi: beshdan katta bo'lgan hamma son ikkidan ham katta. Shuning uchun kesishma — TOR nur, x beshdan katta. Tekshiring: uchni oling — u ikkidan katta, lekin beshdan katta emas, demak sistemaning yechimi emas.",
      'Второе утверждение верно. Два луча смотрят в одну сторону, то есть один лежит внутри другого: всякое число, большее пяти, больше и двух. Поэтому пересечение — БОЛЕЕ УЗКИЙ луч, x больше пяти. Проверь: возьми три — оно больше двух, но не больше пяти, значит решением системы не является.',
      'The second claim is true. The two rays point the same way, so one lies inside the other: every number greater than five is also greater than two. Hence the intersection is the NARROWER ray, x greater than five. Check: take three — it is greater than two but not greater than five, so it is not a solution of the system.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi sistemaning yechimi YO'Q. Bir vaqtda beshdan katta va ikkidan kichik bo'lgan son bo'lolmaydi: son o'qida beshdan o'ngdagi joy bilan ikkidan chapdagi joy KESISHMAYDI. Sinab ko'ring: olti beshdan katta, lekin ikkidan kichik emas; bir ikkidan kichik, lekin beshdan katta emas. Yechimning yo'qligi ham javob — sistemani yechish shuni aniqlash demakdir.",
      'У первой системы решений НЕТ. Числа, одновременно большего пяти и меньшего двух, не бывает: на числовой прямой область правее пяти и область левее двух НЕ ПЕРЕСЕКАЮТСЯ. Попробуй: шесть больше пяти, но не меньше двух; один меньше двух, но не больше пяти. Отсутствие решений — тоже ответ, решить систему и значит это установить.',
      'The first system has NO solutions. There is no number that is greater than five and less than two at once: on the number line the region right of five and the region left of two DO NOT OVERLAP. Try it: six is greater than five but not less than two; one is less than two but not greater than five. Having no solutions is an answer too — solving a system means establishing exactly that.') },
  ],
  wrongText: L(
    "Har sistemada ikki yechimni to'g'ri chiziqda tasavvur qiling va ular qayerda USTMA-UST tushishini toping. Ustma-ust tushmasa, sistemaning yechimi yo'q.",
    'В каждой системе представь два решения на числовой прямой и найди, где они НАКЛАДЫВАЮТСЯ. Не наложились — у системы решений нет.',
    'In each system picture the two solutions on the number line and find where they OVERLAP. If they do not overlap, the system has no solutions.'),
};

export default function D26_03(props) { return <TrueFalse data={DATA} {...props} />; }
