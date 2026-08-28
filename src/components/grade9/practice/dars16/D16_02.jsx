// Dars16 · Amaliyot 02 — Ha/yo'q · 🟢 · teg: chegara-turini-notogri-kochirish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Sistema: x > −4 va x ≤ 3. Uchala hukm ham CHEGARA nuqtalari haqida:
// nol — ichkarida, uch — yopiq chegara (kiradi), minus to'rt — ochiq
// chegara (kirmaydi). Aynan shu ikki chegara har xil turda.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'chegara-turini-notogri-kochirish', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Sistemaning ikkita chegarasi har xil turda: bittasi qat'iy, ikkinchisi qat'iy emas.",
    'У системы две границы разного типа: одна строгая, другая нестрогая.',
    'The system has two boundaries of different kinds: one strict, one non-strict.'),
  ask: L(
    "Har bir son uchun «Ha» yoki «Yo'q» ni tanlang: u sistemaning yechimimi?",
    'Для каждого числа выбери «Да» или «Нет»: оно решение системы?',
    'For each number choose "Yes" or "No": is it a solution of the system?'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x > −4'], ['x ≤ 3']],
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['x = 0'], yes: true, claim: L(
      "— sistemaning yechimi.",
      '— решение системы.',
      'is a solution of the system.') },
    { id: 's2', tokens: ['x = 3'], yes: true, claim: L(
      "— sistemaning yechimi.",
      '— решение системы.',
      'is a solution of the system.') },
    { id: 's3', tokens: ['x = −4'], yes: false, claim: L(
      "— sistemaning yechimi.",
      '— решение системы.',
      'is a solution of the system.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri. Nol ikkala shartni ham bajaradi: nol minus to'rtdan katta, va nol uchdan kichik. Uch ham yechim, chunki ikkinchi belgi qat'iy EMAS: uch uchga teng bo'lishi mumkin. Minus to'rt esa yechim emas: birinchi belgi QAT'IY, ya'ni minus to'rtdan qat'iy katta bo'lishi kerak, o'zi kirmaydi. Bitta sistemada ikkita chegara har xil turda bo'lishi mumkin, va ularni aralashtirib yubormaslik kerak.",
    'Верно. Нуль выполняет оба условия: нуль больше минус четырёх и нуль меньше трёх. Тройка тоже решение, ведь второй знак НЕстрогий: икс может быть равен трём. А минус четыре решением не является: первый знак СТРОГИЙ, то есть икс должен быть строго больше минус четырёх, сама граница не входит. В одной системе границы бывают разного типа, и путать их нельзя.',
    'Correct. Zero satisfies both conditions: zero is greater than minus four, and zero is less than three. Three is a solution too, since the second sign is NON-strict: x may equal three. But minus four is not: the first sign is STRICT, so x must be strictly greater than minus four, and the boundary itself is out. In one system the two boundaries may be of different kinds, and they must not be mixed up.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi belgi «kichik YOKI TENG», ya'ni uchning o'zi ham bo'lishi mumkin. Uchni ikkala shartga qo'yib ko'ring: uch minus to'rtdan katta, va uch uchga teng — ikkalasi ham bajariladi.",
      'Второй знак «меньше ИЛИ РАВНО», то есть сама тройка возможна. Подставь три в оба условия: три больше минус четырёх, и три равно трём — оба выполнены.',
      'The second sign is "less than OR EQUAL", so three itself is allowed. Put three into both conditions: three is greater than minus four, and three equals three — both hold.') },
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Birinchi belgi qat'iy: iks minus to'rtdan KATTA bo'lishi kerak, teng bo'lishi mumkin emas. Minus to'rtning o'zi javobga kirmaydi.",
      'Первый знак строгий: икс должен быть БОЛЬШЕ минус четырёх, равным быть не может. Само минус четыре в ответ не входит.',
      'The first sign is strict: x must be GREATER than minus four, it cannot be equal. Minus four itself is not in the answer.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Nolni ikkala tengsizlikka qo'yib ko'ring: nol minus to'rtdan kattami? Ha. Nol uchdan kichikmi? Ha. Ikkalasi ham bajarilsa, son yechim bo'ladi.",
      'Подставь нуль в оба неравенства: нуль больше минус четырёх? Да. Нуль меньше трёх? Да. Если выполнены оба, число — решение.',
      'Put zero into both inequalities: is zero greater than minus four? Yes. Is zero less than three? Yes. If both hold, the number is a solution.') },
  ],
  wrongText: L(
    "Har bir sonni IKKALA tengsizlikka alohida qo'yib ko'ring va belgining turiga qarang: «katta» bilan «katta yoki teng» boshqa narsa.",
    'Подставляй каждое число в ОБА неравенства по отдельности и смотри на тип знака: «больше» и «больше или равно» — разные вещи.',
    'Put each number into BOTH inequalities separately and mind the kind of sign: "greater than" and "greater than or equal" are different things.'),
};

export default function D16_02(props) { return <TrueFalse data={DATA} {...props} />; }
