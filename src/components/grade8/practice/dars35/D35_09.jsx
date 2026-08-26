// Dars35 · Amaliyot 09 — Kod · 🔴 · tag: code_three_measures
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 9-pozitsiya)
//
// BITTA QATOR — UCH XIL SON. 2, 2, 3, 5, 8:
//   moda      = 2  (ikkilik ikki marta)
//   mediana   = 3  (beshta son, o'rtadagisi uchinchi o'rinda)
//   o'rtacha  = 4  (yigirma bo'lingan besh)
// Bu З71 ning to'g'ridan-to'g'ri raddiyasi: uch o'lchov uch boshqa javob
// beradi, va ularni ajratmasdan kodni yig'ib bo'lmaydi.
//
// Kod o'sish tartibida — 2, 3, 4, — ya'ni tartib ham hisobning bir qismi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_three_measures', level: '🔴',
  expr: ['2, 2, 3, 5, 8'], exprSize: 26,
  cards: ['2', '3', '4', '5', '6', '8'],
  answer: ['2', '3', '4'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Bitta qator berilgan, va undan uchta o'lchov topiladi: moda, mediana va o'rtacha qiymat. Qator o'sish tartibida yozilgan.",
    'В комнате сейф, код трёхзначный. Дан один ряд, и из него находятся три величины: мода, медиана и среднее значение. Ряд записан по возрастанию.',
    'There is a safe in the room and its code has three places. One series is given, and three measures are found from it: the mode, the median and the mean. The series is written in increasing order.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Modani, medianani va o'rtachani kodga o'sish tartibida yozing.",
    'Запиши моду, медиану и среднее в код по возрастанию.',
    'Write the mode, the median and the mean into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uch o'lchov uch xil ish talab qiladi. Moda — sanoq: ikkilik ikki marta, qolganlari bir martadan, ya'ni moda ikki. Mediana — o'rin: beshta son bor, toq, o'rtadagisi uchinchi o'rinda turibdi — bu uch. O'rtacha — hisob: ikki qo'shuv ikki qo'shuv uch qo'shuv besh qo'shuv sakkiz yigirma, yigirma bo'lingan besh to'rt. O'sish tartibida: ikki, uch, to'rt. Uchala javob ham boshqa, va bu tasodif emas: sakkizlik qatorning o'ng chetida turgani o'rtachani yuqoriga tortadi, medianaga esa umuman ta'sir qilmaydi, chunki mediana faqat o'rinni ko'radi.",
    'Верно. Три величины требуют трёх разных действий. Мода — подсчёт: двойка два раза, остальные по одному, значит мода два. Медиана — место: чисел пять, нечётное количество, срединное стоит на третьем месте — это три. Среднее — вычисление: два плюс два плюс три плюс пять плюс восемь двадцать, двадцать делить на пять четыре. По возрастанию: два, три, четыре. Все три ответа разные, и это не случайность: восьмёрка на правом краю тянет среднее вверх, а на медиану вовсе не влияет, ведь медиана видит только место.',
    'Correct. Three measures call for three different jobs. The mode is a count: the two occurs twice, the rest once each, so the mode is two. The median is a position: there are five numbers, an odd count, and the middle one stands third — that is three. The mean is a computation: two plus two plus three plus five plus eight is twenty, twenty divided by five is four. In increasing order: two, three, four. All three answers differ, and that is no accident: the eight at the right edge pulls the mean upward while leaving the median untouched, since the median sees only position.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('8') !== -1, text: L(
      "Sakkiz — qatordagi eng katta son, lekin u uch o'lchovning hech biriga javob bermaydi. Moda eng ko'p uchraydigani (ikki), mediana o'rtadagisi (uch), o'rtacha esa hammasining hisobi (to'rt). Sakkizlik faqat o'rtachaga ta'sir qiladi — uni yuqoriga tortadi, — lekin o'zi javob bo'lmaydi.",
      'Восемь — наибольшее число ряда, но ни на одну из трёх величин оно не отвечает. Мода — самое частое (два), медиана — срединное (три), среднее — вычисление по всем (четыре). Восьмёрка влияет только на среднее, подтягивая его вверх, но сама ответом не становится.',
      'Eight is the largest number in the series, but it answers none of the three measures. The mode is the most frequent (two), the median the middle one (three), the mean the computation over all (four). The eight affects only the mean, pulling it upward, but is not itself an answer.') },
    { when: (s) => s.slots.indexOf('5') !== -1 || s.slots.indexOf('6') !== -1, text: L(
      "Bu son uch o'lchovning hech biridan chiqmaydi. Har birini alohida hisoblang: modani sanang (ikkilik ikki marta), medianani o'rindan oling (beshta sondan uchinchisi), o'rtachani qo'shib bo'ling (yigirma bo'lingan besh). Javoblar ikki, uch va to'rt — ular yaqin turibdi, lekin har biri o'z yo'li bilan topiladi.",
      'Это число не получается ни из одной из трёх величин. Посчитай каждую отдельно: моду подсчётом (двойка два раза), медиану по месту (третье из пяти), среднее сложением и делением (двадцать делить на пять). Ответы два, три и четыре — они близки, но каждый находится своим способом.',
      'This number comes from none of the three measures. Compute each separately: the mode by counting (the two occurs twice), the median by position (the third of five), the mean by adding and dividing (twenty by five). The answers are two, three and four — close together, yet each found its own way.') },
    { when: (s) => s.slots.indexOf('4') === -1, text: L(
      "Kodda to'rt yo'q, lekin o'rtacha qiymat aynan to'rt. Qo'shing: ikki qo'shuv ikki to'rt, to'rt qo'shuv uch yetti, yetti qo'shuv besh o'n ikki, o'n ikki qo'shuv sakkiz yigirma. Yigirmani beshga bo'ling — to'rt. O'rtacha qatorda yo'q, va bu normal: u tanlanmaydi, hisoblanadi.",
      'В коде нет четвёрки, а среднее значение именно четыре. Сложи: два плюс два четыре, четыре плюс три семь, семь плюс пять двенадцать, двенадцать плюс восемь двадцать. Раздели двадцать на пять — четыре. Четвёрки в ряду нет, и это нормально: среднее не выбирается, а вычисляется.',
      'The code has no four, yet the mean is exactly four. Add: two plus two is four, plus three is seven, plus five is twelve, plus eight is twenty. Divide twenty by five — four. There is no four in the series, and that is fine: the mean is not chosen, it is computed.') },
    { when: (s) => s.set, text: L(
      "Uch o'lchov to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: ikki, uch, to'rt. Bu tartib o'lchovlarning nomiga emas, ularning QIYMATIGA qarab qo'yiladi.",
      'Три величины найдены верно, а порядок нарушен. Код пишется по возрастанию: два, три, четыре. Этот порядок задаётся не названиями величин, а их ЗНАЧЕНИЯМИ.',
      'The three measures are right, the order is not. The code goes in increasing order: two, three, four. That order follows the VALUES of the measures, not their names.') },
  ],
  wrongText: L(
    "Uch o'lchovni uch xil yo'l bilan toping: modani sanab, medianani o'rindan, o'rtachani qo'shib bo'lib. Keyin javoblarni o'sish tartibida joylashtiring.",
    'Находи три величины тремя разными способами: моду подсчётом, медиану по месту, среднее сложением и делением. Потом расставь ответы по возрастанию.',
    'Find the three measures in three different ways: the mode by counting, the median by position, the mean by adding and dividing. Then put the answers in increasing order.'),
};

export default function D35_09(props) { return <CodeLock data={DATA} {...props} />; }
