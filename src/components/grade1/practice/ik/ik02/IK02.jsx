// ИК-2 — «Yakuniy kvest» (свёртка). Butun kurs sintezi: применение + логика. 10 stansiya, ≥70% → o'tdi.
// Reja: PK_IK_REJA_1SINF.md §3 — kurs oxiri, barcha bloklardan aralash stansiyalar + sertifikat.
// Savollar butun kurs bo'ylab (Б1–Б11) aralashtirib olingan.
import React from 'react';
import PKHost from '../PKHost.jsx';

import D03_01 from '../../dars03/D03_01.jsx'; // Б1 sanoq 6–10
import D06_01 from '../../dars06/D06_01.jsx'; // Б1 son tarkibi
import D10_02 from '../../dars10/D10_02.jsx'; // Б2 10 ichida ±
import D15_02 from '../../dars15/D15_02.jsx'; // Б3 sonlar 16–20
import D17_01 from '../../dars17/D17_01.jsx'; // Б4 o'tib qo'shish
import D21_01 from '../../dars21/D21_01.jsx'; // Б8 razryad 21–100
import D26_01 from '../../dars26/D26_01.jsx'; // Б9 2x + 2x
import D28_01 from '../../dars28/D28_01.jsx'; // Б5 matnli masala
import D33_01 from '../../dars33/D33_01.jsx'; // Б6 shakllar
import D34_04 from '../../dars34/D34_04.jsx'; // Б11 o'lchov (dm→sm)

const TASKS = [
  { C: D03_01, topic: 'Sanoq 10 gacha' },
  { C: D06_01, topic: 'Son tarkibi' },
  { C: D10_02, topic: '± 10 gacha' },
  { C: D15_02, topic: 'Sonlar 20 gacha' },
  { C: D17_01, topic: 'O\'nlikdan o\'tish' },
  { C: D21_01, topic: 'Sonlar 21–100' },
  { C: D26_01, topic: '± 100 gacha' },
  { C: D28_01, topic: 'Matnli masala' },
  { C: D33_01, topic: 'Geometriya' },
  { C: D34_04, topic: 'O\'lchov birliklari' },
];

export default function IK02() {
  return <PKHost title="ИК-2 — Yakuniy kvest" block="Свёртка · Butun kurs sintezi" tasks={TASKS} passPct={70} />;
}
