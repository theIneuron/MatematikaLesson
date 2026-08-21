// Dars03 · Amaliyot 09 — O'rin almashtirish qayerda ishlaydi · 🔴 · tag: swap_works
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): manfiy son va o'nli kasr
// qo'shildi, ya'ni «musbat butun sonlar» odati ishlamaydi.
//
// O'rin almashtirish faqat QO'SHISH va KO'PAYTIRISHDA ishlaydi -- sonlar
// manfiy yoki kasr bo'lsa ham. Ayirish va bo'lishda esa ishlamaydi.
// Tekshirilgan:
//   −19 + 46      -> 27,  teskarisi 46 + (−19) = 27      HA
//   −19 · 46      -> −874, teskarisi 46 · (−19) = −874   HA
//   0,5 + 40      -> 40,5, teskarisi 40 + 0,5 = 40,5     HA
//   19 − 46       -> −27, teskarisi 27                   yo'q
//   144 : (−12)   -> −12, teskarisi −1/12                yo'q
//   100 : 0,5     -> 200, teskarisi 0,005                yo'q
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'swap_works', level: '🔴', col: 170, itemSize: 21,
  eyebrow: L("O'rin almashtirish", 'Перестановка', 'Swapping'),
  setup: L(
    "Ba'zi amallarda sonlarning o'rnini almashtirsak qiymat o'zgarmaydi -- sonlar manfiy yoki kasr bo'lsa ham. Ba'zilarida esa o'zgaradi.",
    'В одних действиях от перестановки чисел значение не меняется — даже если числа отрицательные или дробные. В других меняется.',
    'In some operations swapping leaves the value the same — even for negatives or decimals. In others it does not.'),
  ask: L("Sonlar o'rni almashsa ham qiymati O'ZGARMAYDIGAN yozuvlarni belgilang.", 'Отметь записи, значение которых НЕ изменится, если поменять числа местами.', 'Mark the records whose value does NOT change when the numbers swap.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['−19', '+', '46'], hit: true },
    { id: 'n1', tokens: ['19', '−', '46'], hit: false },
    { id: 'p2', tokens: ['−19', '·', '46'], hit: true },
    { id: 'n2', tokens: ['144', ':', '(−12)'], hit: false },
    { id: 'p3', tokens: ['0,5', '+', '40'], hit: true },
    { id: 'n3', tokens: ['100', ':', '0,5'], hit: false },
  ],
  correctText: L(
    "To'g'ri. O'rin almashtirish qo'shish va ko'paytirishda ishlaydi, ishora va kasr bunga to'sqinlik qilmaydi. Ayirish va bo'lishda esa sonlarning o'rni QAT'IY.",
    'Верно. Перестановка работает в сложении и умножении, знак и дробь этому не мешают. А в вычитании и делении место чисел СТРОГОЕ.',
    'Correct. Swapping works in addition and multiplication; signs and decimals do not matter. In subtraction and division the places are FIXED.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "19 − 46 = −27, teskarisi 46 − 19 = 27. Modul o'sha, lekin ishora boshqa -- ya'ni son boshqa.",
      '19 − 46 = −27, а наоборот 46 − 19 = 27. Модуль тот же, но знак другой — значит число другое.',
      '19 − 46 = −27, the other way 46 − 19 = 27. Same size, different sign — a different number.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "100 : 0,5 = 200, teskarisi esa 0,5 : 100 = 0,005. Bo'lishda o'rin almashtirib bo'lmaydi.",
      '100 : 0,5 = 200, а наоборот 0,5 : 100 = 0,005. В делении переставлять нельзя.',
      '100 : 0,5 = 200, the other way 0,5 : 100 = 0,005. You cannot swap in a division.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "144 : (−12) = −12, teskarisi butun son ham emas. Bo'linuvchi va bo'luvchining o'rni qat'iy.",
      '144 : (−12) = −12, а наоборот даже не целое число. Место делимого и делителя строгое.',
      '144 : (−12) = −12; the other way is not even a whole number. Dividend and divisor have fixed places.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "0,5 + 40 ni tekshirmadingiz: qo'shishda o'rin almashtirish kasr bilan ham ishlaydi.",
      'Ты не проверил 0,5 + 40: в сложении перестановка работает и с дробью.',
      'You did not check 0,5 + 40: swapping works in addition with decimals too.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: amalga qarang, son manfiy yoki kasr bo'lishi ahamiyatsiz.",
      'Одну пропустил: смотри на действие, а отрицательное число или дробь значения не имеют.',
      'One is missing: look at the operation; a negative or a decimal makes no difference.') },
  ],
  wrongText: L(
    "Har yozuvda AMALGA qarang: qo'shish va ko'paytirishda o'rin almashtirish ishlaydi, ayirish va bo'lishda esa yo'q.",
    'Смотри на ДЕЙСТВИЕ в каждой записи: в сложении и умножении перестановка работает, в вычитании и делении — нет.',
    'Look at the OPERATION in each record: swapping works in addition and multiplication, not in subtraction or division.'),
};

export default function D03_09(props) { return <MarkAll data={DATA} {...props} />; }
