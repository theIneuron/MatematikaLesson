// Dars22 · Amaliyot 08 — Qavs ichida xato · 🔴 · fix · tag: factor_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 8-o'rin.
// Chuqur yechim: 36z⁵ − 24z³ = 12z³(3z² − 2z)
//   12z³ TO'G'RI, 3z² TO'G'RI, −2z NOTO'G'RI: 24z³ : 12z³ = 2, z qolmaydi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_fix', level: '🔴',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi ajratdi, lekin bitta bo'lak noto'g'ri. Tekshirish yo'li bitta: qavsni ochib asl yozuv bilan solishtirish.",
    'Другой ученик разложил, но одна часть неверная. Путь проверки один: раскрыть скобку и сравнить с исходной записью.',
    'Another pupil factorised it, but one part is wrong. There is one way to check: open the bracket and compare.'),
  given: [['36z⁵', '−', '24z³']],
  givenLabel: L('Asl yozuv:', 'Исходная запись:', 'The original:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: '12z³' },
    { k: 'sign', v: '(' },
    { k: 'term', id: 't2', v: '3z²' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't3', v: '2z' },
    { k: 'sign', v: ')' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. 24z³ : 12z³ = 2, harf qolmaydi: ko'rsatkichlar teng, 3 − 3 = 0. Ya'ni qavsda 3z² − 2 bo'lishi kerak.",
    'Верно. 24z³ : 12z³ = 2, буква не остаётся: показатели равны, 3 − 3 = 0. Значит в скобке должно быть 3z² − 2.',
    'Correct. 24z³ : 12z³ = 2 with no letter left: equal exponents, 3 − 3 = 0. The bracket needs 3z² − 2.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "12z³ to'g'ri: 36 va 24 ning umumiy bo'luvchisi 12, eng kichik daraja z³.",
      '12z³ верно: общий делитель 36 и 24 это 12, наименьшая степень z³.',
      '12z³ is right: the common divisor of 36 and 24 is 12, the lowest power z³.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "3z² ham to'g'ri: 36z⁵ : 12z³ da 36 : 12 = 3 va 5 − 3 = 2.",
      '3z² тоже верно: в 36z⁵ : 12z³ выходит 36 : 12 = 3 и 5 − 3 = 2.',
      '3z² is right too: 36z⁵ : 12z³ gives 36 : 12 = 3 and 5 − 3 = 2.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Ikkinchi qoldiqni tekshiring: 24z³ ni 12z³ ga bo'lsa harf qoladimi?",
      'Проверь второе частное: останется ли буква при делении 24z³ на 12z³?',
      'Check the second quotient: does a letter remain when 24z³ is divided by 12z³?') },
  ],
  wrongText: L(
    "Qavsni ochib ko'ring: 12z³ · 3z² va 12z³ · 2z nima beradi?",
    'Раскрой скобку: что дают 12z³ · 3z² и 12z³ · 2z?',
    'Open the bracket: what do 12z³ · 3z² and 12z³ · 2z give?'),
};

export default function D22_08(props) { return <TapTerms data={DATA} {...props} />; }
