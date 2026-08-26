// Dars27 · Amaliyot 03 — Tegishli · 🟢 · tag: belongs_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 3-pozitsiya)
//
// YARIM-INTERVAL (T3): bitta yozuvda IKKI XIL qavs. Chap chegara dumaloq
// qavs bilan — minus uch KIRMAYDI; o'ng chegara kvadrat qavs bilan — to'rt
// KIRADI. Ya'ni «chegara kiradimi» degan savolga bitta javob yo'q.
//
// Uch rad etilgan son uch xil: minus uch — chegara, lekin dumaloq qavsda;
// besh — o'ng chegaradan tashqarida; minus to'rt — chap chegaradan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'belongs_marked', level: '🟢',
  col: 120, itemSize: 19,
  given: [['(−3; 4]']],
  givenLabel: L('Oraliq', 'Промежуток', 'The range'),
  items: [
    { id: 'i1', tokens: ['0'], hit: true },
    { id: 'i2', tokens: ['−3'] },
    { id: 'i3', tokens: ['4'], hit: true },
    { id: 'i4', tokens: ['5'] },
    { id: 'i5', tokens: ['−2,5'], hit: true },
    { id: 'i6', tokens: ['−4'] },
  ],
  eyebrow: L('Tegishli', 'Принадлежит', 'Belongs'),
  setup: L(
    "Bu yozuvda ikki xil qavs: chapda dumaloq, o'ngda kvadrat. Bunday to'plam yarim-interval deyiladi.",
    'В этой записи разные скобки: слева круглая, справа квадратная. Такое множество называется полуинтервалом.',
    'This record holds two different brackets: round on the left, square on the right. Such a set is a half-interval.'),
  ask: L(
    'Bu oraliqqa tegishli 3 ta sonni belgilang.',
    'Отметь 3 числа, принадлежащие этому промежутку.',
    'Mark the 3 numbers that belong to this range.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Chap qavs dumaloq — minus uch kirmaydi; o'ng qavs kvadrat — to'rt kiradi. Bitta yozuvda ikki chegara ikki xil o'qiladi.",
    'Верно. Левая скобка круглая — минус три не входит; правая квадратная — четыре входит. В одной записи две границы читаются по-разному.',
    'Correct. The left bracket is round — minus three is out; the right is square — four is in. In one record the two boundaries read differently.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
        "Minus uch — CHAP chegara, va qavs u yerda DUMALOQ: minus uchning o'zi kirmaydi.",
        'Минус три — ЛЕВАЯ граница, а скобка там КРУГЛАЯ: само минус три не входит.',
        'Minus three is the LEFT boundary, and the bracket there is ROUND: minus three itself is out.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "To'rt chetlab o'tildi, lekin u KIRADI. O'ng qavsga qarang — u KVADRAT, ya'ni x to'rtdan kichik yoki TENG. To'rtning o'zi bu shartni bajaradi. Ikki chegarani bir xil o'qib bo'lmaydi: chapdagisi chiqarib tashlaydi, o'ngdagisi kiritadi.",
      'Четвёрка осталась в стороне, а она ВХОДИТ. Посмотри на правую скобку — она КВАДРАТНАЯ, то есть x меньше четырёх или РАВЕН ему. Сама четвёрка это условие выполняет. Две границы нельзя читать одинаково: левая исключает, правая включает.',
      'Four was left out, yet it IS in. Look at the right bracket — it is SQUARE, that is x is less than four or EQUAL to it. Four itself satisfies that. The two boundaries cannot be read the same way: the left excludes, the right includes.') },
    { when: (s) => s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu son oraliqdan TASHQARIDA. Besh to'rtdan katta, minus to'rt esa minus uchdan kichik — ikkalasi ham chegaralardan chiqib ketadi. Qavsning turi bu yerda hech narsani o'zgartirmaydi: son chegaraga TENG bo'lganda qavs hal qiladi, undan uzoqda esa yo'q.",
      'Это число ВНЕ промежутка. Пять больше четырёх, а минус четыре меньше минус трёх — оба выходят за границы. Тип скобки здесь ничего не меняет: скобка решает, когда число РАВНО границе, а вдали от неё — нет.',
      'That number is OUTSIDE the range. Five is greater than four and minus four is less than minus three — both fall beyond the boundaries. The type of bracket changes nothing here: a bracket decides when a number EQUALS the boundary, not when it is far from it.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta son kerak. Har birini ikki chegara bilan solishtiring va qavsning turiga qarang: dumaloq qavsda tenglik yaramaydi, kvadrat qavsda yaraydi.",
      'Нужно ровно три числа. Сравни каждое с обеими границами и посмотри на тип скобки: при круглой равенство не годится, при квадратной годится.',
      'Exactly three numbers are needed. Compare each with both boundaries and look at the bracket type: with a round bracket equality does not qualify, with a square one it does.') },
  ],
  wrongText: L(
    "Yozuvni tengsizlik bilan oching va har chegaraga alohida qarang. Dumaloq qavs chegarani chiqarib tashlaydi, kvadrat qavs kiritadi.",
    'Раскрой запись неравенством и посмотри на каждую границу отдельно. Круглая скобка границу исключает, квадратная включает.',
    'Unfold the record as an inequality and look at each boundary separately. A round bracket excludes the boundary, a square one includes it.'),
};

export default function D27_03(props) { return <MarkAll data={DATA} {...props} />; }
