// Dars13 · Amaliyot 02 — Jadval · 🟢 · teg: shartni-notogri-tenglamaga-otkazish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval so'zdagi BITTA shartni tenglamaga aylantirilgan holida ko'rsatadi:
// «raqamlari yig'indisi o'n bir». Ustunlar — shu shartni bajaradigan
// raqam juftliklari, ya'ni bitta shart hali sonni aniqlamaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'shartni-notogri-tenglamaga-otkazish', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Ikki xonali sonning raqamlari yig'indisi o'n bir. Yuqori qator — o'nlar raqami, pastki qator — birlar raqami.",
    'Сумма цифр двузначного числа равна одиннадцати. Верхняя строка — цифра десятков, нижняя — цифра единиц.',
    "The digits of a two-digit number add up to eleven. The top row is the tens digit, the bottom the units digit."),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['a + b = 11'],
  xLabel: 'a', yLabel: 'b',
  cols: [
    { id: 'c1', x: '2', y: '9' },
    { id: 'c2', x: '3', y: '', ans: 8, hole: 'y' },
    { id: 'c3', x: '', y: '5', ans: 6, hole: 'x' },
    { id: 'c4', x: '8', y: '3' },
  ],
  correctText: L(
    "To'g'ri: uchga sakkiz, beshga olti. Jadvalning to'rttala ustuni ham shartni bajaradi — yigirma to'qqiz, o'ttiz sakkiz, oltmish besh, sakson uch: hammasining raqamlari yig'indisi o'n bir. Demak bitta shart sonni aniqlamaydi, u faqat nomzodlar ro'yxatini beradi. Masalaning IKKINCHI sharti shu ro'yxatdan bittasini tanlaydi.",
    'Верно: трём — восемь, пяти — шесть. Все четыре столбца таблицы выполняют условие — двадцать девять, тридцать восемь, шестьдесят пять, восемьдесят три: у всех сумма цифр одиннадцать. Значит одно условие числа не определяет, оно лишь даёт список кандидатов. ВТОРОЕ условие задачи выбирает из этого списка один.',
    'Correct: three gives eight, five gives six. All four columns satisfy the condition — twenty-nine, thirty-eight, sixty-five, eighty-three: each has digit sum eleven. So one condition does not determine the number, it only gives a list of candidates. The SECOND condition of the problem picks one from that list.'),
  wrongs: [
    { when: (s) => s.vals.c2 === 14, text: L(
      "Uchga o'n bir qo'shildi. Shart yig'indi haqida: ikkita raqamning yig'indisi o'n bir bo'lishi kerak, demak birlar raqami o'n bir minus uch.",
      'К трём прибавили одиннадцать. Условие про сумму: сумма двух цифр должна быть одиннадцать, значит цифра единиц равна одиннадцать минус три.',
      'Eleven was added to three. The condition is about the sum: the two digits must add up to eleven, so the units digit is eleven minus three.') },
    { when: (s) => s.vals.c3 === 16, text: L(
      "Beshga o'n bir qo'shildi. Bu ustunda birlar raqami berilgan, o'nlar raqami so'ralyapti: nechchi qo'shuv besh o'n bir beradi?",
      'К пяти прибавили одиннадцать. В этом столбце дана цифра единиц, а спрашивают цифру десятков: сколько плюс пять даёт одиннадцать?',
      'Eleven was added to five. In this column the units digit is given and the tens digit is asked: what plus five makes eleven?') },
    { when: (s) => s.vals.c2 === 11 || s.vals.c3 === 11, text: L(
      "Katakka yig'indining o'zi yozilgan. O'n bir — bu ikkita raqamning YIG'INDISI, alohida raqam emas: raqam noldan to'qqizgacha bo'ladi.",
      'В клетку записана сама сумма. Одиннадцать — это СУММА двух цифр, а не отдельная цифра: цифра бывает от нуля до девяти.',
      'The sum itself was written into the cell. Eleven is the SUM of two digits, not a digit: a digit runs from zero to nine.') },
    { when: (s) => s.vals.c2 === 38 || s.vals.c3 === 65, text: L(
      "Katakka butun SON yozilgan, raqam esa so'ralgan. Jadvalning har bir katagida bitta raqam turadi.",
      'В клетку записано целое ЧИСЛО, а спрашивают цифру. В каждой клетке таблицы стоит одна цифра.',
      'A whole NUMBER was written into the cell, but a digit is asked. Each cell of the table holds a single digit.') },
  ],
  wrongText: L(
    "Har ustunda ikkita raqamning yig'indisi o'n bir bo'lishi kerak. Berilgan raqamni o'n birdan ayirsangiz, ikkinchisi chiqadi.",
    'В каждом столбце сумма двух цифр должна быть одиннадцать. Вычти известную цифру из одиннадцати — получишь вторую.',
    'In every column the two digits must add up to eleven. Subtract the known digit from eleven to get the other one.'),
};

export default function D13_02(props) { return <RowTable data={DATA} {...props} />; }
