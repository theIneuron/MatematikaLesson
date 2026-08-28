// Dars14 · Amaliyot 09 — Tartib · 🔴 · teg: urinish-notogri-oqish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// MATEMATIKA: x² + 2x + 1 > 0. D = 4 − 4 = 0, takroriy ildiz x = −1.
// Tarmoqlar yuqoriga, urinish nuqtasida ishora almashmaydi, ya'ni ifoda
// hamma joyda musbat — FAQAT minus birning o'zida nolga teng. Qat'iy
// belgi bo'lgani uchun bu nuqta javobga kirmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'urinish-notogri-oqish', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Takroriy ildizli tengsizlikni yechishning beshta qadami aralashtirilgan.",
    'Пять шагов решения неравенства с повторяющимся корнем перемешаны.',
    'Five steps of solving an inequality with a repeated root are shuffled.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 14,
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['x² + 2x + 1 > 0']],
  lines: [
    { id: 'c1', label: L(
      'Diskriminantni hisoblaymiz:',
      'Считаем дискриминант:',
      'Compute the discriminant:'), tokens: ['D = 4 − 4 = 0'] },
    { id: 'c2', label: L(
      'Bitta takroriy ildiz:',
      'Один повторяющийся корень:',
      'One repeated root:'), tokens: ['x = −1'] },
    { id: 'c3', label: L(
      "Tarmoqlar yuqoriga, urinish nuqtasida ishora almashmaydi",
      'Ветви вверх, в точке касания знак не меняется',
      'Branches up, the sign does not change at the point of tangency') },
    { id: 'c4', label: L(
      "Qat'iy belgi: urinish nuqtasining o'zi javobga kirmaydi",
      'Строгий знак: сама точка касания в ответ не входит',
      'Strict sign: the point of tangency itself is not in the answer') },
    { id: 'c5', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x ≠ −1'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Diskriminant nol, ya'ni ildiz bitta va u takroriy: minus bir. Ishora bu nuqtada almashmaydi, shuning uchun ifoda o'qning ikki tomonida ham musbat — minus birning o'zida esa nolga teng. Belgi qat'iy bo'lgani uchun nol qiymat javobga kirmaydi, va javob minus birdan boshqa barcha sonlar. Agar belgi qat'iy bo'lmaganda, javob barcha sonlar bo'lardi.",
    'Верно. Дискриминант нуль, значит корень один и он повторяющийся: минус один. Знак в этой точке не меняется, поэтому выражение положительно по обе стороны — а в самой точке минус один равно нулю. Знак строгий, поэтому нулевое значение в ответ не входит, и ответ — любое число, кроме минус одного. Будь знак нестрогим, ответом было бы любое число.',
    'Correct. The discriminant is zero, so there is one root and it is repeated: minus one. The sign does not change there, so the expression is positive on both sides — and at minus one itself it equals zero. The sign is strict, so the zero value is excluded, and the answer is every number except minus one. Had the sign been non-strict, the answer would be all numbers.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Ildiz diskriminantdan chiqadi. Uni hisoblamasdan nechta ildiz borligini ham bilib bo'lmaydi.",
      'Корень выходит из дискриминанта. Не посчитав его, нельзя даже узнать, сколько корней.',
      'The root comes from the discriminant. Without computing it you cannot even tell how many roots there are.') },
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Javob chegara nuqtasi haqidagi qarordan keyin yoziladi. Qat'iy belgi bilan minus bir chiqariladi, qat'iy bo'lmasa esa qoladi — javob shundan aniqlanadi.",
      'Ответ пишется после решения о граничной точке. При строгом знаке минус один исключается, при нестрогом остаётся — от этого и зависит ответ.',
      'The answer is written after the decision about the boundary point. With a strict sign minus one is excluded, with a non-strict one it stays — the answer depends on that.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Ishora QAYSI nuqtada almashmasligi haqida gapirish uchun o'sha nuqta topilgan bo'lishi kerak.",
      'Чтобы говорить, в КАКОЙ точке знак не меняется, эта точка должна быть найдена.',
      'To say at WHICH point the sign does not change, that point must already be found.') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Chegara nuqtasi haqidagi qaror ishora tahlilidan keyin keladi: avval ifoda qayerda musbat ekani aniqlanadi, keyin nol qiymat kiradimi yoki yo'qmi hal qilinadi.",
      'Решение о граничной точке идёт после разбора знака: сначала выясняют, где выражение положительно, потом решают, входит ли нулевое значение.',
      'The decision about the boundary point comes after the sign analysis: first where the expression is positive, then whether the zero value is included.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D14_09(props) { return <OrderLines data={DATA} {...props} />; }
