// Dars15 · Amaliyot 03 — Jadval · 🟢 · teg: nechta-oraliq-notogri-hisoblash
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// MATEMATIKA: y = x(x − 2)(x + 2) = x³ − 4x. Uchta ildiz: −2, 0, 2.
// Jadval ishoraning ALMASHIB borishini sonlarda ko'rsatadi:
//   x = −3 -> −15 (manfiy) · x = −1 -> 3 (musbat)
//   x = 1  -> −3  (manfiy) · x = 3  -> 15 (musbat)
// Ya'ni uchta ildiz o'qni TO'RTTA oraliqqa bo'ladi, va ishora har
// oraliqda almashadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'nechta-oraliq-notogri-hisoblash', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Bu ko'paytmaning uchta ildizi bor: minus ikki, nol va ikki. Jadvalda har oraliqdan bittadan son olingan.",
    'У этого произведения три корня: минус два, нуль и два. В таблице взято по одному числу из каждого промежутка.',
    'This product has three roots: minus two, zero and two. The table takes one number from each interval.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = x(x − 2)(x + 2)'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−3', y: '−15' },
    { id: 'c2', x: '−1', y: '', ans: 3, hole: 'y' },
    { id: 'c3', x: '1', y: '−3' },
    { id: 'c4', x: '', y: '15', ans: 3, hole: 'x' },
  ],
  correctText: L(
    "To'g'ri. Minus birda: minus bir karra minus uch karra bir — uchta ko'paytuvchidan ikkitasi manfiy, demak natija musbat, uch. O'ng chetda esa iks uchga teng: uch karra bir karra besh, ya'ni o'n besh. Jadvalning eng muhim gapi — ishoralar ketma-ketligi: manfiy, musbat, manfiy, musbat. Uchta ildiz o'qni TO'RTTA oraliqqa bo'ladi, va har ildizda ishora almashadi.",
    'Верно. В минус одном: минус один на минус три на один — из трёх множителей два отрицательных, значит результат положителен, три. А справа икс равен трём: три на один на пять, то есть пятнадцать. Главное в таблице — последовательность знаков: минус, плюс, минус, плюс. Три корня делят ось на ЧЕТЫРЕ промежутка, и в каждом корне знак меняется.',
    'Correct. At minus one: minus one times minus three times one — two of the three factors are negative, so the result is positive, three. And on the right x is three: three times one times five, that is fifteen. The main point of the table is the sequence of signs: minus, plus, minus, plus. Three roots split the axis into FOUR intervals, and the sign changes at each root.'),
  wrongs: [
    { when: (s) => s.vals.c2 === -3, text: L(
      "Ishoralarni sanab chiqing: minus bir manfiy, minus bir minus ikki uch manfiy, minus bir qo'shuv ikki bir musbat. Ikkita manfiy ko'paytuvchi musbat natija beradi.",
      'Пересчитай знаки: минус один отрицателен, минус один минус два — минус три, отрицательно, минус один плюс два — один, положительно. Два отрицательных множителя дают положительный результат.',
      'Count the signs: minus one is negative, minus one minus two is minus three, negative, minus one plus two is one, positive. Two negative factors give a positive result.') },
    { when: (s) => s.vals.c4 === -3, text: L(
      "Bu ustunda igrek MUSBAT o'n besh. Minus uchda esa qiymat minus o'n besh — jadvalning birinchi ustunida shu turibdi. Ishora manfiy ustunni musbatidan ajratadi.",
      'В этом столбце игрек ПОЛОЖИТЕЛЕН — пятнадцать. А при минус трёх значение минус пятнадцать, оно стоит в первом столбце. Знак и отличает отрицательный столбец от положительного.',
      'In this column y is POSITIVE fifteen. At minus three the value is minus fifteen — that stands in the first column. The sign is what tells the negative column from the positive one.') },
    { when: (s) => s.vals.c4 === 15 || s.vals.c2 === 15, text: L(
      "Katakka igrekning qiymati ko'chirilgan. Yuqori qatorda IKS turadi, pastki qatorda igrek: har qator o'zining sonini so'raydi.",
      'В клетку переписано значение игрека. В верхней строке стоит ИКС, в нижней игрек: каждая строка спрашивает своё число.',
      "The value of y was copied into the cell. The top row holds X and the bottom row y: each row asks for its own number.") },
    { when: (s) => s.vals.c2 === 5 || s.vals.c2 === -5, text: L(
      "Uchta ko'paytuvchining hammasini hisoblang: minus bir, minus uch va bir. Ularning ko'paytmasi uch.",
      'Посчитай все три множителя: минус один, минус три и один. Их произведение — три.',
      'Compute all three factors: minus one, minus three, and one. Their product is three.') },
  ],
  wrongText: L(
    "Har katakda uchta ko'paytuvchini alohida hisoblang va ishoralarini sanab chiqing: nechta manfiy ko'paytuvchi bor?",
    'В каждой клетке считай три множителя по отдельности и пересчитывай знаки: сколько отрицательных множителей?',
    'In each cell compute the three factors separately and count the signs: how many negative factors are there?'),
};

export default function D15_03(props) { return <RowTable data={DATA} {...props} />; }
