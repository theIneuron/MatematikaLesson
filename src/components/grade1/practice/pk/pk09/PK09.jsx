// ПК9 — Blok 6 «Geometriya» nazorati (geyt). 6 topshiriq, ≥80% → o'tdi.
// YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK09_01 from './PK09_01.jsx';
import PK09_02 from './PK09_02.jsx';
import PK09_03 from './PK09_03.jsx';
import PK09_04 from './PK09_04.jsx';
import PK09_05 from './PK09_05.jsx';
import PK09_06 from './PK09_06.jsx';

const TASKS = [
  { C: PK09_01, topic: 'To\'g\'ri chiziq' },
  { C: PK09_02, topic: 'Egri chiziq' },
  { C: PK09_03, topic: 'Doira' },
  { C: PK09_04, topic: 'Uchburchak' },
  { C: PK09_05, topic: 'Kvadrat' },
  { C: PK09_06, topic: 'Burchaklar soni' },
];

export default function PK09() {
  return <PKHost title="ПК9 — Nazorat" block="Blok 6 · Geometriya" tasks={TASKS} passPct={80} />;
}
