// Dars15 · Amaliyot 07 — Sonlar o'qi · 🟡 · teg: qatiy-tengsizlikda-ildizni-qoshish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `interval` rejimida.
//
// MATEMATIKA: x(x − 5)(x + 3) ≥ 0. Ildizlari −3, 0, 5. Ishoralar:
//   x > 5      musbat   (masalan 6: 6 · 1 · 9)
//   0 < x < 5  manfiy   (1: 1 · −4 · 4)
//   −3 < x < 0 musbat   (−1: −1 · −6 · 2)
//   x < −3     manfiy   (−4: −4 · −9 · −1)
// Javob: minus uchdan nolgacha, va beshdan boshlab. So'ralgan narsa —
// CHEGARALANGAN qism, ya'ni minus uch bilan nol orasidagi kesma.
// Belgi qat'iy emas, shuning uchun ikkala chegara ham BO'YALGAN.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'qatiy-tengsizlikda-ildizni-qoshish', level: '🟡',
  eyebrow: L('Sonlar o\'qi', 'Числовая ось', 'The number line'),
  setup: L(
    "Javob ikki qismdan iborat: ikki tomondan chegaralangan kesma va o'ngga ketuvchi nur. Bu yerda faqat KESMA so'ralyapti.",
    'Ответ состоит из двух частей: ограниченного с двух сторон отрезка и уходящего вправо луча. Здесь спрашивают только ОТРЕЗОК.',
    'The answer has two parts: a segment bounded on both sides, and a ray going right. Here only the SEGMENT is asked for.'),
  ask: L(
    "Javobning CHEGARALANGAN qismini o'qda ko'rsating.",
    'Покажи на оси ОГРАНИЧЕННУЮ часть ответа.',
    'Show the BOUNDED part of the answer on the axis.'),
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['x(x − 5)(x + 3) ≥ 0']],
  mode: 'interval',
  axis: { from: -5, to: 6 },
  answer: { a: { at: -3, closed: true }, b: { at: 0, closed: true } },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri: minus uchdan nolgacha, ikkala chegara ham bo'yalgan. Ildizlar minus uch, nol va besh; eng o'ng oraliqqa oltini qo'ysak, olti karra bir karra to'qqiz — musbat. Chapga qarab ishora almashib boradi: noldan beshgacha manfiy, minus uchdan nolgacha musbat, minus uchdan chapda yana manfiy. Belgi qat'iy emas, shuning uchun ildizlarning o'zi ham javobga kiradi — nuqtalar bo'yalgan. Qat'iy belgida esa ikkalasi ham bo'sh bo'lardi.",
    'Верно: от минус трёх до нуля, обе границы закрашены. Корни — минус три, нуль и пять; подставив шесть в самый правый промежуток, получим шесть на один на девять — положительно. Влево знак меняется: от нуля до пяти отрицательно, от минус трёх до нуля положительно, левее минус трёх снова отрицательно. Знак нестрогий, поэтому сами корни тоже входят в ответ — точки закрашены. При строгом знаке обе были бы пустыми.',
    'Correct: from minus three to zero, both boundaries filled. The roots are minus three, zero and five; substituting six into the rightmost interval gives six times one times nine — positive. Going left the sign alternates: negative from zero to five, positive from minus three to zero, negative again left of minus three. The sign is non-strict, so the roots themselves belong to the answer — the points are filled. With a strict sign both would be hollow.'),
  wrongs: [
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Chegaralarning turi noto'g'ri. Belgi «katta YOKI TENG», ya'ni ildiz nuqtalarida ko'paytma nolga teng bo'ladi va bu javobga kiradi — ikkala nuqta ham bo'yalgan bo'lishi kerak.",
      'Тип границ неверен. Знак «больше ИЛИ РАВНО», то есть в точках корней произведение равно нулю, и это входит в ответ — обе точки должны быть закрашены.',
      'The boundary type is wrong. The sign is "greater than OR EQUAL", so at the root points the product equals zero, and that belongs to the answer — both points must be filled.') },
    { when: (s) => s.has(0) && s.has(5), text: L(
      "Bu oraliqda ko'paytma MANFIY. Bittasini tekshirib ko'ring: bir karra minus to'rt karra to'rt — minus o'n olti. Musbat oraliqni qidirish kerak.",
      'На этом промежутке произведение ОТРИЦАТЕЛЬНО. Проверь единицей: один на минус четыре на четыре — минус шестнадцать. Нужен положительный промежуток.',
      'On this interval the product is NEGATIVE. Check with one: one times minus four times four is minus sixteen. A positive interval is what is needed.') },
    { when: (s) => s.has(-5) || s.has(-4), text: L(
      "Minus uchdan chapda ko'paytma manfiy: minus to'rtni qo'yib ko'ring — minus to'rt karra minus to'qqiz karra minus bir, uchta manfiy ko'paytuvchi manfiy natija beradi. Va bu qism chegaralanmagan.",
      'Левее минус трёх произведение отрицательно: подставь минус четыре — минус четыре на минус девять на минус один; три отрицательных множителя дают отрицательный результат. К тому же эта часть не ограничена.',
      'Left of minus three the product is negative: substitute minus four — minus four times minus nine times minus one; three negative factors give a negative result. Besides, that part is unbounded.') },
    { when: (s) => s.has(3) || s.has(2), text: L(
      "Bu son ildiz emas, shuning uchun chegara bo'lolmaydi. Chegaralar faqat ildizlarda bo'ladi: minus uch, nol va besh.",
      'Это число не корень, поэтому границей быть не может. Границы бывают только в корнях: минус три, нуль и пять.',
      'That number is not a root, so it cannot be a boundary. Boundaries occur only at roots: minus three, zero and five.') },
    { when: (s) => !s.atOk, text: L(
      "Uchta ildizni o'qqa qo'ying, eng o'ng oraliqqa son qo'yib ishorani aniqlang va chapga qarab almashtirib boring. Ikki tomondan chegaralangan musbat oraliqni tanlang.",
      'Нанеси три корня на ось, подставь число в самый правый промежуток и меняй знак влево. Выбери положительный промежуток, ограниченный с двух сторон.',
      'Put the three roots on the axis, substitute a number into the rightmost interval and alternate the sign leftwards. Pick the positive interval bounded on both sides.') },
  ],
  wrongText: L(
    "Ildizlar minus uch, nol va besh. Eng o'ng oraliqqa oltini qo'yib ishorani aniqlang, chapga qarab har ildizda almashtiring, va ikki tomondan chegaralangan musbat oraliqni belgilang.",
    'Корни — минус три, нуль и пять. Подставь шесть в самый правый промежуток, определи знак, меняй его влево на каждом корне и отметь положительный промежуток, ограниченный с двух сторон.',
    'The roots are minus three, zero and five. Substitute six into the rightmost interval, find the sign, alternate it leftwards at each root, and mark the positive interval bounded on both sides.'),
};

export default function D15_07(props) { return <DomainAxis data={DATA} {...props} />; }
