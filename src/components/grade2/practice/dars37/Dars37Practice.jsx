// Dars37 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D37_01 from './D37_01.jsx';
import D37_02 from './D37_02.jsx';
import D37_03 from './D37_03.jsx';
import D37_04 from './D37_04.jsx';
import D37_05 from './D37_05.jsx';
import D37_06 from './D37_06.jsx';
import D37_07 from './D37_07.jsx';
import D37_08 from './D37_08.jsx';
import D37_09 from './D37_09.jsx';
import D37_10 from './D37_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 Naqsh +2", C: D37_01 },
  { id: '02', label: "🟢 Toq son", C: D37_02 },
  { id: '03', label: "🟢 Shakl naqshi", C: D37_03 },
  { id: '04', label: "🟡 Naqsh +5", C: D37_04 },
  { id: '05', label: "🟡 Juft sonlar", C: D37_05 },
  { id: '06', label: "🟡 Kun ketma-ketligi", C: D37_06 },
  { id: '07', label: "🟡 Naqshni buzgan", C: D37_07 },
  { id: '08', label: "🔴 Naqsh +1,+2,+3", C: D37_08 },
  { id: '09', label: "🔴 Og‘irlik", C: D37_09 },
  { id: '10', label: "🔴 O‘nlab ortiqcha", C: D37_10 },
];

const TITLE = "Dars 37 · Mantiq";

export default function Dars37Practice() {
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
