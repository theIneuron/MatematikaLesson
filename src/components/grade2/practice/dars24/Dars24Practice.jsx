// Dars24 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D24_01 from './D24_01.jsx';
import D24_04 from './D24_04.jsx';
import D24_08 from './D24_08.jsx';
import D24_02 from './D24_02.jsx';
import D24_05 from './D24_05.jsx';
import D24_09 from './D24_09.jsx';
import D24_03 from './D24_03.jsx';
import D24_06 from './D24_06.jsx';
import D24_10 from './D24_10.jsx';
import D24_07 from './D24_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 Teng ulash", C: D24_01 },
  { id: '04', label: "🟡 Qaysi amal? ×", C: D24_04 },
  { id: '08', label: "🔴 Qaysi bo‘lish?", C: D24_08 },
  { id: '02', label: "🟢 Guruhlash", C: D24_02 },
  { id: '05', label: "🟡 Kalit so‘z", C: D24_05 },
  { id: '09', label: "🔴 Masala (katta)", C: D24_09 },
  { id: '03', label: "🟢 Qaysi amal? ÷", C: D24_03 },
  { id: '06', label: "🟡 Ifodani yig‘", C: D24_06 },
  { id: '10', label: "🔴 Tuzoqli masala", C: D24_10 },
  { id: '07', label: "🟡 Javobni ter", C: D24_07 },
];

const TITLE = "Dars 24 · Bo'lishga masalalar";

export default function Dars24Practice() {
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
