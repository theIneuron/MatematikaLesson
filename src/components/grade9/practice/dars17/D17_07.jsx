// Dars17 · Amaliyot 07 — Saralash · 🟡 · teg: nollarni-toliq-belgilamaslik
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
//
// Zona — NOM emas, XOSSA: son kasrning qaysi qismini nolga aylantiradi.
// Kartochkalar SON, ya'ni telefonda ham qisqa.
//
// TEKSHIRUV, kasr (x − 3)(x + 2) / (x − 5)(x + 4):
//   3, −2   suratni nolga aylantiradi
//   5, −4   maxrajni nolga aylantiradi
//   0, 1    hech qaysi qavsni nolga aylantirmaydi
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'nollarni-toliq-belgilamaslik', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  // SHART QISQA: uzunroq varianti telefonda kadrdan 3px chiqib ketardi
  // (tekshiruv 2026-08-28) — kasrning yozuvi `given` da o'zi keng.
  setup: L(
    "Har bir son kasrning qaysi qismini nolga aylantiradi?",
    'Какую часть дроби обращает в нуль каждое число?',
    'Which part of the fraction does each number turn to zero?'),
  ask: L(
    'Sonni bosing, keyin guruhni bosing.',
    'Нажми число, потом нажми группу.',
    'Tap a number, then tap a group.'),
  itemSize: 17,
  givenLabel: L('Kasr', 'Дробь', 'Fraction'),
  given: [['(x − 3)(x + 2) / (x − 5)(x + 4)']],
  zones: [
    { id: 'a', label: L('Surat noli', 'Нуль числителя', 'Numerator zero') },
    { id: 'b', label: L('Maxraj noli', 'Нуль знаменателя', 'Denominator zero') },
    { id: 'c', label: L('Nol nuqta emas', 'Не нулевая точка', 'Not a zero point') },
  ],
  items: [
    { id: 'i1', tokens: ['3'], zone: 'a' },
    { id: 'i2', tokens: ['−2'], zone: 'a' },
    { id: 'i3', tokens: ['5'], zone: 'b' },
    { id: 'i4', tokens: ['−4'], zone: 'b' },
    { id: 'i5', tokens: ['0'], zone: 'c' },
    { id: 'i6', tokens: ['1'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Uch va minus ikki suratning qavslarini nolga aylantiradi — bunday nuqtada butun kasr nolga teng. Besh va minus to'rt maxrajning qavslarini nolga aylantiradi — bunday nuqtada kasrning qiymati umuman yo'q. Nol va bir hech qaysi qavsni nolga aylantirmaydi, ya'ni ular o'qqa qo'yilmaydi. Muhimi: birinchi ikkita guruh ham o'qda belgilanadi, lekin qat'iy emas tengsizlikda birinchisi javobga kiradi, ikkinchisi hech qachon kirmaydi.",
    'Верно. Три и минус два обращают в нуль скобки числителя — в такой точке вся дробь равна нулю. Пять и минус четыре обращают в нуль скобки знаменателя — в такой точке у дроби нет значения вовсе. Нуль и один не обращают в нуль ни одну скобку, значит на ось их не наносят. Важно: первые две группы обе попадают на ось, но при нестрогом знаке первая входит в ответ, а вторая не входит никогда.',
    'Correct. Three and minus two zero the numerator brackets — at such a point the whole fraction equals zero. Five and minus four zero the denominator brackets — at such a point the fraction has no value at all. Zero and one zero no bracket, so they do not go on the axis. Note: the first two groups both land on the axis, but under a non-strict sign the first is included in the answer while the second never is.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'a' || s.place.i4 === 'a', text: L(
      "Bu sonlar MAXRAJDAGI qavslarni nolga aylantiradi. Beshni qo'ying: maxrajda besh minus besh, ya'ni nol — kasrning qiymati yo'q, nolga teng emas.",
      'Эти числа обращают в нуль скобки ЗНАМЕНАТЕЛЯ. Подставь пять: в знаменателе пять минус пять, то есть нуль — у дроби нет значения, а не нуль.',
      'These numbers zero the DENOMINATOR brackets. Put five in: the denominator gives five minus five, that is zero — the fraction has no value, it does not equal zero.') },
    { when: (s) => s.place.i1 === 'b' || s.place.i2 === 'b', text: L(
      "Bu sonlar SURATDAGI qavslarni nolga aylantiradi. Uchni qo'ying: suratda uch minus uch, ya'ni nol; maxrajda esa uch minus besh va uch qo'shuv to'rt — ikkalasi ham noldan farqli.",
      'Эти числа обращают в нуль скобки ЧИСЛИТЕЛЯ. Подставь три: в числителе три минус три, то есть нуль; а в знаменателе три минус пять и три плюс четыре — оба отличны от нуля.',
      'These numbers zero the NUMERATOR brackets. Put three in: the numerator gives three minus three, that is zero; while the denominator gives three minus five and three plus four — both nonzero.') },
    { when: (s) => s.place.i5 !== 'c' || s.place.i6 !== 'c', text: L(
      "Bu sonlar hech qaysi qavsni nolga aylantirmaydi. Nolni qo'ying: surat minus uch karra ikki, maxraj minus besh karra to'rt — ikkalasi ham noldan farqli, demak nol nuqta emas.",
      'Эти числа не обращают в нуль ни одну скобку. Подставь нуль: числитель минус три на два, знаменатель минус пять на четыре — оба отличны от нуля, значит это не нулевая точка.',
      'These numbers zero no bracket. Put zero in: the numerator is minus three times two, the denominator minus five times four — both nonzero, so it is not a zero point.') },
    { when: (s) => s.place.i2 === 'c' || s.place.i4 === 'c', text: L(
      "Ishora e'tibordan qolgan. Qavsda iks QO'SHUV ikki turibdi, u MINUS ikkida nolga aylanadi; iks qo'shuv to'rt esa minus to'rtda.",
      'Знак остался без внимания. В скобке икс ПЛЮС два, она обращается в нуль при МИНУС двух; а икс плюс четыре — при минус четырёх.',
      'A sign was overlooked. The bracket has x PLUS two, which becomes zero at MINUS two; and x plus four at minus four.') },
  ],
  wrongText: L(
    "Har bir sonni to'rtala qavsga alohida qo'yib chiqing va qaysi biri nolga aylanganini kuzatib boring: surat qavslaridami yoki maxraj qavslaridami?",
    'Подставь каждое число во все четыре скобки по отдельности и следи, какая обращается в нуль: скобка числителя или знаменателя?',
    'Put each number into all four brackets separately and watch which becomes zero: a numerator bracket or a denominator one?'),
};

export default function D17_07(props) { return <Zones data={DATA} {...props} />; }
