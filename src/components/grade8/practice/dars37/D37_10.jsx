// Dars37 · Amaliyot 10 — Pazl · 🔴 · tag: diagonal_to_half
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §9 (37-dars, 10-pozitsiya)
//
// T3 VA З77 BIR TOPSHIRIQDA. Uch juftlik:
//   AC = 12 -> AO = 6    (diagonalning yarmi)
//   BD = 10 -> BO = 5    (ikkinchi diagonal, va u BIRINCHISIGA TENG EMAS)
//   AO = 4  -> AC = 8    (teskari yo'nalish)
// Birinchi ikki juftlik bitta figurada tura oladi: AC o'n ikki, BD esa o'n.
// Ya'ni har diagonal O'ZI teng ikkiga bo'linadi, lekin ikki diagonal
// bir-biriga teng emas — bu ikki boshqa fakt.
//
// Kartalarda yozuv bo'shliqsiz (skelet §0a.5).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'diagonal_to_half', level: '🔴',
  faceSize: 12, faceSizePhone: 10,
  given: [['O']],
  givenLabel: L('Kesishish nuqtasi', 'Точка пересечения', 'The point of intersection'),
  cards: [
    { id: 'f1', side: 0, tokens: ['AC=12'] },
    { id: 'f2', side: 0, tokens: ['BD=10'] },
    { id: 'f3', side: 0, tokens: ['AO=4'] },
    { id: 'v1', side: 1, v: 'AO=6' },
    { id: 'v2', side: 1, v: 'BO=5' },
    { id: 'v3', side: 1, v: 'AC=8' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "ABCD parallelogrammning diagonallari O nuqtada kesishadi. Uch berilgan qiymatga uchta natija mos keladi. Diqqat: birinchi ikki yozuv BITTA figuraga tegishli bo'lishi mumkin.",
    'Диагонали параллелограмма ABCD пересекаются в точке O. Трём данным значениям отвечают три результата. Внимание: первые две записи могут относиться к ОДНОЙ фигуре.',
    'The diagonals of the parallelogram ABCD meet at O. Three given values have three matching results. Note: the first two records may belong to ONE figure.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Kesishish nuqtasi har diagonalni teng ikkiga bo'ladi, ya'ni AO — AC ning yarmi, BO — BD ning yarmi. O'n ikkining yarmi olti, o'nning yarmi besh. Uchinchi juftlik teskari yo'nalishda: AO to'rt bo'lsa, butun diagonal ikki barobar — sakkiz. Endi eng muhim joyi: birinchi ikki yozuv bir vaqtda to'g'ri bo'lishi mumkin, ya'ni bitta parallelogrammda AC o'n ikki, BD esa o'n bo'la oladi. Diagonallar bir-biriga TENG EMAS, lekin har biri o'z o'rtasidan bo'linadi. Ikki fakt bir-biriga xalaqit bermaydi, chunki ular boshqa narsa haqida: bittasi ikki diagonalni solishtiradi, ikkinchisi bitta diagonalning ichini aytadi.",
    'Верно. Точка пересечения делит каждую диагональ пополам, значит AO — половина AC, BO — половина BD. Половина двенадцати шесть, половина десяти пять. Третья пара в обратную сторону: если AO четыре, то вся диагональ вдвое больше — восемь. И самое важное: первые две записи могут быть верны одновременно, то есть в одном параллелограмме AC может быть двенадцать, а BD десять. Диагонали НЕ РАВНЫ друг другу, но каждая делится своей серединой. Два факта друг другу не мешают, потому что говорят о разном: один сравнивает две диагонали, другой описывает внутренность одной.',
    'Correct. The point of intersection halves each diagonal, so AO is half of AC and BO is half of BD. Half of twelve is six, half of ten is five. The third pair runs the other way: if AO is four, the whole diagonal is twice that — eight. And the most important point: the first two records may be true at once, that is, in one parallelogram AC may be twelve and BD ten. The diagonals are NOT equal to each other, yet each is split at its own midpoint. The two facts do not clash, because they speak of different things: one compares two diagonals, the other describes the inside of one.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuv TESKARI yo'nalishda: bu yerda yarmi berilgan va butun diagonal so'ralyapti. Yarmini ikkiga bo'lish emas, IKKIGA KO'PAYTIRISH kerak: to'rt karra ikki sakkiz. Boshqa ikki kartada aksincha — butun berilgan va yarmi so'ralgan. Har kartada nima berilganini o'qish shart, chunki amal shunga qarab o'zgaradi.",
      'Третья запись идёт в ОБРАТНУЮ сторону: здесь дана половина и спрашивается вся диагональ. Половину надо не делить на два, а УМНОЖИТЬ на два: четырежды два восемь. В двух других карточках наоборот — дано целое, спрашивается половина. В каждой карточке надо прочитать, что дано, потому что от этого меняется действие.',
      'The third record runs the OTHER way: here the half is given and the whole diagonal is asked for. The half must not be halved but DOUBLED: four times two is eight. In the other two cards it is the reverse — the whole is given and the half asked for. In every card you must read what is given, because the operation depends on it.') },
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Bu ikki javob almashib ketdi, va sabab shundaki, ular bir-biriga o'xshaydi. Harflarga qarang: AO — AC diagonalining bo'lagi, BO esa BD niki. Birinchi harf qaysi diagonal haqida gap ketayotganini aytadi. O'n ikkining yarmi olti, o'nning yarmi besh — ikki diagonal boshqa uzunlikda, shuning uchun yarimlari ham boshqa.",
      'Эти два ответа поменялись местами, и причина в том, что они похожи. Смотри на буквы: AO — часть диагонали AC, а BO — часть BD. Первая буква говорит, о какой диагонали идёт речь. Половина двенадцати шесть, половина десяти пять — диагонали разной длины, поэтому и половины разные.',
      'These two answers were swapped, and the reason is that they look alike. Look at the letters: AO is part of the diagonal AC, BO is part of BD. The first letter says which diagonal is meant. Half of twelve is six, half of ten is five — the diagonals differ in length, so their halves differ too.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi diagonal ham xuddi birinchisi kabi teng ikkiga bo'linadi: BD o'n bo'lsa, BO besh. Uning birinchi diagonaldan qisqaroq bo'lgani hech narsani buzmaydi — parallelogrammda diagonallar teng bo'lishi shart emas, lekin har biri o'z o'rtasidan bo'linadi. Bu ikki fakt bir-biriga zid emas.",
      'Вторая диагональ делится пополам точно так же, как первая: если BD десять, то BO пять. То, что она короче первой, ничего не портит — в параллелограмме диагонали равными быть не обязаны, но каждая делится своей серединой. Эти два факта друг другу не противоречат.',
      'The second diagonal is halved just like the first: if BD is ten, BO is five. Its being shorter than the first spoils nothing — in a parallelogram the diagonals need not be equal, yet each is split at its own midpoint. The two facts do not contradict each other.') },
  ],
  wrongText: L(
    "Har kartada nima berilganiga qarang: butun diagonal berilsa ikkiga bo'ling, yarmi berilsa ikkiga ko'paytiring. Ikki diagonal teng bo'lishi shart emas.",
    'Смотри, что дано в каждой карточке: дана целая диагональ — дели на два, дана половина — умножай на два. Диагонали равными быть не обязаны.',
    'See what each card gives: a whole diagonal is halved, a half is doubled. The two diagonals need not be equal.'),
};

export default function D37_10(props) { return <PairSlots data={DATA} {...props} />; }
