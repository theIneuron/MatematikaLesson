// Dars03 · Amaliyot 09 — O'rin almashtirish qayerda ishlaydi · 🔴 · tag: swap_works
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): manfiy son va o'nli kasr
// qo'shildi, ya'ni «musbat butun sonlar» odati ishlamaydi.
//
// O'rin almashtirish faqat QO'SHISH va KO'PAYTIRISHDA ishlaydi -- sonlar
// manfiy yoki kasr bo'lsa ham. Ayirish va bo'lishda esa ishlamaydi.
// Tekshirilgan:
//   −1900 + 4600  -> 2700, teskarisi 4600 + (−1900) = 2700   HA
//   −19 · 4600    -> −87400, teskarisi bir xil               HA
//   0,5 + 4000    -> 4000,5, teskarisi 4000 + 0,5 = 4000,5   HA
//   1900 − 4600   -> −2700, teskarisi 2700                   yo'q
//   14400 : (−12) -> −1200, teskarisi butun son emas         yo'q
//   10000 : 0,5   -> 20000, teskarisi 0,00005                yo'q
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
    { id: 'p1', tokens: ['−1900', '+', '4600'], hit: true },
    { id: 'n1', tokens: ['1900', '−', '4600'], hit: false },
    { id: 'p2', tokens: ['−19', '·', '4600'], hit: true },
    { id: 'n2', tokens: ['14400', ':', '(−12)'], hit: false },
    { id: 'p3', tokens: ['0,5', '+', '4000'], hit: true },
    { id: 'n3', tokens: ['10000', ':', '0,5'], hit: false },
  ],
  correctText: L(
    "To'g'ri. O'rin almashtirish qo'shish va ko'paytirishda ishlaydi, ishora va kasr bunga to'sqinlik qilmaydi. Ayirish va bo'lishda esa sonlarning o'rni QAT'IY.",
    'Верно. Перестановка работает в сложении и умножении, знак и дробь этому не мешают. А в вычитании и делении место чисел СТРОГОЕ.',
    'Correct. Swapping works in addition and multiplication; signs and decimals do not matter. In subtraction and division the places are FIXED.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "1900 − 4600 = −2700, teskarisi 4600 − 1900 = 2700. Modul o'sha, lekin ishora boshqa -- ya'ni son boshqa.",
      '1900 − 4600 = −2700, а наоборот 4600 − 1900 = 2700. Модуль тот же, но знак другой — значит число другое.',
      '1900 − 4600 = −2700, the other way 4600 − 1900 = 2700. Same size, different sign — a different number.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "10000 : 0,5 = 20000, teskarisi esa 0,5 : 10000 juda kichik son. Bo'lishda o'rin almashtirib bo'lmaydi.",
      '10000 : 0,5 = 20000, а наоборот 0,5 : 10000 — совсем маленькое число. В делении переставлять нельзя.',
      '10000 : 0,5 = 20000, the other way 0,5 : 10000 is a tiny number. You cannot swap in a division.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "14400 : (−12) = −1200, teskarisi butun son ham emas. Bo'linuvchi va bo'luvchining o'rni qat'iy.",
      '14400 : (−12) = −1200, а наоборот даже не целое число. Место делимого и делителя строгое.',
      '14400 : (−12) = −1200; the other way is not even a whole number. Dividend and divisor have fixed places.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "0,5 + 4000 ni tekshirmadingiz: qo'shishda o'rin almashtirish kasr bilan ham ishlaydi.",
      'Ты не проверил 0,5 + 4000: в сложении перестановка работает и с дробью.',
      'You did not check 0,5 + 4000: swapping works in addition with decimals too.') },
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
