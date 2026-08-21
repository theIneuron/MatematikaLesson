// Dars38 · Amaliyot 10 — Bitta tekshirish yetmadi · 🔴 · fix · tag: sys_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin.
// (2; 2) sistemasi x + y = 4, 2x − y = 5 uchun tekshirilgan:
//   2 + 2 = 4 TO'G'RI, 2 · 2 − 2 = 5 NOTO'G'RI (2 chiqadi).
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_fix', level: '🔴',
  eyebrow: L('Xato tekshirish', 'Неверная проверка', 'The wrong check'),
  setup: L(
    "Boshqa o'quvchi (2; 2) ni yechim deb qabul qildi. Bitta tekshirish to'g'ri chiqdi, ikkinchisi esa yo'q.",
    'Другой ученик принял (2; 2) за решение. Одна проверка вышла верной, вторая нет.',
    'Another pupil accepted (2; 2) as a solution. One check worked out, the other did not.'),
  given: [['x', '+', 'y', '=', '4'], ['2x', '−', 'y', '=', '5']],
  givenLabel: L('Sistema:', 'Система:', 'The system:'),
  ask: L("NOTO'G'RI tekshirishni belgilang.", 'Отметь НЕВЕРНУЮ проверку.', 'Mark the WRONG check.'),
  note: L('Bitta tekshirish.', 'Одна проверка.', 'One check.'),
  parts: [
    { k: 'term', id: 't1', v: '2 + 2 = 4' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '2 · 2 − 2 = 5' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 2 · 2 − 2 = 2, beshga teng emas. Ikkinchi tenglama bajarilmadi, ya'ni (2; 2) yechim emas.",
    'Верно. 2 · 2 − 2 = 2, а не пять. Второе уравнение не выполнено, значит (2; 2) не решение.',
    'Correct. 2 · 2 − 2 = 2, not five. The second equation fails, so (2; 2) is not a solution.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "2 + 2 = 4 to'g'ri: birinchi tenglama bajarildi. Lekin bitta tenglama yetarli emas.",
      '2 + 2 = 4 верно: первое уравнение выполнено. Но одного уравнения недостаточно.',
      '2 + 2 = 4 is right: the first equation holds. But one equation is not enough.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Ikkinchi tekshirishni hisoblang: 2 · 2 − 2 nechchi chiqadi?",
      'Посчитай вторую проверку: чему равно 2 · 2 − 2?',
      'Work out the second check: what is 2 · 2 − 2?') },
  ],
  wrongText: L(
    "Har tekshirishni oxirigacha hisoblang va o'ng tomon bilan solishtiring.",
    'Досчитай каждую проверку и сравни с правой частью.',
    'Finish each check and compare with the right-hand side.'),
};

export default function D38_10(props) { return <TapTerms data={DATA} {...props} />; }
