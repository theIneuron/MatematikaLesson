// Dars52 · Amaliyot 09 — Pazl · 🔴 🖼 · tag: fourth_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 9-pozitsiya)
//
// З111 HISOBGA AYLANADI: uch tomon berilgan, to'rtinchisi izlanadi.
//   7, 5, 9  -> 7+9=16, 16-5 = 11
//   6, 4, 8  -> 6+8=14, 14-4 = 10
//   10, 3, 5 -> 10+5=15, 15-3 = 12
// Tomonlar teng deb olinsa javob ikkinchi tomonning o'zi bo'lardi (5, 4,
// 3), va bunday karta bankda YO'Q — javobni tenglikdan chiqarish kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'fourth_side', level: '🔴',
  faceSize: 14, faceSizePhone: 12,
  given: [[{
    fig: 'circ', w: 66, h: 56, r: 16, cx: 33, cy: 28,
    tang: [60, 150, 250, 335], vnames: ['B', 'A', 'D', 'C'],
  }]],
  givenLabel: L('Chizma', 'Рисунок', 'The drawing'),
  cards: [
    { id: 'f1', side: 0, tokens: ['7, 5, 9'] },
    { id: 'f2', side: 0, tokens: ['6, 4, 8'] },
    { id: 'f3', side: 0, tokens: ['10, 3, 5'] },
    { id: 'v1', side: 1, v: '11' },
    { id: 'v2', side: 1, v: '10' },
    { id: 'v3', side: 1, v: '12' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Chizmadagidek tashqi chizilgan to'rtburchak: aylana uning to'rt tomoniga ham urinadi. Uch holatda AB, BC va CD tomonlari tartib bilan berilgan, to'rtinchi DA tomonini topish kerak.",
    'Описанный четырёхугольник, как на рисунке: окружность касается всех четырёх его сторон. В трёх случаях по порядку даны стороны AB, BC и CD, надо найти четвёртую сторону DA.',
    'A circumscribed quadrilateral as in the drawing: the circle touches all four of its sides. In three cases the sides AB, BC and CD are given in order, and the fourth side DA must be found.'),
  ask: L(
    "Uch tomonni bosing, keyin uyani bosing.",
    'Нажми три стороны, потом ячейку.',
    'Tap the three sides, then a slot.'),
  bank: L("To'plamlar", 'Наборы', 'Sets'),
  correctText: L(
    "To'g'ri. Qoida: birinchi qo'shuv uchinchi teng ikkinchi qo'shuv to'rtinchi. Demak to'rtinchi tomon birinchi va uchinchining yig'indisidan ikkinchisini ayirish bilan topiladi. Yetti qo'shuv to'qqiz o'n olti, ayirmoq besh o'n bir. Olti qo'shuv sakkiz o'n to'rt, ayirmoq to'rt o'n. O'n qo'shuv besh o'n besh, ayirmoq uch o'n ikki. Uchala javob ham berilgan tomonlarning hech biriga teng emas, va bu tabiiy.",
    'Верно. Правило: первая плюс третья равно второй плюс четвёртой. Значит четвёртая сторона находится вычитанием второй из суммы первой и третьей. Семь плюс девять шестнадцать, минус пять одиннадцать. Шесть плюс восемь четырнадцать, минус четыре десять. Десять плюс пять пятнадцать, минус три двенадцать. Ни один из трёх ответов не равен какой-либо из данных сторон, и это естественно.',
    'Correct. The rule: first plus third equals second plus fourth. So the fourth side is found by subtracting the second from the sum of the first and third. Seven plus nine is sixteen, minus five is eleven. Six plus eight is fourteen, minus four is ten. Ten plus five is fifteen, minus three is twelve. None of the three answers equals any of the given sides, and that is natural.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Yetti, besh, to'qqiz va o'n, uch, besh to'plamlari o'rin almashdi. Har birini alohida hisoblang: birinchi to'plamda yetti qo'shuv to'qqiz o'n olti, undan besh ayirilsa o'n bir; uchinchisida o'n qo'shuv besh o'n besh, undan uch ayirilsa o'n ikki. Sonlar yaqin, shuning uchun yodda hisoblash o'rniga yozib chiqish kerak.",
      'Наборы семь, пять, девять и десять, три, пять поменялись местами. Посчитай каждый отдельно: в первом семь плюс девять шестнадцать, минус пять одиннадцать; в третьем десять плюс пять пятнадцать, минус три двенадцать. Числа близкие, поэтому лучше выписать, чем считать в уме.',
      'The sets seven, five, nine and ten, three, five swapped places. Compute each separately: in the first, seven plus nine is sixteen, minus five is eleven; in the third, ten plus five is fifteen, minus three is twelve. The numbers are close, so write them out instead of doing it in your head.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Olti, to'rt, sakkiz to'plami uchun javob mos kelmadi. Ketma-ket bajaring: birinchi va uchinchi tomonni qo'shing — olti qo'shuv sakkiz o'n to'rt. Keyin ikkinchi tomonni ayiring — o'n to'rt ayirmoq to'rt o'n. To'rtinchi tomon o'n.",
      'Для набора шесть, четыре, восемь ответ не подошёл. Делай по порядку: сложи первую и третью сторону — шесть плюс восемь четырнадцать. Потом вычти вторую — четырнадцать минус четыре десять. Четвёртая сторона десять.',
      'The answer for the set six, four, eight did not fit. Go step by step: add the first and third sides — six plus eight is fourteen. Then subtract the second — fourteen minus four is ten. The fourth side is ten.') },
    { when: () => true, text: L(
      "Qarama-qarshi tomonlar TENG emas, ularning YIG'INDILARI teng. Agar tomonlar teng deb olinsa, javob ikkinchi tomonning o'zi bo'lardi — besh, to'rt va uch. Bankda bunday karta yo'q, chunki bu javob emas. Birinchi va uchinchini qo'shing, keyin ikkinchisini ayiring.",
      'Противоположные стороны не РАВНЫ, равны их СУММЫ. Если считать стороны равными, ответом была бы сама вторая сторона — пять, четыре и три. Таких карточек в банке нет, потому что это не ответ. Сложи первую и третью, потом вычти вторую.',
      'Opposite sides are not EQUAL, their SUMS are. If the sides were taken as equal, the answer would be the second side itself — five, four, and three. No such cards are in the bank, because that is not the answer. Add the first and third, then subtract the second.') },
  ],
  wrongText: L(
    "Birinchi qo'shuv uchinchi, keyin ikkinchisini ayiring.",
    'Первая плюс третья, потом вычти вторую.',
    'First plus third, then subtract the second.'),
};

export default function D52_09(props) { return <PairSlots data={DATA} {...props} />; }
