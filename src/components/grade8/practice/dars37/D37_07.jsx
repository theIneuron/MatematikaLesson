// Dars37 · Amaliyot 07 — Kod · 🟡 · tag: code_angles
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 7-pozitsiya)
//
// UCH PARALLELOGRAMM, VA SAVOLLAR ATAYLAB ARALASH:
//   ∠A = 40°  -> ∠B  (qo'shni) -> 140
//   ∠A = 75°  -> ∠C  (qarama-qarshi) -> 75
//   ∠A = 100° -> ∠B  (qo'shni) -> 80
// Ikkinchi savol o'rtada turadi, ya'ni o'quvchi bir xil harakatni uch
// marta takrorlay olmaydi: har safar QAYSI burchak so'ralayotganini
// o'qish kerak. З76 aynan shu joyda tutiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_angles', level: '🟡',
  expr: ['∠A = 40° → ∠B', '   ', '∠A = 75° → ∠C', '   ', '∠A = 100° → ∠B'], exprSize: 14,
  cards: ['40', '75', '80', '100', '105', '140'],
  answer: ['75', '80', '140'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch xil parallelogramm ABCD berilgan, va har birida bitta burchak ma'lum. Diqqat: uch savolda so'ralayotgan burchaklar bir xil emas.",
    'В комнате сейф, код трёхзначный. Даны три разных параллелограмма ABCD, и в каждом известен один угол. Внимание: в трёх вопросах спрашивают не одинаковые углы.',
    'There is a safe in the room and its code has three places. Three different parallelograms ABCD are given, and one angle is known in each. Note: the three questions do not ask for the same angle.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni kodga o'sish tartibida yozing.",
    'Запиши три ответа в код по возрастанию.',
    'Write the three answers into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Har savolda avval QAYSI burchak so'ralayotganini aniqlash kerak. Birinchisida ∠B so'ralyapti — u ∠A ga qo'shni, ya'ni bir yuz sakson minus qirq, bir yuz qirq. Ikkinchisida ∠C so'ralyapti — u ∠A ga qarama-qarshi, ya'ni TENG: yetmish besh. Uchinchisida yana ∠B — bir yuz sakson minus yuz, sakson. O'sish tartibida: yetmish besh, sakson, bir yuz qirq. Uch savolning ikkitasida ayirish, bittasida esa hech qanday hisob kerak emas — javob berilgan burchakning o'zi. Farqni faqat harf beradi: B qo'shni, C qarama-qarshi.",
    'Верно. В каждом вопросе сначала надо понять, КАКОЙ угол спрашивают. В первом спрашивают ∠B — он соседний с ∠A, значит сто восемьдесят минус сорок, сто сорок. Во втором спрашивают ∠C — он противоположен ∠A, значит РАВЕН ему: семьдесят пять. В третьем снова ∠B — сто восемьдесят минус сто, восемьдесят. По возрастанию: семьдесят пять, восемьдесят, сто сорок. В двух вопросах из трёх нужно вычитание, а в одном никакого счёта не нужно — ответ и есть данный угол. Разницу задаёт только буква: B соседний, C противоположный.',
    'Correct. In each question you must first see WHICH angle is asked for. The first asks for ∠B — adjacent to ∠A, so one hundred eighty minus forty is one hundred forty. The second asks for ∠C — opposite to ∠A, hence EQUAL to it: seventy-five. The third asks for ∠B again — one hundred eighty minus one hundred is eighty. In increasing order: seventy-five, eighty, one hundred forty. Two of the three questions need a subtraction and one needs no arithmetic at all — the answer is the given angle itself. Only the letter makes the difference: B is adjacent, C is opposite.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('105') !== -1, text: L(
      "Bir yuz besh — bu ikkinchi savolga AYIRISH qo'llangan natija: bir yuz sakson minus yetmish besh. Lekin u yerda ∠C so'ralyapti, ∠B emas. C uchi A uchiga QARAMA-QARSHI turadi, ya'ni burchaklar teng va hech narsa hisoblanmaydi. Ayirish faqat qo'shni burchaklar uchun ishlatiladi.",
      'Сто пять — это результат ВЫЧИТАНИЯ во втором вопросе: сто восемьдесят минус семьдесят пять. Но там спрашивают ∠C, а не ∠B. Вершина C ПРОТИВОПОЛОЖНА вершине A, значит углы равны и ничего вычислять не надо. Вычитание применяется только к соседним углам.',
      'One hundred five is the result of SUBTRACTING in the second question: one hundred eighty minus seventy-five. But there ∠C is asked for, not ∠B. The vertex C is OPPOSITE the vertex A, so the angles are equal and nothing needs computing. Subtraction applies only to adjacent angles.') },
    { when: (s) => s.slots.indexOf('40') !== -1 || s.slots.indexOf('100') !== -1, text: L(
      "Bu son berilgan burchakning O'ZI, va u faqat qarama-qarshi burchak so'ralganda javob bo'ladi. Birinchi va uchinchi savolda esa ∠B so'ralyapti — u qo'shni burchak, ya'ni javob boshqa: bir yuz sakson minus berilgan burchak. Harflarga qarang: A va B bitta tomonning ikki uchida, A va C esa diagonal bo'ylab qarama-qarshi.",
      'Это число — САМ данный угол, и ответом оно бывает лишь тогда, когда спрашивают противоположный угол. А в первом и третьем вопросе спрашивают ∠B — это соседний угол, значит ответ другой: сто восемьдесят минус данный угол. Смотри на буквы: A и B стоят в двух концах одной стороны, а A и C противоположны по диагонали.',
      'This number is the given angle ITSELF, and it is the answer only when the opposite angle is asked for. The first and third questions ask for ∠B — the adjacent angle, so the answer differs: one hundred eighty minus the given angle. Look at the letters: A and B stand at the two ends of one side, while A and C are opposite along a diagonal.') },
    { when: (s) => s.slots.indexOf('75') === -1, text: L(
      "Kodda yetmish besh yo'q, lekin ikkinchi savolning javobi aynan u. U yerda ∠C so'ralgan, C esa A ga qarama-qarshi uch — parallelogrammda bunday burchaklar teng. Hech qanday hisob talab qilinmaydi, va bu uchta savolning eng osoni: javobni shartning o'zidan ko'chirib yozish kifoya.",
      'В коде нет семидесяти пяти, а ответ второго вопроса именно он. Там спрашивают ∠C, а C — вершина, противоположная A; в параллелограмме такие углы равны. Никаких вычислений не требуется, и это самый лёгкий из трёх вопросов: ответ переписывается прямо из условия.',
      'The code has no seventy-five, yet that is the answer to the second question. It asks for ∠C, and C is the vertex opposite A; in a parallelogram such angles are equal. No computation is needed, and this is the easiest of the three questions: the answer is copied straight from the condition.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: yetmish besh, sakson, bir yuz qirq. Savollarning tartibi javoblarning tartibi bilan mos kelmaydi.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: семьдесят пять, восемьдесят, сто сорок. Порядок вопросов с порядком ответов не совпадает.',
      'The three answers are right, the order is not. The code goes in increasing order: seventy-five, eighty, one hundred forty. The order of the questions does not match the order of the answers.') },
  ],
  wrongText: L(
    "Har savolda qaysi burchak so'ralayotganiga qarang: B qo'shni (180 dan ayiriladi), C esa qarama-qarshi (teng).",
    'В каждом вопросе смотри, какой угол спрашивают: B соседний (вычитается из 180), C противоположный (равен).',
    'In every question see which angle is asked for: B is adjacent (subtract from 180), C is opposite (equal).'),
};

export default function D37_07(props) { return <CodeLock data={DATA} {...props} />; }
