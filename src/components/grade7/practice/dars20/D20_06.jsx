// Dars20 · Amaliyot 06 — Manfiy bir had · 🟡 · build · tag: mul_neg_mono
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
//
// −4c(3c − 8) = −12c² + 32c. Manfiyni manfiyga ko'paytirsak MUSBAT chiqadi:
// −4c · (−8) = +32c. Shuning uchun ikkinchi hadning ishorasi o'zgaradi.
// Ortiqcha kartalar: −32c (ishora), 12c² (birinchi ishora).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_neg_mono', level: '🟡',
  eyebrow: L('Manfiy bir had', 'Отрицательный одночлен', 'A negative monomial'),
  setup: L(
    "Qavs oldida manfiy bir had turadi. Manfiyni manfiyga ko'paytirsa musbat chiqadi, ya'ni qavsdagi ayirmaning ikkinchi hadi javobda PLYUS bo'ladi.",
    'Перед скобкой стоит отрицательный одночлен. Минус на минус даёт плюс, поэтому второй член разности в ответе окажется с ПЛЮСОМ.',
    'The monomial in front is negative. Minus times minus is plus, so the second term of the difference comes out with a PLUS.'),
  expr: ['−4c', '(3c', '−', '8)'], exprSize: 32,
  cards: [
    { id: 'a', label: '−12c²' },
    { id: 'b', label: '+32c' },
    { id: 'c', label: '−32c' },
    { id: 'd', label: '12c²' },
    { id: 'e', label: '+12c' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. −4c · 3c = −12c², va −4c · (−8) = +32c: ikki minus musbat berdi.",
    'Верно. −4c · 3c = −12c², а −4c · (−8) = +32c: два минуса дали плюс.',
    'Correct. −4c · 3c = −12c², and −4c · (−8) = +32c: two minuses gave a plus.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Ikkinchi ko'paytmada IKKI minus bor: qavs oldidagi va qavs ichidagi. Ikki minus musbat beradi: +32c.",
      'Во втором произведении ДВА минуса: перед скобкой и в скобке. Два минуса дают плюс: +32c.',
      'The second product has TWO minuses: in front and inside. Two minuses give a plus: +32c.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Birinchi ko'paytmada bitta minus bor: −4c · 3c = −12c². Bitta minus musbat bermaydi.",
      'В первом произведении один минус: −4c · 3c = −12c². Один минус плюса не даёт.',
      'The first product has one minus: −4c · 3c = −12c². One minus does not give a plus.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+12c da koeffitsiyent ham, harf ham noto'g'ri: −4c · 3c da 4 · 3 = 12 va c · c = c².",
      'В +12c неверны и коэффициент, и буква: в −4c · 3c выходит 4 · 3 = 12 и c · c = c².',
      'In +12c both the coefficient and the letter are off: −4c · 3c gives 4 · 3 = 12 and c · c = c².') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki ko'paytma bo'ladi: qavsda ikki had turibdi.",
      'В ответе два произведения: в скобке два члена.',
      'The answer has two products: the bracket holds two terms.') },
  ],
  wrongText: L(
    "Har ko'paytmada minuslar sonini sanang: bitta bo'lsa manfiy, ikkita bo'lsa musbat.",
    'В каждом произведении посчитай минусы: один — отрицательное, два — положительное.',
    'Count the minuses in each product: one means negative, two means positive.'),
};

export default function D20_06(props) { return <BuildLine data={DATA} {...props} />; }
