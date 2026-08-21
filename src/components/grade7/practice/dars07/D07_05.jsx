// Dars07 · Amaliyot 05 — Tekshirish oxirigacha · 🔴 · tag: check_chain
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 4-topshiriqda qator YOZILDI, bu yerda u HISOBLANADI:
//   5 · (−2) + 3 = −10 + 3 = −7
// O'ng tomon ham −7, ya'ni x = −2 haqiqatan ildiz.
// Kartalar orasida 10 (ishorani tashlab ketgan), −13 (3 ni ayirgan),
// 7 va 13 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'check_chain', level: '🔴',
  eyebrow: L('Tekshirishni tugatish', 'Довести проверку', 'Finish the check'),
  setup: L(
    "Qator yozildi, endi uni oxirigacha hisoblash kerak. Faqat shundan keyin son ildizmi yoki emasligini aytish mumkin.",
    'Строка записана, теперь её надо досчитать до конца. Только после этого можно сказать, корень это число или нет.',
    'The line is written, now it must be worked out to the end. Only then can you say whether the number is a root.'),
  rows: [
    [{ t: ['5x', '+', '3', '=', '−7'] }],
    [{ t: ['5', '·', '(', '−2', ')', '+', '3', '='] }, { slot: 0 }, { t: ['+', '3', '='] }, { slot: 1 }],
  ],
  cards: ['−10', '−7', '10', '7', '−13', '13'],
  answer: ['−10', '−7'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5 · (−2) = −10, keyin −10 + 3 = −7. O'ng tomon ham −7, ya'ni x = −2 shu tenglamaning ildizi.",
    'Верно. 5 · (−2) = −10, затем −10 + 3 = −7. Справа тоже −7, значит x = −2 корень этого уравнения.',
    'Correct. 5 · (−2) = −10, then −10 + 3 = −7. The right side is −7 too, so x = −2 is a root of this equation.'),
  wrongs: [
    { when: (s) => s.slots[0] === '10', text: L(
      "Ishora yo'qoldi: musbat sonni manfiyga ko'paytirsa manfiy chiqadi, 5 · (−2) = −10.",
      'Потерялся знак: положительное на отрицательное даёт отрицательное, 5 · (−2) = −10.',
      'The sign got lost: positive times negative is negative, 5 · (−2) = −10.') },
    { when: (s) => s.slots[1] === '−13', text: L(
      "3 QO'SHILADI, ayirilmaydi: −10 + 3 = −7. Manfiy songa qo'shilganda son nolga yaqinlashadi.",
      'Тройка ПРИБАВЛЯЕТСЯ, а не вычитается: −10 + 3 = −7. При прибавлении к отрицательному число приближается к нулю.',
      'The three is ADDED, not subtracted: −10 + 3 = −7. Adding to a negative moves it towards zero.') },
    { when: (s) => s.slots[1] === '7' || s.slots[1] === '13', text: L(
      "Natija manfiy tomonda qoladi: −10 ga 3 qo'shilsa −7 bo'ladi, musbat son chiqmaydi.",
      'Результат остаётся в отрицательной стороне: −10 плюс 3 это −7, положительное число не выйдет.',
      'The result stays negative: −10 plus 3 is −7, it cannot become positive.') },
  ],
  wrongText: L(
    "Avval ko'paytirishni hisoblang, keyin 3 ni qo'shing. Ikki qadam ham ishoraga e'tibor talab qiladi.",
    'Сначала посчитай умножение, потом прибавь 3. Оба шага требуют внимания к знаку.',
    'Work out the multiplication first, then add 3. Both steps need care with the sign.'),
};

export default function D07_05(props) { return <SlotsBank data={DATA} {...props} />; }
