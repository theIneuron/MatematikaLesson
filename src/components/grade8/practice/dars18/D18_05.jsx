// Dars18 · Amaliyot 05 — Juftlash · 🟡 · tag: D_to_count
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 5-pozitsiya)
//
// TO'RT MA'LUMOT — DARSNING UCH HOLI VA BITTA QO'SHIMCHA. Oxirgi juftlik
// 16-darsdan keladi: `x² − 7x = 0` chala tenglama, uning ildizlaridan biri
// nol. D ni hisoblash ham mumkin (qirq to'qqiz), lekin ko'paytuvchilarga
// ajratish tezroq — ikki yo'l bir javobni beradi.
//
// «Ikki turli ildiz» va «ikki ildiz, biri nol» ni ajratadigan narsa OZOD HAD:
// u nolga teng bo'lsa, nol albatta ildiz bo'ladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'D_to_count', level: '🟡',
  connect: true,
  targetSize: 14,
  items: [
    { id: 'm1', label: L('ikki turli ildiz', 'два различных корня', 'two different roots') },
    { id: 'm2', label: L('bitta ildiz', 'один корень', 'one root') },
    { id: 'm3', label: L("ildiz yo'q", 'корней нет', 'no roots') },
    { id: 'm4', label: L('ikki ildiz, biri nol', 'два корня, один из них нуль', 'two roots, one is zero') },
  ],
  targets: [
    { id: 't1', tokens: ['x² − 7x + 6 = 0'] },
    { id: 't2', tokens: ['x² + 6x + 9 = 0'] },
    { id: 't3', tokens: ['x² + x + 3 = 0'] },
    { id: 't4', tokens: ['x² − 7x = 0'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt tenglama, to'rt xil natija. Uchtasini diskriminant hal qiladi, to'rtinchisini esa ozod hadning yo'qligi.",
    'Четыре уравнения и четыре разных исхода. Три решает дискриминант, а четвёртый — отсутствие свободного члена.',
    'Four equations and four different outcomes. Three are decided by the discriminant, the fourth by the missing constant term.'),
  ask: L(
    "Chapdan ma'lumotni bosing, keyin o'ngdan uning tenglamasini bosing.",
    'Нажми описание слева, потом его уравнение справа.',
    'Tap a description on the left, then its equation on the right.'),
  correctText: L(
    "To'g'ri. Birinchisi: qirq to'qqiz minus yigirma to'rt yigirma besh — musbat, ikki turli ildiz (bir va olti). Ikkinchisi: o'ttiz olti minus o'ttiz olti nol — bitta ildiz, minus uch. Uchinchisi: bir minus o'n ikki minus o'n bir — manfiy, ildiz yo'q. To'rtinchisida ozod had yo'q, demak nol albatta ildiz: x karra x minus yetti, ildizlar nol va yetti.",
    'Верно. Первое: сорок девять минус двадцать четыре двадцать пять — положительное, два различных корня (один и шесть). Второе: тридцать шесть минус тридцать шесть нуль — один корень, минус три. Третье: один минус двенадцать минус одиннадцать — отрицательное, корней нет. В четвёртом нет свободного члена, значит нуль обязательно корень: x на скобку x минус семь, корни нуль и семь.',
    'Correct. First: forty nine minus twenty four is twenty five — positive, two different roots (one and six). Second: thirty six minus thirty six is zero — one root, minus three. Third: one minus twelve is minus eleven — negative, no roots. The fourth has no constant term, so zero is necessarily a root: x times the bracket x minus seven, roots zero and seven.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't4' || s.pair.m4 === 't1', text: L(
      "Bu ikki tenglamada ham ikki ildiz bor, farqi esa OZOD HADDA. To'rtinchisida u yo'q, ya'ni x umumiy ko'paytuvchi bo'lib chiqadi va nol albatta ildiz bo'ladi. Birinchisida ozod had olti, va uning ildizlari bir bilan olti — nol emas: nolni qo'ysangiz olti chiqadi, nol emas.",
      'У этих двух уравнений по два корня, а различает их СВОБОДНЫЙ ЧЛЕН. В четвёртом его нет, значит x выносится общим множителем и нуль обязательно корень. В первом свободный член шесть, и корни один и шесть — нуля среди них нет: подставь нуль и выйдет шесть, а не нуль.',
      'Both these equations have two roots; the CONSTANT TERM tells them apart. The fourth has none, so x factors out and zero is necessarily a root. The first has a constant term of six and its roots are one and six — zero is not among them: substitute zero and six comes out, not zero.') },
    { when: (s) => s.pair.m2 === 't3' || s.pair.m3 === 't2', text: L(
      "Bu ikki natija almashdi, va bu darsning eng qimmat farqi. Ikkinchi tenglamada D nolga teng, ya'ni ildiz BOR va u bitta: minus uch. Uchinchisida D manfiy — bir minus o'n ikki minus o'n bir, ya'ni ildiz umuman yo'q. Nol bilan manfiy son bir xil emas.",
      'Эти два результата поменялись местами, и это самое дорогое различие урока. Во втором уравнении D равно нулю, значит корень ЕСТЬ и он один: минус три. В третьем D отрицательно — один минус двенадцать минус одиннадцать, значит корней нет вовсе. Нуль и отрицательное — не одно и то же.',
      'These two results swapped, and this is the most valuable distinction of the lesson. In the second equation D is zero, so a root EXISTS and there is one: minus three. In the third D is negative — one minus twelve is minus eleven — so there are no roots at all. Zero and a negative number are not the same.') },
    { when: (s) => s.pair.m1 !== 't1', text: L(
      "Ikki TURLI ildiz D musbat bo'lganda bo'ladi. Birinchi tenglamada D qirq to'qqiz minus yigirma to'rt, ya'ni yigirma besh — musbat. Ildizlari bir va olti, ikkalasi ham noldan farqli.",
      'Два РАЗЛИЧНЫХ корня бывают при положительном D. В первом уравнении D это сорок девять минус двадцать четыре, то есть двадцать пять — положительное. Корни один и шесть, оба отличны от нуля.',
      'Two DIFFERENT roots need a positive D. In the first equation D is forty nine minus twenty four, that is twenty five — positive. Its roots are one and six, both non-zero.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har tenglamada avval ozod hadga qarang: yo'q bo'lsa nol ildiz bor. Bo'lsa — D ni hisoblang va ishorasiga qarang: musbat, nol yoki manfiy.",
      'В каждом уравнении сначала смотри на свободный член: его нет — есть корень нуль. Есть — посчитай D и смотри на знак: положительный, нуль или отрицательный.',
      'In every equation look first at the constant term: if it is missing, zero is a root. If it is there, compute D and look at the sign: positive, zero or negative.') },
  ],
  wrongText: L(
    "Ikki savol yetadi: ozod had bormi (yo'q bo'lsa nol ildiz), va D ning ishorasi qanday. Javoblarni tenglamaga qo'yib tekshiring.",
    'Хватает двух вопросов: есть ли свободный член (нет — есть корень нуль) и каков знак D. Ответы проверь подстановкой.',
    'Two questions are enough: is there a constant term (if not, zero is a root), and what is the sign of D. Check the answers by substitution.'),
};

export default function D18_05(props) { return <MatchPairs data={DATA} {...props} />; }
