// Dars07 · Amaliyot 05 — Kesishish · 🟡 · teg: tekshirish-otkazib-yuborish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// ASOSIY TUZOQ — faqat BITTA tenglamaga qo'yib tekshirish. (2; 4) nuqtasi
// ikkinchi yozuvni qanoatlantiradi, birinchisini esa yo'q; (1; 1) esa
// aksincha. Ikkalasi ham tekislikda bor, ya'ni o'quvchi ularni qila oladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'tekshirish-otkazib-yuborish', level: '🟡',
  eyebrow: L('Kesishish', 'Пересечение', 'Crossing'),
  setup: L(
    "Ikkita chiziq berilgan. Kesishish nuqtasi IKKALA yozuvni ham qanoatlantiradi.",
    'Даны две прямые. Точка пересечения удовлетворяет ОБЕИМ записям.',
    'Two lines are given. The crossing point satisfies BOTH records.'),
  ask: L(
    "Ikki chiziqning kesishish nuqtasini tekislikka qo'ying.",
    'Поставь на плоскости точку пересечения двух прямых.',
    'Place the crossing point of the two lines on the plane.'),
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['y = 2x − 1'], ['y = x + 2']],
  plane: { x0: -2, x1: 6, y0: -4, y1: 7 },
  answer: [[3, 5]],
  correctText: L(
    "To'g'ri. Ikkala yozuvning o'ng tomonini tenglashtirsak, ikki iks minus bir iks qo'shuv ikkiga teng bo'ladi, bundan iks uchga teng. Ikkalasiga uchni qo'ysangiz, ikkalasi ham beshni beradi — nuqta har ikkala chiziqda ham yotadi. Aynan shu narsa uni kesishish qiladi.",
    'Верно. Приравняв правые части, получим два икс минус один равно икс плюс два, откуда икс равен трём. Подставив тройку в обе записи, в обеих получим пять — точка лежит на обеих прямых. Именно это и делает её пересечением.',
    'Correct. Setting the right-hand sides equal gives two x minus one equals x plus two, so x is three. Putting three into both records gives five in both — the point lies on both lines. That is exactly what makes it a crossing.'),
  wrongs: [
    { when: (s) => s.has(2, 4), text: L(
      "Bu nuqta faqat IKKINCHI yozuvni qanoatlantiradi: ikki qo'shuv ikki to'rtga teng. Birinchisiga qo'ying: ikki karra ikki minus bir uch chiqadi, to'rt emas. Kesishish ikkalasida ham yotishi kerak.",
      'Эта точка удовлетворяет только ВТОРОЙ записи: два плюс два равно четырём. Подставь её в первую: два умножить на два минус один даёт три, а не четыре. Пересечение должно лежать на обеих.',
      'This point satisfies only the SECOND record: two plus two is four. Put it into the first: two times two minus one gives three, not four. A crossing must lie on both.') },
    { when: (s) => s.has(1, 1), text: L(
      "Bu nuqta faqat BIRINCHI yozuvni qanoatlantiradi: ikki karra bir minus bir birga teng. Ikkinchisiga qo'ying: bir qo'shuv ikki uch chiqadi, bir emas.",
      'Эта точка удовлетворяет только ПЕРВОЙ записи: два умножить на один минус один равно единице. Подставь её во вторую: один плюс два даёт три, а не единицу.',
      'This point satisfies only the FIRST record: two times one minus one is one. Put it into the second: one plus two gives three, not one.') },
    { when: (s) => s.has(5, 3), text: L(
      "Sonlar o'rin almashdi. Birinchi son gorizontal o'qda, ikkinchisi tik o'qda o'lchanadi.",
      'Числа поменялись местами. Первое откладывают по горизонтальной оси, второе — по вертикальной.',
      'The numbers changed places. The first goes along the horizontal axis, the second along the vertical one.') },
  ],
  wrongText: L(
    "Ikkala yozuvning o'ng tomonini bir-biriga tenglashtiring va iksni toping. Keyin topgan nuqtangizni IKKALA yozuvga ham qo'yib tekshiring.",
    'Приравняй правые части двух записей друг к другу и найди икс. Потом подставь найденную точку в ОБЕ записи.',
    'Set the right-hand sides of the two records equal to each other and find x. Then check your point against BOTH records.'),
};

export default function D07_05(props) { return <PlacePoint data={DATA} {...props} />; }
