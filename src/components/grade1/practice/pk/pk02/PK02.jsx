// ПК2 — Blok 2 «Qo'shish va ayirish 10 gacha» nazorati (geyt). 6 topshiriq, ≥80% → o'tdi.
// YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK02_01 from './PK02_01.jsx';
import PK02_02 from './PK02_02.jsx';
import PK02_03 from './PK02_03.jsx';
import PK02_04 from './PK02_04.jsx';
import PK02_05 from './PK02_05.jsx';
import PK02_06 from './PK02_06.jsx';

const TASKS = [
  { C: PK02_01, topic: 'Qo\'shishning ma\'nosi' },
  { C: PK02_02, topic: 'Ayirishning ma\'nosi' },
  { C: PK02_03, topic: '5 ichida qo\'shish' },
  { C: PK02_04, topic: '10 ichida ayirish' },
  { C: PK02_05, topic: 'O\'rin almashtirish' },
  { C: PK02_06, topic: 'Tenglik / tengsizlik' },
];

export default function PK02() {
  return <PKHost title="ПК2 — Nazorat" block="Blok 2 · Qo'shish va ayirish 10 gacha" tasks={TASKS} passPct={80} />;
}
