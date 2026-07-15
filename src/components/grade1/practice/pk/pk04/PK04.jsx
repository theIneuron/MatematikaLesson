// ПК4 — Blok 4 «O'nlikdan o'tish» nazorati (KALIT GEYT). 8 topshiriq, ≥80% → o'tdi.
// YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK04_01 from './PK04_01.jsx';
import PK04_02 from './PK04_02.jsx';
import PK04_03 from './PK04_03.jsx';
import PK04_04 from './PK04_04.jsx';
import PK04_05 from './PK04_05.jsx';
import PK04_06 from './PK04_06.jsx';
import PK04_07 from './PK04_07.jsx';
import PK04_08 from './PK04_08.jsx';

const TASKS = [
  { C: PK04_01, topic: '10 ga to\'ldirish' },
  { C: PK04_02, topic: '10 ga to\'ldirish' },
  { C: PK04_03, topic: 'O\'tib qo\'shish' },
  { C: PK04_04, topic: 'O\'tib qo\'shish' },
  { C: PK04_05, topic: 'O\'tib qo\'shish' },
  { C: PK04_06, topic: 'O\'tib ayirish' },
  { C: PK04_07, topic: 'O\'tib ayirish' },
  { C: PK04_08, topic: 'O\'tib ayirish' },
];

export default function PK04() {
  return <PKHost title="ПК4 — Nazorat (kalit geyt)" block="Blok 4 · O'nlikdan o'tish" tasks={TASKS} passPct={80} />;
}
