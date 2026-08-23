// Dars01 * Amaliyot 03 -- Ifodaning qiymati * 🟢 * tag: value_substitute
// Faqat MA'LUMOT. Tip: kit.jsx -> Input (kind number).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Input, L } from '../kit.jsx';

const DATA = {
  tag: 'value_substitute', level: '🟢', kind: 'number',
  answer: '1',
  eyebrow: L("Qiymatni toping", 'Найди значение', 'Find the value'),
  expr: [{ n: '3b + 21', d: '6' }],
  exprSize: 26,
  ask: L("b = -5 bo'lganda ifodaning qiymati qancha?", 'Чему равно значение при b = -5?', 'What is the value at b = -5?'),
  label: L('qiymat', 'значение', 'value'),
  hints: {
    '6': L(
      "Ishora yo'qoldi: 3 · (−5) minus o'n besh, ya'ni suratda 21 dan AYIRILADI, qo'shilmaydi.",
      'Потерялся знак: 3 · (−5) это минус пятнадцать, значит в числителе оно ВЫЧИТАЕТСЯ из 21, а не прибавляется.',
      'The sign got lost: 3 times -5 is minus fifteen, so in the numerator it is SUBTRACTED from 21, not added.',
    ),
    '-15': L(
      "Bu 3b ning o'zi. Uni 21 ga qo'shib, keyin oltiga bo'lish kerak.",
      'Это только 3b. Его надо сложить с 21 и потом разделить на шесть.',
      'That is only 3b. Add it to 21 and then divide by six.',
    ),
  },
  correctText: L(
    "To'g'ri. 3 · (−5) = -15, -15 + 21 = 6, 6 : 6 = 1.",
    'Верно. 3 · (−5) = -15, -15 + 21 = 6, 6 : 6 = 1.',
    'Correct. 3 times -5 is -15, -15 + 21 = 6, 6 divided by 6 = 1.',
  ),
  wrongText: L(
    "Avval 3b ni hisoblang, keyin 21 ga qo'shing va oxirida oltiga bo'ling.",
    'Сначала посчитай 3b, потом сложи с 21 и только потом раздели на шесть.',
    'First compute 3b, then add 21, and only then divide by six.',
  ),
};

export default function D01_03(props) { return <Input data={DATA} {...props} />; }
