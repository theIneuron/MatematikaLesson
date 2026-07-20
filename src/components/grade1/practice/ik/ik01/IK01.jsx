// ИК-1 — «Spiral doira» (свёртка). Б1–Б4 sintezi: состав + десяток + переход. 10 stansiya, ≥70% → o'tdi.
// Reja: PK_IK_REJA_1SINF.md §3 — o'rganilgan tugunlarni bir aylanaga «yig'ish», kurs o'rtasida.
// Savollar bir nechta blokdan (Dars04–19) aralashtirib olingan.
import React from 'react';
import PKHost from '../../pk/PKHost.jsx';

import D05_01 from '../../dars05/D05_01.jsx'; // Б1 son tarkibi 2–5
import D06_01 from '../../dars06/D06_01.jsx'; // Б1 son tarkibi 6–10
import D04_06 from '../../dars04/D04_06.jsx'; // Б1 taqqoslash
import D13_01 from '../../dars13/D13_01.jsx'; // Б3 o'nlik
import D14_02 from '../../dars14/D14_02.jsx'; // Б3 sonlar 11–15
import D16_01 from '../../dars16/D16_01.jsx'; // Б4 10 ga to'ldirish
import D17_01 from '../../dars17/D17_01.jsx'; // Б4 o'tib qo'shish
import D19_01 from '../../dars19/D19_01.jsx'; // Б4 o'tib ayirish
import D10_02 from '../../dars10/D10_02.jsx'; // Б2 10 ichida ±
import D11_02 from '../../dars11/D11_02.jsx'; // Б2 o'rin almashtirish

const TASKS = [
  { C: D05_01, topic: 'Son tarkibi 2–5' },
  { C: D06_01, topic: 'Son tarkibi 6–10' },
  { C: D04_06, topic: 'Taqqoslash' },
  { C: D10_02, topic: '10 ichida ±' },
  { C: D11_02, topic: 'O\'rin almashtirish' },
  { C: D13_01, topic: 'O\'nlik' },
  { C: D14_02, topic: 'Sonlar 11–15' },
  { C: D16_01, topic: '10 ga to\'ldirish' },
  { C: D17_01, topic: 'O\'tib qo\'shish' },
  { C: D19_01, topic: 'O\'tib ayirish' },
];

export default function IK01() {
  return <PKHost title="ИК-1 — Spiral doira" block="Свёртка · Б1–Б4 sintezi" tasks={TASKS} passPct={70} />;
}
