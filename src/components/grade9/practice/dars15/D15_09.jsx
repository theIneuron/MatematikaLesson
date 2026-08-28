// Dars15 · Amaliyot 09 — Tartib · 🔴 · teg: nechta-oraliq-notogri-hisoblash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// MATEMATIKA: (x + 3)(x − 1)(x − 2) < 0. Ildizlari −3, 1, 2 — o'q TO'RTTA
// oraliqqa bo'linadi. Eng o'ng oraliqqa uchni qo'yamiz: 6 · 2 · 1 = 12,
// musbat. Chapga qarab almashib boradi:
//   x > 2      musbat
//   1 < x < 2  manfiy
//   −3 < x < 1 musbat
//   x < −3     manfiy
// Javob: x < −3 yoki 1 < x < 2.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'nechta-oraliq-notogri-hisoblash', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Oraliqlar usulining beshta qadami aralashtirilgan.",
    'Пять шагов метода интервалов перемешаны.',
    'Five steps of the interval method are shuffled.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 14,
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['(x + 3)(x − 1)(x − 2) < 0']],
  lines: [
    { id: 'c1', label: L(
      'Ildizlarni topamiz:',
      'Находим корни:',
      'Find the roots:'), tokens: ['−3', ',', '1', ',', '2'] },
    { id: 'c2', label: L(
      "Ildizlarni o'qqa qo'yamiz: o'q to'rtta oraliqqa bo'linadi",
      'Наносим корни на ось: ось делится на четыре промежутка',
      'Put the roots on the axis: it splits into four intervals') },
    { id: 'c3', label: L(
      "Eng o'ng oraliqqa son qo'yamiz:",
      'Подставляем число в самый правый промежуток:',
      'Substitute a number into the rightmost interval:'), tokens: ['x = 3', ':', '6 · 2 · 1 = 12'] },
    { id: 'c4', label: L(
      "Chapga qarab har ildizda ishorani almashtiramiz",
      'Влево на каждом корне меняем знак',
      'Alternate the sign leftwards at each root') },
    { id: 'c5', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x < −3', 'yoki', '1 < x < 2'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Uchta ildiz o'qni to'rtta oraliqqa bo'ladi — bu son ildizlar sonidan bittaga ko'p, va uni sanab chiqish kerak, taxmin qilinmaydi. Eng o'ng oraliqda uchta ko'paytuvchi ham musbat, ya'ni natija musbat. Chapga qarab har ildizda ishora almashadi: manfiy, musbat, manfiy. Bizga manfiy oraliqlar kerak, ular ikkita: minus uchdan chapda va bir bilan ikki orasida. Ildizlarning o'zi kirmaydi, chunki belgi qat'iy.",
    'Верно. Три корня делят ось на четыре промежутка — это число на единицу больше числа корней, и его надо пересчитать, а не угадывать. В самом правом промежутке все три множителя положительны, значит и результат положителен. Влево знак меняется на каждом корне: минус, плюс, минус. Нам нужны отрицательные промежутки, их два: левее минус трёх и между единицей и двойкой. Сами корни не входят, ведь знак строгий.',
    'Correct. Three roots split the axis into four intervals — one more than the number of roots, and that count must be made, not guessed. In the rightmost interval all three factors are positive, so the result is positive. Going left the sign flips at each root: minus, plus, minus. We need the negative intervals, and there are two: left of minus three and between one and two. The roots themselves are excluded, since the sign is strict.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "O'qqa nima qo'yiladi, agar ildizlar hali topilmagan bo'lsa? Avval har bir ko'paytuvchi nolga tenglashtiriladi.",
      'Что наносить на ось, если корни ещё не найдены? Сначала каждый множитель приравнивают к нулю.',
      'What would you put on the axis if the roots are not found yet? Each factor is set to zero first.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "«Eng o'ng oraliq» degan gap o'qda ildizlar turgandan keyin ma'noga ega bo'ladi: oraliqlarni aynan ildizlar hosil qiladi.",
      'Слова «самый правый промежуток» обретают смысл только после того, как корни на оси: именно корни и создают промежутки.',
      'The phrase "the rightmost interval" makes sense only once the roots are on the axis: it is the roots that create the intervals.') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Nimani almashtiramiz, agar birorta oraliqning ishorasi hali ma'lum bo'lmasa? Almashtirish uchun BOSHLANG'ICH ishora kerak, u esa son qo'yishdan chiqadi.",
      'Что менять, если знак ни одного промежутка ещё не известен? Для чередования нужен НАЧАЛЬНЫЙ знак, а он выходит из подстановки числа.',
      'What would you alternate if no interval has a known sign yet? Alternating needs a STARTING sign, and that comes from substituting a number.') },
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Javob barcha oraliqlarning ishorasi ma'lum bo'lgandan keyin yoziladi. Bittasining ishorasi bilan javob yozib bo'lmaydi: manfiy oraliqlar ikkita.",
      'Ответ пишут после того, как знаки всех промежутков известны. По знаку одного промежутка ответ не запишешь: отрицательных промежутков два.',
      'The answer is written once the signs of all intervals are known. One interval is not enough: there are two negative intervals.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D15_09(props) { return <OrderLines data={DATA} {...props} />; }
