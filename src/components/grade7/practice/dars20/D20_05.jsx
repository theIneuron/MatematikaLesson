// Dars20 · Amaliyot 05 — Teskari yo'l: qavsga olish · 🟡 · bracket · tag: factor_out
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 5-o'rin.
//
// 14b² − 21b = 7b(2b − 3). Umumiy ko'paytuvchi 7b: 14 va 21 ning umumiy
// bo'luvchisi 7, harfda esa eng kichik daraja b.
// Tekshirish: 7b · 2b = 14b², 7b · 3 = 21b.
// Tuzoq kartalari: 7b² (harf ortiqcha) va 2b + 3 (ishora).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_out', level: '🟡',
  eyebrow: L('Teskari yo\'l', 'Обратный путь', 'The other way round'),
  setup: L(
    "Bu ko'paytirishning teskarisi: yozuvni qavs ko'rinishida yozish kerak. Qavs oldiga umumiy ko'paytuvchi chiqadi, ichida esa bo'linmalar qoladi.",
    'Это обратное умножению: запись надо представить в виде скобки. Перед скобкой выносится общий множитель, внутри остаются частные.',
    'This reverses the multiplication: the record must be written as a bracket. The common factor goes in front, the quotients stay inside.'),
  expr: ['14b²', '−', '21b'], exprSize: 34,
  cards: [
    { id: 'f7b', label: '7b' },
    { id: 'op', label: '(' },
    { id: 'in', label: '2b − 3' },
    { id: 'cl', label: ')' },
    { id: 'f7b2', label: '7b²' },
    { id: 'in2', label: '2b + 3' },
  ],
  answerSeq: ['f7b', 'op', 'in', 'cl'],
  empty: L("Qavsli ko'rinishni tuzing", 'Собери запись со скобкой', 'Build the bracket form'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 7b(2b − 3) ni ochsak 14b² − 21b chiqadi. Umumiy ko'paytuvchi 7b: 14 va 21 ikkisi ham 7 ga bo'linadi.",
    'Верно. Раскрытие 7b(2b − 3) даёт 14b² − 21b. Общий множитель 7b: и 14, и 21 делятся на 7.',
    'Correct. Opening 7b(2b − 3) gives 14b² − 21b. The common factor is 7b: both 14 and 21 divide by 7.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('f7b2') !== -1, text: L(
      "7b² ni chiqarib bo'lmaydi: ikkinchi hadda b faqat bitta, ya'ni b² unda yo'q. Umumiy ko'paytuvchi eng kichik darajani oladi.",
      '7b² вынести нельзя: во втором члене b только одна, значит b² в нём нет. Общий множитель берёт наименьшую степень.',
      '7b² cannot be taken out: the second term has only one b, so no b². The common factor takes the lowest power.') },
    { when: (s) => s.seq.indexOf('in2') !== -1, text: L(
      "7b(2b + 3) ochilsa 14b² + 21b chiqadi, bizda esa ayirma. Qavs ichida minus qolishi kerak.",
      'Раскрытие 7b(2b + 3) даёт 14b² + 21b, а у нас разность. В скобке должен остаться минус.',
      'Opening 7b(2b + 3) gives 14b² + 21b, but we have a difference. The minus must stay inside.') },
    { when: (s) => s.seq.indexOf('cl') === -1 || s.seq.indexOf('op') === -1, text: L(
      "Qavs yopilmagan yoki ochilmagan: umumiy ko'paytuvchi oldinda, qolgani qavs ichida turadi.",
      'Скобка не открыта или не закрыта: общий множитель впереди, остальное внутри скобки.',
      'The bracket is not opened or not closed: the common factor in front, the rest inside.') },
  ],
  wrongText: L(
    "Yig'ilgan yozuvni qavsni ochib tekshiring: 14b² − 21b chiqishi kerak.",
    'Проверь собранную запись раскрытием: должно выйти 14b² − 21b.',
    'Check what you built by opening it: the result must be 14b² − 21b.'),
};

export default function D20_05(props) { return <BuildLine data={DATA} {...props} />; }
