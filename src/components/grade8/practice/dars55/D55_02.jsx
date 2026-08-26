// Dars55 · Amaliyot 02 — Yozuvlar · 🟢 · tag: coords_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 2-pozitsiya)
//
// T1: AB⃗ ning koordinatalari OXIRIdan BOSHIni ayirish bilan topiladi.
//   (1;2) -> (4;6):  (3;4) ha        (−3;−4) yo'q  -> З116, tartib teskari
//   (5;1) -> (2;7):  (−3;6) ha       (3;6)   yo'q  -> ishora yo'qoldi
//   (0;3) -> (4;3):  (4;0) ha        (4;3)   yo'q  -> ikkinchisi ayirilmagan
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'coords_marked', level: '🟢',
  col: 132, itemSize: 12,
  given: [[{
    // Kadr kichik: telefonda 52px li to'r razbor bilan birga to'rt piksel
    // chiqarib yuborardi (o'lchov 2026-08-25).
    fig: 'vec', w: 62, h: 44,
    grid: { x: [-1, 5], y: [-1, 4] },
    arrows: [{ from: [1, 1], to: [4, 3], name: 'AB' }],
    dots: [{ at: [1, 1], name: 'A', dy: -5 }, { at: [4, 3], name: 'B', dy: -5 }],
  }]],
  givenLabel: L('Namuna', 'Пример', 'An example'),
  items: [
    { id: 'i1', hit: true, tokens: ['(1;2) → (4;6):  (3;4)'] },
    { id: 'i2', tokens: ['(1;2) → (4;6):  (−3;−4)'] },
    { id: 'i3', hit: true, tokens: ['(5;1) → (2;7):  (−3;6)'] },
    { id: 'i4', tokens: ['(5;1) → (2;7):  (3;6)'] },
    { id: 'i5', hit: true, tokens: ['(0;3) → (4;3):  (4;0)'] },
    { id: 'i6', tokens: ['(0;3) → (4;3):  (4;3)'] },
  ],
  eyebrow: L('Yozuvlar', 'Записи', 'Records'),
  setup: L(
    "Oltita yozuv. Har birida chapda vektorning boshi va oxiri, o'ngda esa uning koordinatalari deb aytilgan juftlik. Vektorning koordinatalari oxirining koordinatalaridan boshining koordinatalarini ayirish bilan topiladi.",
    'Шесть записей. В каждой слева начало и конец вектора, а справа пара, названная его координатами. Координаты вектора находятся вычитанием координат начала из координат конца.',
    'Six records. In each, the start and end of a vector are on the left, and on the right a pair named as its coordinates. The coordinates of a vector are found by subtracting the coordinates of the start from those of the end.'),
  ask: L(
    "To'g'ri hisoblangan 3 ta yozuvni belgilang.",
    'Отметь 3 верно посчитанные записи.',
    'Mark the 3 records computed correctly.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uch yozuvda amal to'g'ri bajarilgan. To'rt ayirmoq bir uch, olti ayirmoq ikki to'rt. Ikki ayirmoq besh minus uch, yetti ayirmoq bir olti. To'rt ayirmoq nol to'rt, uch ayirmoq uch nol. Uchinchi javobdagi nol tasodif emas: ikki nuqtaning ikkinchi koordinatasi bir xil, ya'ni vektor gorizontal.",
    'Верно. В трёх записях действие выполнено правильно. Четыре минус один три, шесть минус два четыре. Два минус пять минус три, семь минус один шесть. Четыре минус ноль четыре, три минус три ноль. Ноль в третьем ответе не случаен: у двух точек вторая координата одинакова, значит вектор горизонтален.',
    'Correct. In three records the operation was done right. Four minus one is three, six minus two is four. Two minus five is minus three, seven minus one is six. Four minus zero is four, three minus three is zero. The zero in the third answer is no accident: the two points share the same second coordinate, so the vector is horizontal.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Ikkinchi yozuvda tartib teskarilangan: boshning koordinatalaridan oxirniki ayirilgan. Natijada ikkala son ham qarama-qarshi ishorada chiqdi, ya'ni bu QARAMA-QARSHI vektor. Tekshirish oson: boshning koordinatalariga javobni qo'shsangiz, oxiri chiqishi kerak. Bir qo'shuv minus uch minus ikki beradi, to'rt emas.",
      'Во второй записи порядок перепутан: из координат начала вычли координаты конца. В результате оба числа вышли с обратным знаком, то есть это ПРОТИВОПОЛОЖНЫЙ вектор. Проверить легко: прибавь ответ к координатам начала — должен получиться конец. Один плюс минус три даёт минус два, а не четыре.',
      'In the second record the order is reversed: the end coordinates were subtracted from the start ones. Both numbers came out with the opposite sign, so this is the OPPOSITE vector. An easy check: add the answer to the start coordinates and the end must come out. One plus minus three gives minus two, not four.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "To'rtinchi yozuvda birinchi koordinatada ishora yo'qolgan. Ikki ayirmoq besh minus uch bo'ladi, uch emas: oxirning birinchi koordinatasi boshnikidan KICHIK, demak vektor chapga qaraydi va birinchi koordinata manfiy chiqadi.",
      'В четвёртой записи в первой координате потерян знак. Два минус пять это минус три, а не три: первая координата конца МЕНЬШЕ, чем у начала, значит вектор смотрит влево и первая координата отрицательна.',
      'In the fourth record the sign is lost in the first coordinate. Two minus five is minus three, not three: the first coordinate of the end is SMALLER than the start, so the vector points left and the first coordinate is negative.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Oltinchi yozuvda ikkinchi koordinata umuman ayirilmagan: uch shundoq ko'chirilgan. Uch ayirmoq uch nol, demak vektorning ikkinchi koordinatasi nol. Bu vektorning yuqoriga ham, pastga ham siljimasligini bildiradi.",
      'В шестой записи вторая координата вовсе не вычиталась: тройку просто переписали. Три минус три ноль, значит вторая координата вектора равна нулю. Это означает, что вектор не смещается ни вверх, ни вниз.',
      'In the sixth record the second coordinate was not subtracted at all: the three was simply copied over. Three minus three is zero, so the second coordinate of the vector is zero. That means the vector does not shift up or down.') },
    { when: () => true, text: L(
      "Har yozuvda ikki ayirish bor: birinchi koordinatalar va ikkinchi koordinatalar. Ikkalasini ham OXIRDAN BOSHNI ayirib hisoblang.",
      'В каждой записи два вычитания: первые координаты и вторые. Оба считай, вычитая ИЗ КОНЦА НАЧАЛО.',
      'Each record has two subtractions: the first coordinates and the second. Compute both by subtracting the START from the END.') },
  ],
  wrongText: L(
    "Oxirning koordinatalaridan boshning koordinatalarini ayiring. Ikki koordinata ham alohida.",
    'Из координат конца вычти координаты начала. Каждая координата отдельно.',
    'Subtract the start coordinates from the end coordinates. Each coordinate separately.'),
};

export default function D55_02(props) { return <MarkAll data={DATA} {...props} />; }
