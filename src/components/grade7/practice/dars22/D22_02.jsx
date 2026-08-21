// Dars22 · Amaliyot 02 — Qavsga olish · 🟢 · bracket · tag: factor_bracket
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 2-o'rin.
// 12c² + 18c = 6c(2c + 3). Tekshirish: 6c · 2c = 12c², 6c · 3 = 18c.
// Tuzoq kartalari: 6c² (ortiqcha harf) va 2c − 3 (ishora).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_bracket', level: '🟢',
  eyebrow: L('Qavsga olish', 'Вынести за скобку', 'Take out of the bracket'),
  setup: L(
    "Umumiy ko'paytuvchi qavs oldiga chiqadi, qavs ichida esa bo'linmalar qoladi. Tekshirish oson: qavsni ochib asl yozuv bilan solishtiriladi.",
    'Общий множитель выносится перед скобку, а внутри остаются частные. Проверка простая: раскрыть и сравнить с исходной записью.',
    'The common factor goes in front and the quotients stay inside. The check is simple: open it and compare with the original.'),
  expr: ['12c²', '+', '18c'], exprSize: 34,
  cards: [
    { id: 'a', label: '6c' },
    { id: 'b', label: '(' },
    { id: 'c', label: '2c + 3' },
    { id: 'd', label: ')' },
    { id: 'e', label: '6c²' },
    { id: 'f', label: '2c − 3' },
  ],
  answerSeq: ['a', 'b', 'c', 'd'],
  empty: L("Qavsli ko'rinishni tuzing", 'Собери запись со скобкой', 'Build the bracket form'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6c(2c + 3) ochilsa 12c² + 18c beradi: 12 : 6 = 2 va 18 : 6 = 3.",
    'Верно. Раскрытие 6c(2c + 3) даёт 12c² + 18c: 12 : 6 = 2 и 18 : 6 = 3.',
    'Correct. Opening 6c(2c + 3) gives 12c² + 18c: 12 : 6 = 2 and 18 : 6 = 3.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "6c² ni chiqarib bo'lmaydi: ikkinchi hadda c faqat bitta. Umumiy ko'paytuvchi eng kichik darajani oladi.",
      '6c² вынести нельзя: во втором члене c только одна. Общий множитель берёт наименьшую степень.',
      '6c² cannot be taken out: the second term has only one c. The common factor takes the lowest power.') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "6c(2c − 3) ochilsa 12c² − 18c chiqadi, bizda esa yig'indi. Qavs ichida plyus qolishi kerak.",
      'Раскрытие 6c(2c − 3) даёт 12c² − 18c, а у нас сумма. В скобке должен остаться плюс.',
      'Opening 6c(2c − 3) gives 12c² − 18c, but we have a sum. The plus must stay inside.') },
    { when: (s) => s.seq.indexOf('b') === -1 || s.seq.indexOf('d') === -1, text: L(
      "Qavs ochilmagan yoki yopilmagan: umumiy ko'paytuvchi oldinda, qolgani qavs ichida.",
      'Скобка не открыта или не закрыта: общий множитель впереди, остальное внутри.',
      'The bracket is not opened or closed: the common factor in front, the rest inside.') },
  ],
  wrongText: L(
    "Har hadni 6c ga bo'ling: nima qoladi? Shu qoldiqlar qavs ichiga yoziladi.",
    'Раздели каждый член на 6c: что остаётся? Эти частные и пишутся в скобку.',
    'Divide each term by 6c: what is left? Those quotients go inside the bracket.'),
};

export default function D22_02(props) { return <BuildLine data={DATA} {...props} />; }
