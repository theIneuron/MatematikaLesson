// Dars25 · Amaliyot 04 — Eng kichik · 🟡 🖼 · tag: smallest_integer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 4-pozitsiya)
//
// CHIZMA — `practice/fig.jsx` ning `axis` speci (skelet §2). U izlash
// JOYINI ko'rsatadi: `?` ikki va uch orasida turadi, ya'ni chegara butun
// son emas. Javobni chizma bermaydi — u faqat qidiruvni son o'qiga bog'laydi.
//
// Eng ko'p uchraydigan xato — ikki: yetti bo'lingan uch ning butun qismi.
// Lekin chegara ikki butun uchdan bir, va ikki undan KICHIK, ya'ni yaramaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'smallest_integer', level: '🟡',
  target: 3, allowNeg: true,
  expr: ['3x > 7'], exprSize: 30,
  given: [[{ fig: 'axis', from: 0, to: 5, step: 1, w: 176, h: 46, marks: [{ at: 2.5, q: true }] }]],
  givenLabel: L('Qayerda', 'Где', 'Where'),
  eyebrow: L('Eng kichik', 'Наименьшее', 'The smallest'),
  setup: L(
    "Tengsizlikning yechimlari cheksiz ko'p, lekin ular orasida eng kichik BUTUN son bor. Chizmada u ikki va uch orasidagi chegaradan keyin turadi.",
    'Решений у неравенства бесконечно много, но среди них есть наименьшее ЦЕЛОЕ число. На рисунке оно стоит за границей между двумя и тремя.',
    'The inequality has infinitely many solutions, but among them there is a smallest WHOLE number. On the drawing it lies beyond the boundary between two and three.'),
  label: L('Eng kichik butun yechim', 'Наименьшее целое решение', 'The smallest whole solution'),
  ask: L("Eng kichik butun yechimni yozing.", 'Запиши наименьшее целое решение.', 'Write the smallest whole solution.'),
  correctText: L(
    "To'g'ri. Ikkala qismni uchga bo'lamiz: x ikki butun uchdan birdan katta. Chegara butun emas, ikki bilan uch orasida turadi — ikki yaramaydi, uch esa yaraydi. Tekshirish: uch karra uch to'qqiz, to'qqiz yettidan katta.",
    'Верно. Делим обе части на три: x больше двух целых одной трети. Граница не целая, она между двумя и тремя — двойка не годится, а тройка годится. Проверка: три на три девять, девять больше семи.',
    'Correct. Divide both sides by three: x is greater than two and one third. The boundary is not whole, it lies between two and three — two does not qualify, three does. Check: three times three is nine, nine is greater than seven.'),
  wrongs: [
    { when: (s) => s.value === 2, text: L(
      "Ikki — bu yetti bo'lingan uch ning BUTUN QISMI, lekin u yechim emas. Chegara ikki butun uchdan bir, ya'ni ikkidan kattaroq: ikki undan CHAPDA qoladi. Tekshiring: uch karra ikki olti, va olti yettidan katta emas. Eng kichik butun yechimni topish uchun chegaradan O'NGGA qarab birinchi butun sonni olish kerak.",
      'Два — это ЦЕЛАЯ ЧАСТЬ от семи третьих, но решением оно не является. Граница равна двум целым одной трети, то есть больше двойки: двойка остаётся ЛЕВЕЕ неё. Проверь: три на два шесть, а шесть не больше семи. Чтобы найти наименьшее целое решение, надо взять первое целое ВПРАВО от границы.',
      'Two is the WHOLE PART of seven thirds, but it is not a solution. The boundary is two and one third, that is larger than two: two stays to its LEFT. Check: three times two is six, and six is not greater than seven. To find the smallest whole solution you take the first whole number to the RIGHT of the boundary.') },
    { when: (s) => s.value === 7 || s.value === 4, text: L(
      "Bu son yechim, lekin eng kichigi emas. Yetti ham, to'rt ham tengsizlikni bajaradi, ammo undan kichikroq butun yechim ham bor. Chegarani toping: ikkala qismni uchga bo'ling — x ikki butun uchdan birdan katta. Chegaradan keyingi birinchi butun son uch.",
      'Это число решение, но не наименьшее. И семь, и четыре неравенству удовлетворяют, но есть целое решение поменьше. Найди границу: раздели обе части на три — x больше двух целых одной трети. Первое целое за границей — три.',
      'That number is a solution, but not the smallest one. Both seven and four satisfy the inequality, yet there is a smaller whole solution. Find the boundary: divide both sides by three — x is greater than two and one third. The first whole number past the boundary is three.') },
    { when: (s) => s.value <= 1, text: L(
      "Bu son chegaradan ancha chapda. Tengsizlikda x ning oldida uch turibdi, ya'ni chap tomon x dan uch barobar katta bo'ladi. Ikkala qismni uchga bo'ling va chegarani ko'ring: x yetti uchdandan katta bo'lishi kerak.",
      'Это число намного левее границы. В неравенстве перед x стоит тройка, то есть левая часть втрое больше x. Раздели обе части на три и посмотри на границу: x должен быть больше семи третьих.',
      'That number lies far to the left of the boundary. The inequality has a three before x, so the left side is three times x. Divide both sides by three and look at the boundary: x must be greater than seven thirds.') },
  ],
  wrongText: L(
    "Ikkala qismni uchga bo'lib chegarani toping. Chegara butun son bo'lmasa, undan O'NGDAGI birinchi butun sonni oling va javobni tengsizlikka qo'yib tekshiring.",
    'Раздели обе части на три и найди границу. Если граница не целая, возьми первое целое СПРАВА от неё и проверь ответ подстановкой.',
    'Divide both sides by three and find the boundary. If the boundary is not a whole number, take the first whole number to its RIGHT and check your answer by substitution.'),
};

export default function D25_04(props) { return <TypeValue data={DATA} {...props} />; }
