// Dars10 · Amaliyot 10 — Nechta ildiz bor · 🔴 · tag: mod_root_count
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Darsning yakuni. O'ng tomondagi son hal qiladi:
//   |x| = 8        musbat -> IKKI ildiz (8 va −8)
//   |x − 5| = 0    nol    -> BITTA ildiz (5)
//   |x| + 3 = 1    |x| = −2, manfiy -> ILDIZI YO'Q
// Uchinchisi ATAYLAB qo'shiluvchi bilan: o'ng tomon 1 musbat ko'rinadi,
// lekin modulni ajratgach −2 chiqadi.
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi («ikkinchi tenglamada...»), aralashtirilsa izoh ekrandagiga mos
// kelmay qoladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_root_count', level: '🔴', noShuffle: true, itemSize: 20, zoneLbl: 108,
  eyebrow: L('Nechta ildiz', 'Сколько корней', 'How many roots'),
  setup: L(
    "Modulli tenglamada ildiz soni o'ng tomondagi songa bog'liq. Lekin uni ko'rish uchun avval modulni yolg'iz qoldirish kerak.",
    'Число корней в уравнении с модулем зависит от правой части. Но чтобы её увидеть, модуль надо сначала оставить одним.',
    'The number of roots depends on the right side. But to see it the modulus must first be left alone.'),
  zones: [
    { id: 'z2', label: L('IKKI ILDIZ', 'ДВА КОРНЯ', 'TWO ROOTS') },
    { id: 'z1', label: L('BITTA ILDIZ', 'ОДИН КОРЕНЬ', 'ONE ROOT') },
    { id: 'z0', label: L("ILDIZI YO'Q", 'КОРНЕЙ НЕТ', 'NO ROOTS') },
  ],
  items: [
    { id: 'i1', tokens: ['|x|', '=', '8'], zone: 'z2' },
    { id: 'i2', tokens: ['|x', '−', '5|', '=', '0'], zone: 'z1' },
    { id: 'i3', tokens: ['|x|', '+', '3', '=', '1'], zone: 'z0' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. |x| = 8 da o'ng tomon musbat -- ikki ildiz. |x − 5| = 0 da nol -- bitta ildiz. Uchinchisida esa |x| = 1 − 3 = −2, manfiy -- ildiz yo'q.",
    'Верно. В |x| = 8 правая часть положительная — два корня. В |x − 5| = 0 нуль — один корень. А в третьем |x| = 1 − 3 = −2, отрицательное — корней нет.',
    'Correct. In |x| = 8 the right side is positive — two roots. In |x − 5| = 0 it is zero — one root. In the third |x| = 1 − 3 = −2, negative — no roots.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi tenglamada modul yolg'iz emas: 3 ni ko'chirsak |x| = 1 − 3 = −2 chiqadi. Modul manfiy bo'lmaydi, ya'ni ildiz yo'q.",
      'В третьем уравнении модуль не один: если перенести 3, выйдет |x| = 1 − 3 = −2. Модуль не бывает отрицательным, значит корней нет.',
      'In the third equation the modulus is not alone: moving the 3 gives |x| = 1 − 3 = −2. A modulus is never negative, so no roots.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi tenglamada o'ng tomon nol: modul ichidagi ifoda nolga teng bo'lishi kerak, ya'ni ildiz bitta.",
      'Во втором уравнении справа нуль: выражение под модулем должно быть равно нулю, значит корень один.',
      'In the second equation the right side is zero: the expression under the modulus must be zero, so there is one root.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi tenglamada o'ng tomon musbat: noldan sakkiz qadam uzoqda ikki nuqta bor, 8 va −8.",
      'В первом уравнении справа положительное число: в восьми шагах от нуля две точки, 8 и −8.',
      'In the first equation the right side is positive: there are two points eight steps from zero, 8 and −8.') },
  ],
  wrongText: L(
    "Har tenglamada modulni yolg'iz qoldiring, keyin o'ng tomondagi sonning ishorasiga qarang.",
    'В каждом уравнении оставь модуль один, потом посмотри на знак правой части.',
    'In each equation leave the modulus alone, then look at the sign of the right side.'),
};

export default function D10_10(props) { return <Zones data={DATA} {...props} />; }
