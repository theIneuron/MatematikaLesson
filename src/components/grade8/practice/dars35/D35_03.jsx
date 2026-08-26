// Dars35 · Amaliyot 03 — Test · 🟢 · tag: which_mode
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 3-pozitsiya)
//
// UCH XATO VARIANT — MODANING UCH XIL SOXTA TA'RIFI:
//   5   — ikkinchi darajali takror («ko'p uchraydiganlardan biri»)
//   8   — eng KATTA son («moda eng kattasi» degan tasavvur)
//   4,5 — o'rtacha qiymat (З71)
// Qator ataylab shunday: modasi eng katta ham, o'rtachaga yaqin ham emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_mode', level: '🟢',
  correct: 0, optCols: 4, optSize: 20,
  expr: ['3, 5, 3, 8, 5, 3'], exprSize: 28,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Olti sondan iborat qator berilgan. Uning modasini topish kerak — bu hisoblanadigan emas, SANALADIGAN kattalik.",
    'Дан ряд из шести чисел. Надо найти его моду — это величина не вычисляемая, а ПОДСЧИТЫВАЕМАЯ.',
    'A series of six numbers is given. Its mode must be found — a quantity that is not computed but COUNTED.'),
  ask: L('Bu qatorning modasi qaysi?', 'Какова мода этого ряда?', 'What is the mode of this series?'),
  opts: [
    { label: ['3'] },
    { label: ['5'] },
    { label: ['8'] },
    { label: ['4,5'] },
  ],
  correctText: L(
    "To'g'ri. Modani topish uchun har qiymat necha marta uchraganini sanaymiz: uchlik uch marta, beshlik ikki marta, sakkizlik bir marta. Eng ko'p uchraydigani uchlik, demak moda uch. Diqqat qilinadigan uch narsa. Birinchidan, moda eng KATTA son emas — bu qatorda eng kattasi sakkiz, lekin u bir marta turibdi. Ikkinchidan, moda o'rtacha ham emas — o'rtacha to'rt butun besh o'ndan, va u qatorda umuman yo'q. Uchinchidan, moda har doim qatorning o'z sonlaridan biri bo'ladi, chunki u qiymatni tanlaydi.",
    'Верно. Чтобы найти моду, считаем, сколько раз встретилось каждое значение: тройка три раза, пятёрка два, восьмёрка один. Чаще всех тройка, значит мода три. На что стоит обратить внимание. Во-первых, мода не НАИБОЛЬШЕЕ число — в этом ряду наибольшее восемь, но оно стоит один раз. Во-вторых, мода и не среднее — среднее четыре целых пять десятых, и его в ряду вообще нет. В-третьих, мода всегда одно из чисел самого ряда, ведь она выбирает значение.',
    'Correct. To find the mode we count how many times each value occurs: the three three times, the five twice, the eight once. The three occurs most, so the mode is three. Three things worth noting. First, the mode is not the LARGEST number — the largest here is eight, and it stands once. Second, the mode is not the mean either — the mean is four point five, which does not appear in the series at all. Third, the mode is always one of the numbers of the series itself, since it picks a value.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Beshlik ham takrorlanadi, lekin faqat IKKI marta, uchlik esa uch marta. Moda ENG KO'P uchraydigan qiymat, ya'ni takrorlanganlarning eng ko'pi. Qayta sanang: uchlik birinchi, uchinchi va oltinchi o'rinlarda; beshlik ikkinchi va beshinchi o'rinlarda. Uch marta ikki martadan ko'p.",
      'Пятёрка тоже повторяется, но только ДВА раза, а тройка три. Мода — САМОЕ частое значение, то есть наиболее частое из повторяющихся. Пересчитай: тройка на первом, третьем и шестом местах; пятёрка на втором и пятом. Три раза больше, чем два.',
      'The five repeats too, but only TWICE, while the three occurs three times. The mode is the MOST frequent value, the most frequent among those that repeat. Count again: the three in the first, third and sixth places; the five in the second and fifth. Three times is more than two.') },
    { when: (s) => s.picked === 2, text: L(
      "Sakkiz — qatordagi eng KATTA son, lekin moda kattalikka qaramaydi, u SANOQQA qaraydi. Sakkizlik qatorda faqat bir marta turibdi, ya'ni u eng kam uchraydigan qiymatlardan biri. Modani topishda sonlarning o'zi emas, ular necha marta takrorlangani muhim.",
      'Восемь — НАИБОЛЬШЕЕ число ряда, но мода смотрит не на величину, а на ПОДСЧЁТ. Восьмёрка стоит в ряду всего один раз, то есть она из самых редких значений. При поиске моды важны не сами числа, а сколько раз они повторяются.',
      'Eight is the LARGEST number in the series, but the mode looks not at size, it looks at the COUNT. The eight stands only once, making it one of the rarest values. What matters for the mode is not the numbers themselves but how many times they repeat.') },
    { when: (s) => s.picked === 3, text: L(
      "To'rt butun besh o'ndan — bu O'RTACHA qiymat: uch qo'shuv besh qo'shuv uch qo'shuv sakkiz qo'shuv besh qo'shuv uch yigirma yetti, yigirma yetti bo'lingan olti to'rt butun besh o'ndan. Moda esa boshqa narsa. Ikkalasini bir belgi bilan ajratish mumkin: moda HAR DOIM qatorning o'z soni bo'ladi, o'rtacha esa ko'pincha qatorda yo'q — bu yerda to'rt butun besh o'ndan qatorda yo'q.",
      'Четыре целых пять десятых — это СРЕДНЕЕ значение: три плюс пять плюс три плюс восемь плюс пять плюс три двадцать семь, двадцать семь делить на шесть четыре целых пять десятых. А мода — другое. Различить их можно по одному признаку: мода ВСЕГДА число самого ряда, а среднее часто в ряду отсутствует — здесь четырёх целых пяти десятых в ряду нет.',
      'Four point five is the MEAN: three plus five plus three plus eight plus five plus three is twenty-seven, twenty-seven divided by six is four point five. The mode is something else. One mark tells them apart: the mode is ALWAYS a number of the series itself, while the mean is often absent — and four point five is not in this series.') },
  ],
  wrongText: L(
    "Har qiymat necha marta uchraganini sanang va eng ko'pini tanlang. Moda hisoblanmaydi va u qatordagi sonlardan biri bo'ladi.",
    'Сосчитай, сколько раз встретилось каждое значение, и выбери самое частое. Мода не вычисляется и является одним из чисел ряда.',
    'Count how many times each value occurs and pick the most frequent. The mode is not computed and is one of the numbers of the series.'),
};

export default function D35_03(props) { return <Choice data={DATA} {...props} />; }
