// Dars23 · Amaliyot 09 — Guruhni qavsga olish · 🔴 · bracket · tag: group_bracket
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 9-o'rin.
// 12k² − 8k − 15k + 10 = (12k² − 8k) − (15k − 10).
// Ikkinchi guruh minus bilan olinadi, ya'ni ichidagi ishoralar ag'dariladi:
// −15k + 10 -> −(15k − 10). Keyin 4k(3k − 2) − 5(3k − 2) = (3k − 2)(4k − 5).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'group_bracket', level: '🔴',
  eyebrow: L('Guruhni qavsga olish', 'Группа в скобке', 'A group in a bracket'),
  setup: L(
    "Ikkinchi guruhning ikki hadi ham manfiy emas: −15k va +10. Ularni minusli qavsga olsak, ichida (15k − 10) qoladi va keyin 5 chiqariladi.",
    'Оба члена второй группы не отрицательные: −15k и +10. Если взять их в скобку с минусом, внутри останется (15k − 10), а потом вынесется 5.',
    'The second group holds −15k and +10. Putting them in a minus bracket leaves (15k − 10), from which 5 comes out.'),
  expr: ['12k²', '−', '8k', '−', '15k', '+', '10'], exprSize: 26,
  cards: [
    { id: 'a', label: '(12k² − 8k)' },
    { id: 'b', label: '−(15k − 10)' },
    { id: 'c', label: '−(15k + 10)' },
    { id: 'd', label: '+(15k − 10)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki guruhni qavsga oling", 'Возьми две группы в скобки', 'Put the two groups in brackets'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. −(15k − 10) ochilsa −15k + 10 chiqadi, ya'ni asl yozuv. Keyin 4k(3k − 2) − 5(3k − 2) = (3k − 2)(4k − 5).",
    'Верно. Раскрытие −(15k − 10) даёт −15k + 10, это исходная запись. Дальше 4k(3k − 2) − 5(3k − 2) = (3k − 2)(4k − 5).',
    'Correct. Opening −(15k − 10) gives −15k + 10, the original. Then 4k(3k − 2) − 5(3k − 2) = (3k − 2)(4k − 5).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "−(15k + 10) ochilsa −15k − 10 chiqadi, bizda esa +10. Qavs ichidagi ikkinchi ishorani ham ag'darish kerak.",
      'Раскрытие −(15k + 10) даёт −15k − 10, а у нас +10. Второй знак внутри скобки тоже надо перевернуть.',
      'Opening −(15k + 10) gives −15k − 10, but we have +10. The second sign inside must flip too.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+(15k − 10) ochilsa +15k − 10 chiqadi: birinchi hadning ishorasi noto'g'ri bo'lib qoladi.",
      'Раскрытие +(15k − 10) даёт +15k − 10: знак первого члена окажется неверным.',
      'Opening +(15k − 10) gives +15k − 10: the first sign comes out wrong.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki guruh kerak: birinchisi qavsda, ikkinchisi minusli qavsda.",
      'Нужны две группы: первая в скобке, вторая в скобке с минусом.',
      'Two groups are needed: the first in a bracket, the second in a minus bracket.') },
  ],
  wrongText: L(
    "Ikkinchi guruhni qavsdan chiqarib tekshiring: −15k + 10 chiqishi kerak.",
    'Проверь вторую группу раскрытием: должно выйти −15k + 10.',
    'Check the second group by opening it: the result must be −15k + 10.'),
};

export default function D23_09(props) { return <BuildLine data={DATA} {...props} />; }
