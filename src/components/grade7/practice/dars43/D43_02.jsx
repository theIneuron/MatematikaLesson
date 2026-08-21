// Dars43 · Amaliyot 02 — Ikki tomon yetarlimi · 🟢 · choice · tag: eq_enough
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// Faqat ikki tomon tengligi yetarli emas: ular ORASIDAGI burchak ham kerak.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_enough', level: '🟢',
  eyebrow: L('Yetarlimi', 'Достаточно ли', 'Is it enough'),
  setup: L(
    "Uchburchaklar tengligini isbotlash uchun uch element kerak. Ikki tomon o'zi kifoya qilmaydi.",
    'Чтобы доказать равенство треугольников, нужны три элемента. Двух сторон самих по себе недостаточно.',
    'Proving triangles equal needs three elements. Two sides alone are not enough.'),
  ask: L("Ikki tomonning tengligi yetarlimi?", 'Достаточно ли равенства двух сторон?', 'Is the equality of two sides enough?'),
  opts: [
    { label: L("Yo'q, ular orasidagi burchak ham kerak", 'Нет, нужен угол между ними', 'No, the angle between is needed') },
    { label: L('Ha, yetarli', 'Да, достаточно', 'Yes, it is enough') },
    { label: L('Uch burchak kerak', 'Нужны три угла', 'Three angles are needed') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ikki tomon va ular ORASIDAGI burchak -- shu uchlik uchburchakni yagona qilib belgilaydi.",
    'Верно. Две стороны и угол МЕЖДУ ними — эта тройка задаёт треугольник однозначно.',
    'Correct. Two sides and the angle BETWEEN them fix the triangle uniquely.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikki tomon bir xil bo'lsa ham burchakni o'zgartirib boshqa uchburchak yasash mumkin.",
      'Даже при равных двух сторонах можно менять угол и получать другой треугольник.',
      'Even with two equal sides, changing the angle gives a different triangle.') },
    { when: (s) => s.picked === 2, text: L(
      "Uch burchak tengligi shaklni beradi, lekin O'LCHAMNI bermaydi: kichik va katta uchburchak burchaklari bir xil bo'lishi mumkin.",
      'Равенство трёх углов даёт форму, но не РАЗМЕР: у маленького и большого треугольника углы совпадают.',
      'Three equal angles give the shape but not the SIZE: a small and a large triangle can share angles.') },
  ],
  wrongText: L(
    "Ikki tomonni ushlab, ular orasidagi burchakni o'zgartirsak shakl o'zgaradimi?",
    'Если держать две стороны и менять угол между ними, форма изменится?',
    'Holding two sides and changing the angle between them: does the shape change?'),
};

export default function D43_02(props) { return <Choice data={DATA} {...props} />; }
