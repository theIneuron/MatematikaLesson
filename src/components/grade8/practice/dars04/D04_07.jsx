// Dars04 · Amaliyot 07 — Guruhlar · 🟡 · tag: add_correct_or_not
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 6-o'rinda
// turgan, endi 7-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi
// (`DARS02_06_AMALIYOT_SKELET.md` §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Sakkiz tenglik, to'rt-to'rt. Tuzoqlar darsning adashishlari bo'yicha:
//   З24 — maxrajlar ham qo'shildi:      3/k + 4/k = 7/(2k)
//                                        4/k + 4/k = 8/k²
//   З15 — umumiy maxrajsiz qo'shildi:   1/k + 1/3 = 2/(k + 3)
//   suratlar keltirilmasdan qo'shildi:  1/(k+1) + 1/(k−1) = 2/(k²−1)
// To'g'rilari orasida ayirish ham bor — o'quvchi qoidani faqat qo'shishga
// tegishli deb o'ylamasin.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'add_correct_or_not', level: '🟡',
  zoneLbl: 86, itemSize: 13,
  zones: [
    { id: 'yes', label: L("TO'G'RI", 'ВЕРНО', 'CORRECT') },
    { id: 'no', label: L("NOTO'G'RI", 'НЕВЕРНО', 'WRONG') },
  ],
  items: [
    { id: 'i1', tokens: [{ n: '3', d: 'k' }, '+', { n: '4', d: 'k' }, '=', { n: '7', d: 'k' }], zone: 'yes' },
    { id: 'i2', tokens: [{ n: '2', d: 'k' }, '−', { n: '5', d: 'k' }, '=', { n: '−3', d: 'k' }], zone: 'yes' },
    { id: 'i3', tokens: [{ n: '5', d: 'k' }, '−', { n: '2', d: 'k' }, '=', { n: '3', d: 'k' }], zone: 'yes' },
    { id: 'i4', tokens: [{ n: '1', d: 'k + 1' }, '+', { n: '1', d: 'k − 1' }, '=', { n: '2k', d: 'k² − 1' }], zone: 'yes' },
    { id: 'i5', tokens: [{ n: '3', d: 'k' }, '+', { n: '4', d: 'k' }, '=', { n: '7', d: '2k' }], zone: 'no' },
    { id: 'i6', tokens: [{ n: '4', d: 'k' }, '+', { n: '4', d: 'k' }, '=', { n: '8', d: 'k²' }], zone: 'no' },
    { id: 'i7', tokens: [{ n: '1', d: 'k' }, '+', { n: '1', d: '3' }, '=', { n: '2', d: 'k + 3' }], zone: 'no' },
    { id: 'i8', tokens: [{ n: '1', d: 'k + 1' }, '+', { n: '1', d: 'k − 1' }, '=', { n: '2', d: 'k² − 1' }], zone: 'no' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkizta tenglik. To'rttasi to'g'ri, to'rttasida esa xato bor.",
    'Восемь равенств. Четыре верны, в четырёх есть ошибка.',
    'Eight equalities. Four are right, four contain an error.'),
  ask: L(
    "Kartani bosing, keyin zonani bosing. Sakkizala tenglik ham joyini topishi kerak.",
    'Нажми карточку, потом зону. Все восемь равенств обязаны найти место.',
    'Tap a card, then a zone. All eight equalities must find a place.'),
  bank: L('Tengliklar', 'Равенства', 'Equalities'),
  correctText: L(
    "To'g'ri. Ikki qoida ishladi. Birinchisi: maxrajlar bir xil bo'lsa, faqat suratlar qo'shiladi yoki ayiriladi, maxraj esa TEGILMAYDI. Ikkinchisi: maxrajlar boshqa bo'lsa, avval umumiy maxrajga keltirish kerak — shundan keyingina suratlar bilan ishlash mumkin.",
    'Верно. Сработали два правила. Первое: при одинаковых знаменателях складывают или вычитают только числители, а знаменатель НЕ ТРОГАЮТ. Второе: при разных знаменателях сначала приводят к общему — и только потом работают с числителями.',
    'Correct. Two rules were at work. First: with equal denominators only the numerators add or subtract, and the denominator is NOT touched. Second: with different denominators you must go to a common one first — only then can you work with the numerators.'),
  wrongs: [
    { when: (s) => s.place.i5 === 'yes' || s.place.i6 === 'yes', text: L(
      "Maxrajlar qo'shilmaydi va ko'paytirilmaydi. Ular bir xil bo'lgani uchun umumiy — u ikki marta hisoblanmaydi. K ni birga teng qo'ying va ikkala tomonni solishtiring.",
      'Знаменатели не складывают и не перемножают. Они одинаковые, значит общие — и берутся один раз. Подставь k равное одному и сравни обе стороны.',
      'Denominators are neither added nor multiplied. They are equal, so they are shared and counted once. Put k equal to one and compare both sides.') },
    { when: (s) => s.place.i7 === 'yes', text: L(
      "Maxrajlar boshqa: k va uch. Umumiy maxrajga keltirmasdan suratlarni ham, maxrajlarni ham qo'shib bo'lmaydi. K ni uchga teng qo'ying: bir uchdan qo'shuv bir uchdan bu ikki uchdan, ikki oltidan emas.",
      'Знаменатели разные: k и три. Без приведения к общему нельзя складывать ни числители, ни знаменатели. Подставь k равное трём: одна треть плюс одна треть — две трети, а не две шестых.',
      'The denominators differ: k and three. Without a common denominator neither numerators nor denominators may be added. Put k equal to three: one third plus one third is two thirds, not two sixths.') },
    { when: (s) => s.place.i8 === 'yes', text: L(
      "Umumiy maxraj to'g'ri topilgan, lekin suratlar keltirilmagan. Birinchi kasr k minus birga, ikkinchisi k qo'shuv birga ko'paytirilishi kerak edi — shunda tepada ikki k chiqadi.",
      'Общий знаменатель найден верно, а числители не приведены. Первую дробь надо было домножить на k минус один, вторую на k плюс один — тогда сверху выйдет два k.',
      'The common denominator is right, but the numerators were not converted. The first fraction had to be multiplied by k minus one, the second by k plus one — then two k appears above.') },
    { when: (s) => s.place.i4 === 'no', text: L(
      "Bu tenglik to'g'ri: k minus bir qo'shuv k qo'shuv bir bu ikki k. Maxraj esa kvadratlar ayirmasi. K ni ikkiga teng qo'ying: bir uchdan qo'shuv bir bu bir uchdan qo'shuv bir, ya'ni to'rt uchdan — va to'rt uchdan.",
      'Это равенство верно: k минус один плюс k плюс один — два k. Знаменатель — разность квадратов. Подставь k равное двум: одна треть плюс один — четыре третьих, и справа тоже.',
      'This equality is right: k minus one plus k plus one is two k. The denominator is a difference of squares. Put k equal to two: one third plus one is four thirds, and the right side gives the same.') },
    { when: (s) => s.place.i2 === 'no' || s.place.i3 === 'no', text: L(
      "Ayirishda ham o'sha qoida: maxraj bir xil bo'lsa, faqat suratlar ayiriladi. Ikki minus besh bu minus uch, besh minus ikki esa uch.",
      'При вычитании то же правило: если знаменатель одинаковый, вычитаются только числители. Два минус пять — минус три, пять минус два — три.',
      'Subtraction follows the same rule: with equal denominators only the numerators subtract. Two minus five is minus three, five minus two is three.') },
  ],
  wrongText: L(
    "Har tenglikda ikki savol bering: maxrajlar bir xilmi, va maxraj tegilganmi? Bir xil bo'lsa maxraj o'zgarmaydi; boshqa bo'lsa avval umumiy maxrajga keltiriladi.",
    'К каждому равенству два вопроса: одинаковы ли знаменатели, и трогали ли знаменатель? Если одинаковы — он не меняется; если разные — сначала приводят к общему.',
    'Ask two questions of each equality: are the denominators equal, and was the denominator touched? If equal it stays; if different, go to a common one first.'),
};

export default function D04_07(props) { return <Zones data={DATA} {...props} />; }
