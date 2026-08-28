// Dars09 · Amaliyot 08 — So'zlar · 🔴 · teg: vieta-teskari-notogri
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Darsning uchala tasdig'i bir gapda: yechim ikkala tenglamani ham
// qanoatlantiradi, Viyet teoremasining teskarisi, va yig'indining kvadrati.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'vieta-teskari-notogri', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      'Sistemaning yechimi —',
      'Решение системы — это пара, удовлетворяющая',
      'A solution of a system is a pair that satisfies') },
    { slot: 0 },
    { text: L(
      "tenglamani ham qanoatlantiradigan juftlik. Yig'indi va ko'paytma ma'lum bo'lsa, sonlar",
      'уравнениям. Если известны сумма и произведение, числа являются корнями',
      'equations. If the sum and the product are known, the numbers are the roots of a') },
    { slot: 1 },
    { text: L(
      "tenglamaning ildizlari bo'ladi. Kvadratlar yig'indisiga ikki karra ko'paytma",
      'уравнения. Если к сумме квадратов удвоенное произведение',
      'equation. If twice the product is') },
    { slot: 2 },
    { text: L(
      "yig'indining kvadrati hosil bo'ladi.",
      ', получится квадрат суммы.',
      'to the sum of the squares, the square of the sum appears.') },
  ],
  cards: [
    { id: 'w1', label: L('ikkala', 'обоим', 'both') },
    { id: 'w2', label: L('kvadrat', 'квадратного', 'quadratic') },
    { id: 'w3', label: L("qo'shilsa", 'прибавить', 'added') },
    { id: 'w4', label: L('bitta', 'одному', 'one') },
    { id: 'w5', label: L('chiziqli', 'линейного', 'linear') },
    { id: 'w6', label: L('ayirilsa', 'вычесть', 'subtracted') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoidada darsning uchta ishi turibdi: yechim ikkala tenglamaga ham tegishli, yig'indi bilan ko'paytma sonlarni kvadrat tenglama orqali beradi, va kvadratlar yig'indisi ikki karra ko'paytma bilan to'ldirilganda yig'indining kvadratiga aylanadi.",
    'Верно, все три слова на месте. В правиле стоят три дела урока: решение относится к обоим уравнениям, сумма с произведением дают числа через квадратное уравнение, а сумма квадратов, дополненная удвоенным произведением, превращается в квадрат суммы.',
    'Correct, all three words are in place. The rule holds the three jobs of the lesson: a solution belongs to both equations, the sum and the product give the numbers through a quadratic equation, and the sum of the squares completed by twice the product turns into the square of the sum.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Bitta tenglamani qanoatlantiradigan juftliklar juda ko'p. Yechim bo'lishi uchun ikkalasi ham bir vaqtda bajarilishi kerak.",
      'Пар, удовлетворяющих одному уравнению, очень много. Чтобы быть решением, должны выполняться оба сразу.',
      'There are very many pairs satisfying one equation. To be a solution, both must hold at once.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Chiziqli tenglamaning bitta ildizi bor, bu yerda esa ikkita son qidirilyapti. Ikkita ildiz kvadrat tenglamadan chiqadi.",
      'У линейного уравнения один корень, а здесь ищут два числа. Два корня даёт квадратное уравнение.',
      'A linear equation has one root, but two numbers are being sought here. Two roots come from a quadratic equation.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Yig'indining kvadratini yozib ko'ring: iks kvadrat QO'SHUV ikki iks igrek QO'SHUV igrek kvadrat. Ikkala qo'shuv ham qo'shish, ayirish emas.",
      'Выпиши квадрат суммы: икс в квадрате ПЛЮС два икс игрек ПЛЮС игрек в квадрате. Оба плюса — сложение, а не вычитание.',
      'Write out the square of a sum: x squared PLUS two xy PLUS y squared. Both signs are addition, not subtraction.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nechta tenglama haqida, ikkinchisi qanday tenglama haqida, uchinchisi esa qanday amal haqida.",
    'Проверяй каждую клетку самим предложением: первое про число уравнений, второе про вид уравнения, третье про действие.',
    'Check each blank against the sentence itself: the first is about how many equations, the second about which kind of equation, the third about which operation.'),
};

export default function D09_08(props) { return <ClozeBank data={DATA} {...props} />; }
