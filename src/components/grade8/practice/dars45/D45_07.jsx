// Dars45 · Amaliyot 07 — Kod · 🟡 · tag: code_checks
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 7-pozitsiya)
//
// UCH SAVOL, UCH XIL ISH — bir xil harakatni uch marta takrorlab bo'lmaydi:
//   c=13, a=12   -> ikkinchi katet, 5     (kvadratlar AYIRILADI)
//   6, 8, 10     -> to'g'ri burchakka qarshi tomon, 10   (TANLASH)
//   a=9, b=12    -> gipotenuza, 15        (kvadratlar QO'SHILADI)
// Bankdagi tuzoqlar: 1 (o'n uch minus o'n ikki — З92), 21 (to'qqiz qo'shuv
// o'n ikki — З91), 25 (o'n ikki qo'shuv o'n uch — З91).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_checks', level: '🟡',
  expr: ['c = 13, a = 12', '   ', '6, 8, 10', '   ', 'a = 9, b = 12'], exprSize: 14,
  cards: ['1', '5', '10', '15', '21', '25'],
  answer: ['5', '10', '15'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch savol uch xil: birinchisida gipotenuza va bir katet berilgan, ikkinchi katet kerak; ikkinchisida uchala tomon berilgan, to'g'ri burchakka qarshi tomon kerak; uchinchisida ikki katet berilgan, gipotenuza kerak.",
    'В комнате сейф, код трёхзначный. Три вопроса разные: в первом даны гипотенуза и один катет, нужен второй катет; во втором даны все три стороны, нужна сторона против прямого угла; в третьем даны два катета, нужна гипотенуза.',
    'There is a safe in the room and its code has three places. The three questions differ: the first gives the hypotenuse and one leg and asks for the other leg; the second gives all three sides and asks for the side opposite the right angle; the third gives two legs and asks for the hypotenuse.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni toping va kodga o'sish tartibida yozing.",
    'Найди три ответа и запиши их в код по возрастанию.',
    'Find the three answers and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uch savolda uch xil ish. Birinchisida gipotenuza berilgan, ya'ni kvadratlar AYIRILADI: bir yuz oltmish to'qqiz minus bir yuz qirq to'rt yigirma besh, ildizi besh. Ikkinchisida hech narsa hisoblanmaydi — faqat eng katta tomonni tanlash kerak, chunki to'g'ri burchak unga qarshi turadi: o'n. Uchinchisida gipotenuza izlanadi, ya'ni kvadratlar QO'SHILADI: sakson bir qo'shuv bir yuz qirq to'rt ikki yuz yigirma besh, ildizi o'n besh. O'sish tartibida: besh, o'n, o'n besh. Uch savolning tartibi javoblarning tartibi bilan mos kelgani tasodif.",
    'Верно. В трёх вопросах три разных действия. В первом дана гипотенуза, значит квадраты ВЫЧИТАЮТСЯ: сто шестьдесят девять минус сто сорок четыре — двадцать пять, корень пять. Во втором ничего не вычисляется — надо лишь выбрать наибольшую сторону, ведь прямой угол лежит против неё: десять. В третьем ищется гипотенуза, значит квадраты СКЛАДЫВАЮТСЯ: восемьдесят один плюс сто сорок четыре — двести двадцать пять, корень пятнадцать. По возрастанию: пять, десять, пятнадцать. То, что порядок вопросов совпал с порядком ответов, — совпадение.',
    'Correct. Three different actions in the three questions. The first gives the hypotenuse, so the squares are SUBTRACTED: one hundred sixty nine minus one hundred forty four is twenty five, the root is five. The second computes nothing — you only pick the largest side, since the right angle faces it: ten. The third asks for the hypotenuse, so the squares are ADDED: eighty one plus one hundred forty four is two hundred twenty five, the root is fifteen. In increasing order: five, ten, fifteen. That the order of the questions matches the order of the answers is a coincidence.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('1') !== -1, text: L(
      "Bir — gipotenuza bilan katetning CHIZIQLI ayirmasi: o'n uch minus o'n ikki. Ayirish kerak, lekin kvadratlarda: bir yuz oltmish to'qqiz minus bir yuz qirq to'rt yigirma besh, ildizi besh. Tekshiring: besh, o'n ikki, o'n uch — darslikdagi uchlik.",
      'Один — ЛИНЕЙНАЯ разность гипотенузы и катета: тринадцать минус двенадцать. Вычитать нужно, но в квадратах: сто шестьдесят девять минус сто сорок четыре — двадцать пять, корень пять. Проверь: пять, двенадцать, тринадцать — тройка из учебника.',
      'One is the PLAIN difference of the hypotenuse and the leg: thirteen minus twelve. Subtraction is needed, but in the squares: one hundred sixty nine minus one hundred forty four is twenty five, the root is five. Check: five, twelve, thirteen — the triple from the textbook.') },
    { when: (s) => s.slots.indexOf('21') !== -1 || s.slots.indexOf('25') !== -1, text: L(
      "Bu sonlar uzunliklarning yig'indisi: to'qqiz qo'shuv o'n ikki, o'n ikki qo'shuv o'n uch. Pifagor teoremasi KVADRATLARNI qo'shadi. Uchinchi savolda: sakson bir qo'shuv bir yuz qirq to'rt ikki yuz yigirma besh, ildizi o'n besh — bu yigirma birdan kichik, chunki gipotenuza ikki katetning yig'indisidan kichik bo'ladi.",
      'Эти числа — суммы длин: девять плюс двенадцать, двенадцать плюс тринадцать. Теорема Пифагора складывает КВАДРАТЫ. В третьем вопросе: восемьдесят один плюс сто сорок четыре — двести двадцать пять, корень пятнадцать — это меньше двадцати одного, ведь гипотенуза меньше суммы двух катетов.',
      'These numbers are sums of lengths: nine plus twelve, twelve plus thirteen. The Pythagorean theorem adds SQUARES. In the third question: eighty one plus one hundred forty four is two hundred twenty five, the root is fifteen — less than twenty one, since the hypotenuse is less than the sum of the two legs.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: besh, o'n, o'n besh.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: пять, десять, пятнадцать.',
      'The three answers are right, the order is not. The code goes in increasing order: five, ten, fifteen.') },
    { when: (s) => s.slots.indexOf('10') === -1, text: L(
      "Kodda o'n yo'q, lekin ikkinchi savolning javobi aynan shu. U savolda hisoblash kerak emas: uchala tomon berilgan, va to'g'ri burchak ENG KATTA tomonga qarshi turadi. Olti, sakkiz, o'n dan eng kattasi o'n.",
      'В коде нет десяти, а ответ второго вопроса именно такой. Там не нужно вычислять: даны все три стороны, а прямой угол лежит против НАИБОЛЬШЕЙ. Из шести, восьми и десяти наибольшее десять.',
      'The code has no ten, yet that is the answer to the second question. Nothing needs computing there: all three sides are given and the right angle faces the LARGEST. Of six, eight and ten the largest is ten.') },
  ],
  wrongText: L(
    "Har savolda avval nima berilganini o'qing: gipotenuza berilsa ayirish, katetlar berilsa qo'shish, uchala tomon berilsa tanlash.",
    'В каждом вопросе сначала прочитай, что дано: дана гипотенуза — вычитание, даны катеты — сложение, даны все три стороны — выбор.',
    'In every question first read what is given: the hypotenuse means subtraction, the legs mean addition, all three sides mean a choice.'),
};

export default function D45_07(props) { return <CodeLock data={DATA} {...props} />; }
