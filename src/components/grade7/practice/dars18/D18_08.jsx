// Dars18 · Amaliyot 08 — Darajasi kamayadigan tartib · 🔴 · order · tag: poly_order
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 8-o'rin.
//
// 9 − 4k³ + 7k -> −4k³ + 7k + 9. Tartib: uchinchi daraja, birinchi daraja,
// ozod had. Ishoralar o'zgarmaydi.
// Ortiqcha kartalar: 4k³ va −7k -- ishora almashtirilgan variantlar.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_order', level: '🔴',
  eyebrow: L('Darajasi bo\'yicha', 'По степеням', 'By degree'),
  setup: L(
    "Standart shaklda hadlar darajasi kamayib boradi. Bu yerda o'xshash hadlar yo'q -- faqat tartib va ishora ustida ishlanadi.",
    'В стандартном виде степени идут по убыванию. Подобных членов здесь нет — работа только с порядком и знаками.',
    'In standard form the degrees decrease. There are no like terms here — only order and signs matter.'),
  expr: ['9', '−', '4k³', '+', '7k'], exprSize: 32,
  cards: [
    { id: 'm4k3', label: '−4k³' },
    { id: 'p7k', label: '+7k' },
    { id: 'p9', label: '+9' },
    { id: 'p4k3', label: '4k³' },
    { id: 'm7k', label: '−7k' },
  ],
  answerSeq: ['m4k3', 'p7k', 'p9'],
  empty: L("Hadlarni darajasi kamayadigan tartibda qo'ying", 'Поставь члены по убыванию степени', 'Place the terms in decreasing degree'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. −4k³ uchinchi daraja, +7k birinchi, +9 ozod had. Ishoralar asl yozuvdagidek qoldi.",
    'Верно. −4k³ третья степень, +7k первая, +9 свободный член. Знаки остались как в исходной записи.',
    'Correct. −4k³ is degree three, +7k degree one, +9 the free term. The signs stayed as in the original.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('p4k3') !== -1, text: L(
      "4k³ asl yozuvda MINUS bilan turgan. Tartibni o'zgartirish ishorani almashtirmaydi.",
      '4k³ в исходной записи стоит с МИНУСОМ. Смена порядка знак не меняет.',
      '4k³ has a MINUS in the original. Changing the order does not flip the sign.') },
    { when: (s) => s.seq.indexOf('m7k') !== -1, text: L(
      "7k musbat edi. Har had o'z ishorasi bilan ko'chadi.",
      '7k был положительным. Каждый член переезжает со своим знаком.',
      '7k was positive. Each term travels with its own sign.') },
    { when: (s) => s.seq[0] === 'p9', text: L(
      "Ozod had oxirida turadi: standart shakl eng katta darajadan boshlanadi.",
      'Свободный член стоит в конце: стандартный вид начинается со старшей степени.',
      'The free term goes last: standard form starts with the highest degree.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Hadlar to'g'ri, tartibi boshqa: uchinchi daraja, keyin birinchi, oxirida ozod had.",
      'Члены верные, но порядок другой: третья степень, потом первая, в конце свободный член.',
      'The terms are right but the order is not: degree three, then one, then the free term.') },
  ],
  wrongText: L(
    "Har hadning darajasini aniqlang, keyin kattadan kichikka qarab joylashtiring.",
    'Определи степень каждого члена, потом расположи от большей к меньшей.',
    'Find the degree of each term, then place them from the highest down.'),
};

export default function D18_08(props) { return <BuildLine data={DATA} {...props} />; }
