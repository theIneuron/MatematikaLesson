// Dars48 · Amaliyot 10 — Teng yonli va tashqi burchak · 🔴 · build · tag: rev_iso_ext
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin `build`.
// Uchidagi burchak 40° -> asos burchagi 70° -> asosdagi tashqi burchak 180 − 70 = 110°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_iso_ext',
  level: '🔴',
  eyebrow: L(
    'Uch fakt birga',
    'Три факта вместе',
    'Three facts at once'),
  setup: L(
    "Uch fakt ketma-ket ishlaydi: asosdagi burchaklar teng, yig'indi 180, tashqi burchak ichkisining qo'shnisi. Ikki javob kerak.",
    'Три факта работают друг за другом: углы при основании равны, сумма 180, внешний угол смежен с внутренним. Нужны два ответа.',
    'Three facts chain together: equal base angles, the 180 sum, and the exterior angle adjacent to the interior one.'),
  given: [[L('uchidagi burchak = 40°', 'угол при вершине = 40°', 'apex angle = 40°')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: L('asos burchagi 70°', 'угол при основании 70°', 'base angle 70°') },
    { id: 'b', label: L('tashqi burchak 110°', 'внешний угол 110°', 'exterior angle 110°') },
    { id: 'c', label: L('asos burchagi 140°', 'угол при основании 140°', 'base angle 140°') },
    { id: 'd', label: L('tashqi burchak 140°', 'внешний угол 140°', 'exterior angle 140°') },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. (180 − 40) : 2 = 70, keyin 180 − 70 = 110.",
    'Верно. (180 − 40) : 2 = 70, затем 180 − 70 = 110.',
    'Correct. (180 − 40) : 2 = 70, then 180 − 70 = 110.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "140 bu ikki asos burchagining yig'indisi. Bittasi 70.",
        '140 это сумма двух углов при основании. Один равен 70.',
        '140 is the sum of both base angles. One of them is 70.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "140 tashqi burchak emas: tashqi burchak 70 ning qo'shnisi, ya'ni 110.",
        '140 не внешний угол: внешний смежен с 70, значит 110.',
        '140 is not the exterior angle: it is adjacent to 70, hence 110.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "Avval asos burchagini toping, keyin uning qo'shnisini hisoblang.",
    'Сначала найди угол при основании, потом его смежный.',
    'Find the base angle first, then its adjacent angle.'),
};

export default function D48_10(props) { return <BuildLine data={DATA} {...props} />; }
