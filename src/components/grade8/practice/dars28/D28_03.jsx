// Dars28 · Amaliyot 03 — Guruhlar · 🟢 · tag: fits_condition
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 3-pozitsiya)
//
// T3 SOF HOLDA, IKKI SABAB BILAN (З57). O'quvchilar soni:
//   manfiy bo'lolmaydi — minus o'n ikki, minus bir;
//   KASR ham bo'lolmaydi — nol butun besh, yetti butun besh.
// Ikkinchi sabab birinchisidan qiyinroq: manfiy sonni rad etish oson,
// kasr sonni esa o'quvchi ko'pincha «shunchaki chiroyli emas» deb qabul
// qilib qo'yadi.
//
// Kartalar juft-juft: 12 va −12, 1 va −1, 7 va 7,5 — farq bir belgida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'fits_condition', level: '🟢',
  zoneSize: 14, itemSize: 16, zoneLbl: 126,
  zones: [
    { id: 'z1', label: L("BO'LISHI MUMKIN", 'МОЖЕТ БЫТЬ', 'POSSIBLE') },
    { id: 'z2', label: L("MUMKIN EMAS", 'НЕ МОЖЕТ БЫТЬ', 'IMPOSSIBLE') },
  ],
  items: [
    { id: 'i1', tokens: ['12'], zone: 'z1' },
    { id: 'i2', tokens: ['−12'], zone: 'z2' },
    { id: 'i3', tokens: ['1'], zone: 'z1' },
    { id: 'i4', tokens: ['−1'], zone: 'z2' },
    { id: 'i5', tokens: ['30'], zone: 'z1' },
    { id: 'i6', tokens: ['0,5'], zone: 'z2' },
    { id: 'i7', tokens: ['7'], zone: 'z1' },
    { id: 'i8', tokens: ['7,5'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Masalada x harfi o'quvchilar sonini bildiradi. Tengsizlikni yechgandan keyin sakkiz qiymat chiqdi — har birini masala sharti bilan solishtirish kerak.",
    'В задаче буква x означает число учеников. После решения неравенства вышло восемь значений — каждое надо сверить с условием задачи.',
    'In the problem the letter x stands for the number of pupils. Solving the inequality produced eight values — each must be checked against the condition.'),
  ask: L(
    'Sonni bosing, keyin guruhini bosing.',
    'Нажми число, потом его группу.',
    'Tap a number, then its group.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. O'quvchilarning soni ikki shartni bajaradi: manfiy bo'lmaydi va BUTUN bo'ladi. Kasr son aldab qo'yadi: yetti butun besh son sifatida bor, lekin yetti yarim o'quvchi yo'q.",
    'Верно. Число учеников удовлетворяет двум условиям: не отрицательное и ЦЕЛОЕ. Дробное обманывает: семь целых пять как число существует, но семи с половиной учеников не бывает.',
    'Correct. A count of pupils satisfies two conditions: not negative and WHOLE. A fractional number deceives: seven point five exists as a number, but there are no seven and a half pupils.'),
  wrongs: [
    { when: (s) => s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu son KASR, o'quvchilar soni esa butun bo'lishi kerak. Nol butun besh o'quvchi ham, yetti yarim o'quvchi ham yo'q — sanaladigan narsa bo'lakka bo'linmaydi. Qo'shni kartaga qarang: yetti bo'ladi, yetti butun besh esa yo'q, va farq faqat vergul ortidagi raqamda.",
      'Это число ДРОБНОЕ, а число учеников должно быть целым. Ни ноль целых пяти ученика, ни семи с половиной учеников не бывает — то, что считают, на части не делится. Посмотри на соседнюю карточку: семь бывает, а семь целых пять нет, и различие лишь в цифре после запятой.',
      'That number is FRACTIONAL, while a count of pupils must be whole. There are no zero point five pupils and no seven and a half pupils — what is counted does not split into parts. Look at the neighbouring card: seven is possible, seven point five is not, and the difference is only the digit after the comma.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1', text: L(
      "Manfiy son sanoq bo'lolmaydi. Minus o'n ikkita o'quvchi degan sinf yo'q: sanoq noldan boshlanadi va oshib boradi. Bunday qiymat tengsizlikning yechimida bo'lishi mumkin, lekin masalaning javobiga kirmaydi.",
      'Отрицательное число количеством быть не может. Класса из минус двенадцати учеников не бывает: счёт начинается с нуля и идёт вверх. Такое значение может оказаться в решении неравенства, но в ответ задачи оно не входит.',
      'A negative number cannot be a count. There is no class of minus twelve pupils: counting starts at zero and goes up. Such a value may appear in the solution of the inequality, but it does not enter the answer of the problem.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu son musbat va butun, ya'ni o'quvchilar soni bo'la oladi. Katta yoki kichik ekani ahamiyatsiz: bir o'quvchi ham, o'ttiz o'quvchi ham bo'ladi. Rad etish faqat ikki sabab bilan bo'ladi — manfiylik va kasrlik.",
      'Это число положительное и целое, значит числом учеников быть может. Велико оно или мало — не важно: и один ученик бывает, и тридцать. Отбрасывают только по двум причинам — отрицательность и дробность.',
      'That number is positive and whole, so it can be a count of pupils. Whether it is large or small does not matter: one pupil is possible and so are thirty. Rejection happens for two reasons only — being negative and being fractional.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har son bilan bitta savolni bering: shuncha o'quvchi bo'lishi mumkinmi. Ikki narsa taqiqlangan — manfiy son va kasr son. Qolgan hammasi bo'ladi.",
      'С каждым числом задай один вопрос: может ли быть столько учеников. Запрещены две вещи — отрицательное число и дробное. Всё остальное бывает.',
      'Ask one question of every number: can there be that many pupils. Two things are forbidden — a negative number and a fractional one. Everything else is possible.') },
  ],
  wrongText: L(
    "Sanoq manfiy ham, kasr ham bo'lmaydi. Har sonni shu ikki shart bilan tekshiring: masalaning kattaligi qanday qiymatlarni qabul qila olishini o'ylang.",
    'Количество не бывает ни отрицательным, ни дробным. Проверяй каждое число по этим двум условиям: думай, какие значения может принимать величина из задачи.',
    'A count is neither negative nor fractional. Test every number against these two conditions: think about what values the quantity in the problem can take.'),
};

export default function D28_03(props) { return <Zones data={DATA} {...props} />; }
