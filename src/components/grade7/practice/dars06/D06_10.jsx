// Dars06 · Amaliyot 10 — Nechta had qoladi · 🔴 · tag: terms_left
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Uchta yozuv, bir xil ko'rinishda, lekin natijasi har xil:
//   4a + 3a − 2a   hammasi o'xshash        -> 5a          BITTA had
//   4a + 3b − 2a   ikkisi o'xshash         -> 2a + 3b     IKKI had
//   4a + 3b − 2c   uchta har xil harf      -> o'zgarmaydi UCH had
// O'quvchi hisoblab yakuniy ko'rinishni topadi va yozuvni NATIJASI bo'yicha
// joylashtiradi. Bu darsning yakuni: soddalashtirish hadlar sonini
// kamaytiradi, lekin har doim bittaga emas.
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi («ikkinchi tenglamada...»), aralashtirilsa izoh ekrandagiga mos
// kelmay qoladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'terms_left', level: '🔴', noShuffle: true, itemSize: 19, zoneLbl: 118,
  eyebrow: L('Nechta had qoladi', 'Сколько слагаемых останется', 'How many terms are left'),
  setup: L(
    "Uch yozuv bir xil ko'rinadi, lekin harflari boshqa. Soddalashtirgandan keyin nechta had qolishini aniqlang.",
    'Три записи выглядят одинаково, но буквы разные. Определи, сколько слагаемых останется после упрощения.',
    'Three records look alike but the letters differ. Work out how many terms are left after simplifying.'),
  zones: [
    { id: 'z1', label: L('BITTA HAD', 'ОДНО СЛАГАЕМОЕ', 'ONE TERM') },
    { id: 'z2', label: L('IKKI HAD', 'ДВА СЛАГАЕМЫХ', 'TWO TERMS') },
    { id: 'z3', label: L('UCH HAD', 'ТРИ СЛАГАЕМЫХ', 'THREE TERMS') },
  ],
  items: [
    { id: 'i1', tokens: ['4a', '+', '3a', '−', '2a'], zone: 'z1' },
    { id: 'i2', tokens: ['4a', '+', '3b', '−', '2a'], zone: 'z2' },
    { id: 'i3', tokens: ['4a', '+', '3b', '−', '2c'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Birinchisida hamma had o'xshash: 4 + 3 − 2 = 5, ya'ni 5a. Ikkinchisida a li ikkita yig'ildi va 2a + 3b qoldi. Uchinchisida uch xil harf, yig'ish uchun juftlik yo'q.",
    'Верно. В первой все слагаемые подобны: 4 + 3 − 2 = 5, то есть 5a. Во второй собрались два с a и осталось 2a + 3b. В третьей три разные буквы, собирать нечего.',
    'Correct. In the first all terms are alike: 4 + 3 − 2 = 5, that is 5a. In the second the two a terms collected, leaving 2a + 3b. In the third there are three different letters and nothing to collect.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi yozuvda a, b va c -- uchta har xil harf. O'xshash had yo'q, demak yozuv o'zgarmaydi va uch had qoladi.",
      'В третьей записи a, b и c — три разные буквы. Подобных нет, значит запись не меняется и остаётся три слагаемых.',
      'The third record has a, b and c — three different letters. No like terms, so the record stays and three terms remain.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi yozuvda faqat a li ikkita had yig'iladi: 4a − 2a = 2a. 3b esa o'z holida qoladi, ya'ni ikki had.",
      'Во второй записи собираются только два слагаемых с a: 4a − 2a = 2a. А 3b остаётся как есть, значит два слагаемых.',
      'In the second record only the two a terms collect: 4a − 2a = 2a. The 3b stays as it is, so two terms.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi yozuvda uchta hadning ham harfi a: ular bitta hadga yig'iladi, 5a.",
      'В первой записи у всех трёх слагаемых буква a: они собираются в одно слагаемое, 5a.',
      'In the first record all three terms have the letter a: they collect into one term, 5a.') },
  ],
  wrongText: L(
    "Har yozuvda harflarni sanang: bir xil harflar bitta hadga qo'shiladi, har xil harflar esa alohida qoladi.",
    'Посчитай буквы в каждой записи: одинаковые буквы соберутся в одно слагаемое, разные останутся отдельно.',
    'Count the letters in each record: matching letters collect into one term, different ones stay apart.'),
};

export default function D06_10(props) { return <Zones data={DATA} {...props} />; }
