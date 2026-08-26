// Dars25 · Amaliyot 01 — Yechim · 🟢 · tag: is_solution
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 1-pozitsiya)
//
// T2 NING TA'RIFI: yechim — tengsizlikni TO'G'RI SONLI tengsizlikka
// aylantiradigan qiymat. Ya'ni tekshirish usuli bitta — qo'yib ko'rish.
//
// To'rt — CHEGARA nuqtasi: unda chap tomon o'ngdagiga TENG bo'ladi, lekin
// tengsizlik qat'iy, ya'ni tenglik yaramaydi (З54). Bu eng qimmat variant.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'is_solution', level: '🟢',
  correct: 0, optCols: 4, optSize: 20,
  expr: ['2x − 3 > 5'], exprSize: 30,
  eyebrow: L('Yechim', 'Решение', 'Solution'),
  setup: L(
    "Tengsizlikning yechimi — uni to'g'ri sonli tengsizlikka aylantiradigan qiymat. Har sonni qo'yib tekshirish mumkin.",
    'Решение неравенства — значение, обращающее его в верное числовое неравенство. Каждое число можно проверить подстановкой.',
    'A solution of an inequality is a value that turns it into a true numerical inequality. Every number can be tested by substitution.'),
  ask: L(
    'Qaysi son bu tengsizlikning yechimi?',
    'Какое число является решением этого неравенства?',
    'Which number is a solution of this inequality?'),
  opts: [
    { label: ['5'] },
    { label: ['4'] },
    { label: ['0'] },
    { label: ['−1'] },
  ],
  correctText: L(
    "To'g'ri. Beshni qo'yamiz: o'n minus uch yetti, yetti beshdan katta. To'rtda esa besh chiqadi, va besh beshdan KATTA EMAS — tengsizlik qat'iy, ya'ni chegara yechim emas.",
    'Верно. Подставим пять: десять минус три семь, семь больше пяти. А при четырёх выходит пять, и пять НЕ БОЛЬШЕ пяти — неравенство строгое, значит граница решением не является.',
    'Correct. Substitute five: ten minus three is seven, and seven is greater than five. At four the left side is five, and five is NOT GREATER than five — the inequality is strict, so the boundary is not a solution.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "To'rt — CHEGARA nuqtasi, yechim emas. Qo'yib ko'ring: ikki karra to'rt sakkiz, sakkiz minus uch besh. Besh beshdan katta emas — u unga teng, tengsizlik belgisi esa qat'iy «katta» ni talab qiladi. Chegara nuqtasi qat'iy tengsizlikka kirmaydi: agar belgi «katta yoki teng» bo'lganida, to'rt yechim bo'lardi.",
      'Четыре — ГРАНИЧНАЯ точка, а не решение. Подставь: два на четыре восемь, восемь минус три пять. Пять не больше пяти — оно ему равно, а знак неравенства требует строгого «больше». Граничная точка в строгое неравенство не входит: будь знак «больше или равно», четыре было бы решением.',
      'Four is the BOUNDARY point, not a solution. Substitute: two times four is eight, eight minus three is five. Five is not greater than five — it equals it, while the inequality sign demands a strict «greater». A boundary point does not belong to a strict inequality: had the sign been «greater than or equal», four would be a solution.') },
    { when: (s) => s.picked === 2, text: L(
      "Nolni qo'ying: ikki karra nol nol, nol minus uch minus uch. Minus uch beshdan katta emas, ya'ni yozuv yolg'on bo'ldi — nol yechim emas. Bu tengsizlikda x qanchalik katta bo'lsa, chap tomon ham shunchalik katta bo'ladi, shuning uchun kichik sonlar yaramaydi.",
      'Подставь нуль: два на нуль нуль, нуль минус три минус три. Минус три не больше пяти, то есть запись оказалась ложной — нуль не решение. В этом неравенстве чем больше x, тем больше левая часть, поэтому маленькие числа не годятся.',
      'Substitute zero: two times zero is zero, zero minus three is minus three. Minus three is not greater than five, so the record turned out false — zero is not a solution. In this inequality the larger x is, the larger the left side, so small numbers do not qualify.') },
    { when: (s) => s.picked === 3, text: L(
      "Minus birni qo'ying: ikki karra minus bir minus ikki, minus ikki minus uch minus besh. Minus besh beshdan katta emas — u undan ancha kichik. Manfiy son bu yerda chap tomonni yanada kichraytiradi.",
      'Подставь минус один: два на минус один минус два, минус два минус три минус пять. Минус пять не больше пяти — оно намного меньше. Отрицательное число здесь делает левую часть ещё меньше.',
      'Substitute minus one: two times minus one is minus two, minus two minus three is minus five. Minus five is not greater than five — it is far smaller. A negative number here makes the left side smaller still.') },
  ],
  wrongText: L(
    "Har sonni tengsizlikka qo'yib hisoblang va yozuv to'g'ri chiqdimi ko'ring. Chegara nuqtasida chap tomon o'ngdagiga TENG bo'ladi, tenglik esa qat'iy tengsizlikni qanoatlantirmaydi.",
    'Подставляй каждое число в неравенство и смотри, верной ли вышла запись. В граничной точке левая часть РАВНА правой, а равенство строгому неравенству не годится.',
    'Substitute each number into the inequality and see whether the record comes out true. At the boundary point the left side EQUALS the right one, and equality does not satisfy a strict inequality.'),
};

export default function D25_01(props) { return <Choice data={DATA} {...props} />; }
