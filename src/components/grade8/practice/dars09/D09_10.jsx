// Dars09 · Amaliyot 10 — Moslashtirish · 🔴 · tag: fact_to_record
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 10-pozitsiya)
//
// Darsning uch tasdig'i BITTA topshiriqda: qiymat butun (196), qiymat butun
// emas lekin BOR (27), qiymat yo'q (manfiy ildiz osti), qiymat nolga teng.
// Oxirgi ikkitasi ataylab yonma-yon: «yo'q» va «nolga teng» — ikki xil holat,
// va ularni aralashtirish eng ko'p uchraydigan xato.
// Chapda ma'lumot SO'Z bilan, o'ngda yozuv; tanlangan juftlik chiziq bilan
// birlashtiriladi (`connect: true`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_to_record', level: '🔴',
  connect: true,
  targetSize: 19,
  items: [
    { id: 'm1', label: L('qiymati butun son', 'значение целое число', 'the value is a whole number') },
    { id: 'm2', label: L('qiymati 5 bilan 6 orasida', 'значение между 5 и 6', 'the value is between 5 and 6') },
    { id: 'm3', label: L("qiymati yo'q", 'значения нет', 'there is no value') },
    { id: 'm4', label: L('qiymati nolga teng', 'значение равно нулю', 'the value is zero') },
  ],
  targets: [
    { id: 't1', tokens: [{ r: '196' }] },
    { id: 't2', tokens: [{ r: '27' }] },
    { id: 't3', tokens: [{ r: '−9' }] },
    { id: 't4', tokens: [{ r: '0' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Moslashtirish', 'Соответствие', 'Match'),
  setup: L(
    "To'rt yozuv, to'rt xil holat. Chapda har biri haqida bitta ma'lumot turadi.",
    'Четыре записи, четыре разных случая. Слева про каждую сказано одно.',
    'Four records, four different cases. On the left, one fact is stated about each.'),
  ask: L(
    "Chapdan ma'lumotni bosing, keyin o'ngdan unga mos yozuvni bosing.",
    'Нажми сведение слева, потом подходящую запись справа.',
    'Tap a fact on the left, then tap the matching record on the right.'),
  correctText: L(
    "To'g'ri. Bir yuz to'qson olti to'liq kvadrat: o'n to'rt karra o'n to'rt. Yigirma yetti yigirma besh bilan o'ttiz olti orasida, demak ildizi besh bilan olti orasida — bor, lekin butun emas. Minus to'qqizdan ildiz yo'q, chunki hech bir sonning kvadrati manfiy emas. Noldan ildiz esa bor va nolga teng: nol karra nol nol. Yo'qlik va nolga tenglik — ikki xil holat.",
    'Верно. Сто девяносто шесть полный квадрат: четырнадцать на четырнадцать. Двадцать семь между двадцатью пятью и тридцатью шестью, значит корень между пятью и шестью — есть, но не целый. Корня из минус девяти нет, ведь квадрат ни одного числа не отрицателен. А корень из нуля есть и равен нулю: нуль на нуль нуль. Отсутствие и равенство нулю — два разных случая.',
    'Correct. One hundred ninety six is a perfect square: fourteen times fourteen. Twenty seven lies between twenty five and thirty six, so its root lies between five and six — it exists but is not whole. Minus nine has no root, since no number has a negative square. Zero does have a root and it equals zero: zero times zero is zero. Having no value and having the value zero are two different cases.'),
  wrongs: [
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Ikki holat aralashdi. Noldan ildiz BOR va u nolga teng: nol karra nol nol, ya'ni ta'rifning ikki sharti ham bajarildi. Minus to'qqizda esa umuman javob yo'q: kvadrati minus to'qqizga teng son yo'q.",
      'Два случая смешались. Корень из нуля ЕСТЬ и равен нулю: нуль на нуль нуль, оба условия определения выполнены. А у минус девяти ответа нет вовсе: числа, чей квадрат минус девять, не существует.',
      'The two cases got mixed. Zero DOES have a root and it equals zero: zero times zero is zero, so both conditions of the definition hold. Minus nine has no answer at all: no number has a square of minus nine.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Ikkalasini kvadratlar bilan tekshiring. Bir yuz to'qson olti aynan o'n to'rtning kvadrati, demak ildizi butun. Yigirma yetti esa yigirma besh bilan o'ttiz olti orasida qoladi, ya'ni ildizi butun emas.",
      'Проверь оба квадратами. Сто девяносто шесть это ровно квадрат четырнадцати, значит корень целый. А двадцать семь лежит между двадцатью пятью и тридцатью шестью, значит корень не целый.',
      'Check both with squares. One hundred ninety six is exactly fourteen squared, so its root is whole. Twenty seven falls between twenty five and thirty six, so its root is not whole.') },
    { when: (s) => s.pair.m2 === 't4' || s.pair.m4 === 't2', text: L(
      "Noldan ildiz besh bilan olti orasida bo'lishi mumkin emas: u aynan nolga teng. Yigirma yettini esa kvadratlar bilan solishtiring — besh karra besh yigirma besh, olti karra olti o'ttiz olti.",
      'Корень из нуля не может быть между пятью и шестью: он равен ровно нулю. А двадцать семь сравни с квадратами — пять на пять двадцать пять, шесть на шесть тридцать шесть.',
      'The root of zero cannot lie between five and six: it is exactly zero. As for twenty seven, compare it with squares — five times five is twenty five, six times six is thirty six.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda bitta savol bering: ildiz osti manfiymi, nolmi yoki to'liq kvadratmi? Uch javob uch xil holatni beradi, to'rtinchisi esa qolgan son.",
      'Задай к каждой записи один вопрос: подкоренное отрицательно, равно нулю или полный квадрат? Три ответа дают три случая, четвёртый и есть оставшееся число.',
      'Ask one question about every record: is the radicand negative, zero, or a perfect square? Three answers give three cases, and the fourth is the number left over.') },
  ],
  wrongText: L(
    "Har yozuvning ildiz ostiga qarang: manfiy, nol, to'liq kvadrat yoki ikki kvadrat orasidagi son. To'rt holat — to'rt ma'lumot.",
    'Посмотри на подкоренное каждой записи: отрицательное, нуль, полный квадрат или число между двумя квадратами. Четыре случая — четыре сведения.',
    'Look at the radicand of each record: negative, zero, a perfect square, or a number between two squares. Four cases, four facts.'),
};

export default function D09_10(props) { return <MatchPairs data={DATA} {...props} />; }
