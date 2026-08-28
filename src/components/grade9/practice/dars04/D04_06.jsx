// Dars04 · Amaliyot 06 — Uchi · 🟡 · teg: x0-formula-belgisi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
// Kontent: src/books/grade9/DARS04_AMALIYOT_KONTENT.md §06
//
// IKKI QADAM: avval abssissa formuladan, keyin uni ASL formulaga qo'yib
// ordinata. Tuzoqlardan biri — 3, ya'ni abssissani javob deb berish.
//
// MATEMATIKA: y = −x² + 6x − 5 , x₀ = −6/(2·(−1)) = 3 ,
// y₀ = −9 + 18 − 5 = 4.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'x0-formula-belgisi', level: '🟡',
  eyebrow: L('Uchi', 'Вершина', 'Vertex'),
  setup: L(
    "Uchining ordinatasi abssissani formulaga qo'yib topiladi.",
    'Ординату вершины находят подстановкой абсциссы в формулу.',
    'The ordinate of the vertex is found by substituting the abscissa into the formula.'),
  ask: L(
    'Uchining ordinatasi y₀ ni yozing.',
    'Напиши ординату вершины y₀.',
    'Write the ordinate of the vertex y₀.'),
  hint: L('Javob bitta son.', 'Ответ — одно число.', 'The answer is a single number.'),
  placeholder: '0',
  expr: ['y = −x² + 6x − 5'],
  answer: [4],
  correctText: L(
    "To'g'ri, to'rt. Avval abssissa topildi: minus oltining qarama-qarshisi olti, uni ikki marta minus bir ga bo'lsak uch chiqadi. Keyin uchni formulaga qo'ydingiz: minus to'qqiz qo'shuv o'n sakkiz minus besh, ya'ni to'rt.",
    'Верно, четыре. Сначала нашлась абсцисса: противоположное к минус шести есть шесть, делённое на два умножить на минус один даёт три. Потом ты подставил тройку в формулу: минус девять плюс восемнадцать минус пять, то есть четыре.',
    'Correct, four. First the abscissa was found: the opposite of minus six is six, and divided by two times minus one it gives three. Then you put three into the formula: minus nine plus eighteen minus five, that is four.'),
  wrongs: [
    { when: (s) => s.has(3), text: L(
      "Bu abssissa, ya'ni uchining birinchi soni. Ordinata esa shu abssissani formulaga qo'yib topiladi.",
      'Это абсцисса, то есть первое число вершины. А ординату находят подстановкой этой абсциссы в формулу.',
      'That is the abscissa, the first number of the vertex. The ordinate is found by substituting that abscissa into the formula.') },
    { when: (s) => s.has(14), text: L(
      "Uchni formulaga qo'yayotganda kvadratning ishorasi tushib qolgan: iks kvadrat oldida minus turibdi, demak uchning kvadrati manfiy bo'lib kiradi.",
      'При подстановке тройки потерялся знак перед квадратом: перед икс в квадрате стоит минус, значит квадрат тройки входит со знаком минус.',
      'While substituting three, the sign in front of the square was lost: x squared has a minus in front of it, so three squared enters as a negative.') },
    { when: (s) => s.has(-4), text: L(
      "Ishora teskari chiqdi. Uchta hadni tartib bilan hisoblang: minus to'qqiz, keyin o'n sakkiz, keyin minus besh.",
      'Знак вышел наоборот. Посчитай три слагаемых по порядку: минус девять, потом восемнадцать, потом минус пять.',
      'The sign came out the other way. Compute the three terms in order: minus nine, then eighteen, then minus five.') },
    { when: (s) => s.has(-3), text: L(
      "Bu abssissaning qarama-qarshisi. Abssissani hisoblashda maxrajdagi a manfiy ekanini eslang.",
      'Это противоположное к абсциссе. При счёте абсциссы помни, что a в знаменателе отрицательно.',
      'That is the opposite of the abscissa. When computing the abscissa, remember that a in the denominator is negative.') },
  ],
  wrongText: L(
    "Ikki qadam: avval abssissani formuladan toping, keyin uni ASL formulaga qo'yib qiymatni hisoblang.",
    'Два шага: сначала найди абсциссу по формуле, потом подставь её в ИСХОДНУЮ формулу и посчитай значение.',
    'Two steps: first find the abscissa from the formula, then put it into the ORIGINAL formula and compute the value.'),
};

export default function D04_06(props) { return <TypeSet data={DATA} {...props} />; }
