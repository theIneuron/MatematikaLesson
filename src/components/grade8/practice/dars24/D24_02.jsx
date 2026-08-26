// Dars24 · Amaliyot 02 — Munosabat · 🟢 · tag: multiply_by_negative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 2-pozitsiya)
//
// T2 SOF HOLDA, SONSIZ. a va b qanday son ekani noma'lum, lekin xulosa
// baribir aniq: minus uchga ko'paytirilganda ishora buriladi.
//
// Uch xato variant: ishorani saqlash (З52), tenglik (ko'paytirish farqni
// yo'qotadi degan qarash) va «aniqlab bo'lmaydi» — darsning butun mag'zini
// rad etish, chunki xossalar aynan shu holda ishlaydi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'multiply_by_negative', level: '🟢',
  correct: 0, optCols: 2, optSize: 19,
  expr: ['a > b'], exprSize: 30,
  eyebrow: L('Munosabat', 'Отношение', 'The relation'),
  setup: L(
    "a soni b sonidan katta. Ikkala son ham minus 3 ga ko'paytirildi. Sonlarning o'zi noma'lum, lekin natijani aytish mumkin.",
    'Число a больше числа b. Оба числа умножили на минус 3. Сами числа неизвестны, но результат назвать можно.',
    'The number a is greater than the number b. Both were multiplied by minus 3. The numbers themselves are unknown, but the result can be stated.'),
  ask: L(
    '−3a va −3b orasida qanday munosabat bor?',
    'Какое отношение между −3a и −3b?',
    'What is the relation between −3a and −3b?'),
  opts: [
    { label: ['−3a < −3b'] },
    { label: ['−3a > −3b'] },
    { label: ['−3a = −3b'] },
    { label: L("aniqlab bo'lmaydi", 'определить нельзя', 'it cannot be determined') },
  ],
  correctText: L(
    "To'g'ri. Manfiy songa ko'paytirilganda ishora qarama-qarshisiga o'zgaradi. Sonlarda tekshiring: a besh, b uch — minus o'n besh minus to'qqizdan kichik. Boshqa juftlikda ham shunday: a minus bir, b minus to'rt — uch o'n ikkidan kichik.",
    'Верно. При умножении на отрицательное знак меняется на противоположный. Проверь числами: a пять, b три — минус пятнадцать меньше минус девяти. С другой парой так же: a минус один, b минус четыре — три меньше двенадцати.',
    'Correct. Multiplying by a negative turns the sign into its opposite. Check with numbers: a five, b three — minus fifteen is less than minus nine. The same with another pair: a minus one, b minus four — three is less than twelve.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ishora saqlab qolingan, lekin ko'paytuvchi MANFIY. Sonlarda tekshiring: a besh, b uch. Minus o'n besh va minus to'qqiz — qaysi biri katta? Son o'qida minus to'qqiz o'ngroqda turadi, ya'ni u katta. Demak minus uch a kichik chiqadi.",
      'Знак сохранён, но множитель ОТРИЦАТЕЛЬНЫЙ. Проверь числами: a равно пяти, b трём. Минус пятнадцать и минус девять — какое больше? На числовой прямой минус девять правее, значит больше оно. Значит минус три a выходит меньше.',
      'The sign was kept, but the multiplier is NEGATIVE. Check with numbers: a is five, b is three. Minus fifteen and minus nine — which is greater? On the number line minus nine lies further right, so it is greater. Hence minus three a comes out smaller.') },
    { when: (s) => s.picked === 2, text: L(
      "Ko'paytirish farqni yo'qotmaydi. a bilan b turli son edi, minus uchga ko'paytirilgandan keyin ham ular turli qoladi: minus o'n besh va minus to'qqiz teng emas. Tenglik faqat a bilan b teng bo'lganda paydo bo'lardi, yoki ko'paytuvchi nol bo'lganda.",
      'Умножение разницу не убирает. a и b были разными числами, и после умножения на минус три они остаются разными: минус пятнадцать и минус девять не равны. Равенство возникло бы, только если бы a и b были равны, или если бы множитель был нулём.',
      'Multiplication does not erase the difference. a and b were different numbers, and after multiplying by minus three they stay different: minus fifteen and minus nine are not equal. Equality would arise only if a and b were equal, or if the multiplier were zero.') },
    { when: (s) => s.picked === 3, text: L(
      "Aniqlash mumkin, va aynan shu darsning ishi. Sonlarning o'zini bilish shart emas: tengsizlikning ikkala qismi bir xil manfiy songa ko'paytirilganda ishora har doim buriladi. Qanday sonlarni olib tekshirmang, natija bir xil chiqadi.",
      'Определить можно, и это как раз работа урока. Знать сами числа не обязательно: если обе части неравенства умножить на одно и то же отрицательное число, знак всегда переворачивается. Какие числа ни подставь, результат один.',
      'It can be determined, and that is exactly the work of this lesson. Knowing the numbers is not required: if both sides of an inequality are multiplied by the same negative number, the sign always flips. Whichever numbers you substitute, the result is the same.') },
  ],
  wrongText: L(
    "Ko'paytuvchi manfiy, demak ishora buriladi. Ishonch hosil qilish uchun ikki xil juftlikni qo'yib ko'ring: masalan 5 va 3, keyin −1 va −4.",
    'Множитель отрицательный, значит знак переворачивается. Чтобы убедиться, подставь две разные пары: например 5 и 3, потом −1 и −4.',
    'The multiplier is negative, so the sign flips. To be sure, substitute two different pairs: say 5 and 3, then −1 and −4.'),
};

export default function D24_02(props) { return <Choice data={DATA} {...props} />; }
