// Dars48 · Amaliyot 09 — Bo'lmaydigan uchburchak · 🔴 · fix · tag: rev_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 9-o'rin `fix`.
// Teng yonli uchburchakda asos burchagi 100° bo'lolmaydi: 100 + 100 = 200 > 180. Xato qadam -- birinchisi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_fix',
  level: '🔴',
  eyebrow: L(
    'Xato qadam',
    'Неверный шаг',
    'The wrong step'),
  setup: L(
    "O'quvchi teng yonli uchburchak bilan ishladi. Uch qadamdan biri boshidan noto'g'ri: shunday uchburchak mavjud emas.",
    'Ученик работал с равнобедренным треугольником. Один из трёх шагов неверен с самого начала: такого треугольника нет.',
    'A pupil worked with an isosceles triangle. One of the three steps is wrong from the start: no such triangle exists.'),
  ask: L(
    "NOTO'G'RI qadamni belgilang.",
    'Отметь НЕВЕРНЫЙ шаг.',
    'Mark the WRONG step.'),
  note: L(
    'Bitta qadam.',
    'Один шаг.',
    'One step.'),
  parts: [
    { k: 'term', id: 't1', v: 'asos burchagi 100°' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'ikkinchi asos burchagi ham 100°' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: 'uchidagi burchak 180 − 200' },
  ],
  want: ['t1'],
  correctText: L(
    "To'g'ri. Xato boshida: asos burchagi 100 bo'lsa, ikkinchisi ham 100 va yig'indi 180 dan oshadi. Asos burchagi 90 dan kichik bo'lishi kerak.",
    'Верно. Ошибка в начале: если угол при основании 100, второй тоже 100 и сумма превысит 180. Угол при основании должен быть меньше 90.',
    'Correct. The flaw is at the start: a base angle of 100 forces another 100 and the sum exceeds 180. A base angle must be below 90.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t2') !== -1,
      text: L(
        'Ikkinchi asos burchagi birinchisiga teng -- bu qadam xossaga mos, xato bundan oldinda.',
        'Второй угол при основании равен первому — этот шаг по свойству верен, ошибка раньше.',
        'The second base angle equals the first, which follows the property; the flaw is earlier.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        'Uchinchi qadam ikkinchisidan mantiqan chiqadi. Sabab esa BIRINCHI qadamda.',
        'Третий шаг логично следует из второго. А причина в ПЕРВОМ шаге.',
        'The third step follows from the second. The cause sits in the FIRST step.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        "Ikki asos burchagini qo'shib ko'ring va 180 bilan solishtiring.",
        'Сложи два угла при основании и сравни с 180.',
        'Add the two base angles and compare with 180.'),
    },
  ],
  wrongText: L(
    "Asos burchaklari teng. Ikkitasi birga 180 dan kam bo'lishi kerak.",
    'Углы при основании равны. Вдвоём они должны быть меньше 180.',
    'The base angles are equal, and together they must stay below 180.'),
};

export default function D48_09(props) { return <TapTerms data={DATA} {...props} />; }
