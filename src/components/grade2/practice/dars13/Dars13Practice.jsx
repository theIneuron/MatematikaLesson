// Dars13 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D13_01 from './D13_01.jsx';
import D13_02 from './D13_02.jsx';
import D13_08 from './D13_08.jsx';
import D13_03 from './D13_03.jsx';
import D13_06 from './D13_06.jsx';
import D13_09 from './D13_09.jsx';
import D13_04 from './D13_04.jsx';
import D13_05 from './D13_05.jsx';
import D13_07 from './D13_07.jsx';
import D13_10 from './D13_10.jsx';

const ITEMS = [
  { id: '01', label: "🟢 Massiv", C: D13_01 },
  { id: '02', label: "🟢 Ko'paytma yozuvi", C: D13_02 },
  { id: '08', label: "🔴 Masala", C: D13_08 },
  { id: '03', label: "🟢 Qo'shish yozuvi", C: D13_03 },
  { id: '06', label: "🟡 Juftlab ulash", C: D13_06 },
  { id: '09', label: "🔴 Yashirin ko'paytuvchi", C: D13_09 },
  { id: '04', label: "🟡 Massiv javob", C: D13_04 },
  { id: '05', label: "🟡 Teng qatorlar", C: D13_05 },
  { id: '07', label: "🟡 Xatoni top", C: D13_07 },
  { id: '10', label: "🔴 Mos ifoda", C: D13_10 },
];

const TITLE = "Dars 13";

export default function Dars13Practice() {
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
