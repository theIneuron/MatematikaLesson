// Dars12 · Amaliyot 10 — Tartib · 🔴 · teg: faqat-bitta-yechim-yozish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// Sistema: x + y = 7, x² − y = 5. Qo'shsak igrek yo'qoladi: x² + x = 12,
// ya'ni x² + x − 12 = 0, ildizlari 3 va −4. Igreklar birinchi tenglamadan:
// 4 va 11. Tekshiruv: 9 − 4 = 5 va 16 − 11 = 5.
//
// Zanjirning oxirgi ikki qadami ataylab ajratilgan: ildizlar hali javob
// emas, har biri uchun igrek topilishi kerak.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'faqat-bitta-yechim-yozish', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Qo'shish usulining beshta qadami aralashtirilgan.",
    'Пять шагов способа сложения перемешаны.',
    'Five steps of the addition method are shuffled.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 14,
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x + y = 7'], ['x² − y = 5']],
  lines: [
    { id: 'c1', label: L(
      "Ikkala tenglamani qo'shamiz, igrek yo'qoladi:",
      'Складываем оба уравнения, игрек исчезает:',
      'Add both equations, y vanishes:'), tokens: ['x² + x = 12'] },
    { id: 'c2', label: L(
      'Hosil bo\'lgan tenglamani nolga keltiramiz:',
      'Приводим полученное уравнение к нулю:',
      'Bring the equation to zero:'), tokens: ['x² + x − 12 = 0'] },
    { id: 'c3', label: L(
      'Ildizlarni topamiz:',
      'Находим корни:',
      'Find the roots:'), tokens: ['x₁ = 3', ',', 'x₂ = −4'] },
    { id: 'c4', label: L(
      "Har bir iks uchun igrekni birinchi tenglamadan topamiz",
      'Для каждого икса находим игрек из первого уравнения',
      'For each x, find y from the first equation') },
    { id: 'c5', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['(3; 4)', 'va', '(−4; 11)'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Qo'shishdan iks kvadrat qo'shuv iks o'n ikkiga teng chiqadi, uni nolga keltirsak, iks kvadrat qo'shuv iks minus o'n ikki nolga teng bo'ladi: ildizlari uch va minus to'rt. Ikkita ildiz bergan joyda ikkita yechim bo'ladi, va har biri uchun igrek alohida topiladi: uchga to'rt, minus to'rtga o'n bir. Tekshiruv ikkinchi tenglamada: to'qqiz minus to'rt besh, o'n olti minus o'n bir ham besh.",
    'Верно. Из сложения выходит икс в квадрате плюс икс равно двенадцати; приведя к нулю, получим икс в квадрате плюс икс минус двенадцать равно нулю: корни три и минус четыре. Там, где корней два, и решений два, и для каждого игрек находится отдельно: трём — четыре, минус четырём — одиннадцать. Проверка во втором уравнении: девять минус четыре — пять, шестнадцать минус одиннадцать — тоже пять.',
    'Correct. Adding gives x squared plus x equals twelve; bringing it to zero gives x squared plus x minus twelve equals zero, with roots three and minus four. Where there are two roots there are two solutions, and y is found separately for each: three gives four, minus four gives eleven. Check in the second equation: nine minus four is five, sixteen minus eleven is five as well.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Javob juftliklardan iborat, ildizlar esa faqat ikslar. Har bir iks uchun igrek topilmasa, javob yozib bo'lmaydi.",
      'Ответ состоит из пар, а корни — только иксы. Пока для каждого икса не найден игрек, ответ записать нельзя.',
      'The answer consists of pairs, while the roots are only x-values. Until y is found for each x, the answer cannot be written.') },
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Nolga keltiriladigan tenglama qo'shishdan hosil bo'ladi. Qo'shishdan oldin nolga keltirish uchun hech nima yo'q.",
      'Уравнение, которое приводят к нулю, возникает после сложения. До сложения приводить нечего.',
      'The equation that gets brought to zero arises from adding. Before the adding there is nothing to bring anywhere.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Ildizlar nolga keltirilgan tenglamadan topiladi. Ikki tomonda ham had turgan yozuvdan Viyet teoremasi ham, diskriminant ham ishlamaydi.",
      'Корни находят по уравнению, приведённому к нулю. Из записи, где слагаемые стоят с обеих сторон, не работают ни теорема Виета, ни дискриминант.',
      'The roots come from the equation brought to zero. With terms on both sides neither Vieta nor the discriminant applies.') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Igrekni nimadan topasiz, agar ikslar hali topilmagan bo'lsa? Avval ildizlar chiqadi.",
      'Из чего находить игрек, если иксы ещё не найдены? Сначала выходят корни.',
      'From what would you find y if the x-values are not found yet? The roots come first.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D12_10(props) { return <OrderLines data={DATA} {...props} />; }
