// ПК1 — Blok 1 «Числа до 10» oraliq nazorati (geyt). 8 topshiriq, ≥80% → o'tdi.
// Reja: PK_IK_REJA_1SINF.md §3 (счёт 1–10, цифры, 0, сравнение > < =, состав числа).
// Topshiriqlar mavjud amaliyot bankidan yig'ilgan (jsx-question kontrakti — bitta-javobli turlar).
import React from 'react';
import PKHost from './PKHost.jsx';

import D01_01 from '../dars01/D01_01.jsx'; // sanoq 1–5
import D03_01 from '../dars03/D03_01.jsx'; // sanoq 6–10 (5 va yana)
import D02_01 from '../dars02/D02_01.jsx'; // raqamni tanish
import D03_04 from '../dars03/D03_04.jsx'; // nol (bo'sh uy)
import D04_05 from '../dars04/D04_05.jsx'; // belgi tanlash > < =
import D04_06 from '../dars04/D04_06.jsx'; // sonlarni taqqoslash
import D05_01 from '../dars05/D05_01.jsx'; // son tarkibi 2–5 (uycha)
import D06_01 from '../dars06/D06_01.jsx'; // son tarkibi 6–10 (uycha)

const TASKS = [
  { C: D01_01, topic: 'Sanoq 1–5' },
  { C: D03_01, topic: 'Sanoq 6–10' },
  { C: D02_01, topic: 'Raqamlar' },
  { C: D03_04, topic: 'Nol soni' },
  { C: D04_05, topic: 'Taqqoslash > < =' },
  { C: D04_06, topic: 'Taqqoslash' },
  { C: D05_01, topic: 'Son tarkibi 2–5' },
  { C: D06_01, topic: 'Son tarkibi 6–10' },
];

export default function PK01() {
  return <PKHost title="ПК1 — Nazorat" block="Blok 1 · Sonlar 10 gacha" tasks={TASKS} passPct={80} />;
}
