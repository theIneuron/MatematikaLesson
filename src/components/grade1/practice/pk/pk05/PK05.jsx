// ПК5 — Blok 8 «Sonlar 21–100» nazorati (geyt). 6 topshiriq, ≥80% → o'tdi.
// STATUS: ◐ на согласовании. YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK05_01 from './PK05_01.jsx';
import PK05_02 from './PK05_02.jsx';
import PK05_03 from './PK05_03.jsx';
import PK05_04 from './PK05_04.jsx';
import PK05_05 from './PK05_05.jsx';
import PK05_06 from './PK05_06.jsx';

const TASKS = [
  { C: PK05_01, topic: 'Razryad — o\'nlik' },
  { C: PK05_02, topic: 'Razryad — birlik' },
  { C: PK05_03, topic: 'Ikki xonali taqqoslash' },
  { C: PK05_04, topic: 'Ikki xonali taqqoslash' },
  { C: PK05_05, topic: '10 lab sanoq' },
  { C: PK05_06, topic: '5 lab sanoq' },
];

export default function PK05() {
  return <PKHost title="ПК5 — Nazorat" block="Blok 8 · Sonlar 21–100" tasks={TASKS} passPct={80} />;
}
