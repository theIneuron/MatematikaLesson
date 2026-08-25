// Dars09 · Amaliyot 08 — Pazl · 🔴 · tag: root_to_bounds
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 8-pozitsiya)
//
// Uch ildiz, uch chegara juftligi. Uchtasi ham to'liq kvadrat emas, ya'ni
// javob faqat kvadratlar jadvalidan chiqadi:
//   20 — 16 va 25 orasida  → 4 va 5
//   40 — 36 va 49 orasida  → 6 va 7
//   90 — 81 va 100 orasida → 9 va 10
// Tuzoq ikkita: ildiz ostini ikkiga bo'lish (qirqdan yigirma) va chegarani
// kvadrat bilan tekshirmasdan «taxminan» qo'yish.
// Chegaralar uch nuqta bilan yoziladi — bu belgi uch tilda ham bir xil
// o'qiladi, «va» so'zi esa tarjimaga tushib qolardi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'root_to_bounds', level: '🔴',
  cardSize: 88, faceSize: 21, cardSizePhone: 62, faceSizePhone: 15,
  cards: [
    { id: 'f1', side: 0, tokens: [{ r: '20' }] },
    { id: 'f2', side: 0, tokens: [{ r: '40' }] },
    { id: 'f3', side: 0, tokens: [{ r: '90' }] },
    { id: 'v1', side: 1, tokens: ['4 … 5'] },
    { id: 'v2', side: 1, tokens: ['6 … 7'] },
    { id: 'v3', side: 1, tokens: ['9 … 10'] },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch ildizning hech biri butun emas. Har biriga o'zining ikki qo'shni butun soni mos keladi — ular uch nuqta bilan yozilgan.",
    'Ни один из трёх корней не целый. Каждому соответствуют свои два соседних целых числа — они записаны через многоточие.',
    'None of the three roots is whole. Each matches its own two neighbouring integers, written with an ellipsis between them.'),
  ask: L(
    "Ildizni bosing, keyin uyani bosing.",
    'Нажми корень, потом ячейку.',
    'Tap a root, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Hammasi kvadratlar jadvali bilan hal bo'ladi. Yigirma o'n olti bilan yigirma besh orasida, demak ildizi to'rt bilan besh orasida. Qirq o'ttiz olti bilan qirq to'qqiz orasida — olti bilan yetti orasida. To'qson sakson bir bilan yuz orasida — to'qqiz bilan o'n orasida. Har javobni chegaralarni kvadratga oshirib tekshirish mumkin.",
    'Верно. Всё решается таблицей квадратов. Двадцать между шестнадцатью и двадцатью пятью, значит корень между четырьмя и пятью. Сорок между тридцатью шестью и сорока девятью — между шестью и семью. Девяносто между восемьюдесятью одним и сотней — между девятью и десятью. Каждый ответ проверяется возведением границ в квадрат.',
    'Correct. Everything is settled by the table of squares. Twenty lies between sixteen and twenty five, so its root lies between four and five. Forty lies between thirty six and forty nine — between six and seven. Ninety lies between eighty one and one hundred — between nine and ten. Every answer can be checked by squaring the bounds.'),
  wrongs: [
    { when: (s) => s.mate.f2 === 'v1' || s.mate.f1 === 'v2', text: L(
      "Chegaralarni kvadratga oshirib tekshiring. To'rt karra to'rt o'n olti, besh karra besh yigirma besh: yigirma shu orada, qirq esa yo'q. Qirq uchun olti va yetti kerak: o'ttiz olti va qirq to'qqiz.",
      'Проверь границы возведением в квадрат. Четыре на четыре шестнадцать, пять на пять двадцать пять: двадцать между ними, а сорок нет. Для сорока нужны шесть и семь: тридцать шесть и сорок девять.',
      'Check the bounds by squaring. Four times four is sixteen, five times five is twenty five: twenty fits between them, forty does not. Forty needs six and seven: thirty six and forty nine.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "To'qsonni ikkiga bo'lib qo'ymang, ildiz bo'lish emas. Sakson bir bilan yuzni solishtiring: to'qson shu orada, demak ildiz to'qqiz bilan o'n orasida. To'qqizning kvadrati sakson bir, o'nning kvadrati yuz.",
      'Не дели девяносто на два, корень это не деление. Сравни с восемьюдесятью одним и сотней: девяносто между ними, значит корень между девятью и десятью. Квадрат девяти восемьдесят один, квадрат десяти сто.',
      'Do not halve ninety, a root is not division. Compare with eighty one and one hundred: ninety lies between them, so the root lies between nine and ten. Nine squared is eighty one, ten squared is one hundred.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Kattaliklarni solishtiring: yigirma yigirma beshdan kichik, ya'ni ildizi beshdan ham kichik. To'qson esa sakson birdan katta, ya'ni ildizi to'qqizdan katta.",
      'Сравни величины: двадцать меньше двадцати пяти, значит его корень меньше пяти. А девяносто больше восьмидесяти одного, значит его корень больше девяти.',
      'Compare the sizes: twenty is less than twenty five, so its root is less than five. Ninety is more than eighty one, so its root is more than nine.') },
  ],
  wrongText: L(
    "Har ildiz uchun yaqin kvadratlarni toping: ildiz osti qaysi ikki kvadrat orasida qolsa, javob ularning asoslari bo'ladi.",
    'Для каждого корня найди близкие квадраты: между какими двумя квадратами лежит подкоренное, их основания и есть ответ.',
    'Find the nearby squares for each root: whichever two squares the radicand falls between, their bases are the answer.'),
};

export default function D09_08(props) { return <PairSlots data={DATA} {...props} />; }
