// Dars43 · Amaliyot 09 — Kod · 🔴 · tag: code_midlines
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 9-pozitsiya)
//
// UCH SAVOL — DARSNING UCH TASDIG'I, ATAYLAB ARALASH TARTIBDA:
//   AC = 16      -> uchburchakning o'rta chizig'i, 8   (T2)
//   a=7, b=13    -> trapetsiyaning o'rta chizig'i, 10  (T3)
//   AB = 21, uch teng bo'lak -> bitta bo'lak, 7        (T1, Falyes)
// Kod o'sish tartibida yoziladi: 7, 8, 10 — ya'ni javoblarning tartibi
// savollarning tartibi bilan MOS KELMAYDI.
//
// Bankdagi tuzoqlar: 16 va 21 — shartdagi sonlar, 20 — yetti qo'shuv o'n uch
// (yarim unutilgan, З90).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_midlines', level: '🔴',
  expr: ['AC = 16', '   ', 'a = 7, b = 13', '   ', 'AB = 21'], exprSize: 15,
  cards: ['7', '8', '10', '16', '20', '21'],
  answer: ['7', '8', '10'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch savol uch xil: birinchisida uchburchakning uchinchi tomoni berilgan va o'rta chiziq kerak; ikkinchisida trapetsiyaning ikki asosi berilgan va o'rta chiziq kerak; uchinchisida yigirma bir uzunlikdagi kesma Falyes teoremasi bilan uch teng bo'lakka bo'linadi va bitta bo'lakning uzunligi kerak.",
    'В комнате сейф, код трёхзначный. Три вопроса разные: в первом дана третья сторона треугольника и нужна средняя линия; во втором даны два основания трапеции и нужна средняя линия; в третьем отрезок длиной двадцать один делится теоремой Фалеса на три равные части и нужна длина одной части.',
    'There is a safe in the room and its code has three places. The three questions differ: the first gives the third side of a triangle and asks for the midline; the second gives the two bases of a trapezoid and asks for the midline; the third splits a segment of length twenty one into three equal parts by the Thales theorem and asks for the length of one part.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch javobni toping va kodga o'sish tartibida yozing.",
    'Найди три ответа и запиши их в код по возрастанию.',
    'Find the three answers and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi savol uchburchak haqida: o'rta chiziq uchinchi tomonning yarmi, ya'ni o'n oltining yarmi sakkiz. Ikkinchisi trapetsiya haqida: yetti qo'shuv o'n uch yigirma, yarmi o'n. Uchinchisi Falyes teoremasi: kesma uch teng bo'lakka bo'linsa, bitta bo'lak yigirma birning uchdan biri, ya'ni yetti. O'sish tartibida: yetti, sakkiz, o'n — javoblarning tartibi savollarning tartibiga mos kelmaydi, va bu ataylab shunday.",
    'Верно. Первый вопрос про треугольник: средняя линия — половина третьей стороны, то есть половина шестнадцати восемь. Второй про трапецию: семь плюс тринадцать — двадцать, половина десять. Третий — теорема Фалеса: если отрезок разделён на три равные части, одна часть это третья часть двадцати одного, то есть семь. По возрастанию: семь, восемь, десять — порядок ответов не совпадает с порядком вопросов, и это сделано намеренно.',
    'Correct. The first question is about a triangle: the midline is half the third side, so half of sixteen is eight. The second is about a trapezoid: seven plus thirteen is twenty, half is ten. The third is the Thales theorem: if the segment is split into three equal parts, one part is a third of twenty one, that is seven. In increasing order: seven, eight, ten — the order of the answers does not match the order of the questions, and that is deliberate.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('20') !== -1, text: L(
      "Yigirma — asoslarning yig'indisi, o'rta chiziq esa uning YARMI. Yetti qo'shuv o'n uch yigirma, ikkiga bo'lsak o'n. Tekshirish oson: o'rta chiziq har doim ikki asosning orasida yotadi, ya'ni u yettidan katta va o'n uchdan kichik bo'lishi kerak.",
      'Двадцать — сумма оснований, а средняя линия её ПОЛОВИНА. Семь плюс тринадцать — двадцать, делим на два — десять. Проверить легко: средняя линия всегда лежит между основаниями, то есть должна быть больше семи и меньше тринадцати.',
      'Twenty is the sum of the bases, while the midline is HALF of it. Seven plus thirteen is twenty, halved is ten. An easy check: the midline always lies between the bases, so it must exceed seven and fall short of thirteen.') },
    { when: (s) => s.slots.indexOf('16') !== -1 || s.slots.indexOf('21') !== -1, text: L(
      "Bu sonlar shartning o'zidan ko'chirilgan. O'n olti — uchburchakning uchinchi tomoni, o'rta chiziq esa uning yarmi. Yigirma bir — butun kesma, javob esa uning uchdan biri. Ikki holatda ham berilgan sonning O'ZI javob bo'lolmaydi.",
      'Эти числа переписаны прямо из условия. Шестнадцать — третья сторона треугольника, а средняя линия её половина. Двадцать один — весь отрезок, а ответ его третья часть. В обоих случаях САМО данное число ответом быть не может.',
      'These numbers were copied straight from the condition. Sixteen is the third side of the triangle, while the midline is half of it. Twenty one is the whole segment, while the answer is a third of it. In neither case can the given number ITSELF be the answer.') },
    { when: (s) => s.set, text: L(
      "Uch javob to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: yetti, sakkiz, o'n. Savollar boshqa tartibda berilgan — uchinchi savolning javobi eng kichik.",
      'Три ответа найдены верно, а порядок нарушен. Код пишется по возрастанию: семь, восемь, десять. Вопросы заданы в другом порядке — ответ третьего вопроса наименьший.',
      'The three answers are right, the order is not. The code goes in increasing order: seven, eight, ten. The questions come in a different order — the answer to the third is the smallest.') },
    { when: (s) => s.slots.indexOf('7') === -1, text: L(
      "Kodda yetti yo'q, lekin uchinchi savolning javobi aynan shu. Falyes teoremasi bilan bo'lish kesmani TENG bo'laklarga bo'ladi, ya'ni bitta bo'lak butunning uchdan biri: yigirma birni uchga bo'lsak yetti.",
      'В коде нет семи, а ответ третьего вопроса именно такой. Деление по теореме Фалеса даёт РАВНЫЕ части, то есть одна часть это третья часть целого: двадцать один разделить на три — семь.',
      'The code has no seven, yet that is the answer to the third question. Dividing by the Thales theorem gives EQUAL parts, so one part is a third of the whole: twenty one divided by three is seven.') },
  ],
  wrongText: L(
    "Har savolda avval QAYSI qoida kerakligini aniqlang: uchburchakning o'rta chizig'i, trapetsiyaning o'rta chizig'i yoki teng bo'laklarga bo'lish.",
    'В каждом вопросе сначала определи, КАКОЕ правило нужно: средняя линия треугольника, средняя линия трапеции или деление на равные части.',
    'In every question first decide WHICH rule is needed: the midline of a triangle, the midline of a trapezoid, or the division into equal parts.'),
};

export default function D43_09(props) { return <CodeLock data={DATA} {...props} />; }
