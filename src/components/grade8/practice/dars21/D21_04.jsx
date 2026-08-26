// Dars21 · Amaliyot 04 — Kod · 🟡 · tag: code_real_answers
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 4-pozitsiya)
//
// TENGLAMA YECHILMAYDI — TANLANADI. Uch masalaning ildizlari tayyor
// berilgan, ish esa bitta: har juftlikdan masalaga MOS keladiganini olish.
// Shu sababli З47 uch marta ketma-ket, boshqa hech qanday hisob aralashmasdan.
//
// Uch kattalik uch xil: uzunlik, vaqt, tezlik — va uchalasi ham manfiy
// bo'lmaydi. Bankdagi uch tuzoq aynan o'sha rad etilgan ildizlar.
// Kod O'SISH tartibida, ya'ni javoblar topilgandan keyin yana bir ish qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_real_answers', level: '🟡',
  expr: ['5; −8', '   ', '−2; 4', '   ', '−7; 3'], exprSize: 20,
  cards: ['−8', '−7', '−2', '3', '4', '5'],
  answer: ['3', '4', '5'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Uch masala yechildi va har birida ikkita ildiz chiqdi. Birinchisida tomon uzunligi so'ralgan: 5 va −8. Ikkinchisida vaqt so'ralgan: −2 va 4. Uchinchisida tezlik so'ralgan: −7 va 3.",
    'Три задачи решены, и в каждой вышло по два корня. В первой спрашивали длину стороны: 5 и −8. Во второй время: −2 и 4. В третьей скорость: −7 и 3.',
    'Three problems were solved and each gave two roots. The first asked for a side length: 5 and −8. The second for time: −2 and 4. The third for speed: −7 and 3.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Har masaladan haqiqiy javobni oling va kodga o'sish tartibida yozing.",
    'Возьми из каждой задачи настоящий ответ и запиши их в код по возрастанию.',
    'Take the genuine answer from each problem and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uch masalada uch xil kattalik so'ralgan, lekin ularning hammasi bir xil narsani talab qiladi: uzunlik ham, vaqt ham, tezlik ham manfiy bo'lmaydi. Shuning uchun har juftlikdan musbat son olinadi: besh, to'rt, uch. O'sish tartibida esa ular boshqacha turadi — uch, to'rt, besh. Manfiy ildizlar tenglamani to'g'ri qiladi, lekin masalani emas, shuning uchun ular javobga kirmaydi.",
    'Верно. В трёх задачах спрашивали три разные величины, но все они требуют одного: ни длина, ни время, ни скорость отрицательными не бывают. Поэтому из каждой пары берётся положительное число: пять, четыре, три. А по возрастанию они идут иначе — три, четыре, пять. Отрицательные корни обращают в верное уравнение, но не задачу, поэтому в ответ они не входят.',
    'Correct. The three problems asked for three different quantities, but all of them require the same thing: neither a length, nor a time, nor a speed is ever negative. So from each pair the positive number is taken: five, four, three. In increasing order they stand differently — three, four, five. The negative roots satisfy the equation but not the problem, so they do not enter the answer.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−8') !== -1, text: L(
      "Minus sakkiz — birinchi masalaning ildizi, lekin u yerda TOMON UZUNLIGI so'ralgan. Minus sakkiz santimetrli tomon yo'q, uni chizib bo'lmaydi. Shuning uchun birinchi masalaning javobi besh.",
      'Минус восемь — корень первой задачи, но там спрашивали ДЛИНУ СТОРОНЫ. Стороны в минус восемь сантиметров не бывает, её не начертить. Поэтому ответ первой задачи пять.',
      'Minus eight is a root of the first problem, but that problem asked for a SIDE LENGTH. A side of minus eight centimetres does not exist and cannot be drawn. So the answer to the first problem is five.') },
    { when: (s) => s.slots.indexOf('−2') !== -1, text: L(
      "Minus ikki — ikkinchi masalaning ildizi, lekin u yerda VAQT so'ralgan. Vaqt manfiy bo'lmaydi: minus ikki soat yurgan mashina yo'q. Shuning uchun ikkinchi masalaning javobi to'rt.",
      'Минус два — корень второй задачи, но там спрашивали ВРЕМЯ. Время отрицательным не бывает: машины, ехавшей минус два часа, не существует. Поэтому ответ второй задачи четыре.',
      'Minus two is a root of the second problem, but that problem asked for TIME. Time is never negative: there is no car that drove for minus two hours. So the answer to the second problem is four.') },
    { when: (s) => s.slots.indexOf('−7') !== -1, text: L(
      "Minus yetti — uchinchi masalaning ildizi, lekin u yerda TEZLIK so'ralgan. Masalada tezlik manfiy bo'lmaydi: harakat bor va u soatiga qancha km ekani musbat son bilan o'lchanadi. Shuning uchun uchinchi masalaning javobi uch.",
      'Минус семь — корень третьей задачи, но там спрашивали СКОРОСТЬ. В задаче скорость отрицательной не бывает: движение есть, и сколько километров в час — измеряется положительным числом. Поэтому ответ третьей задачи три.',
      'Minus seven is a root of the third problem, but that problem asked for SPEED. In this problem a speed is never negative: there is motion, and how many kilometres per hour is measured by a positive number. So the answer to the third problem is three.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi, ya'ni eng kichigidan boshlanadi: uch, to'rt, besh. Masalalarning tartibi bilan javoblarning tartibi bu yerda mos kelmaydi.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию, то есть начинается с наименьшего: три, четыре, пять. Порядок задач и порядок ответов здесь не совпадают.',
      'The three answers are right, the order is not. The code is written in increasing order, starting from the smallest: three, four, five. The order of the problems and the order of the answers do not coincide here.') },
  ],
  wrongText: L(
    "Har juftlikdan masalaga mos keladigan sonni oling: uzunlik ham, vaqt ham, tezlik ham manfiy bo'lmaydi. Keyin uch javobni o'sish tartibida joylashtiring.",
    'Из каждой пары бери число, подходящее задаче: ни длина, ни время, ни скорость отрицательными не бывают. Потом расставь три ответа по возрастанию.',
    'From each pair take the number that fits the problem: neither a length, nor a time, nor a speed is ever negative. Then put the three answers in increasing order.'),
};

export default function D21_04(props) { return <CodeLock data={DATA} {...props} />; }
