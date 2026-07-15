// ПК3 — Blok 3 «Sonlar 20 gacha» nazorati (geyt). 6 topshiriq, ≥80% → o'tdi.
// YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK03_01 from './PK03_01.jsx';
import PK03_02 from './PK03_02.jsx';
import PK03_03 from './PK03_03.jsx';
import PK03_04 from './PK03_04.jsx';
import PK03_05 from './PK03_05.jsx';
import PK03_06 from './PK03_06.jsx';

const TASKS = [
  { C: PK03_01, topic: 'O\'nlik va birlik' },
  { C: PK03_02, topic: 'Sonlar 16–20' },
  { C: PK03_03, topic: '13 hosil qilish' },
  { C: PK03_04, topic: 'Taqqoslash 20 gacha' },
  { C: PK03_05, topic: 'Taqqoslash 20 gacha' },
  { C: PK03_06, topic: 'Tenglik / tengsizlik' },
];

export default function PK03() {
  return <PKHost title="ПК3 — Nazorat" block="Blok 3 · Sonlar 20 gacha" tasks={TASKS} passPct={80} />;
}
