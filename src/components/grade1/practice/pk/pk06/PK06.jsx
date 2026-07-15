// ПК6 — Blok 9 «Qo'shish va ayirish 100 gacha» nazorati (geyt). 8 topshiriq, ≥80% → o'tdi.
// STATUS: ◐ на согласовании. YANGI SHARTLI: har savol alohida mustaqil jsx (q/ papkada).
import React from 'react';
import PKHost from '../PKHost.jsx';
import PK06_01 from './PK06_01.jsx';
import PK06_02 from './PK06_02.jsx';
import PK06_03 from './PK06_03.jsx';
import PK06_04 from './PK06_04.jsx';
import PK06_05 from './PK06_05.jsx';
import PK06_06 from './PK06_06.jsx';
import PK06_07 from './PK06_07.jsx';
import PK06_08 from './PK06_08.jsx';

const TASKS = [
  { C: PK06_01, topic: 'Yumaloq o\'nliklar' },
  { C: PK06_02, topic: 'Yumaloq o\'nliklar' },
  { C: PK06_03, topic: '2 xonali + 1 xonali' },
  { C: PK06_04, topic: '2 xonali + 1 xonali' },
  { C: PK06_05, topic: '2 xonali + 2 xonali' },
  { C: PK06_06, topic: '2 xonali + 2 xonali' },
  { C: PK06_07, topic: '2 xonali − 2 xonali' },
  { C: PK06_08, topic: '100 dan ayirish' },
];

export default function PK06() {
  return <PKHost title="ПК6 — Nazorat" block="Blok 9 · ± 100 gacha" tasks={TASKS} passPct={80} />;
}
