// ПК7 — Blok 5 «Matnli masalalar» nazorati (geyt). 6 topshiriq, ≥80% → o'tdi.
// YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK07_01 from './PK07_01.jsx';
import PK07_02 from './PK07_02.jsx';
import PK07_03 from './PK07_03.jsx';
import PK07_04 from './PK07_04.jsx';
import PK07_05 from './PK07_05.jsx';
import PK07_06 from './PK07_06.jsx';

const TASKS = [
  { C: PK07_01, topic: 'Yig\'indiga masala' },
  { C: PK07_02, topic: 'Yig\'indiga masala' },
  { C: PK07_03, topic: 'Qoldiqqa masala' },
  { C: PK07_04, topic: 'Qoldiqqa masala' },
  { C: PK07_05, topic: 'Noma\'lum qo\'shiluvchi' },
  { C: PK07_06, topic: 'Noma\'lum qo\'shiluvchi' },
];

export default function PK07() {
  return <PKHost title="ПК7 — Nazorat" block="Blok 5 · Matnli masalalar" tasks={TASKS} passPct={80} />;
}
