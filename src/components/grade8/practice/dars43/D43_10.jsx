// Dars43 · Amaliyot 10 — Juftlash · 🔴 · tag: mixed_midlines
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 10-pozitsiya)
//
// TO'RT JUFTLIKDA TO'RT XIL YO'NALISH: uchburchak to'g'ri yo'lda, trapetsiya
// to'g'ri yo'lda, trapetsiya teskari yo'lda, uchburchak teskari yo'lda.
// O'quvchi har juftlikda ikki narsani aniqlashi kerak: qaysi figura va qaysi
// yo'nalish.
//
// CHAP USTUN SO'Z BILAN: `MatchPairs` ning `items[].label` i `tr()` dan
// o'tadi (`D01_10.jsx` dalili, skelet §0a.4), ya'ni figuraning nomini uch
// tilda yozish mumkin. O'ng ustun esa belgi — u tarjima qilinmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'mixed_midlines', level: '🔴',
  connect: true,
  targetSize: 17,
  items: [
    { id: 'm1', label: L("uchburchak, uchinchi tomoni 10", 'треугольник, третья сторона 10', 'a triangle, the third side is 10') },
    { id: 'm2', label: L("trapetsiya, asoslari 3 va 9", 'трапеция, основания 3 и 9', 'a trapezoid, the bases are 3 and 9') },
    { id: 'm3', label: L("trapetsiya, o'rta chizig'i 7, bir asosi 4", 'трапеция, средняя линия 7, одно основание 4', 'a trapezoid, midline 7, one base 4') },
    { id: 'm4', label: L("uchburchak, o'rta chizig'i 6", 'треугольник, средняя линия 6', 'a triangle, the midline is 6') },
  ],
  targets: [
    { id: 't1', tokens: ['MN = 5'] },
    { id: 't2', tokens: ['m = 6'] },
    { id: 't3', tokens: ['b = 10'] },
    { id: 't4', tokens: ['AC = 12'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt shart: ikkitasi uchburchak, ikkitasi trapetsiya haqida. Ikkitasida o'rta chiziq izlanadi, ikkitasida esa o'rta chiziq berilgan va tomon yoki asos izlanadi.",
    'Четыре условия: два про треугольник, два про трапецию. В двух ищется средняя линия, а в двух средняя линия дана и ищется сторона или основание.',
    'Four conditions: two about a triangle, two about a trapezoid. Two ask for the midline; in the other two the midline is given and a side or a base is asked for.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan natijani bosing.",
    'Нажми условие слева, потом результат справа.',
    'Tap a condition on the left, then the result on the right.'),
  correctText: L(
    "To'g'ri. To'rt juftlikda to'rt xil ish bajarildi. Uchburchakda uchinchi tomon o'n bo'lsa, o'rta chiziq uning yarmi — besh. Trapetsiyada asoslar uch va to'qqiz bo'lsa, o'rta chiziq yig'indining yarmi — olti. Uchinchi shartda yo'nalish teskari: o'rta chiziq yetti bo'lsa, asoslar yig'indisi o'n to'rt, undan to'rtni ayirsak o'n. To'rtinchisi ham teskari, lekin uchburchakda: o'rta chiziq olti bo'lsa, uchinchi tomon uning ikki barobari — o'n ikki. Ya'ni yarim to'rt marta ishlatildi, ikki marta OLINDI va ikki marta TIKLANDI.",
    'Верно. В четырёх парах выполнены четыре разных действия. В треугольнике третья сторона десять — средняя линия её половина, пять. В трапеции основания три и девять — средняя линия половина суммы, шесть. В третьем условии направление обратное: средняя линия семь, значит сумма оснований четырнадцать, вычтем четыре — десять. Четвёртое тоже обратное, но в треугольнике: средняя линия шесть, значит третья сторона вдвое больше — двенадцать. То есть половина сработала четыре раза: дважды её БРАЛИ и дважды ВОССТАНАВЛИВАЛИ.',
    'Correct. Four different actions were done in the four pairs. In the triangle the third side is ten, so the midline is half of it, five. In the trapezoid the bases are three and nine, so the midline is half the sum, six. The third condition runs backwards: the midline is seven, so the sum of the bases is fourteen; subtract four and ten remains. The fourth is backwards too, but in a triangle: the midline is six, so the third side is twice that, twelve. So the half worked four times: twice it was TAKEN and twice RESTORED.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki juftlik almashib ketdi, va sabab shu: ikkalasida ham o'rta chiziq izlanadi, lekin figuralar boshqa. Uchburchakda bitta tomonning yarmi olinadi — o'nning yarmi besh. Trapetsiyada esa ikki asos qo'shiladi, keyin yarmi olinadi — uch qo'shuv to'qqiz o'n ikki, yarmi olti.",
      'Эти две пары поменялись местами, и вот почему: в обеих ищется средняя линия, но фигуры разные. В треугольнике берётся половина одной стороны — половина десяти пять. А в трапеции сначала складываются основания, потом берётся половина — три плюс девять двенадцать, половина шесть.',
      'These two pairs were swapped, and here is why: both ask for the midline, but the figures differ. In a triangle you halve one side — half of ten is five. In a trapezoid the bases are added first and then halved — three plus nine is twelve, half is six.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki juftlikda yo'nalish teskari, lekin ular boshqa figurada. Uchburchakda o'rta chiziqdan tomonga o'tish uchun IKKILANTIRISH kifoya: olti karra ikki o'n ikki. Trapetsiyada esa ikki qadam kerak: yettini ikkilantirib o'n to'rtni olamiz, keyin ma'lum asosni ayiramiz — o'n to'rt minus to'rt o'n.",
      'В этих двух парах направление обратное, но фигуры разные. В треугольнике, чтобы перейти от средней линии к стороне, достаточно УДВОИТЬ: шесть на два — двенадцать. А в трапеции нужны два шага: удвоим семь и получим четырнадцать, потом вычтем известное основание — четырнадцать минус четыре — десять.',
      'These two pairs both run backwards, but in different figures. In a triangle, going from the midline to the side, DOUBLING is enough: six times two is twelve. In a trapezoid two steps are needed: double seven to fourteen, then subtract the known base — fourteen minus four is ten.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har shartda ikki savolga javob bering. Birinchisi: figura uchburchakmi yoki trapetsiyami? Ikkinchisi: o'rta chiziq IZLANAYAPTIMI yoki u BERILGANMI? Ikki javob birga qanday amal kerakligini aytadi.",
      'В каждом условии ответь на два вопроса. Первый: фигура треугольник или трапеция? Второй: средняя линия ИЩЕТСЯ или ДАНА? Два ответа вместе и говорят, какое действие нужно.',
      'Answer two questions in every condition. First: is the figure a triangle or a trapezoid? Second: is the midline being SOUGHT or is it GIVEN? The two answers together say which action is needed.') },
  ],
  wrongText: L(
    "Avval figurani aniqlang, keyin yo'nalishni: yarmini olish kerakmi yoki ikkilantirish.",
    'Сначала определи фигуру, потом направление: брать половину или удваивать.',
    'First identify the figure, then the direction: take the half or double.'),
};

export default function D43_10(props) { return <MatchPairs data={DATA} {...props} />; }
