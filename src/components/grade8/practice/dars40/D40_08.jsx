// Dars40 · Amaliyot 08 — Kod · 🔴 · tag: code_heights
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 8-pozitsiya)
//
// BITTA FIGURA, YUZI 60, UCH XIL ASOS:
//   a = 15 -> h = 4 ; a = 12 -> h = 5 ; a = 10 -> h = 6
// З84 aynan shu: parallelogrammda bitta balandlik yo'q — har asosning
// o'z balandligi bor, va ular uch xil son. Yuza esa uch qatorda ham bir
// xil bo'lib qolaveradi.
//
// Bankdagi tuzoqlar — ASOSLARNING o'zi: 15, 12, 10.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_heights', level: '🔴',
  expr: ['S = 60', '   ', 'a = 15,  12,  10'], exprSize: 17,
  cards: ['4', '5', '6', '10', '12', '15'],
  answer: ['4', '5', '6'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Bitta parallelogramm berilgan, uning yuzi oltmish kvadrat santimetr. Uning uch tomoni navbat bilan asos qilib olindi: o'n besh, o'n ikki va o'n. Har asosga mos balandlikni topish kerak.",
    'В комнате сейф, код трёхзначный. Дан один параллелограмм, его площадь шестьдесят квадратных сантиметров. Три его стороны по очереди брали за основание: пятнадцать, двенадцать и десять. Надо найти высоту, соответствующую каждому основанию.',
    'There is a safe in the room and its code has three places. One parallelogram is given with an area of sixty square centimetres. Three of its sides were taken as the base in turn: fifteen, twelve and ten. Find the height matching each base.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch balandlikni kodga o'sish tartibida yozing.",
    'Запиши три высоты в код по возрастанию.',
    'Write the three heights into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Yuza uch qatorda ham bir xil — u figuraning xossasi, — shuning uchun har balandlik yuzani o'z asosiga bo'lishdan chiqadi: oltmish bo'lingan o'n besh to'rt; oltmish bo'lingan o'n ikki besh; oltmish bo'lingan o'n olti. O'sish tartibida: to'rt, besh, olti. Bu topshiriqning butun mazmuni bitta jumlada: parallelogrammda BITTA balandlik yo'q. Har asosning o'z balandligi bor, va asos qanchalik uzun bo'lsa, balandlik shunchalik qisqa. Uchta javobning uch xil chiqqani xato emas — aksincha, agar ular bir xil chiqqan bo'lsa, hisobda xato bo'lardi.",
    'Верно. Площадь во всех трёх строках одна — это свойство фигуры, — поэтому каждая высота получается делением площади на своё основание: шестьдесят делить на пятнадцать четыре; шестьдесят делить на двенадцать пять; шестьдесят делить на десять шесть. По возрастанию: четыре, пять, шесть. Весь смысл задания в одной фразе: у параллелограмма нет ОДНОЙ высоты. У каждого основания своя, и чем длиннее основание, тем короче высота. То, что три ответа разные, не ошибка — наоборот, если бы они совпали, ошибка была бы в счёте.',
    'Correct. The area is the same in all three rows — it is a property of the figure — so each height comes from dividing the area by its own base: sixty by fifteen is four; sixty by twelve is five; sixty by ten is six. In increasing order: four, five, six. The whole point of the task fits in one sentence: a parallelogram has no SINGLE height. Each base has its own, and the longer the base the shorter the height. That the three answers differ is no error — on the contrary, had they agreed, the arithmetic would be wrong.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('15') !== -1 || s.slots.indexOf('12') !== -1 || s.slots.indexOf('10') !== -1, text: L(
      "Kodga ASOSLARNING o'zi yozildi. Ular shartda berilgan, javob esa BALANDLIKLAR: har birini topish uchun yuzani mos asosga bo'lish kerak. Oltmish bo'lingan o'n besh to'rt, o'n ikki besh, o'n olti. Diqqat: javoblar berilgan sonlardan ancha kichik, chunki ularning ko'paytmasi oltmishga teng bo'lishi kerak.",
      'В код записаны САМИ ОСНОВАНИЯ. Они даны в условии, а ответ — ВЫСОТЫ: чтобы найти каждую, надо разделить площадь на соответствующее основание. Шестьдесят делить на пятнадцать четыре, на двенадцать пять, на десять шесть. Заметь: ответы заметно меньше данных чисел, ведь их произведение должно давать шестьдесят.',
      'The BASES themselves were written into the code. They are given in the condition; the answers are the HEIGHTS: to find each, divide the area by the matching base. Sixty by fifteen is four, by twelve five, by ten six. Note: the answers are much smaller than the given numbers, since their product must give sixty.') },
    { when: (s) => s.slots.indexOf('4') === -1, text: L(
      "Kodda to'rt yo'q, lekin eng uzun asosning balandligi aynan to'rt: oltmish bo'lingan o'n besh. Uzun asosga qisqa balandlik to'g'ri keladi — bu naqsh uch qatorda ham ko'rinadi: o'n besh va to'rt, o'n ikki va besh, o'n va olti. Asos kamayganda balandlik ortadi.",
      'В коде нет четырёх, а высота при самом длинном основании именно четыре: шестьдесят делить на пятнадцать. Длинному основанию отвечает короткая высота — эта закономерность видна во всех трёх строках: пятнадцать и четыре, двенадцать и пять, десять и шесть. Основание убывает — высота растёт.',
      'The code has no four, yet the height for the longest base is exactly four: sixty divided by fifteen. A long base takes a short height — the pattern shows in all three rows: fifteen and four, twelve and five, ten and six. As the base falls the height rises.') },
    { when: (s) => s.slots.indexOf('6') === -1, text: L(
      "Kodda olti yo'q, lekin eng qisqa asosning balandligi aynan olti: oltmish bo'lingan o'n. Bu uch javobning eng kattasi, va u eng kichik asosga to'g'ri keladi. Har javobni ko'paytirib tekshiring: olti karra o'n oltmish.",
      'В коде нет шести, а высота при самом коротком основании именно шесть: шестьдесят делить на десять. Это наибольший из трёх ответов, и отвечает он наименьшему основанию. Проверяй каждый ответ умножением: шестью десять шестьдесят.',
      'The code has no six, yet the height for the shortest base is exactly six: sixty divided by ten. It is the largest of the three answers and belongs to the smallest base. Check each answer by multiplying: six times ten is sixty.') },
    { when: (s) => s.set, text: L(
      "Uch balandlik to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: to'rt, besh, olti. Diqqat: asoslar kamayish tartibida berilgan, balandliklar esa o'sish tartibida yoziladi — bu ikki ro'yxat teskari yo'nalishda.",
      'Три высоты найдены верно, а порядок нарушен. Код пишется по возрастанию: четыре, пять, шесть. Обрати внимание: основания даны по убыванию, а высоты записываются по возрастанию — эти два списка идут в разные стороны.',
      'The three heights are right, the order is not. The code goes in increasing order: four, five, six. Note: the bases are given in decreasing order while the heights are written in increasing order — the two lists run in opposite directions.') },
  ],
  wrongText: L(
    "Har balandlikni yuzani o'z asosiga bo'lib toping. Parallelogrammda bitta balandlik yo'q — har asosning o'z balandligi bor.",
    'Находи каждую высоту делением площади на своё основание. У параллелограмма нет одной высоты — у каждого основания своя.',
    'Find each height by dividing the area by its own base. A parallelogram has no single height — each base has its own.'),
};

export default function D40_08(props) { return <CodeLock data={DATA} {...props} />; }
