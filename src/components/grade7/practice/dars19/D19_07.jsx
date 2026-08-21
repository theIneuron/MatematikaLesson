// Dars19 · Amaliyot 07 — Qavsga olish · 🟡 · bracket · tag: into_bracket
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 7-o'rin.
//
// 5a − 2b ni boshqacha yozish: 9a − (4a + 2b).
// Tekshirish: 9a − 4a − 2b = 5a − 2b. Tuzoq: −(4a − 2b) ochilsa 5a + 2b
// chiqadi, ya'ni ikkinchi hadning ishorasi noto'g'ri bo'ladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'into_bracket', level: '🟡',
  eyebrow: L('Qavsga olish', 'Взять в скобку', 'Into a bracket'),
  setup: L(
    "Yozuvni minusli qavs bilan boshqacha ko'rinishda yozish kerak. Qavs ichiga kirgan hadlarning ishorasi ag'dariladi, shuning uchun tekshirish -- qavsni qayta ochish.",
    'Запись надо переписать через скобку с минусом. У членов, попавших в скобку, знак переворачивается, поэтому проверка это раскрытие обратно.',
    'The record must be rewritten with a minus bracket. Terms moving inside flip their signs, so the check is to open it again.'),
  expr: ['5a', '−', '2b'], exprSize: 34,
  cards: [
    { id: 'a9', label: '9a' },
    { id: 'mo', label: '−(' },
    { id: 'in', label: '4a + 2b' },
    { id: 'cl', label: ')' },
    { id: 'in2', label: '4a − 2b' },
    { id: 'po', label: '+(' },
  ],
  answerSeq: ['a9', 'mo', 'in', 'cl'],
  empty: L("Qavsli yozuvni tuzing", 'Собери запись со скобкой', 'Build the record with a bracket'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 9a − (4a + 2b) ochilsa 9a − 4a − 2b = 5a − 2b beradi. Ikki had ham ag'darildi.",
    'Верно. Раскрытие 9a − (4a + 2b) даёт 9a − 4a − 2b = 5a − 2b. Оба члена перевернулись.',
    'Correct. Opening 9a − (4a + 2b) gives 9a − 4a − 2b = 5a − 2b. Both terms flipped.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('in2') !== -1 && s.seq.indexOf('mo') !== -1, text: L(
      "−(4a − 2b) ochilsa 9a − 4a + 2b = 5a + 2b chiqadi. Bizga esa −2b kerak, ya'ni qavs ichida +2b turishi kerak.",
      'Раскрытие −(4a − 2b) даёт 9a − 4a + 2b = 5a + 2b. А нам нужно −2b, значит в скобке должно стоять +2b.',
      'Opening −(4a − 2b) gives 9a − 4a + 2b = 5a + 2b. We need −2b, so the bracket must hold +2b.') },
    { when: (s) => s.seq.indexOf('po') !== -1, text: L(
      "Plyusli qavs ishoralarni o'zgartirmaydi: 9a + (4a + 2b) = 13a + 2b, bu boshqa yozuv.",
      'Скобка с плюсом знаки не меняет: 9a + (4a + 2b) = 13a + 2b, это другая запись.',
      'A plus bracket changes nothing: 9a + (4a + 2b) = 13a + 2b, a different record.') },
    { when: (s) => s.seq.indexOf('a9') === -1 || s.seq.indexOf('cl') === -1, text: L(
      "Yozuv to'liq emas: 9a oldinda turadi, qavs esa yopilishi kerak.",
      'Запись не полная: 9a стоит впереди, а скобка должна закрыться.',
      'The record is incomplete: 9a comes first and the bracket must be closed.') },
  ],
  wrongText: L(
    "Yig'ilgan yozuvni qavsni ochib tekshiring: 5a − 2b chiqishi kerak.",
    'Проверь собранную запись раскрытием: должно выйти 5a − 2b.',
    'Check what you built by opening it: the result must be 5a − 2b.'),
};

export default function D19_07(props) { return <BuildLine data={DATA} {...props} />; }
