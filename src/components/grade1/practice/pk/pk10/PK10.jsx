// ПК10 — Blok 11 «O'lchov birliklari» nazorati (geyt). 6 topshiriq, ≥80% → o'tdi.
// STATUS: ◐ на согласовании. YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK10_01 from './PK10_01.jsx';
import PK10_02 from './PK10_02.jsx';
import PK10_03 from './PK10_03.jsx';
import PK10_04 from './PK10_04.jsx';
import PK10_05 from './PK10_05.jsx';
import PK10_06 from './PK10_06.jsx';

const TASKS = [
  { C: PK10_01, topic: 'Detsimetr → sm' },
  { C: PK10_02, topic: 'Detsimetr → sm' },
  { C: PK10_03, topic: 'Metr → dm' },
  { C: PK10_04, topic: 'Massa — qaysi og\'ir' },
  { C: PK10_05, topic: 'Massa — teng' },
  { C: PK10_06, topic: 'O\'lchov tenglik' },
];

export default function PK10() {
  return <PKHost title="ПК10 — Nazorat" block="Blok 11 · O'lchov birliklari" tasks={TASKS} passPct={80} />;
}
