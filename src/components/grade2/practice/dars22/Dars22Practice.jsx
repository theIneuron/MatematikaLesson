// Dars22 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D22_01 from './D22_01.jsx';
import D22_04 from './D22_04.jsx';
import D22_08 from './D22_08.jsx';
import D22_02 from './D22_02.jsx';
import D22_05 from './D22_05.jsx';
import D22_09 from './D22_09.jsx';
import D22_03 from './D22_03.jsx';
import D22_06 from './D22_06.jsx';
import D22_10 from './D22_10.jsx';
import D22_07 from './D22_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 Teng ulash ÷4", C: D22_01 },
  { id: '04', label: "🟡 Jadval ÷5", C: D22_04 },
  { id: '08', label: "🔴 Masala", C: D22_08 },
  { id: '02', label: "🟢 Nechta vagoncha", C: D22_02 },
  { id: '05', label: "🟡 Ortiqchani top", C: D22_05 },
  { id: '09', label: "🔴 Aralash jadval", C: D22_09 },
  { id: '03', label: "🟢 Jadval ÷4", C: D22_03 },
  { id: '06', label: "🟡 Javobni ter", C: D22_06 },
  { id: '10', label: "🔴 To‘g‘rimi?", C: D22_10 },
  { id: '07', label: "🟡 Yashirin bo‘luvchi", C: D22_07 },
];

const TITLE = "Dars 22 · 4 ga va 5 ga bo'lish";

export default function Dars22Practice() {
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
