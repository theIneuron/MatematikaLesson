// Dars11 · Amaliyot 06 — Belgilash · 🟡 · teg: notogri-orniga-qoyish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> PlacePoint.
//
// MATEMATIKA: y = x + 1 ni xy = 6 ga qo'ysak, x(x + 1) = 6, ya'ni
// x² + x − 6 = 0 → x = 2 va x = −3. Yechimlar (2; 3) va (−3; −2).
// IKKI nuqta so'ralgani muhim: bitta iksni topib to'xtash — darsning
// eng ko'p uchraydigan adashishi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { PlacePoint } from '../asboblar9.jsx';

const DATA = {
  tag: 'notogri-orniga-qoyish', level: '🟡',
  eyebrow: L('Belgilash', 'Отметка', 'Marking'),
  setup: L(
    "Birinchi tenglamadan igrek ifodalangan. Uni ko'paytmaga qo'ysangiz, kvadrat tenglama chiqadi.",
    'Из первого уравнения выражен игрек. Подставь его в произведение — получится квадратное уравнение.',
    'y is expressed from the first equation. Substituting it into the product gives a quadratic.'),
  ask: L(
    "Sistemaning IKKALA yechimini tekislikka qo'ying.",
    'Поставь на плоскость ОБА решения системы.',
    'Place BOTH solutions of the system on the plane.'),
  expr: ['y = x + 1', ',', 'xy = 6'],
  plane: { x0: -5, x1: 4, y0: -4, y1: 5 },
  answer: [[2, 3], [-3, -2]],
  correctText: L(
    "To'g'ri. Igrekning o'rniga iks qo'shuv bir yozsak, iks karra iks qo'shuv bir oltiga teng, ya'ni iks kvadrat qo'shuv iks minus olti nolga teng. Ildizlari ikki va minus uch. Har bir iks uchun igrek ifodadan chiqadi: ikkiga uch, minus uchga minus ikki. Ikkala nuqtani ham ko'paytmada tekshirish mumkin: ikki karra uch olti, minus uch karra minus ikki ham olti.",
    'Верно. Написав вместо игрека икс плюс один, получим икс на икс плюс один равно шести, то есть икс в квадрате плюс икс минус шесть равно нулю. Корни — два и минус три. Для каждого икса игрек выходит из выражения: двум — три, минус трём — минус два. Обе точки можно проверить в произведении: два на три — шесть, минус три на минус два — тоже шесть.',
    'Correct. Writing x plus one for y gives x times x plus one equals six, that is x squared plus x minus six equals zero. The roots are two and minus three. For each x, y comes from the expression: two gives three, minus three gives minus two. Both points can be checked in the product: two times three is six, minus three times minus two is six as well.'),
  wrongs: [
    { when: (s) => s.has(3, 2) || s.has(-2, -3), text: L(
      "Koordinatalar o'rin almashdi. Birinchi son har doim iks: gorizontal o'q bo'ylab qancha yurilganini bildiradi.",
      'Координаты поменялись местами. Первое число — всегда икс: сколько прошли по горизонтальной оси.',
      'The coordinates swapped places. The first number is always x: how far you went along the horizontal axis.') },
    { when: (s) => s.pts.length === 1, text: L(
      "Bitta nuqta qo'yildi. Kvadrat tenglamaning ikkita ildizi bor, demak sistemaning ham ikkita yechimi bor.",
      'Поставлена одна точка. У квадратного уравнения два корня, значит и у системы два решения.',
      'One point was placed. The quadratic has two roots, so the system has two solutions.') },
    { when: (s) => s.has(2, 4) || s.has(-3, -1), text: L(
      "Igrek ifodadan noto'g'ri hisoblandi: igrek iks qo'shuv BIR. Ikkiga uch, minus uchga minus ikki chiqadi.",
      'Игрек посчитан по выражению неверно: игрек равен икс плюс ОДИН. Двум отвечает три, минус трём — минус два.',
      'y was computed wrongly from the expression: y equals x plus ONE. Two gives three, minus three gives minus two.') },
    { when: (s) => s.has(1, 2) || s.has(-1, 0), text: L(
      "Bu nuqta birinchi tenglamada yotadi, lekin ko'paytmasi olti emas. Yechim IKKALA tenglamani ham qanoatlantirishi kerak: bir karra ikki — ikki, olti emas.",
      'Эта точка лежит на первом уравнении, но её произведение не шесть. Решение должно удовлетворять ОБОИМ уравнениям: один на два — два, а не шесть.',
      'This point satisfies the first equation, but its product is not six. A solution must satisfy BOTH equations: one times two is two, not six.') },
  ],
  wrongText: L(
    "Igrekning o'rniga iks qo'shuv birni yozing, hosil bo'lgan kvadrat tenglamani yeching va har bir iks uchun igrekni o'sha ifodadan hisoblang.",
    'Напиши вместо игрека икс плюс один, реши получившееся квадратное уравнение и для каждого икса посчитай игрек по тому же выражению.',
    'Write x plus one for y, solve the quadratic you get, and compute y for each x from that same expression.'),
};

export default function D11_06(props) { return <PlacePoint data={DATA} {...props} />; }
