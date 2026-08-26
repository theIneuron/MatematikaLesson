// Dars42 · Amaliyot 03 — Uch burchak yetarli emas · 🟢 · fix · tag: eq_angles_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 3-o'rin `fix`.
// Uch xulosadan biri xato: uch burchakning tengligi uchburchaklar tengligini BERMAYDI (o'lcham har xil).
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_angles_fix',
  level: '🟢',
  eyebrow: L(
    'Xato xulosa',
    'Неверный вывод',
    'The wrong claim'),
  setup: L(
    "Uch xulosadan biri noto'g'ri. Uch burchak faqat SHAKLNI beradi: bir xil shaklda katta va kichik uchburchak bo'lishi mumkin.",
    'Один из трёх выводов неверный. Три угла задают только ФОРМУ: при одной форме треугольник может быть большим и маленьким.',
    'One of the three claims is wrong. Three angles fix only the SHAPE: the same shape comes in large and small.'),
  ask: L(
    "NOTO'G'RI xulosani belgilang.",
    'Отметь НЕВЕРНЫЙ вывод.',
    'Mark the WRONG claim.'),
  note: L(
    'Bitta xulosa.',
    'Один вывод.',
    'One claim.'),
  parts: [
    { k: 'term', id: 't1', v: L('uch tomon teng -> teng', 'три стороны равны -> равны', 'three sides equal -> equal') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: L('uch burchak teng -> teng', 'три угла равны -> равны', 'three angles equal -> equal') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: L('teng uchburchaklarning perimetri teng', 'у равных треугольников периметры равны', 'equal triangles have equal perimeters') },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. Uch burchak teng bo'lsa shakl bir xil, lekin o'lcham boshqa bo'lishi mumkin.",
    'Верно. При равных трёх углах форма одна, а размер может быть разным.',
    'Correct. Equal angles give one shape, but the size may still differ.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "Uch tomon tengligi -- bu alomat, xulosa to'g'ri.",
        'Равенство трёх сторон это признак, вывод верный.',
        'Three equal sides form a criterion, so the claim holds.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        "Teng uchburchaklarning tomonlari mos ravishda teng, ya'ni perimetrlari ham teng.",
        'У равных треугольников стороны соответственно равны, значит и периметры равны.',
        'Equal triangles have matching sides, hence equal perimeters.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        "Bitta xulosa faqat shaklni beradi, o'lchamni bermaydi. Shu joyni toping.",
        'Один из выводов даёт только форму, но не размер. Найди его.',
        'One claim gives shape only, not size. Find it.'),
    },
  ],
  wrongText: L(
    'Bir xil burchakli katta va kichik uchburchakni tasavvur qiling.',
    'Представь большой и маленький треугольник с одинаковыми углами.',
    'Picture a large and a small triangle with the same angles.'),
};

export default function D42_03(props) { return <TapTerms data={DATA} {...props} />; }
