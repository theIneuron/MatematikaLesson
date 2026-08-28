// Dars14 · Amaliyot 10 — So'zlar · 🔴 · teg: diskriminant-manfiy-holati
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Qoida darsning uchala tasdig'ini bir gapga yig'adi. Kartalar bo'shliqqa
// BUTUN ibora bilan tushadi (masalan «Ox ga tegadi»), chunki uch tilda
// kelishik boshqa-boshqa: o'zbekchada «Ox ga tegadi», lekin «Ox ni
// kesadi» — yolg'iz fe'l qo'yilsa gap buziladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'diskriminant-manfiy-holati', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta ibora tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три выражения выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three phrases fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      "Diskriminant nolga teng bo'lsa, parabola bitta nuqtada",
      'Если дискриминант равен нулю, парабола в одной точке',
      'If the discriminant is zero, the parabola') },
    { slot: 0 },
    { text: L(
      ", va bu nuqtaning ikki tomonida ishora",
      ', и по обе стороны от этой точки знак остаётся',
      'at one point, and on both sides of that point the sign stays') },
    { slot: 1 },
    { text: L(
      "qoladi. Diskriminant manfiy bo'lsa, javob",
      '. Если дискриминант отрицателен, ответом будет',
      '. If the discriminant is negative, the answer is') },
    { slot: 2 },
    { text: L(
      " yoki «yechim yo'q» bo'ladi.",
      ' или «решений нет».',
      ' or "no solution".') },
  ],
  cards: [
    { id: 'w1', label: L('Ox ga tegadi', 'касается Ox', 'touches Ox') },
    { id: 'w2', label: L('bir xil', 'одинаковым', 'the same') },
    { id: 'w3', label: L('barcha sonlar', 'любое число', 'all numbers') },
    { id: 'w4', label: L('Ox ni kesadi', 'пересекает Ox', 'crosses Ox') },
    { id: 'w5', label: L('teskari', 'противоположным', 'the opposite') },
    { id: 'w6', label: L('faqat bitta son', 'только одно число', 'only one number') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala ibora ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: nol diskriminantda parabola o'qqa tegadi, kesmaydi; urinish nuqtasining ikki tomonida ishora bir xil qoladi, chunki parabola o'qning ikkinchi tomoniga o'tmaydi; va manfiy diskriminantda umumiy nuqta yo'q, shuning uchun javob ikkita maxsus shakldan biri bo'ladi — barcha sonlar yoki yechim yo'q. Qaysi biri ekani tarmoqlarning yo'nalishi va tengsizlik belgisi bilan aniqlanadi.",
    'Верно, все три выражения на месте. Правило собирает в одно предложение три дела урока: при нулевом дискриминанте парабола касается оси, а не пересекает её; по обе стороны от точки касания знак остаётся одинаковым, ведь парабола не переходит на другую сторону; а при отрицательном дискриминанте общих точек нет, поэтому ответом будет одна из двух особых форм — любое число или решений нет. Какая именно, определяют направление ветвей и знак неравенства.',
    'Correct, all three phrases are in place. The rule gathers the three jobs of the lesson into one sentence: with a zero discriminant the parabola touches the axis rather than crossing it; on both sides of the point of tangency the sign stays the same, since the parabola never gets to the other side; and with a negative discriminant there are no common points, so the answer is one of two special forms — all numbers, or no solution. Which one is decided by the direction of the branches and the sign of the inequality.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Kesish ikkita nuqtada bo'ladi va faqat diskriminant musbat bo'lganda. Nol diskriminantda parabola o'qqa tegib o'tadi — bir nuqta, ikkinchi tomonga o'tmasdan.",
      'Пересечение бывает в двух точках и только при положительном дискриминанте. При нулевом парабола касается оси — одна точка, без перехода на другую сторону.',
      'Crossing happens at two points and only when the discriminant is positive. At zero the parabola merely touches the axis — one point, without getting to the other side.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ishora teskari bo'lishi uchun grafik o'qni KESIB o'tishi kerak. Urinishda esa u o'qqa tegib qaytadi, ya'ni ikkala tomonda bir xil ishorada qoladi.",
      'Чтобы знак стал противоположным, график должен ПЕРЕСЕЧЬ ось. А при касании он отходит назад, то есть с обеих сторон остаётся один знак.',
      'For the sign to become opposite, the graph must CROSS the axis. At a tangency it turns back instead, so the sign is the same on both sides.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Bitta son javob bo'ladigan hol boshqa: u diskriminant NOLGA teng va belgi qat'iy emas bo'lganda chiqadi. Manfiy diskriminantda umumiy nuqta umuman yo'q.",
      'Случай, когда ответ — одно число, другой: он бывает при дискриминанте, равном НУЛЮ, и нестрогом знаке. При отрицательном дискриминанте общих точек нет вовсе.',
      'The case where the answer is a single number is different: it happens when the discriminant is ZERO and the sign is non-strict. With a negative discriminant there are no common points at all.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nol diskriminantda grafik o'q bilan nima qilishi haqida, ikkinchisi urinish nuqtasida ishora haqida, uchinchisi esa manfiy diskriminantdagi javob shakli haqida.",
    'Проверяй каждую клетку самим предложением: первая про то, что делает график с осью при нулевом дискриминанте, вторая про знак в точке касания, третья про форму ответа при отрицательном дискриминанте.',
    'Check each blank against the sentence itself: the first is about what the graph does with the axis at a zero discriminant, the second about the sign at a tangency, the third about the form of the answer at a negative discriminant.'),
};

export default function D14_10(props) { return <ClozeBank data={DATA} {...props} />; }
