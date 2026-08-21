// Dars23 · Amaliyot 08 — Ikki minus · 🔴 · build · tag: group_two_minus
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// ab − 5a − 2b + 10 = a(b − 5) − 2(b − 5) = (a − 2)(b − 5).
// Ikkinchi guruhdan MINUS chiqadi: −2b + 10 = −2(b − 5).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'group_two_minus', level: '🔴',
  eyebrow: L('Minusni chiqarish', 'Вынести минус', 'Taking out a minus'),
  setup: L(
    "Ikkinchi guruh −2b + 10 ko'rinishida. Undan −2 chiqarilsa qavsda (b − 5) qoladi, ya'ni birinchi guruhdagi qavs bilan bir xil.",
    'Вторая группа имеет вид −2b + 10. Если вынести −2, в скобке останется (b − 5) — то же, что и в первой группе.',
    'The second group is −2b + 10. Taking out −2 leaves (b − 5), matching the first group.'),
  expr: ['ab', '−', '5a', '−', '2b', '+', '10'], exprSize: 28,
  cards: [
    { id: 'a', label: '(a − 2)' },
    { id: 'b', label: '(b − 5)' },
    { id: 'c', label: '(a + 2)' },
    { id: 'd', label: '(b + 5)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki ko'paytuvchini qo'ying", 'Поставь два множителя', 'Place the two factors'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Tekshirish: (a − 2)(b − 5) = ab − 5a − 2b + 10. Ikkinchi guruhdan −2 chiqqani uchun ozod had musbat bo'ldi.",
    'Верно. Проверка: (a − 2)(b − 5) = ab − 5a − 2b + 10. Так как из второй группы вынесли −2, свободный член стал положительным.',
    'Correct. Check: (a − 2)(b − 5) = ab − 5a − 2b + 10. Because −2 came out, the free term turned positive.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Ikkinchi guruhdan +2 chiqarsak qavsda (−b + 5) qolardi, birinchi guruh qavsi bilan mos kelmaydi. Shuning uchun −2 chiqariladi.",
      'Если вынести +2, в скобке осталось бы (−b + 5), а это не совпадает со скобкой первой группы. Поэтому выносится −2.',
      'Taking out +2 would leave (−b + 5), which does not match the first bracket. So −2 comes out.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Birinchi guruh ab − 5a: a chiqsa (b − 5) qoladi, minus bilan.",
      'Первая группа ab − 5a: при выносе a остаётся (b − 5), с минусом.',
      'The first group ab − 5a: taking out a leaves (b − 5) with a minus.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat.",
      'Ответ состоит из двух скобок.',
      'The answer has two brackets.') },
  ],
  wrongText: L(
    "Ikkinchi guruhda −2b + 10 turibdi. Qanday son chiqarilsa qavs birinchi guruhdagidek bo'ladi?",
    'Во второй группе стоит −2b + 10. Какое число вынести, чтобы скобка совпала с первой группой?',
    'The second group is −2b + 10. What must come out for the bracket to match the first?'),
};

export default function D23_08(props) { return <BuildLine data={DATA} {...props} />; }
