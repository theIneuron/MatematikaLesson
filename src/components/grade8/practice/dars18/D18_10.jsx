// Dars18 · Amaliyot 10 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 10-pozitsiya)
//
// DARSNING UCH HOLI BITTA GAPDA. Bankdagi tuzoqlar:
//   «ildiz yo'q»    — З9 AYNAN SHU YERDA: nol holini yo'qlik bilan
//                     almashtirish. Gapga mukammal tushadi;
//   «ikki bir xil»  — D nolga teng bo'lganda «ikkita teng ildiz» deb aytish.
//                     Javob bitta son, va uni ikki marta sanash yaramaydi;
//   «cheksiz ko'p»  — kvadrat tenglamada ildiz ko'pi bilan ikkita.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      "D noldan katta bo'lsa, tenglamaning",
      'Если D больше нуля, у уравнения',
      'If D is greater than zero, the equation has') },
    { slot: 0 },
    { text: L(
      "ildizi bor. D nolga teng bo'lsa",
      'корня. Если D равно нулю, есть',
      'roots. If D equals zero, there is') },
    { slot: 1 },
    { text: L(
      "ildiz bor. D noldan kichik bo'lsa esa",
      'корень. А если D меньше нуля, то',
      'root. And if D is less than zero, then') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('ikki turli', 'два различных', 'two different') },
    { id: 'w2', label: L('bitta', 'один', 'one') },
    { id: 'w3', label: L("haqiqiy ildiz yo'q", 'действительных корней нет', 'there are no real roots') },
    { id: 'w4', label: L('ikki bir xil', 'два одинаковых', 'two identical') },
    { id: 'w5', label: L("ildiz yo'q", 'корней нет', 'no root') },
    { id: 'w6', label: L("cheksiz ko'p", 'бесконечно много', 'infinitely many') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning uch holi bitta gapda yozilgan, lekin uchta so'z tushib qolgan. Bankdagi tuzoqlar gapga mukammal tushadi — har birini formula bilan tekshirish kerak.",
    'Три случая урока записаны в одном предложении, но три слова выпали. Ловушки в банке ложатся в предложение идеально — каждую надо проверить формулой.',
    'The three cases of the lesson are written in one sentence, but three words fell out. The traps in the bank fit the sentence perfectly — each must be tested against the formula.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. D musbat bo'lganda ildiz ostidan noldan farqli son chiqadi, va plyus-minus ikki BOSHQA javobni beradi. D nolga teng bo'lganda plyus-minus nol hech narsani o'zgartirmaydi — javob bitta. D manfiy bo'lganda esa ildiz ostidagi son manfiy, undan ildiz olinmaydi, ya'ni haqiqiy ildiz yo'q. Uch hol, uch javob: ikkita, bittasi va hech qanchasi.",
    'Верно. При положительном D из-под корня выходит отличное от нуля число, и плюс-минус даёт два РАЗНЫХ ответа. При D равном нулю плюс-минус нуль ничего не меняет — ответ один. А при отрицательном D подкоренное отрицательно, корень не извлекается, значит действительных корней нет. Три случая, три ответа: два, один и ни одного.',
    'Correct. With a positive D a non-zero number comes out of the root, and the plus-or-minus gives two DIFFERENT answers. With D equal to zero, plus or minus zero changes nothing — one answer. With a negative D the radicand is negative, no root exists, so there are no real roots. Three cases, three answers: two, one and none.'),
  wrongs: [
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ikkinchi bo'shliqqa «ildiz yo'q» tushdi, va bu darsning eng qimmat xatosi. D nolga teng bo'lganda ildiz BOR. Misol: x kvadrat minus olti x qo'shuv to'qqiz nolga teng, D nol, ildiz uch — qo'yib tekshiring: to'qqiz minus o'n sakkiz qo'shuv to'qqiz nol. Ildiz yo'q bo'lish uchun D MANFIY bo'lishi kerak.",
      'Во второй пропуск попало «корней нет», и это самая дорогая ошибка урока. При D равном нулю корень ЕСТЬ. Пример: x квадрат минус шесть x плюс девять равно нулю, D нуль, корень три — подставь и проверь: девять минус восемнадцать плюс девять нуль. Для отсутствия корней D должно быть ОТРИЦАТЕЛЬНЫМ.',
      'The second gap took «no root», and that is the most costly error of the lesson. When D is zero a root EXISTS. Example: x squared minus six x plus nine equals zero, D is zero, the root is three — substitute and check: nine minus eighteen plus nine is zero. For no roots, D must be NEGATIVE.') },
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«Ikki bir xil» D nolga teng bo'lgan holni ta'riflaydi, musbat holni emas. D musbat bo'lganda ildizlar BOSHQA-BOSHQA: masalan x kvadrat minus besh x qo'shuv olti da D bir, ildizlar ikki va uch. Bir xil ildiz esa faqat nolda paydo bo'ladi, va u bitta son deb sanaladi.",
      '«Два одинаковых» описывает случай D равного нулю, а не положительного. При положительном D корни РАЗНЫЕ: например в x квадрат минус пять x плюс шесть D равно единице, корни два и три. Одинаковый корень появляется только при нуле, и считается он одним числом.',
      '«Two identical» describes the case of D equal to zero, not a positive one. With a positive D the roots DIFFER: in x squared minus five x plus six, D is one and the roots are two and three. An identical root appears only at zero, and it counts as one number.') },
    { when: (s) => s.slots.indexOf('w6') !== -1, text: L(
      "«Cheksiz ko'p» kvadrat tenglamada bo'lolmaydi. Formulaga qarang: plyus-minus faqat ikki hisobni beradi, demak ildizlar soni ikkitadan oshmaydi. Uch hol bor: ikkita, bittasi, hech qanchasi.",
      '«Бесконечно много» у квадратного уравнения быть не может. Посмотри на формулу: плюс-минус даёт только два вычисления, значит корней не больше двух. Случаев три: два, один, ни одного.',
      '«Infinitely many» cannot happen for a quadratic equation. Look at the formula: the plus-or-minus yields only two computations, so there are at most two roots. There are three cases: two, one, none.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1, text: L(
      "Bankdagi uchta tuzoq gapga tili bo'yicha tushadi, matematika bo'yicha esa yo'q. Har so'zni ikki misolda tekshiring: D nolga teng va D manfiy.",
      'Три ловушки в банке подходят по языку, но не по математике. Проверь каждое слово на двух примерах: D равно нулю и D отрицательно.',
      'The three traps in the bank fit the language but not the mathematics. Test each word on two examples: D equal to zero and D negative.') },
  ],
  wrongText: L(
    "Formulaga qarang: ildiz ostida D turadi. Musbat — plyus-minus ikki javob beradi; nol — plyus-minus hech narsani o'zgartirmaydi; manfiy — ildizni olib bo'lmaydi.",
    'Посмотри на формулу: под корнем D. Положительное — плюс-минус даёт два ответа; нуль — плюс-минус ничего не меняет; отрицательное — корень не извлекается.',
    'Look at the formula: D sits under the root. Positive — the plus-or-minus gives two answers; zero — it changes nothing; negative — the root cannot be taken.'),
};

export default function D18_10(props) { return <ClozeBank data={DATA} {...props} />; }
