// Dars36 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D36_01 from './D36_01.jsx';
import D36_02 from './D36_02.jsx';
import D36_03 from './D36_03.jsx';
import D36_04 from './D36_04.jsx';
import D36_05 from './D36_05.jsx';
import D36_06 from './D36_06.jsx';
import D36_07 from './D36_07.jsx';
import D36_08 from './D36_08.jsx';
import D36_09 from './D36_09.jsx';
import D36_10 from './D36_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 Vaqt (birlikli)", C: D36_01 },
  { id: '02', label: "🟢 Uzunlik", C: D36_02 },
  { id: '03', label: "🟢 Pul", C: D36_03 },
  { id: '04', label: "🟡 Pul (birlikli)", C: D36_04 },
  { id: '05', label: "🟡 Vaqt 9:30", C: D36_05 },
  { id: '06', label: "🟡 Uzunlik +", C: D36_06 },
  { id: '07', label: "🟡 Xatoni top", C: D36_07 },
  { id: '08', label: "🔴 Pul masala", C: D36_08 },
  { id: '09', label: "🔴 Vaqt masala", C: D36_09 },
  { id: '10', label: "🔴 Uzunlik (birlikli)", C: D36_10 },
];

const TITLE = "Dars 36 · Kattaliklarga masala";

export default function Dars36Practice() {
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif", whiteSpace: 'nowrap',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <div style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', padding: '12px', borderBottom: '1px solid #eef0f4' }}>
        <strong style={{ fontSize: 13.5, color: '#1f2430', width: '100%' }}>{TITLE}</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {i + 1}. {item.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PracticeHost key={q.id} Question={q.C} title={TITLE} />
      </div>
    </div>
  );
}
