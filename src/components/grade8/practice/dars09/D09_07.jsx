// Dars09 · Amaliyot 07 — Nechta · 🟡 · tag: count_whole
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 7-pozitsiya)
//
// Javob — SANOQ, ya'ni o'quvchi to'liq kvadratlar ro'yxatini o'zi tuzishi
// kerak: 1, 4, 9, 16, 25, 36, 49. Ellikdan keyingisi oltmish to'rt, u
// oraliqdan chiqadi. Shu bilan darsning ikkinchi tasdig'i sonlarda ko'rinadi:
// ildiz hamma joyda bor, butun esa faqat yettita joyda.
// Xato javoblar: 50 (hammasi butun), 25 (yarmi), 6 (qirq to'qqiz tashlandi),
// 8 (oltmish to'rt ham qo'shildi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'count_whole', level: '🟡',
  target: 7, allowNeg: false,
  expr: ['1 ≤ n ≤ 50'], exprSize: 26,
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  setup: L(
    "n bir dan ellikgacha butun qiymatlar oladi. Har birida ildiz bor, lekin hammasida butun emas.",
    'n принимает целые значения от одного до пятидесяти. У каждого корень есть, но не у всех он целый.',
    'n takes whole values from one to fifty. Each has a root, but not all of them are whole.'),
  label: L("shunday n larning soni", 'количество таких n', 'the number of such n'),
  ask: L(
    "n ning nechta qiymatida ildiz butun son bo'ladi?",
    'При скольких значениях n корень будет целым числом?',
    'For how many values of n is the root a whole number?'),
  correctText: L(
    "To'g'ri. Ildiz butun bo'lishi uchun n ning o'zi to'liq kvadrat bo'lishi kerak. Ellikgacha ularni sanaymiz: bir, to'rt, to'qqiz, o'n olti, yigirma besh, o'ttiz olti, qirq to'qqiz — yettita. Keyingisi oltmish to'rt, u ellikdan katta va hisobga kirmaydi. Qolgan qirq uch sonda ham ildiz bor, faqat u butun emas.",
    'Верно. Чтобы корень был целым, само n должно быть полным квадратом. Считаем их до пятидесяти: один, четыре, девять, шестнадцать, двадцать пять, тридцать шесть, сорок девять — семь. Следующий шестьдесят четыре, он больше пятидесяти и в счёт не идёт. У остальных сорока трёх чисел корень тоже есть, просто он не целый.',
    'Correct. For the root to be whole, n itself must be a perfect square. Count them up to fifty: one, four, nine, sixteen, twenty five, thirty six, forty nine — seven of them. The next is sixty four, which is over fifty and does not count. The other forty three numbers have roots too, they just are not whole.'),
  wrongs: [
    { when: (s) => s.value === 50, text: L(
      "Ellik — bu hamma n larning soni, va hammasida ildiz bor. Lekin savol boshqa: ildiz BUTUN bo'ladigan n lar nechta. Ikkidan ildizni oling: bir bilan ikki orasida, butun emas.",
      'Пятьдесят — это количество всех n, и у всех корень есть. Но вопрос другой: у скольких n корень ЦЕЛЫЙ. Возьми корень из двух: он между одним и двумя, не целый.',
      'Fifty is the count of all the n, and all of them do have roots. But the question is different: for how many n is the root WHOLE. Take the root of two: it lies between one and two, not whole.') },
    { when: (s) => s.value === 25, text: L(
      "Yigirma besh — ellikning yarmi, lekin to'liq kvadratlar tekis taqsimlanmagan: ular orasidagi masofa o'sib boradi. Bir, to'rt, to'qqiz — orada bir, keyin ikki, keyin uch qadam bo'sh joy.",
      'Двадцать пять — половина пятидесяти, но полные квадраты распределены неравномерно: расстояние между ними растёт. Один, четыре, девять — сначала один шаг пропуска, потом два, потом три.',
      'Twenty five is half of fifty, but perfect squares are not evenly spread: the gaps between them grow. One, four, nine — first one number skipped, then two, then three.') },
    { when: (s) => s.value === 6, text: L(
      "Bittasi tushib qolgan. Ro'yxatni oxirigacha yozing: bir, to'rt, to'qqiz, o'n olti, yigirma besh, o'ttiz olti va qirq to'qqiz. Qirq to'qqiz ellikdan kichik, demak u ham hisobda.",
      'Одно потерялось. Выпиши список до конца: один, четыре, девять, шестнадцать, двадцать пять, тридцать шесть и сорок девять. Сорок девять меньше пятидесяти, значит оно тоже в счёт.',
      'One was lost. Write the list to the end: one, four, nine, sixteen, twenty five, thirty six and forty nine. Forty nine is less than fifty, so it counts too.') },
    { when: (s) => s.value === 8, text: L(
      "Bittasi ortiqcha. Ro'yxatning oxirini tekshiring: sakkiz karra sakkiz oltmish to'rt, va oltmish to'rt ellikdan katta — demak u oraliqqa kirmaydi.",
      'Одно лишнее. Проверь конец списка: восемь на восемь шестьдесят четыре, а шестьдесят четыре больше пятидесяти — значит в промежуток он не входит.',
      'One is extra. Check the end of the list: eight times eight is sixty four, and sixty four is over fifty, so it does not fall in the range.') },
    { when: (s) => s.value === 1 || s.value === 0, text: L(
      "Bittadan ko'p: n ning o'rniga to'liq kvadratlarni birma-bir qo'yib ko'ring — bir, to'rt, to'qqiz va shu tarzda davom eting.",
      'Их больше одного: подставляй вместо n полные квадраты по очереди — один, четыре, девять и так далее.',
      'There is more than one: substitute perfect squares for n one by one — one, four, nine and so on.') },
  ],
  wrongText: L(
    "Butun sonlarni kvadratga oshirib ro'yxat tuzing va ellikdan oshmaganlarini sanang.",
    'Возведи целые числа в квадрат, составь список и посчитай те, что не превышают пятидесяти.',
    'Square the whole numbers, build a list and count those not over fifty.'),
};

export default function D09_07(props) { return <TypeValue data={DATA} {...props} />; }
