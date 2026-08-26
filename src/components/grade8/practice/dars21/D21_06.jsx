// Dars21 · Amaliyot 06 — Ha yoki yo'q · 🟡 · tag: problem_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 6-pozitsiya)
//
// IKKI MULOHAZA — BIR ISHNING IKKI HOLI. Birinchisida rad etish TO'G'RI
// bajarilgan va uni tasdiqlash kerak; ikkinchisida esa u umuman
// bajarilmagan (З47). Ya'ni o'quvchi «manfiy ildiz har doim yomon» degan
// qoidani emas, SOLISHTIRISH ishini o'rganadi.
//
// Ikkinchi mulohazada ildizlar nolga nosimmetrik (4 va −5): manfiy ildiz
// «birinchisining aksi» bo'lgani uchun emas, MASALA SHARTI bo'yicha rad
// etiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'problem_claims', level: '🟡',
  itemSize: 15,
  items: [
    { id: 's1', yes: true,
      tokens: ['x = 6', ';', 'x = −6'],
      claim: L("tomon uzunligi so'raldi, javob: 6", 'спрашивали длину стороны, ответ: 6', 'a side length was asked for, answer: 6') },
    { id: 's2', yes: true,
      tokens: ['x = 4', ';', 'x = −5'],
      claim: L("tezlik so'raldi, javob: 4", 'спрашивали скорость, ответ: 4', 'a speed was asked for, answer: 4') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki masala yechilgan va har birida ikki ildiz chiqqan. Pastda yozilgan javoblarni masala sharti bilan solishtirish kerak.",
    'Две задачи решены, и в каждой вышло два корня. Записанные ниже ответы надо сверить с условием задачи.',
    'Two problems were solved and each gave two roots. The answers written below must be compared with the condition.'),
  ask: L(
    "Javob to'g'ri yozilgan bo'lsa «Ha», noto'g'ri bo'lsa «Yo'q».",
    'Если ответ записан верно — «Да», если неверно — «Нет».',
    'If the answer is written correctly, «Yes»; if not, «No».'),
  correctText: L(
    "To'g'ri. Ikkala qatorda ham ish oxirigacha bajarilgan: ikki ildiz topilgan va shartga zid ildiz rad etilgan. Birinchisida minus olti — uzunlik manfiy bo'lmaydi; ikkinchisida minus besh — tezlik ham. Ikki ildizni topish ishning yarmi.",
    'Верно. В обеих строках работа доведена до конца: два корня найдены и противоречащий условию отброшен. В первой минус шесть — длина не бывает отрицательной; во второй минус пять — скорость тоже. Найти два корня — половина работы.',
    'Correct. In both rows the work is finished: two roots were found and the one contradicting the condition was rejected. In the first minus six — a length is never negative; in the second minus five — nor is a speed. Finding two roots is half the work.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi mulohaza rost. Tenglamaning ikki ildizi bor, lekin javobga faqat bittasi kirgan — va aynan shunday bo'lishi kerak. Minus olti tenglamani to'g'ri qiladi, ammo tomonning uzunligi bo'lolmaydi. Ikkita ildiz topilgani hali javob ikkita degani emas.",
      'Первое утверждение верно. У уравнения два корня, но в ответ вошёл только один — и так и должно быть. Минус шесть обращает уравнение в верное, но длиной стороны быть не может. То, что корней найдено два, не значит, что и ответов два.',
      'The first claim is true. The equation has two roots, but only one entered the answer — and that is exactly right. Minus six satisfies the equation yet cannot be the length of a side. Finding two roots does not mean there are two answers.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
        "Ikkinchi mulohaza rost: tezlik manfiy bo'lmaydi, shuning uchun minus besh rad etilgan va javobda faqat to'rt qolgan. Diqqat: ildizlar nolga simmetrik emas — rad etish MASALA sharti bo'yicha qilinadi.",
        'Второе утверждение верно: скорость отрицательной не бывает, поэтому минус пять отброшен и в ответе осталось только четыре. Обрати внимание: корни не симметричны нулю — отбрасывают по УСЛОВИЮ задачи.',
        'The second claim is true: a speed is never negative, so minus five was rejected and only four remained. Note: the roots are not symmetric about zero — the rejection follows from the PROBLEM.') },
  ],
  wrongText: L(
    "Har javobni masalaning kattaligiga solishtiring: uzunlik ham, tezlik ham manfiy bo'lmaydi. Shartga zid ildiz javobdan chiqarib tashlanadi, hatto u tenglamani to'g'ri qilsa ham.",
    'Сверяй каждый ответ с величиной из задачи: ни длина, ни скорость отрицательными не бывают. Корень, противоречащий условию, из ответа исключается, даже если он обращает уравнение в верное.',
    'Compare every answer with the quantity in the problem: neither a length nor a speed is ever negative. A root contradicting the condition is dropped from the answer even if it satisfies the equation.'),
};

export default function D21_06(props) { return <TrueFalse data={DATA} {...props} />; }
