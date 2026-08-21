// Dars29 · Amaliyot 02 — To'liq kvadratni tanish · 🟢 · choice · tag: full_square
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// x² + 14x + 49 = (x + 7)²: 49 = 7² va 2 · x · 7 = 14x.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'full_square', level: '🟢', optCols: 3,
  eyebrow: L("To'liq kvadrat", 'Полный квадрат', 'A perfect square'),
  setup: L(
    "Uch had to'liq kvadratmi degan savol. Chetdagi hadlardan asoslar topiladi, o'rta had esa tekshiradi.",
    'Вопрос — являются ли три члена полным квадратом. По крайним членам находятся основания, а средний это проверяет.',
    'Are the three terms a perfect square? The outer terms give the bases and the middle one checks it.'),
  expr: ['x²', '+', '14x', '+', '49'], exprSize: 30,
  ask: L('Bu yozuv nimaga teng?', 'Чему равна эта запись?', 'What does this record equal?'),
  opts: [{ label: ['(x', '+', '7)²'] }, { label: ['(x', '+', '7)', '(x', '−', '7)'] }, { label: ['(x', '+', '14)²'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 49 = 7² va o'rta had 2 · x · 7 = 14x, ya'ni (x + 7)².",
    'Верно. 49 = 7², а средний член 2 · x · 7 = 14x, значит (x + 7)².',
    'Correct. 49 = 7² and the middle term 2 · x · 7 = 14x, so (x + 7)².'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "(x + 7)(x − 7) ochilsa x² − 49 chiqadi: o'rta had bo'lmaydi va oxirgisi manfiy.",
      'Раскрытие (x + 7)(x − 7) даёт x² − 49: среднего члена нет и последний отрицательный.',
      'Opening (x + 7)(x − 7) gives x² − 49: no middle term and the last is negative.') },
    { when: (s) => s.picked === 2, text: L(
      "(x + 14)² da oxirgi had 196 bo'lardi. Bizda 49, ya'ni asos 7.",
      'В (x + 14)² последний член был бы 196. У нас 49, значит основание 7.',
      'In (x + 14)² the last term would be 196. Ours is 49, so the base is 7.') },
  ],
  wrongText: L(
    "49 nimaning kvadrati? O'rta had 2 · x · 7 ga tengmi?",
    'Квадрат чего такое 49? Равен ли средний член 2 · x · 7?',
    '49 is the square of what? Does the middle term equal 2 · x · 7?'),
};

export default function D29_02(props) { return <Choice data={DATA} {...props} />; }
