// Dars13 · Amaliyot 03 — Ha/yo'q · 🟢 · teg: shartni-notogri-tenglamaga-otkazish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Uchala hukm ham SO'ZNI tenglamaga o'tkazish haqida. Ikkinchi hukm —
// darsning eng ko'p uchraydigan adashishi: «marta katta» bilan «ga katta»
// bir xil emas.
//
// MATEMATIKA: N = 5s va s = 9 bo'lsa, N = 45; qirq beshning raqamlari
// yig'indisi to'rt qo'shuv besh, ya'ni to'qqiz — shart bajariladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'shartni-notogri-tenglamaga-otkazish', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Masala: ikki xonali son o'z raqamlari yig'indisidan besh marta katta, raqamlar yig'indisi esa to'qqiz. N — son, s — raqamlar yig'indisi.",
    'Задача: двузначное число в пять раз больше суммы своих цифр, а сумма цифр равна девяти. N — число, s — сумма цифр.',
    'Problem: a two-digit number is five times the sum of its digits, and the digit sum is nine. N is the number, s the digit sum.'),
  ask: L(
    "Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['N = 5s'], yes: true, claim: L(
      "— «besh marta katta» shartining tenglamasi.",
      '— уравнение условия «в пять раз больше».',
      'is the equation for "five times greater".') },
    { id: 's2', tokens: ['N = s + 5'], yes: false, claim: L(
      "ham xuddi shu shartni beradi.",
      'даёт то же самое условие.',
      'gives the very same condition.') },
    { id: 's3', tokens: ['N = 45'], yes: true, claim: L(
      "— shu masalaning javobi.",
      '— ответ этой задачи.',
      'is the answer to this problem.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri. «Besh marta katta» — ko'paytirish: N besh s ga teng. «Besh ga katta» esa qo'shish: N s qo'shuv beshga teng. Bu ikki tenglama butunlay boshqa. Yig'indi to'qqiz bo'lgani uchun N besh karra to'qqiz, ya'ni qirq besh. Tekshiramiz: qirq beshning raqamlari yig'indisi to'rt qo'shuv besh, ya'ni to'qqiz — ikkala shart ham bajariladi.",
    'Верно. «В пять раз больше» — это умножение: N равно пять s. А «на пять больше» — сложение: N равно s плюс пять. Эти два уравнения совершенно разные. Так как сумма цифр девять, N равно пятью девять, то есть сорок пять. Проверяем: сумма цифр сорока пяти — четыре плюс пять, то есть девять; оба условия выполнены.',
    'Correct. "Five times greater" means multiplication: N equals five s. "Greater by five" means addition: N equals s plus five. These two equations are entirely different. Since the digit sum is nine, N is five times nine, that is forty-five. Check: the digits of forty-five add to four plus five, that is nine — both conditions hold.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "«Marta katta» ko'paytirish, «ga katta» esa qo'shish. Sonlarda ko'rib chiqing: to'qqizdan besh marta katta son qirq besh, to'qqizdan besh ga katta son esa o'n to'rt.",
      '«Раз больше» — это умножение, «на больше» — сложение. Проверь на числах: в пять раз больше девяти — сорок пять, а на пять больше девяти — четырнадцать.',
      '"Times greater" is multiplication, "greater by" is addition. Check on numbers: five times nine is forty-five, while five more than nine is fourteen.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "«Besh marta katta» degani berilgan sonni beshga ko'paytirish. Sonni harf bilan yozsak: N besh s ga teng.",
      '«В пять раз больше» значит умножить данное число на пять. Записав буквой: N равно пять s.',
      '"Five times greater" means multiplying the given quantity by five. Written with letters: N equals five s.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Qirq beshni ikkala shartda ham tekshiring: u to'qqizdan besh marta kattami, va uning raqamlari yig'indisi to'qqizmi?",
      'Проверь сорок пять по обоим условиям: оно в пять раз больше девяти, и сумма его цифр девять?',
      'Test forty-five against both conditions: is it five times nine, and do its digits add up to nine?') },
  ],
  wrongText: L(
    "Har bir hukmni sonlarda tekshirib ko'ring: to'qqizni oling va uni avval beshga ko'paytiring, keyin beshga qo'shing. Natijalar bir xilmi?",
    'Проверяй каждое суждение на числах: возьми девять, сначала умножь на пять, потом прибавь пять. Результаты одинаковы?',
    'Test each claim on numbers: take nine, first multiply it by five, then add five. Are the results the same?'),
};

export default function D13_03(props) { return <TrueFalse data={DATA} {...props} />; }
