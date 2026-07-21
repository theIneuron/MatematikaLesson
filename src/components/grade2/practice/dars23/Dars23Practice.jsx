// Dars23 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D23_01 from './D23_01.jsx';
import D23_04 from './D23_04.jsx';
import D23_08 from './D23_08.jsx';
import D23_02 from './D23_02.jsx';
import D23_05 from './D23_05.jsx';
import D23_09 from './D23_09.jsx';
import D23_03 from './D23_03.jsx';
import D23_06 from './D23_06.jsx';
import D23_10 from './D23_10.jsx';
import D23_07 from './D23_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 Izla ÷6", C: D23_01 },
  { id: '04', label: "🟡 Izla ÷8", C: D23_04 },
  { id: '08', label: "🔴 Masala", C: D23_08 },
  { id: '02', label: "🟢 Izla ÷7", C: D23_02 },
  { id: '05', label: "🟡 Izla ÷9", C: D23_05 },
  { id: '09', label: "🔴 Yashirin son", C: D23_09 },
  { id: '03', label: "🟢 Oila", C: D23_03 },
  { id: '06', label: "🟡 Javobni ter", C: D23_06 },
  { id: '10', label: "🔴 Izla ÷9 (katta)", C: D23_10 },
  { id: '07', label: "🟡 To‘g‘ri bo‘linishlar", C: D23_07 },
];

const TITLE = "Dars 23 · 6, 7, 8, 9 ga bo'lish";

export default function Dars23Practice() {
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
