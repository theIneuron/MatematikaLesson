// Dars03 · Amaliyot 09 — O'rin almashtirish qayerda ishlaydi · 🔴 · tag: swap_works
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// O'rin almashtirish faqat QO'SHISH va KO'PAYTIRISHDA ishlaydi. Ayirish va
// bo'lishda sonlarning o'rni almashsa qiymat o'zgaradi -- ko'pincha esa
// umuman boshqa son chiqadi.
// Tekshirilgan:
//   19 + 46  -> 65 va 65      o'zgarmaydi   HA
//   19 · 46  -> 874 va 874    o'zgarmaydi   HA
//   25 + 40  -> 65 va 65      o'zgarmaydi   HA
//   19 − 46  -> −27, teskarisi 27           yo'q
//   144 : 12 -> 12, teskarisi 1/12          yo'q
//   100 : 4  -> 25, teskarisi 1/25          yo'q
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'swap_works', level: '🔴', col: 165, itemSize: 22,
  eyebrow: L("O'rin almashtirish", 'Перестановка', 'Swapping'),
  setup: L(
    "Ba'zi amallarda sonlarning o'rnini almashtirsak qiymat o'zgarmaydi, ba'zilarida esa o'zgaradi.",
    'В одних действиях от перестановки чисел значение не меняется, в других меняется.',
    'In some operations swapping the numbers leaves the value the same, in others it does not.'),
  ask: L("Sonlar o'rni almashsa ham qiymati O'ZGARMAYDIGAN yozuvlarni belgilang.", 'Отметь записи, значение которых НЕ изменится, если поменять числа местами.', 'Mark the records whose value does NOT change when the numbers swap places.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['19', '+', '46'], hit: true },
    { id: 'n1', tokens: ['19', '−', '46'], hit: false },
    { id: 'p2', tokens: ['19', '·', '46'], hit: true },
    { id: 'n2', tokens: ['144', ':', '12'], hit: false },
    { id: 'p3', tokens: ['25', '+', '40'], hit: true },
    { id: 'n3', tokens: ['100', ':', '4'], hit: false },
  ],
  correctText: L(
    "To'g'ri. O'rin almashtirish qo'shish va ko'paytirishda ishlaydi. Ayirish va bo'lishda sonlarning o'rni QAT'IY.",
    'Верно. Перестановка работает в сложении и умножении. В вычитании и делении место чисел СТРОГОЕ.',
    'Correct. Swapping works in addition and multiplication. In subtraction and division the places are FIXED.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "19 − 46 da o'rin almashsa 46 − 19 chiqadi, ya'ni −27 o'rniga 27. Bu boshqa son.",
      'В 19 − 46 после перестановки выйдет 46 − 19, то есть 27 вместо −27. Это другое число.',
      'In 19 − 46 swapping gives 46 − 19, that is 27 instead of −27. A different number.') },
    { when: (s) => s.extra.indexOf('n2') !== -1 || s.extra.indexOf('n3') !== -1, text: L(
      "Bo'lishda o'rin almashtirib bo'lmaydi: 144 : 12 = 12, lekin 12 : 144 butun son ham emas.",
      'В делении переставлять нельзя: 144 : 12 = 12, а 12 : 144 даже не целое число.',
      'You cannot swap in a division: 144 : 12 = 12, while 12 : 144 is not even a whole number.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: qo'shishda ham, ko'paytirishda ham sonlarning o'rni erkin.",
      'Одну пропустил: и в сложении, и в умножении место чисел свободное.',
      'One is missing: in both addition and multiplication the places are free.') },
  ],
  wrongText: L(
    "Har yozuvda amalga qarang: qo'shish va ko'paytirishda o'rin almashtirish ishlaydi, ayirish va bo'lishda esa ishlamaydi.",
    'Смотри на действие в каждой записи: в сложении и умножении перестановка работает, в вычитании и делении — нет.',
    'Look at the operation in each record: swapping works in addition and multiplication, not in subtraction or division.'),
};

export default function D03_09(props) { return <MarkAll data={DATA} {...props} />; }
