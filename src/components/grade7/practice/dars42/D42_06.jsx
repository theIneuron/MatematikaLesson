// Dars42 · Amaliyot 06 — Teng yonli uchburchak · 🟡 · build · tag: tri_isosceles
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// Asos burchagi 70° -> ikkinchisi ham 70°, uchi 180 − 140 = 40°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_isosceles', level: '🟡',
  eyebrow: L('Teng yonli', 'Равнобедренный', 'Isosceles'),
  setup: L(
    "Teng yonli uchburchakda asosdagi ikki burchak teng. Ya'ni 70 gradus ikki marta hisobga olinadi.",
    'В равнобедренном треугольнике два угла при основании равны. Значит 70 градусов учитывается дважды.',
    'An isosceles triangle has equal base angles, so the 70 counts twice.'),
  given: [['asos', 'burchagi', '=', '70°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 140°' },
    { id: 'b', label: '40°' },
    { id: 'c', label: '180° − 70°' },
    { id: 'd', label: '110°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Asosdagi ikki burchak 70 + 70 = 140, keyin 180 − 140 = 40.",
    'Верно. Два угла при основании 70 + 70 = 140, потом 180 − 140 = 40.',
    'Correct. The base angles give 70 + 70 = 140, then 180 − 140 = 40.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Asos burchagi IKKITA: 70 ni bir marta emas, ikki marta ayirish kerak.",
      'Углов при основании ДВА: вычитать 70 надо дважды, а не один раз.',
      'There are TWO base angles: subtract 70 twice, not once.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Teng yonli uchburchakda 70 gradusli burchak nechta?",
    'Сколько углов по 70 градусов в равнобедренном треугольнике?',
    'How many 70-degree angles does an isosceles triangle have?'),
};

export default function D42_06(props) { return <BuildLine data={DATA} {...props} />; }
