// Dars15 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D15_01 from './D15_01.jsx';
import D15_02 from './D15_02.jsx';
import D15_03 from './D15_03.jsx';
import D15_04 from './D15_04.jsx';
import D15_05 from './D15_05.jsx';
import D15_06 from './D15_06.jsx';
import D15_07 from './D15_07.jsx';
import D15_08 from './D15_08.jsx';
import D15_09 from './D15_09.jsx';
import D15_10 from './D15_10.jsx';

const ITEMS = [
  { id: '01', label: "🟢 Ikkilash", C: D15_01 },
  { id: '02', label: "🟡 ×5 naqshi", C: D15_02 },
  { id: '03', label: "🟡 Juftlab ulash", C: D15_03 },
  { id: '04', label: "🟢 Tartiblash", C: D15_04 },
  { id: '05', label: "🟡 Raqamdan yasash", C: D15_05 },
  { id: '06', label: "🟡 Jadval katagi", C: D15_06 },
  { id: '07', label: "🟡 Ortiqchasini top", C: D15_07 },
  { id: '08', label: "🟢 To'g'ri/Noto'g'ri", C: D15_08 },
  { id: '09', label: "🔴 Yashirin ko'paytuvchi", C: D15_09 },
  { id: '10', label: "🔴 Xatoni top", C: D15_10 },
];

const TITLE = "Dars 15";

export default function Dars15Practice() {
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
