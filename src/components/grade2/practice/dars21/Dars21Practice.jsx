// Dars21 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D21_01 from './D21_01.jsx';
import D21_04 from './D21_04.jsx';
import D21_08 from './D21_08.jsx';
import D21_02 from './D21_02.jsx';
import D21_05 from './D21_05.jsx';
import D21_09 from './D21_09.jsx';
import D21_03 from './D21_03.jsx';
import D21_06 from './D21_06.jsx';
import D21_10 from './D21_10.jsx';
import D21_07 from './D21_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 Son o‘qi ÷2", C: D21_01 },
  { id: '04', label: "🟡 Son o‘qi ÷3", C: D21_04 },
  { id: '08', label: "🔴 Masala", C: D21_08 },
  { id: '02', label: "🟢 Jadval ÷2", C: D21_02 },
  { id: '05', label: "🟡 Jadval ÷3", C: D21_05 },
  { id: '09', label: "🔴 Yashirin son", C: D21_09 },
  { id: '03', label: "🟢 Yarmi", C: D21_03 },
  { id: '06', label: "🟡 Bir xil javob", C: D21_06 },
  { id: '10', label: "🔴 Xatoni top", C: D21_10 },
  { id: '07', label: "🟡 To‘g‘ri qator", C: D21_07 },
];

const TITLE = "Dars 21 · 2 ga va 3 ga bo'lish";

export default function Dars21Practice() {
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
