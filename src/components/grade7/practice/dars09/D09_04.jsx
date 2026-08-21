// Dars09 · Amaliyot 04 — Nimani ko'paytirish kerak · 🟡 · tag: which_to_multiply
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// 3(2x − 1) + 4 = 5x + 7. Qavs ochilganda 3 ga IKKI had ko'paytiriladi:
// 2x va −1. Qavsdan tashqaridagi +4 ga esa 3 tegishli emas -- eng ko'p
// uchraydigan xato aynan shu: «hamma narsani 3 ga ko'paytiraman».
// O'ng tomondagi hadlar ham qavs ichida emas.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'which_to_multiply', level: '🟡', exprSize: 25,
  eyebrow: L("Nimani ko'paytirish", 'Что умножать', 'What to multiply'),
  setup: L(
    "Qavs oldidagi ko'paytuvchi faqat QAVS ICHIDAGI hadlarga tegishli. Qavsdan tashqaridagi hadlar o'z holida qoladi.",
    'Множитель перед скобкой относится только к слагаемым ВНУТРИ скобки. Слагаемые вне скобки остаются как есть.',
    'The factor before a bracket belongs only to the terms INSIDE it. Terms outside the bracket stay as they are.'),
  ask: L('3 ga KO\'PAYTIRILADIGAN hadlarni belgilang.', 'Отметь слагаемые, которые УМНОЖАЮТСЯ на 3.', 'Mark the terms that are MULTIPLIED by 3.'),
  note: L("Faqat qavs ichiga qarang.", 'Смотри только внутрь скобки.', 'Look inside the bracket only.'),
  parts: [
    { k: 'txt', v: '3 · (' },
    { k: 'term', id: 't1', v: '2x' },
    { k: 'term', id: 't2', v: '− 1' },
    { k: 'txt', v: ')' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '4' },
    { k: 'op', v: '=' },
    { k: 'term', id: 't4', v: '5x' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't5', v: '7' },
  ],
  want: ['t1', 't2'],
  correctText: L(
    "To'g'ri. 3 · 2x = 6x va 3 · (−1) = −3. Qolgan hadlar o'zgarmaydi: 6x − 3 + 4 = 5x + 7.",
    'Верно. 3 · 2x = 6x и 3 · (−1) = −3. Остальные слагаемые не меняются: 6x − 3 + 4 = 5x + 7.',
    'Correct. 3 · 2x = 6x and 3 · (−1) = −3. The other terms stay: 6x − 3 + 4 = 5x + 7.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "+4 qavsdan TASHQARIDA turibdi: 3 unga tegishli emas. Qavs faqat 2x va −1 ni o'z ichiga olgan.",
      '+4 стоит ВНЕ скобки: тройка к ней не относится. Скобка взяла внутрь только 2x и −1.',
      'The +4 is OUTSIDE the bracket: the three does not reach it. The bracket holds only 2x and −1.') },
    { when: (s) => s.extra.indexOf('t4') !== -1 || s.extra.indexOf('t5') !== -1, text: L(
      "Tenglik belgisining o'ng tomoni qavsga umuman tegishli emas: 3 faqat chap tomondagi qavs ichiga ta'sir qiladi.",
      'Правая часть от знака равенства к скобке не относится вовсе: тройка действует только внутри скобки слева.',
      'The right side of the equals sign has nothing to do with the bracket: the three acts only inside it.') },
    { when: (s) => s.miss.indexOf('t2') !== -1, text: L(
      "Qavs ichida ikki had bor: 2x va −1. Ikkinchisi ham 3 ga ko'paytiriladi va −3 bo'ladi.",
      'В скобке два слагаемых: 2x и −1. Второе тоже умножается на 3 и становится −3.',
      'The bracket has two terms: 2x and −1. The second is multiplied by 3 as well and becomes −3.') },
  ],
  wrongText: L(
    "Qavsning boshi va oxirini toping: faqat ular orasidagi hadlar ko'paytiriladi.",
    'Найди начало и конец скобки: умножаются только слагаемые между ними.',
    'Find where the bracket opens and closes: only the terms between them are multiplied.'),
};

export default function D09_04(props) { return <TapTerms data={DATA} {...props} />; }
