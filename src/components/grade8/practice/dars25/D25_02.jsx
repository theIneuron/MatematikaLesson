// Dars25 · Amaliyot 02 — Yechimlar · 🟢 · tag: solutions_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 2-pozitsiya)
//
// З54 TESKARI TOMONDAN. 01-topshiriqda chegara nuqtasi yechim EMAS edi
// (qat'iy tengsizlik), bu yerda esa chegara yechim BO'LADI, chunki belgi
// ostida chiziq bor: x minus ikkidan katta YOKI TENG.
//
// Ya'ni qoida «chegara kirmaydi» emas, «belgiga qarab kiradi yoki kirmaydi».
// Ikki topshiriq ketma-ket turgani shuning uchun.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'solutions_marked', level: '🟢',
  col: 120, itemSize: 19,
  given: [['x ≥ −2']],
  givenLabel: L('Tengsizlik', 'Неравенство', 'The inequality'),
  items: [
    { id: 'i1', tokens: ['−2'], hit: true },
    { id: 'i2', tokens: ['−3'] },
    { id: 'i3', tokens: ['0'], hit: true },
    { id: 'i4', tokens: ['−10'] },
    { id: 'i5', tokens: ['5'], hit: true },
    { id: 'i6', tokens: ['−2,5'] },
  ],
  eyebrow: L('Yechimlar', 'Решения', 'Solutions'),
  setup: L(
    "Tengsizlik belgisining ostida chiziq bor: x minus ikkidan katta yoki unga TENG. Oltita sondan uchtasi shu shartni bajaradi.",
    'Под знаком неравенства есть черта: x больше минус двух или РАВЕН ему. Из шести чисел три этому условию удовлетворяют.',
    'The inequality sign carries a line beneath it: x is greater than minus two or EQUAL to it. Of six numbers, three satisfy this condition.'),
  ask: L(
    "Tengsizlikning yechimi bo'lgan 3 ta sonni belgilang.",
    'Отметь 3 числа, которые являются решениями неравенства.',
    'Mark the 3 numbers that are solutions of the inequality.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Minus ikkining o'zi ham yechim: belgi ostidagi chiziq «yoki teng» degani. Rad etilganlar esa hammasi minus ikkidan chapda — minus ikki butun besh ham.",
    'Верно. Само минус два тоже решение: черта под знаком означает «или равно». А отброшенные все левее минус двух — в том числе минус два целых пять.',
    'Correct. Minus two itself is a solution too: the line under the sign means «or equal». And all the rejected ones lie left of minus two — minus two point five included.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i1') !== -1, text: L(
        'Minus ikki ham YECHIM: belgi ostidagi chiziq «yoki teng» degani, va minus ikki minus ikkiga teng.',
        'Минус два тоже РЕШЕНИЕ: черта под знаком означает «или равно», а минус два равно минус двум.',
        'Minus two IS a solution too: the line under the sign means «or equal», and minus two equals minus two.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Minus ikki butun besh minus ikkidan KICHIK. Manfiy sonlarda ko'rinish aldaydi: ikki butun besh ikkidan katta, lekin MINUS ikki butun besh minus ikkidan kichik. Son o'qida u minus ikkidan chapda turadi, ya'ni tengsizlikni qanoatlantirmaydi.",
      'Минус два целых пять МЕНЬШЕ минус двух. У отрицательных чисел вид обманывает: два целых пять больше двух, но МИНУС два целых пять меньше минус двух. На числовой прямой оно левее минус двух, значит неравенству не удовлетворяет.',
      'Minus two point five is LESS than minus two. With negative numbers appearances deceive: two point five is greater than two, but MINUS two point five is less than minus two. On the number line it lies left of minus two, so it does not satisfy the inequality.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu son minus ikkidan kichik, ya'ni tengsizlikni qanoatlantirmaydi. Qo'yib tekshiring: minus uch minus ikkidan katta emas, minus o'n ham. Manfiy sonlarda moduli katta bo'lgani KICHIK bo'ladi.",
      'Это число меньше минус двух, значит неравенству не удовлетворяет. Проверь подстановкой: минус три не больше минус двух, минус десять тоже. У отрицательных чисел меньше то, у которого модуль больше.',
      'That number is less than minus two, so it does not satisfy the inequality. Check by substitution: minus three is not greater than minus two, and neither is minus ten. Among negatives, the one with the larger magnitude is smaller.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta son kerak. Har birini son o'qida minus ikki bilan solishtiring: o'ngda tursa yoki minus ikkining o'zi bo'lsa — yechim, chapda tursa — yo'q.",
      'Нужно ровно три числа. Сравни каждое с минус двумя на числовой прямой: стоит правее или само равно минус двум — решение, стоит левее — нет.',
      'Exactly three numbers are needed. Compare each with minus two on the number line: to the right, or equal to minus two — a solution; to the left — not.') },
  ],
  wrongText: L(
    "Har sonni minus ikki bilan solishtiring. Belgi ostidagi chiziq chegarani ham yechimga kiritadi. Manfiy sonlarda moduli katta bo'lgani kichikroq.",
    'Сравни каждое число с минус двумя. Черта под знаком включает в решение и границу. У отрицательных чисел меньше то, у которого модуль больше.',
    'Compare every number with minus two. The line under the sign includes the boundary in the solution. Among negatives, the one with the larger magnitude is smaller.'),
};

export default function D25_02(props) { return <MarkAll data={DATA} {...props} />; }
