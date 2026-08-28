// Dars02 · Amaliyot 04 — Guruhlar · 🟡 · teg: oyna-vs-burilish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Zones.
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §04
//
// Juft daraja ishorani yutadi, toq daraja uni o'tkazadi. Ikkita tuzoq
// qo'shilgan sondan chiqadi: toq funksiyaga son qo'shilsa u toq bo'lmay
// qoladi (x³ + 1), juft funksiyada esa son hech nimani buzmaydi (x² − 6).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, Zones } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'oyna-vs-burilish', level: '🟡',
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Guruhni nom emas, xossa hal qiladi: minus iks da qiymat qanday o'zgaradi.",
    'Группу решает не название, а свойство: что происходит со значением при минус икс.',
    'The group is decided not by a name but by a property: what happens to the value at minus x.'),
  ask: L("Har bir yozuvni o'z guruhiga qo'ying.", 'Разложи каждую запись в свою группу.', 'Put each record into its own group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  zoneLbl: 118, zoneSize: 16, itemSize: 16,
  zones: [
    { id: 'a', label: L('Juft', 'Чётная', 'Even') },
    { id: 'b', label: L('Toq', 'Нечётная', 'Odd') },
    { id: 'c', label: L('Na juft, na toq', 'Ни чётная, ни нечётная', 'Neither even nor odd') },
  ],
  items: [
    { id: 'i1', tokens: ['y = x⁴'], zone: 'a' },
    { id: 'i2', tokens: ['y = x² − 6'], zone: 'a' },
    { id: 'i3', tokens: ['y = −2x'], zone: 'b' },
    { id: 'i4', tokens: ['y = x⁵'], zone: 'b' },
    { id: 'i5', tokens: ['y = 2x + 7'], zone: 'c' },
    { id: 'i6', tokens: ['y = x³ + 1'], zone: 'c' },
  ],
  correctText: L(
    "To'g'ri. Juft daraja ishorani yutadi, toq daraja esa uni o'tkazadi. Qo'shilgan son bu naqshni buzishi mumkin: toq funksiyaga son qo'shilsa, u toq bo'lmay qoladi. Juft funksiyada esa son qo'shish yoki ayirish hech nimani buzmaydi.",
    'Верно. Чётная степень поглощает знак, нечётная его пропускает. Прибавленное число может сломать эту картину: если к нечётной функции прибавить число, она перестаёт быть нечётной. А у чётной функции прибавление или вычитание числа ничего не ломает.',
    'Correct. An even power swallows the sign, an odd power passes it through. An added number can break that picture: add a number to an odd function and it stops being odd. For an even function, adding or subtracting a number breaks nothing.'),
  wrongs: [
    { when: (s) => s.place.i6 !== 'c', text: L(
      "Iks kub qo'shuv birga minus birni qo'ying: nol chiqadi. Birda esa ikki. Toqlik uchun bu ikki son qarama-qarshi bo'lishi kerak edi.",
      'Подставь минус единицу в икс в кубе плюс один: получится нуль. А при единице — два. Для нечётности эти два числа должны были быть противоположными.',
      'Put minus one into x cubed plus one: you get zero. At one you get two. For oddness those two numbers had to be opposite.') },
    { when: (s) => s.place.i5 !== 'c', text: L(
      "Birda to'qqiz, minus birda besh. Bu sonlar na teng, na qarama-qarshi.",
      'При единице девять, при минус единице пять. Эти числа ни равны, ни противоположны.',
      'At one it is nine, at minus one it is five. These numbers are neither equal nor opposite.') },
    { when: (s) => s.place.i2 !== 'a', text: L(
      'Kvadrat ishorani yutadi, ayrilgan olti esa ikkala tomonda ham bir xil qoladi.',
      'Квадрат поглощает знак, а вычитаемая шестёрка остаётся одинаковой с обеих сторон.',
      'The square swallows the sign, and the subtracted six stays the same on both sides.') },
    { when: (s) => s.place.i4 !== 'b', text: L(
      "Toq daraja ishorani saqlaydi: minus ikkining beshinchi darajasi manfiy, ikkiniki esa musbat.",
      'Нечётная степень сохраняет знак: минус два в пятой отрицательно, а два в пятой положительно.',
      'An odd power keeps the sign: minus two to the fifth is negative, two to the fifth is positive.') },
    { when: (s) => s.place.i1 !== 'a', text: L(
      "Juft daraja: minus uchning to'rtinchi darajasi ham, uchning to'rtinchi darajasi ham bir xil son.",
      'Чётная степень: и минус три в четвёртой, и три в четвёртой дают одно и то же число.',
      'An even power: minus three to the fourth and three to the fourth give the same number.') },
    { when: (s) => s.place.i3 !== 'b', text: L(
      "Iks ning ishorasi almashsa, minus ikki iks ham ishorasini almashtiradi.",
      'Если знак икс меняется, минус два икс тоже меняет знак.',
      'If the sign of x changes, minus two x changes sign as well.') },
  ],
  wrongText: L(
    "Har yozuvga birni va minus birni qo'ying. Qiymatlar teng bo'lsa — juft, qarama-qarshi bo'lsa — toq, boshqa holda — na juft, na toq.",
    'Подставь в каждую запись единицу и минус единицу. Значения равны — чётная, противоположны — нечётная, иначе — ни та, ни другая.',
    'Put one and minus one into every record. Equal values mean even, opposite values mean odd, anything else means neither.'),
};

export default function D02_04(props) { return <Zones data={DATA} {...props} />; }
