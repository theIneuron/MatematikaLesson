// Dars16 · Amaliyot 09 — So'zlar · 🔴 · teg: kesishma-emas-birlashma-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Qoida darsning uchala tasdig'ini bir gapga yig'adi. Kartalar butun
// ibora bilan tushadi: uch tilda gap qurilishi boshqa, va yolg'iz so'z
// qo'yilsa grammatika buziladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'kesishma-emas-birlashma-deb-oylash', level: '🔴',
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
      "Sistemaning yechimi — ",
      'Решение системы — это числа, которые удовлетворяют',
      'The solution of a system is the numbers that satisfy') },
    { slot: 0 },
    { text: L(
      "qanoatlantiradigan sonlar, ya'ni ikki yechimning",
      ', то есть',
      ', that is, the') },
    { slot: 1 },
    { text: L(
      ". Umumiy qism topilmasa, sistemaning",
      'двух решений. Если общей части нет, то',
      'of the two solutions. If there is no common part,') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  // KARTALAR QISQA: uzunroq varianti telefonda RU tilida kadrdan 8px
  // chiqib ketardi (tekshiruv 2026-08-28).
  cards: [
    { id: 'w1', label: L("ikkalasini birga", 'обоим сразу', 'both at once') },
    { id: 'w2', label: L('umumiy qismi', 'общая часть', 'common part') },
    { id: 'w3', label: L("yechimi yo'q", 'решений нет', 'it has no solution') },
    { id: 'w4', label: L("bittasini bo'lsa ham", 'хотя бы одному', 'just one of them') },
    { id: 'w5', label: L('birlashmasi', 'объединение', 'union') },
    { id: 'w6', label: L('javobi barcha sonlar', 'подходит любое число', 'any number works') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala ibora ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: «va» ikkala shartni bir vaqtda talab qiladi, ya'ni son ikkala javobga ham tushishi kerak; o'qda bu ikki to'plamning umumiy qismi bo'ladi, birlashmasi emas; va umumiy qism topilmasa, sistemaning yechimi yo'q — bu ham to'liq javob, xato emas.",
    'Верно, все три выражения на месте. Правило собирает в одно предложение три дела урока: «и» требует оба условия одновременно, то есть число должно попасть в оба ответа; на оси это общая часть двух множеств, а не их объединение; а если общей части нет, у системы нет решений — это тоже полноценный ответ, а не ошибка.',
    'Correct, all three phrases are in place. The rule gathers the three jobs of the lesson into one sentence: "and" demands both conditions at once, so a number must fall into both answers; on the axis that is the common part of the two sets, not their union; and if there is no common part, the system has no solution — which is a complete answer, not a mistake.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "«Hech bo'lmasa bittasi» — bu «yoki» ning ta'rifi. Sistemada esa «va» turibdi: ikkala shart ham bir vaqtda bajarilishi kerak.",
      '«Хотя бы одному» — это определение «или». А в системе стоит «и»: оба условия должны выполняться одновременно.',
      '"At least one" is the definition of "or". But a system holds "and": both conditions must hold at once.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Birlashma «yoki» ga tegishli: u ikkala qismni ham oladi. Sistemada esa faqat ustma-ust tushgan qism qoladi, ya'ni umumiy qism.",
      'Объединение относится к «или»: оно берёт обе части. А в системе остаётся только наложившаяся часть, то есть общая.',
      'A union belongs to "or": it takes both parts. In a system only the overlapping part is left, that is, the common part.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Umumiy qism yo'q bo'lsa, hech bir son ikkala shartni bir vaqtda bajarmaydi — demak yechim yo'q. «Barcha sonlar» esa teskari hol.",
      'Если общей части нет, ни одно число не выполняет оба условия одновременно — значит решений нет. А «любое число» — противоположный случай.',
      'If there is no common part, no number satisfies both conditions at once — so there is no solution. "Any number" is the opposite case.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi son nechta shartni bajarishi haqida, ikkinchisi o'qda nima olinishi haqida, uchinchisi esa umumiy qism yo'q bo'lgan hol haqida.",
    'Проверяй каждую клетку самим предложением: первая про то, скольким условиям отвечает число, вторая про то, что берут на оси, третья про случай, когда общей части нет.',
    'Check each blank against the sentence itself: the first is about how many conditions a number meets, the second about what is taken on the axis, the third about the case with no common part.'),
};

export default function D16_09(props) { return <ClozeBank data={DATA} {...props} />; }
