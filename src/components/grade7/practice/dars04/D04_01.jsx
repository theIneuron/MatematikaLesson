// Dars04 · Amaliyot 01 — Bitta son isbot emas · 🟢 · choice · tag: id_one_number
// Mexanika: kit.jsx -> Choice. Raskladka: 4-dars, 1-o'rin (isinish).
// Bitta sonda tenglik chiqishi ayniylikni isbotlamaydi: u faqat RAD ETADI.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'id_one_number', level: '🟢',
  eyebrow: L('Bitta son', 'Одно число', 'A single number'),
  setup: L(
    "Ikki yozuv har qanday son uchun teng bo'lsa, ular ayniy teng. Bitta sonda tekshirish esa kam: u faqat noto'g'riligini ko'rsatishi mumkin.",
    'Если две записи равны при любом числе, они тождественно равны. Одной проверки мало: она может лишь опровергнуть.',
    'Two records are identically equal when they match for every number. One check can only refute, never prove.'),
  given: [['x', '=', '1', 'da', 'ikki', 'yozuv', 'teng']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L('Bundan nima kelib chiqadi?', 'Что из этого следует?', 'What follows from this?'),
  opts: [
    { label: L("Hech narsa: bitta son isbot emas", 'Ничего: одно число не доказательство', 'Nothing: one number proves nothing') },
    { label: L('Yozuvlar ayniy teng', 'Записи тождественно равны', 'The records are identical') },
    { label: L('Yozuvlar teng emas', 'Записи не равны', 'The records are unequal') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Bitta son mos kelishi tasodif bo'lishi mumkin. Ayniylikni isbotlash uchun xossalar bilan qayta yozish kerak.",
    'Верно. Совпадение при одном числе может быть случайным. Чтобы доказать тождество, надо переписать выражение по свойствам.',
    'Correct. One match may be a coincidence. Proving an identity needs rewriting by the properties.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bitta son yetmaydi: x² va 3x − 2 ham x = 1 da teng, lekin x = 5 da 25 va 13 chiqadi.",
      'Одного числа мало: x² и 3x − 2 тоже равны при x = 1, но при x = 5 выходит 25 и 13.',
      'One number is not enough: x² and 3x − 2 agree at x = 1 but give 25 and 13 at x = 5.') },
    { when: (s) => s.picked === 2, text: L(
      "Teng emas deyish uchun mos kelMAGAN son kerak. Bizda esa aynan mos kelgan.",
      'Чтобы сказать «не равны», нужно число, где они НЕ совпали. А у нас совпали.',
      'To call them unequal you need a number where they DIFFER. Here they matched.') },
  ],
  wrongText: L(
    "Bitta son nima qila oladi: isbotlaydimi yoki rad etadimi?",
    'Что может одно число: доказать или опровергнуть?',
    'What can one number do: prove, or refute?'),
};

export default function D04_01(props) { return <Choice data={DATA} {...props} />; }
