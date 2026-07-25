// Dars33 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D33_01 from './D33_01.jsx';
import D33_02 from './D33_02.jsx';
import D33_03 from './D33_03.jsx';
import D33_04 from './D33_04.jsx';
import D33_05 from './D33_05.jsx';
import D33_06 from './D33_06.jsx';
import D33_07 from './D33_07.jsx';
import D33_08 from './D33_08.jsx';
import D33_09 from './D33_09.jsx';
import D33_10 from './D33_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 Soatni o‘qish", C: D33_01 },
  { id: '02', label: "🟢 1 soat = minut", C: D33_02 },
  { id: '03', label: "🟢 Strelkalar", C: D33_03 },
  { id: '04', label: "🟡 Soatni qo‘yish", C: D33_04 },
  { id: '05', label: "🟡 15 minut", C: D33_05 },
  { id: '06', label: "🟡 4:30 o‘qish", C: D33_06 },
  { id: '07', label: "🟡 Yarim soat", C: D33_07 },
  { id: '08', label: "🔴 +1 soat", C: D33_08 },
  { id: '09', label: "🔴 Masala", C: D33_09 },
  { id: '10', label: "🔴 12:00", C: D33_10 },
];

const TITLE = "Dars 33 · Vaqt: soat, minut";

export default function Dars33Practice() {
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
