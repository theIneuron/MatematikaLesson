// Dars07 · Amaliyot 01 — Qavs · 🟢 · teg: qavs-ochish-ishorasi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> Choice.
// Kontent: `node scripts/grade9-practice-kontent.mjs 07` bilan hosil qilinadi.
//
// Savol MANTIQIY: aniq misol emas, QOIDA so'raladi. Uchta noto'g'ri
// variant uchta chala qoida: faqat birinchi had, umuman almashmaydi,
// amalning o'zi almashadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'qavs-ochish-ishorasi', level: '🟢',
  correct: 1, optCols: 1,
  eyebrow: L('Qavs', 'Скобка', 'Bracket'),
  setup: L(
    "Qavs oldida minus turgan yozuvni soddalashtirish kerak.",
    'Нужно упростить запись, перед скобкой которой стоит минус.',
    'A record with a minus in front of the bracket has to be simplified.'),
  ask: L(
    'Qavs ochilganda nima bo\'ladi?',
    'Что происходит при раскрытии скобки?',
    'What happens when the bracket is opened?'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['a − (b + c − d)']],
  opts: [
    { label: L('Faqat birinchi hadning ishorasi almashadi.', 'Знак меняет только первое слагаемое.', 'Only the first term changes sign.') },
    { label: L('Har bir hadning ishorasi almashadi.', 'Знак меняет каждое слагаемое.', 'Every term changes sign.') },
    { label: L('Hech qaysi hadning ishorasi almashmaydi.', 'Ни одно слагаемое знак не меняет.', 'No term changes sign.') },
    { label: L('Qavs ichidagi amallar almashadi.', 'Меняются действия внутри скобки.', 'The operations inside the bracket change.') },
  ],
  correctText: L(
    "To'g'ri. Qavs oldidagi minus butun qavsga tegishli, ya'ni qavs ichidagi HAMMA narsa minus birga ko'paytiriladi. Ko'paytirish esa har bir hadga alohida tushadi, shuning uchun uchala hadning ham ishorasi almashadi.",
    'Верно. Минус перед скобкой относится ко всей скобке, то есть всё её содержимое умножается на минус один. А умножение раскладывается на каждое слагаемое, поэтому знак меняют все три.',
    'Correct. The minus in front of the bracket applies to the whole bracket, so everything inside is multiplied by minus one. Multiplication distributes over each term, so all three terms change sign.'),
  wrongs: [
    { when: (s) => s.picked === 0, text: L(
      "Minus qavsga tegishli, birinchi hadga emas. Qavsni minus birga ko'paytiring va ko'paytirish har bir hadga tushishini eslang.",
      'Минус относится к скобке, а не к первому слагаемому. Умножь скобку на минус один и вспомни, что умножение раскладывается на каждое слагаемое.',
      'The minus belongs to the bracket, not to the first term. Multiply the bracket by minus one and remember that multiplication distributes over every term.') },
    { when: (s) => s.picked === 2, text: L(
      "Agar hech nima almashmasa, minus qayerga ketadi? Sonlarda sinang: besh minus qavs ochiluv ikki qo'shuv bir qavs yopiluv ikki chiqishi kerak.",
      'Если ничего не меняется, куда девается минус? Проверь на числах: пять минус скобка два плюс один должно дать два.',
      'If nothing changes, where does the minus go? Test it on numbers: five minus the bracket two plus one must give two.') },
    { when: (s) => s.picked === 3, text: L(
      "Amallar joyida qoladi: qo'shish qo'shish bo'lib qolaveradi. O'zgaradigan narsa — hadlarning ishorasi.",
      'Действия остаются прежними: сложение так и остаётся сложением. Меняются знаки слагаемых.',
      'The operations stay as they are: addition remains addition. What changes is the signs of the terms.') },
  ],
  wrongText: L(
    "Qavs oldidagi minusni minus bir deb yozing va qavsni unga ko'paytiring. Ko'paytirish qavs ichidagi nechta hadga tushadi?",
    'Запиши минус перед скобкой как минус один и умножь на него скобку. На сколько слагаемых раскладывается умножение?',
    'Write the minus in front of the bracket as minus one and multiply the bracket by it. Over how many terms does the multiplication distribute?'),
};

export default function D07_01(props) { return <Choice data={DATA} {...props} />; }
