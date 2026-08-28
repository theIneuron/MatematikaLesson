// Dars17 · Amaliyot 03 — Test · 🟢 · teg: maxrajga-korpaytirib-yechish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
//
// MANTIQIY savol (TIPLAR_AMALIYOT_9SINF.md §2.1): SABAB so'ralyapti.
// Uchinchi variant — chalg'ituvchi, chunki u o'zi to'g'ri gap, lekin
// savolga javob bermaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'maxrajga-korpaytirib-yechish', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Tenglamada ikkala tomonni maxrajga ko'paytirish mumkin edi. Kasr TENGSIZLIKDA esa bu yo'l ishlatilmaydi.",
    'В уравнении обе части можно было умножить на знаменатель. А в дробном НЕРАВЕНСТВЕ этот путь не используют.',
    'In an equation both sides could be multiplied by the denominator. In a fractional INEQUALITY that path is not used.'),
  ask: L(
    "Nima uchun kasr tengsizlikni maxrajga ko'paytirib bo'lmaydi?",
    'Почему дробное неравенство нельзя умножить на знаменатель?',
    'Why can a fractional inequality not be multiplied by the denominator?'),
  givenLabel: L('Maxraj', 'Знаменатель', 'Denominator'),
  given: [['x − 5']],
  opts: [
    { label: L(
      "Maxrajning ishorasi noma'lum, ko'paytirishda tengsizlik belgisi almashishi mumkin",
      'Знак знаменателя неизвестен, при умножении знак неравенства может перевернуться',
      "The denominator's sign is unknown, and multiplying may flip the inequality") },
    { label: L(
      "Hisob uzayib ketadi",
      'Вычисление становится длиннее',
      'The computation gets longer') },
    { label: L(
      "Maxraj nolga teng bo'la olmaydi",
      'Знаменатель не может быть равен нулю',
      'The denominator cannot equal zero') },
    { label: L(
      "Bunday qoida shunchaki qabul qilingan",
      'Такое правило просто принято',
      'It is simply an accepted rule') },
  ],
  correctText: L(
    "To'g'ri. Iks minus besh beshdan katta iksda musbat, kichigida manfiy — ishorasi iksga bog'liq va oldindan ma'lum emas. Musbat songa ko'paytirilganda tengsizlik belgisi saqlanadi, manfiyga ko'paytirilganda esa teskariga aylanadi: ya'ni bitta amal ikki xil natija berardi. Shu sababli tengsizlikda hammasi bitta tomonga ko'chiriladi va bitta kasr hosil qilinadi — undan keyin ishoralar oraliqlar usuli bilan aniqlanadi.",
    'Верно. Икс минус пять при иксе больше пяти положителен, при меньшем отрицателен — его знак зависит от икса и заранее неизвестен. При умножении на положительное число знак неравенства сохраняется, а на отрицательное переворачивается: одно действие давало бы два разных результата. Поэтому в неравенстве всё переносят в одну сторону и получают одну дробь, а знаки потом определяют методом интервалов.',
    'Correct. x minus five is positive when x exceeds five and negative below it — its sign depends on x and is not known in advance. Multiplying by a positive number keeps the inequality, by a negative one flips it: a single step would give two different results. That is why in an inequality everything is moved to one side to form a single fraction, and the signs are then found by the interval method.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Uzunlik masalasi emas: maxrajga ko'paytirish ba'zan qisqaroq ham bo'lardi. Muammo natijaning TO'G'RILIGIDA: ko'paytirilgan sonning ishorasi noma'lum.",
      'Дело не в длине: умножение на знаменатель иногда было бы даже короче. Проблема в ВЕРНОСТИ результата: знак множителя неизвестен.',
      'It is not about length: multiplying by the denominator would sometimes be shorter. The trouble is the CORRECTNESS of the result: the sign of the multiplier is unknown.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu gap o'zi to'g'ri: maxraj nolga teng bo'lolmaydi, va shu sababli maxrajning noli javobga kirmaydi. Lekin bu ko'paytirishning taqiqiga sabab emas — sabab ISHORADA.",
      'Это утверждение само верно: знаменатель не может быть нулём, поэтому нуль знаменателя в ответ не входит. Но это не причина запрета на умножение — причина в ЗНАКЕ.',
      'That statement is true in itself: the denominator cannot be zero, which is why its zero is excluded from the answer. But it is not the reason multiplying is barred — the reason is the SIGN.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu kelishuv emas. Ikkita sonli misol yozib ko'ring: bir bo'lingan ikki noldan katta, va bir bo'lingan minus ikki noldan kichik — bir xil surat, boshqa javob. Maxrajning ishorasi natijani o'zgartiradi.",
      'Это не договорённость. Выпиши два числовых примера: один делить на два больше нуля, а один делить на минус два меньше нуля — тот же числитель, другой ответ. Знак знаменателя меняет результат.',
      'This is not a convention. Write two numerical examples: one over two is greater than zero, one over minus two is less than zero — same numerator, different answer. The sign of the denominator changes the outcome.') },
  ],
  wrongText: L(
    "Maxrajga ikkita son qo'ying: oltini va nolni. Birinchisida iks minus besh musbat, ikkinchisida manfiy. Manfiy songa ko'paytirilganda tengsizlik belgisi nima bo'ladi?",
    'Подставь в знаменатель два числа: шесть и нуль. В первом икс минус пять положителен, во втором отрицателен. Что происходит со знаком неравенства при умножении на отрицательное число?',
    'Put two numbers into the denominator: six and zero. In the first x minus five is positive, in the second negative. What happens to an inequality sign when you multiply by a negative number?'),
};

export default function D17_03(props) { return <Choice data={DATA} {...props} />; }
