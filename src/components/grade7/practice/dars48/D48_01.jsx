// Dars48 · Amaliyot 01 — To'rtburchak yuzasi · 🟢 · choice · tag: area_rect
// Mexanika: kit.jsx -> Choice. Raskladka: 48-dars, 1-o'rin (isinish).
// To'g'ri to'rtburchak yuzasi: S = a · b. Perimetr esa 2(a + b).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'area_rect', level: '🟢', optCols: 3,
  eyebrow: L('Yuza', 'Площадь', 'Area'),
  setup: L(
    "Yuza va perimetr har xil narsa: yuza ichini o'lchaydi, perimetr esa chegarani. Formulalarni aralashtirmaslik kerak.",
    'Площадь и периметр это разные вещи: площадь измеряет внутреннее, периметр границу. Формулы не смешивать.',
    'Area and perimeter differ: area measures the inside, perimeter the border. Do not mix the formulas.'),
  ask: L("To'g'ri to'rtburchak yuzasi qanday topiladi?", 'Как находится площадь прямоугольника?', 'How is a rectangle\'s area found?'),
  opts: [{ label: ['a', '·', 'b'] }, { label: ['2(a', '+', 'b)'] }, { label: ['a', '+', 'b'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. S = a · b: yuza tomonlarning ko'paytmasi.",
    'Верно. S = a · b: площадь это произведение сторон.',
    'Correct. S = a · b: the area is the product of the sides.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "2(a + b) bu PERIMETR: to'rt tomonning yig'indisi.",
      '2(a + b) это ПЕРИМЕТР: сумма четырёх сторон.',
      '2(a + b) is the PERIMETER: the sum of the four sides.') },
    { when: (s) => s.picked === 2, text: L(
      "a + b bu faqat ikki tomonning yig'indisi -- na yuza, na perimetr.",
      'a + b это сумма только двух сторон — ни площадь, ни периметр.',
      'a + b sums only two sides — neither area nor perimeter.') },
  ],
  wrongText: L(
    "Yuza katakchalar soni bilan o'lchanadi. 3 ga 4 to'rtburchakda nechta katak bor?",
    'Площадь измеряется числом клеток. Сколько клеток в прямоугольнике 3 на 4?',
    'Area counts unit squares. How many are in a 3 by 4 rectangle?'),
};

export default function D48_01(props) { return <Choice data={DATA} {...props} />; }
