// Dars01 · Amaliyot 01 — Fikr · 🟢 · tag: which_claim
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §01
//
// METODIST QARORI 2026-08-22: 1-topshiriq TEST bo'ladi, savol MANTIQIY —
// misol emas. `TIPLAR_AMALIYOT_8SINF.md` §5.11 tayyor javobni tanlashni
// pul'dan chiqargan («yechish emas, yechim haqida gapirish»), lekin bu yerda
// tanlanadigan narsa javob emas, MULOHAZA: to'rt fikrdan bittasi har qanday
// kasr uchun to'g'ri, uchtasi esa aniq bir misolda buziladi. Chetlanish
// ochiq: kontent faylining §0a da yozilgan.
//
// Uchta noto'g'ri fikr — uchta adashish: «harf bor, demak taqiq bor» (a²+1
// bilan rad etiladi), З18 (surat noli), З19 (maxrajda son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_claim', level: '🟢',
  correct: 1, optCols: 1,
  eyebrow: L('Fikr', 'Утверждение', 'Claim'),
  // Matn qisqa: telefonda RU razbor bilan 26px kadrdan chiqib ketardi
  // (o'lchov 2026-08-22, grade8-practice-check.mjs).
  setup: L(
    "To'rt fikr kasr haqida. Bittasi har doim to'g'ri, uchtasi misolda buziladi.",
    'Четыре утверждения про дробь. Одно верно всегда, три ломаются на примере.',
    'Four claims about fractions. One is always true, three break on an example.'),
  ask: L("Qaysi fikr har doim to'g'ri?", 'Какое утверждение верно всегда?', 'Which claim is always true?'),
  opts: [
    { label: L(
      "Maxrajda harf bo'lsa, kasr albatta biror qiymatda ma'noga ega bo'lmaydi.",
      'Если в знаменателе есть буква, дробь где-то обязательно не имеет смысла.',
      'If the denominator contains a letter, the fraction must fail at some value.') },
    { label: L(
      "Kasr ma'noga ega bo'lmasligi uchun uning maxraji nolga aylanishi kerak.",
      'Чтобы дробь не имела смысла, её знаменатель должен обратиться в нуль.',
      'For a fraction to have no value, its denominator must become zero.') },
    { label: L(
      "Surat nolga aylansa, kasr ma'noga ega bo'lmaydi.",
      'Если числитель обращается в нуль, дробь не имеет смысла.',
      'If the numerator becomes zero, the fraction has no value.') },
    { label: L(
      "Maxrajda son turgan kasr ham ba'zi qiymatlarda ma'noga ega bo'lmaydi.",
      'Дробь с числом в знаменателе тоже где-то не имеет смысла.',
      'A fraction with a number in the denominator also fails at some values.') },
  ],
  correctText: L(
    "To'g'ri. Ma'noga ega bo'lmaslikning bitta sababi bor — nolga bo'lish. Demak savol ham doim bitta: maxraj qachon nolga aylanadi. Maxrajda harf turishining o'zi hech narsani hal qilmaydi: a kvadrat qo'shuv bir eng kichik holatda birga teng, ya'ni nolga hech qachon aylanmaydi.",
    'Верно. У «не имеет смысла» одна причина — деление на нуль. Значит вопрос всегда один: когда знаменатель обращается в нуль. Буква сама ничего не решает: a в квадрате плюс один не меньше единицы.',
    'Correct. Having no value has one cause — division by zero. So the question is always the same: when does the denominator become zero. A letter alone settles nothing: a squared plus one is one at its smallest, so it never becomes zero.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      "Harf bor, lekin taqiq bo'lmasligi ham mumkin. a kvadrat qo'shuv birni nolga tenglashga urinib ko'ring: kvadrat manfiy bo'lmaydi, demak yig'indi kamida bir. Harfning borligi emas, maxrajning noli hal qiladi.",
      'Буква есть, а запрета может и не быть. Попробуй приравнять a в квадрате плюс один к нулю: квадрат неотрицателен, значит сумма не меньше единицы. Решает не наличие буквы, а нуль знаменателя.',
      'The letter is there, but the ban need not be. Try setting a squared plus one to zero: a square is never negative, so the sum is at least one. What decides is the zero of the denominator, not the letter.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu yerda suratdagi nol maxrajdagi nol bilan aralashib ketdi. Nolni minus ikkiga bo'lsangiz nol chiqadi — qiymat bor, u nolga teng. Qiymat faqat chiziqning TAGIDA nol paydo bo'lganda yo'qoladi.",
      'Здесь нуль числителя спутан с нулём знаменателя. Нуль разделить на минус два — нуль: значение есть. Оно исчезает только когда нуль появляется ПОД чертой.',
      'Here the zero of the numerator is confused with the zero of the denominator. Zero divided by minus two is zero: the value exists and it is zero. The value disappears only when a zero appears BELOW the bar.') },
    { when: (s) => s.picked === 3, text: L(
      "Maxrajda son turganda kasr harfning har qanday qiymatida hisoblanadi: yetti nolga aylanmaydi, u o'zgarmaydi ham. Harf faqat suratda qolsa, taqiq qo'yadigan narsa yo'q.",
      'Когда в знаменателе число, дробь считается при любом значении буквы: семь в нуль не обращается и вообще не меняется. Если буква осталась только в числителе, запрещать нечего.',
      'With a number in the denominator the fraction is computed for every value of the letter: seven never becomes zero and never changes. If the letter stays only in the numerator, there is nothing to forbid.') },
  ],
  wrongText: L(
    "Bitta savol bering: bu kasrning maxraji qachon nolga aylanadi? Har to'rt fikrni shu savol bilan tekshiring.",
    'Задай один вопрос: когда знаменатель этой дроби обращается в нуль? Проверь этим вопросом все четыре утверждения.',
    'Ask one question: when does the denominator of this fraction become zero? Test all four claims with it.'),
};

export default function D01_01(props) { return <Choice data={DATA} {...props} />; }
