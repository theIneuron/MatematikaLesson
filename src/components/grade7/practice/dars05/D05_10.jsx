// Dars05 · Amaliyot 10 — Qavs olib tashlansa nima bo'ladi · 🔴 · tag: bracket_effect
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Bitta yozuv, uch xil qavs oldi. Qavsni olib tashlasak:
//   12 − (5 − 8)  ichidagi HAMMA ishora o'zgaradi -> 12 − 5 + 8
//   12 + (5 − 8)  ishoralar o'zgarmaydi           -> 12 + 5 − 8
//   12 · (5 − 8)  ishora emas, QIYMAT o'zgaradi:
//                 qavs bilan 12 · (−3) = −36, qavssiz 12 · 5 − 8 = 52
// Uchinchi holat 3-darsning materiali (qavs oldidagi KO'PAYTUVCHI) va u
// bu yerda ataylab turadi: o'quvchi «qavs oldida belgi» va «qavs oldida
// ko'paytuvchi» ni farqlashi kerak.
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi («ikkinchi tenglamada...»), aralashtirilsa izoh ekrandagiga mos
// kelmay qoladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'bracket_effect', level: '🔴', noShuffle: true, itemSize: 18, zoneLbl: 132,
  eyebrow: L('Qavs olib tashlansa', 'Если убрать скобку', 'If the bracket goes'),
  setup: L(
    "Uch yozuvda bir xil sonlar, farqi faqat qavs oldidagi belgida. Qavsni olib tashlaganda nima bo'lishini aniqlang.",
    'В трёх записях одни и те же числа, разница только в знаке перед скобкой. Определи, что будет, если скобку убрать.',
    'Three records with the same numbers; only the sign before the bracket differs. Work out what happens if the bracket is removed.'),
  zones: [
    { id: 'zflip', label: L("HAMMA ISHORA O'ZGARADI", 'ВСЕ ЗНАКИ МЕНЯЮТСЯ', 'ALL SIGNS FLIP') },
    { id: 'zsame', label: L("ISHORALAR O'ZGARMAYDI", 'ЗНАКИ НЕ МЕНЯЮТСЯ', 'SIGNS STAY') },
    { id: 'zvalue', label: L("QIYMAT O'ZGARADI", 'МЕНЯЕТСЯ ЗНАЧЕНИЕ', 'THE VALUE CHANGES') },
  ],
  items: [
    { id: 'i1', tokens: ['12', '−', '(', '5', '−', '8', ')'], zone: 'zflip' },
    { id: 'i2', tokens: ['12', '+', '(', '5', '−', '8', ')'], zone: 'zsame' },
    { id: 'i3', tokens: ['12', '·', '(', '5', '−', '8', ')'], zone: 'zvalue' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Minus hamma ishorani ag'daradi, plyus hech narsani o'zgartirmaydi, ko'paytuvchi esa qavssiz umuman boshqa qiymat beradi: −36 o'rniga 52.",
    'Верно. Минус переворачивает все знаки, плюс не меняет ничего, а множитель без скобки даёт совсем другое значение: 52 вместо −36.',
    'Correct. A minus flips every sign, a plus changes nothing, and a factor without the bracket gives a completely different value: 52 instead of −36.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi yozuvda qavs oldida BELGI emas, KO'PAYTUVCHI turadi. Uni shunchaki o'chirib bo'lmaydi: 12 · (−3) = −36, qavssiz esa 12 · 5 − 8 = 52.",
      'В третьей записи перед скобкой не ЗНАК, а МНОЖИТЕЛЬ. Его нельзя просто стереть: 12 · (−3) = −36, а без скобки 12 · 5 − 8 = 52.',
      'In the third record the bracket is preceded by a FACTOR, not a SIGN. It cannot just be erased: 12 · (−3) = −36, while without the bracket 12 · 5 − 8 = 52.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi yozuvda qavs oldida minus: 5 ayiriladi, 8 esa qo'shiladi. Ikki ishora ham o'zgaradi.",
      'В первой записи перед скобкой минус: 5 вычитается, а 8 прибавляется. Меняются оба знака.',
      'The first record has a minus before the bracket: 5 is subtracted and 8 is added. Both signs change.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi yozuvda qavs oldida plyus: hadlar o'sha holda ko'chadi, 12 + 5 − 8.",
      'Во второй записи перед скобкой плюс: слагаемые переходят как есть, 12 + 5 − 8.',
      'The second record has a plus before the bracket: the terms move over unchanged, 12 + 5 − 8.') },
  ],
  wrongText: L(
    "Qavs oldida nima turganiga qarang: minus, plyus yoki ko'paytirish belgisi. Uchtasi uch xil ish qiladi.",
    'Смотри, что стоит перед скобкой: минус, плюс или знак умножения. Все три ведут себя по-разному.',
    'Look at what stands before the bracket: a minus, a plus or a multiplication sign. All three behave differently.'),
};

export default function D05_10(props) { return <Zones data={DATA} {...props} />; }
