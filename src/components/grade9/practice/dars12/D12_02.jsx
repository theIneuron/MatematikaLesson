// Dars12 · Amaliyot 02 — Jadval · 🟢 · teg: yigindini-yakuniy-javob-deb-olish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval FAQAT yig'indi shartidan tuzilgan. Aynan shu darsning ikkinchi
// tasdig'ini ochadi: yig'indi ma'lum bo'lishi hali juftlikni aniqlamaydi,
// chunki yig'indisi oltiga teng juftliklar cheksiz ko'p.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'yigindini-yakuniy-javob-deb-olish', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Jadval faqat bitta shartdan tuzilgan: iks bilan igrekning yig'indisi oltiga teng.",
    'Таблица составлена по одному условию: сумма икса и игрека равна шести.',
    'The table is built from one condition only: the sum of x and y is six.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['x + y = 6'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '0', y: '6' },
    { id: 'c2', x: '2', y: '', ans: 4, hole: 'y' },
    { id: 'c3', x: '', y: '1', ans: 5, hole: 'x' },
    { id: 'c4', x: '6', y: '0' },
  ],
  correctText: L(
    "To'g'ri: ikkiga to'rt, birga besh. Endi eng muhim gap: jadvaldagi to'rttala ustun ham yig'indi shartini bajaradi, lekin ularning bittasigina sistemaning yechimi bo'ladi. Qo'shish usulida ham xuddi shunday — qo'shishdan keyin topilgan yig'indi hali javob emas, u faqat bitta shart. Javob uchun ikkinchi tenglama ham kerak.",
    'Верно: двум — четыре, единице — пять. А теперь главное: все четыре столбца таблицы выполняют условие суммы, но решением системы будет лишь один из них. В способе сложения то же самое — найденная после сложения сумма это ещё не ответ, а только одно условие. Для ответа нужно и второе уравнение.',
    'Correct: two gives four, one gives five. And now the main point: all four columns satisfy the sum condition, yet only one of them is the solution of the system. It is the same in the addition method — the sum found after adding is not an answer yet, only one condition. The second equation is needed for the answer.'),
  wrongs: [
    { when: (s) => s.vals.c2 === 8, text: L(
      "Ikkinchi ustunda oltiga ikki qo'shildi. Shart yig'indi haqida: iks bilan igrekning yig'indisi olti bo'lishi kerak, demak igrek olti minus ikki.",
      'Во втором столбце к шести прибавили два. Условие про сумму: сумма икса и игрека должна быть шесть, значит игрек равен шесть минус два.',
      'In the second column two was added to six. The condition is about the sum: x plus y must be six, so y is six minus two.') },
    { when: (s) => s.vals.c3 === 7, text: L(
      "Uchinchi ustunda birga olti qo'shildi. Bu ustunda igrek berilgan, iks so'ralyapti: nechchi qo'shuv bir olti beradi?",
      'В третьем столбце к единице прибавили шесть. В этом столбце дан игрек, а спрашивают икс: сколько плюс один даёт шесть?',
      'In the third column six was added to one. In this column y is given and x is asked: what plus one makes six?') },
    { when: (s) => s.vals.c2 === 6 || s.vals.c3 === 6, text: L(
      "Katakka yig'indining o'zi yozilgan. Olti — bu iks bilan igrekning YIG'INDISI, alohida katakning qiymati emas.",
      'В клетку записана сама сумма. Шесть — это СУММА икса и игрека, а не значение отдельной клетки.',
      'The sum itself was written into the cell. Six is the SUM of x and y, not the value of a single cell.') },
    { when: (s) => s.vals.c2 === -4 || s.vals.c3 === -5, text: L(
      "Ishora almashdi. Yig'indi olti bo'lishi kerak: manfiy son bilan yig'indi oltidan kichik chiqadi.",
      'Сбился знак. Сумма должна быть шесть: с отрицательным числом сумма выйдет меньше шести.',
      'A sign slipped. The sum must be six: with a negative number the sum comes out less than six.') },
  ],
  wrongText: L(
    "Har ustunda ikkita sonning yig'indisi oltiga teng bo'lishi kerak. Berilgan sonni oltidan ayirsangiz, ikkinchisi chiqadi.",
    'В каждом столбце сумма двух чисел должна быть равна шести. Вычти известное число из шести — получишь второе.',
    'In every column the two numbers must add up to six. Subtract the known number from six to get the other one.'),
};

export default function D12_02(props) { return <RowTable data={DATA} {...props} />; }
