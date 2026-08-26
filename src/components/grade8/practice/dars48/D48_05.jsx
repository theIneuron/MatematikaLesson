// Dars48 · Amaliyot 05 — Juftlash · 🟡 · tag: angle_to_major
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §10 (48-dars, 5-pozitsiya)
//
// TO'RT MARKAZIY BURCHAK ↔ TO'RT KATTA YOY: 60-300, 90-270, 120-240,
// 180-180. OXIRGI JUFTLIK CHEGARA HOLATI — yarim aylanada javob berilgan
// burchakka TENG chiqadi, va aynan shu holdan З103 tug'iladi («demak katta
// yoy har doim burchakka teng»).
// D37_04 dagi `90°` bilan bir xil naqsh: chegara istisno emas, o'sha
// qoidaning natijasi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'angle_to_major', level: '🟡',
  connect: true,
  targetSize: 19, itemSize: 19,
  items: [
    { id: 'm1', tokens: ['60°'] },
    { id: 'm2', tokens: ['90°'] },
    { id: 'm3', tokens: ['120°'] },
    { id: 'm4', tokens: ['180°'] },
  ],
  targets: [
    { id: 't1', tokens: ['300°'] },
    { id: 't2', tokens: ['270°'] },
    { id: 't3', tokens: ['240°'] },
    { id: 't4', tokens: ['180°'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "Chapda to'rt markaziy burchak, o'ngda ularga mos KATTA yoylar. Katta yoy aylananing markaziy burchakdan qolgan qismi.",
    'Слева четыре центральных угла, справа соответствующие им БОЛЬШИЕ дуги. Большая дуга — та часть окружности, что осталась от центрального угла.',
    'On the left are four central angles, on the right the matching MAJOR arcs. The major arc is the part of the circle left over from the central angle.'),
  ask: L(
    "Chapdan burchakni bosing, keyin o'ngdan katta yoyni bosing.",
    'Нажми угол слева, потом большую дугу справа.',
    'Tap an angle on the left, then the major arc on the right.'),
  correctText: L(
    "To'g'ri. Har javob bitta ayirish bilan topiladi: uch yuz oltmish minus oltmish uch yuz; minus to'qson ikki yuz yetmish; minus yuz yigirma ikki yuz qirq. Oxirgi juftlik alohida: uch yuz oltmish minus bir yuz sakson yana bir yuz sakson, ya'ni javob berilgan burchakka TENG chiqdi. Bu tasodif emas, lekin u xavfli: aynan shu holatdan «katta yoy har doim burchakka teng» degan noto'g'ri xulosa tug'iladi. Qolgan uch juftlikka qarang — u yerda javob boshqa, va tenglik faqat yarim aylanada bo'ladi, chunki yarim aylana o'zining ikkinchi yarmiga teng.",
    'Верно. Каждый ответ находится одним вычитанием: триста шестьдесят минус шестьдесят — триста; минус девяносто — двести семьдесят; минус сто двадцать — двести сорок. Последняя пара особая: триста шестьдесят минус сто восемьдесят — снова сто восемьдесят, то есть ответ оказался РАВЕН данному углу. Это не случайность, но она опасна: именно из этого случая рождается неверный вывод «большая дуга всегда равна углу». Посмотри на остальные три пары — там ответ другой, и равенство бывает только на полуокружности, ведь половина окружности равна своей второй половине.',
    'Correct. Every answer comes from one subtraction: three hundred sixty minus sixty is three hundred; minus ninety is two hundred seventy; minus one hundred twenty is two hundred forty. The last pair is special: three hundred sixty minus one hundred eighty is one hundred eighty again, so the answer came out EQUAL to the given angle. That is no accident, but it is dangerous: it is this case that breeds the false conclusion that a major arc always equals the angle. Look at the other three pairs — the answer differs there, and equality happens only at the semicircle, since half a circle equals its other half.'),
  wrongs: [
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "Bir yuz saksonning juftligi ham bir yuz sakson: uch yuz oltmish minus bir yuz sakson bir yuz sakson. Yarim aylana o'zining ikkinchi yarmiga teng, ya'ni bu yerda katta yoy va kichik yoy bir xil. Bu YAGONA hol bo'lib, unda javob berilgan burchakka teng chiqadi — boshqa uch juftlikda javob boshqa.",
      'Парой к ста восьмидесяти тоже будет сто восемьдесят: триста шестьдесят минус сто восемьдесят — сто восемьдесят. Полуокружность равна своей второй половине, значит здесь большая и малая дуги одинаковы. Это ЕДИНСТВЕННЫЙ случай, когда ответ равен данному углу — в остальных трёх парах ответ другой.',
      'The partner of one hundred eighty is one hundred eighty too: three hundred sixty minus one hundred eighty is one hundred eighty. A semicircle equals its other half, so here the major and minor arcs are the same. This is the ONLY case where the answer equals the given angle — in the other three pairs it differs.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki juftlik almashib ketdi. Har birini alohida hisoblang: uch yuz oltmish minus oltmish uch yuz, uch yuz oltmish minus to'qson ikki yuz yetmish. Burchak qanchalik kichik bo'lsa, katta yoy shunchalik katta — ular birga uch yuz oltmishni to'ldiradi.",
      'Эти две пары поменялись местами. Посчитай каждую отдельно: триста шестьдесят минус шестьдесят — триста, триста шестьдесят минус девяносто — двести семьдесят. Чем меньше угол, тем больше большая дуга — вместе они дополняют друг друга до трёхсот шестидесяти.',
      'These two pairs were swapped. Compute each on its own: three hundred sixty minus sixty is three hundred, three hundred sixty minus ninety is two hundred seventy. The smaller the angle, the larger the major arc — together they make three hundred sixty.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har juftlikda bitta amal bajariladi: uch yuz oltmishdan burchakni ayirish. Tekshirish oson: chap va o'ng sonni qo'shsangiz, uch yuz oltmish chiqishi kerak.",
      'В каждой паре выполняется одно действие: вычесть угол из трёхсот шестидесяти. Проверить легко: сложив левое и правое число, надо получить триста шестьдесят.',
      'One operation is done in every pair: subtract the angle from three hundred sixty. An easy check: adding the left and right numbers must give three hundred sixty.') },
  ],
  wrongText: L(
    "Uch yuz oltmishdan burchakni ayiring. Tekshirish: ikki son birga 360 ni berishi kerak.",
    'Вычти угол из трёхсот шестидесяти. Проверка: два числа вместе должны дать 360.',
    'Subtract the angle from three hundred sixty. Check: the two numbers together must give 360.'),
};

export default function D48_05(props) { return <MatchPairs data={DATA} {...props} />; }
