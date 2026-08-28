// Dars10 · Amaliyot 03 — Jadval · 🟢 · teg: faqat-bir-chiziqda-tekshirish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> RowTable.
//
// Jadval FAQAT chiziqdan tuzilgan. Ikkala bo'sh katak ham keyingi
// topshiriqlarda kerak bo'ladi: iks ikkiga teng — kesishishning abssissasi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { RowTable } from '../asboblar9.jsx';

const DATA = {
  tag: 'faqat-bir-chiziqda-tekshirish', level: '🟢',
  eyebrow: L('Jadval', 'Таблица', 'Table'),
  setup: L(
    "Jadval faqat CHIZIQdan tuzilgan: har ustunda igrek iksdan bittaga katta.",
    'Таблица составлена только по ПРЯМОЙ: в каждом столбце игрек на единицу больше икса.',
    'The table is built from the LINE only: in every column y is one more than x.'),
  ask: L("Ikkita bo'sh katakni to'ldiring.", 'Заполни две пустые клетки.', 'Fill in the two empty cells.'),
  expr: ['y = x + 1'],
  xLabel: 'x', yLabel: 'y',
  cols: [
    { id: 'c1', x: '−1', y: '0' },
    { id: 'c2', x: '0', y: '1' },
    { id: 'c3', x: '1', y: '', ans: 2, hole: 'y' },
    { id: 'c4', x: '', y: '3', ans: 2, hole: 'x' },
  ],
  correctText: L(
    "To'g'ri. Uchinchi ustunda igrek ikkiga, to'rtinchisida esa iks ikkiga teng. Diqqat: bu ustunlarning hammasi CHIZIQda yotadi, lekin sistemaning yechimi bo'lishi shart emas — buning uchun ular parabolada ham yotishi kerak. Masalan bir-ikki paraboladan tashqarida: bir kvadrat minus bir nolga teng, ikkiga emas.",
    'Верно. В третьем столбце игрек равен двум, в четвёртом икс равен двум. Внимание: все эти столбцы лежат на ПРЯМОЙ, но решениями системы быть не обязаны — для этого они должны лежать и на параболе. Скажем, один-два вне параболы: один в квадрате минус один — нуль, а не два.',
    'Correct. In the third column y is two, in the fourth x is two. Note: all these columns lie on the LINE, but they need not be solutions of the system — for that they must lie on the parabola too. One-two, say, is off the parabola: one squared minus one is zero, not two.'),
  wrongs: [
    { when: (s) => s.vals.c4 === 4, text: L(
      "To'rtinchi ustunda igrek berilgan, iks so'ralyapti. Igrek iksdan bittaga KATTA, demak iks igrekdan bittaga kichik.",
      'В четвёртом столбце дан игрек, а спрашивают икс. Игрек БОЛЬШЕ икса на единицу, значит икс меньше игрека на единицу.',
      'In the fourth column y is given and x is asked. y is one MORE than x, so x is one less than y.') },
    { when: (s) => s.vals.c3 === 0, text: L(
      "Uchinchi ustunda parabolaning qoidasi ishlatildi: bir kvadrat minus bir nolga teng. Lekin bu jadval CHIZIQniki: igrek iks qo'shuv bir.",
      'В третьем столбце сработало правило параболы: один в квадрате минус один равно нулю. Но эта таблица — ПРЯМОЙ: игрек равен икс плюс один.',
      'In the third column the rule of the parabola was used: one squared minus one is zero. But this table belongs to the LINE: y equals x plus one.') },
  ],
  wrongText: L(
    "Har bir katakni jadvalning tepasidagi tenglama bilan tekshiring: igrek iks qo'shuv bir. Berilgan katakni tenglamaga qo'ying va ikkinchisini toping.",
    'Проверяй каждую клетку по уравнению над таблицей: игрек равен икс плюс один. Подставь известную клетку и найди вторую.',
    'Check each cell against the equation above the table: y equals x plus one. Substitute the known cell and find the other one.'),
};

export default function D10_03(props) { return <RowTable data={DATA} {...props} />; }
