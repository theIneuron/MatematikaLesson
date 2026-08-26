// Dars01 · Amaliyot 01 — Juftliklar · 🟢 · teg: not_a_function
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §01
//
// Savol MANTIQIY, lekin MATEMATIK: tanlanadigan narsa tayyor javob emas,
// juftliklar to'plami. Metodist qarori 2026-08-26: birinchi variantda bu
// so'z bilan berilgan ta'rifni tanlash edi, u olib tashlandi.
//
// Uchta noto'g'ri variant — uchta adashish yo'li: b va d da QIYMAT
// takrorlanadi (bu ta'rifni buzmaydi), a esa umuman toza.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'not_a_function', level: '🟢',
  correct: 2, optCols: 1, optSize: 16,
  eyebrow: L('Juftliklar', 'Пары', 'Pairs'),
  setup: L(
    "To'rtta to'plam. Har juftlikda birinchi son — argument, ikkinchisi — qiymat.",
    'Четыре набора. В каждой паре первое число — аргумент, второе — значение.',
    'Four sets. In each pair the first number is the argument, the second is the value.'),
  ask: L('Qaysi to\'plam funksiya emas?', 'Какой набор не является функцией?', 'Which set is not a function?'),
  opts: [
    { label: ['(1; 3), (2; 5), (3; 7), (4; 9)'] },
    { label: ['(−2; 4), (−1; 1), (0; 0), (1; 1), (2; 4)'] },
    { label: ['(0; 0), (1; 1), (1; −1), (4; 2)'] },
    { label: ['(1; 5), (2; 5), (3; 5)'] },
  ],
  correctText: L(
    "To'g'ri. Bu to'plamda bir sonining ikkita qiymati bor: bir va minus bir. Bitta argument ikki marta uchradi, demak ta'rif buzildi. Qolgan to'plamlarda birinchi sonlar takrorlanmaydi.",
    'Верно. Здесь у числа один два значения: один и минус один. Один аргумент встретился дважды, значит определение нарушено. В остальных наборах первые числа не повторяются.',
    'Correct. Here the number one has two values: one and minus one. One argument appeared twice, so the definition is broken. In the other sets the first numbers do not repeat.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      "Bu yerda birinchi sonlar bir, ikki, uch, to'rt — har biri bir martadan. Shart bajarilgan. Boshqa to'plamlarda ham birinchi sonlarni sanab chiqing.",
      'Здесь первые числа один, два, три, четыре — каждое по разу. Условие выполнено. Пересчитай первые числа и в остальных наборах.',
      'Here the first numbers are one, two, three, four — each once. The condition holds. Count the first numbers in the other sets too.') },
    { when: (s) => s.picked === 1, text: L(
      "Bu yerda takrorlanayotgan narsa qiymat: to'rt ikki marta va bir ikki marta uchradi. Shart esa qiymatga emas, argumentga qo'yiladi. Birinchi sonlarni alohida yozib chiqing.",
      'Здесь повторяется значение: четыре дважды и один дважды. А условие ставится не на значение, а на аргумент. Выпиши первые числа отдельно.',
      'What repeats here is the value: four twice and one twice. But the condition is placed on the argument, not on the value. Write the first numbers out separately.') },
    { when: (s) => s.picked === 3, text: L(
      "Hamma qiymat beshga teng, lekin argumentlar har xil: bir, ikki, uch. Har bir argumentga bittadan qiymat mos kelyapti, ta'rif buzilmagan.",
      'Все значения равны пяти, но аргументы разные: один, два, три. Каждому аргументу отвечает одно значение, определение не нарушено.',
      'All the values equal five, but the arguments differ: one, two, three. Each argument gets one value, the definition is not broken.') },
  ],
  wrongText: L(
    "Har to'plamda faqat BIRINCHI sonlarni yozib chiqing. Qaysinisida bitta son ikki marta uchradi?",
    'Выпиши в каждом наборе только ПЕРВЫЕ числа. В каком из них одно число встретилось дважды?',
    'Write out only the FIRST numbers in each set. In which one did a number appear twice?'),
};

export default function D01_01(props) { return <Choice data={DATA} {...props} />; }
