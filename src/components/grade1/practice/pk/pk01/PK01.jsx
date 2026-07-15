// ПК1 — Blok 1 «Sonlar 10 gacha» nazorati (geyt). 8 topshiriq, ≥80% → o'tdi.
// YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada). 6 GeytQ-savol + 2 boy PKQ.
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK01_01 from './PK01_01.jsx';
import PK01_02 from './PK01_02.jsx';
import PK01_03 from './PK01_03.jsx';
import PK01_04 from './PK01_04.jsx';
import PK01_05 from './PK01_05.jsx';
import PK01_06 from './PK01_06.jsx';
import PKQ01 from './PKQ01.jsx';
import PKQ02 from './PKQ02.jsx';

const TASKS = [
  { C: PK01_01, topic: 'Sanoq 1–5' },
  { C: PK01_02, topic: 'Sanoq 6–10' },
  { C: PK01_03, topic: 'Nol soni' },
  { C: PKQ01, topic: 'Taqqoslash > < =' },
  { C: PK01_04, topic: 'Son tarkibi 2–5' },
  { C: PK01_05, topic: 'Taqqoslash' },
  { C: PKQ02, topic: 'Son tarkibi 6–10' },
  { C: PK01_06, topic: 'Sanoq 6–10' },
];

export default function PK01() {
  return <PKHost title="ПК1 — Nazorat" block="Blok 1 · Sonlar 10 gacha" tasks={TASKS} passPct={80} />;
}
