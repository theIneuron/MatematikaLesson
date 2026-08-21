// Dars18 · Amaliyot 04 — Standart shaklni yig'ish · 🟡 · build · tag: poly_build
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin.
//
// 2a³ + 2a² − 7 + 2a³ = 4a³ + 2a² − 7. Faqat a³ lar o'xshash: 2 + 2 = 4.
// Ortiqcha kartalar: 6a³ (uchta hadni ham qo'shgan), +7 (ishora),
// −2a² (ishora).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_build', level: '🟡',
  eyebrow: L('Standart shakl', 'Стандартный вид', 'Standard form'),
  setup: L(
    "O'xshash hadlar yig'iladi, qolganlari o'z ishorasi bilan ko'chadi. Javobni o'zingiz yig'asiz: darajasi katta haddan boshlab.",
    'Подобные члены складываются, остальные переходят со своим знаком. Ответ собираешь сам: начиная с члена старшей степени.',
    'Like terms are collected, the rest carry over with their signs. You build the answer yourself, starting from the highest degree.'),
  expr: ['2a³', '+', '2a²', '−', '7', '+', '2a³'], exprSize: 30,
  cards: [
    { id: 'a4', label: '4a³' },
    { id: 'a2', label: '+2a²' },
    { id: 'm7', label: '−7' },
    { id: 'a6', label: '6a³' },
    { id: 'p7', label: '+7' },
    { id: 'm2', label: '−2a²' },
  ],
  answerSeq: ['a4', 'a2', 'm7'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Faqat a³ lar o'xshash: 2 + 2 = 4. 2a² va −7 ning o'xshashi yo'q, ular o'z ishorasi bilan qoladi.",
    'Верно. Подобны только a³: 2 + 2 = 4. У 2a² и −7 подобных нет, они остаются со своими знаками.',
    'Correct. Only the a³ terms are alike: 2 + 2 = 4. 2a² and −7 have no like terms and keep their signs.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('a6') !== -1, text: L(
      "6a³ chiqishi uchun 2a² ham qo'shilgan. Uning ko'rsatkichi boshqa, ya'ni u o'xshash emas.",
      'Чтобы вышло 6a³, прибавили ещё и 2a². У него другой показатель, значит он не подобный.',
      'To get 6a³ the 2a² was added too. Its exponent differs, so it is not a like term.') },
    { when: (s) => s.seq.indexOf('p7') !== -1, text: L(
      "Ozod had −7 edi, ishorasi o'zgarmaydi: ixchamlash ishorani almashtirmaydi.",
      'Свободный член был −7, знак не меняется: приведение подобных знак не переворачивает.',
      'The free term was −7 and the sign does not change: collecting like terms does not flip signs.') },
    { when: (s) => s.seq.indexOf('m2') !== -1, text: L(
      "2a² musbat edi. Uning o'xshashi yo'q, shuning uchun o'sha ishora bilan ko'chadi.",
      '2a² был положительным. Подобного у него нет, поэтому он переходит с тем же знаком.',
      '2a² was positive. It has no like term, so it carries over with the same sign.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch had bo'ladi: a³, a² va ozod had. Bittasi qo'yilmadi.",
      'В ответе три члена: a³, a² и свободный. Одного не поставил.',
      'The answer has three terms: a³, a² and the free one. One is missing.') },
  ],
  wrongText: L(
    "Harfi va ko'rsatkichi bir xil hadlarni toping, faqat ularni qo'shing.",
    'Найди члены с одинаковой буквой и показателем, складывай только их.',
    'Find the terms with the same letter and exponent; add only those.'),
};

export default function D18_04(props) { return <BuildLine data={DATA} {...props} />; }
