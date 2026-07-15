// ПК8 — Blok 10 «Tarkibli masalalar» nazorati (geyt). 6 topshiriq, ≥80% → o'tdi.
// STATUS: ◐ на согласовании. YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK08_01 from './PK08_01.jsx';
import PK08_02 from './PK08_02.jsx';
import PK08_03 from './PK08_03.jsx';
import PK08_04 from './PK08_04.jsx';
import PK08_05 from './PK08_05.jsx';
import PK08_06 from './PK08_06.jsx';

const TASKS = [
  { C: PK08_01, topic: 'Tarkibli: jami' },
  { C: PK08_02, topic: 'Tarkibli: qoldi' },
  { C: PK08_03, topic: 'Ikki qadamli masala' },
  { C: PK08_04, topic: 'Ikki qadamli masala' },
  { C: PK08_05, topic: 'Ikki qadamli masala' },
  { C: PK08_06, topic: 'Ikki qadamli masala' },
];

export default function PK08() {
  return <PKHost title="ПК8 — Nazorat" block="Blok 10 · Tarkibli masalalar" tasks={TASKS} passPct={80} />;
}
