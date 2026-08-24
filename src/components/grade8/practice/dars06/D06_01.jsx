// Dars06 · Amaliyot 01 — Belgilash · 🟢 · tag: first_action_mark
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Kontent: src/books/grade8/DARS06_AMALIYOT_KONTENT_V2.md §01
//
// Metodist qarori 2026-08-24: 2-6 darslar 1-darsning o'nta mexanikasida
// quriladi, har darsda boshqa ketma-ketlikda. 6-darsda 1-pozitsiyada
// `MarkAll` turadi: bitta bosish, boshqaruv tushuntirishni talab qilmaydi.
//
// Bu yerda HISOBLANMAYDI — faqat BIRINCHI AMAL topiladi. Uchtasida birinchi
// amal ko'paytirish yoki bo'lish, uchtasida esa qavs ichidagi amal. Qavs
// darsning butun mavzusini hal qiladi: u bo'lsa tartib butunlay o'zgaradi.
// «Chapdan o'ngga hisoblash» adashishi shu yerda birinchi marta uchraydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'first_action_mark', level: '🟢',
  col: 168, itemSize: 13,
  items: [
    { id: 'i1', tokens: [{ n: '1', d: 'm' }, '+', { n: '2', d: 'm' }, '·', '3'], hit: true },
    { id: 'i2', tokens: ['(', { n: '1', d: 'm' }, '+', { n: '2', d: 'm' }, ')', '·', '3'] },
    { id: 'i3', tokens: [{ n: '1', d: 'm' }, '−', { n: '1', d: 'm' }, ':', '2'], hit: true },
    { id: 'i4', tokens: ['(', { n: '1', d: 'm' }, '−', { n: '1', d: 'm' }, ')', ':', '2'] },
    { id: 'i5', tokens: ['5', '·', { n: 'm', d: '4' }, '+', '1'], hit: true },
    { id: 'i6', tokens: ['5', '·', '(', { n: 'm', d: '4' }, '+', '1', ')'] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita ifoda. Ular juft-juft o'xshaydi, farq faqat qavsda — qavs esa amallar tartibini o'zgartiradi.",
    'Шесть выражений. Они похожи попарно, разница только в скобке — а скобка меняет порядок действий.',
    'Six expressions. They come in similar pairs, differing only by a bracket — and a bracket changes the order of actions.'),
  ask: L(
    "Birinchi amal KO'PAYTIRISH yoki BO'LISH bo'lgan 3 ifodani belgilang.",
    'Отметь 3 выражения, где первое действие — УМНОЖЕНИЕ или ДЕЛЕНИЕ.',
    'Mark the 3 expressions where the first action is MULTIPLICATION or DIVISION.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Qavs bo'lmasa, avval ko'paytirish va bo'lish bajariladi, qo'shish va ayirish esa keyin. Qavs bo'lsa, tartib o'zgaradi: avval qavs ichidagi amal. Uchala qavsli ifodada birinchi amal aynan qavs ichida turadi.",
    'Верно. Без скобок сначала выполняют умножение и деление, а сложение и вычитание потом. Со скобкой порядок меняется: сначала действие внутри скобки. Во всех трёх выражениях со скобкой первое действие стоит именно в ней.',
    'Correct. Without brackets multiplication and division come first, addition and subtraction after. With a bracket the order changes: the action inside it comes first. In all three bracketed expressions the first action is the one inside the bracket.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Qavsni ko'rmadingiz. Qavs bor bo'lsa, birinchi amal doim uning ichida bo'ladi — ko'paytirish qavsdan keyin keladi.",
      'Ты не заметил скобку. Если скобка есть, первое действие всегда внутри неё — умножение идёт после скобки.',
      'You missed the bracket. When there is a bracket, the first action is always inside it — the multiplication comes after.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Bo'lish ham ko'paytirish bilan bir darajada: qavs bo'lmasa, u ayirishdan oldin bajariladi.",
      'Деление стоит в одном ряду с умножением: без скобки оно выполняется раньше вычитания.',
      'Division ranks with multiplication: without a bracket it comes before the subtraction.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Ko'paytirish ifodaning boshida turibdi va qavs yo'q: birinchi amal — aynan u.",
      'Умножение стоит в начале выражения, и скобки нет: первое действие — именно оно.',
      'The multiplication stands at the start and there is no bracket: it is the first action.') },
    { when: (s) => s.miss.length >= 2, text: L(
      "Har ifodaga bitta savol bering: qavs bormi? Bo'lsa — birinchi amal qavsda, bo'lmasa — ko'paytirish yoki bo'lishda.",
      'К каждому выражению один вопрос: есть скобка? Если да — первое действие в ней, если нет — в умножении или делении.',
      'Ask one question of each expression: is there a bracket? If yes, the first action is inside it; if not, it is the multiplication or division.') },
  ],
  wrongText: L(
    "Avval qavsga qarang, keyin amal belgisiga. Qavs bo'lmasa — ko'paytirish va bo'lish oldin, qo'shish va ayirish keyin.",
    'Сначала смотри на скобку, потом на знак действия. Без скобки умножение и деление раньше, сложение и вычитание позже.',
    'Look at the bracket first, then at the operation sign. Without a bracket multiplication and division come first, addition and subtraction later.'),
};

export default function D06_01(props) { return <MarkAll data={DATA} {...props} />; }
