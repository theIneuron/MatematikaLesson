// Dars12 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D12_01 from './D12_01.jsx';
import D12_02 from './D12_02.jsx';
import D12_03 from './D12_03.jsx';
import D12_04 from './D12_04.jsx';
import D12_05 from './D12_05.jsx';
import D12_06 from './D12_06.jsx';
import D12_07 from './D12_07.jsx';
import D12_08 from './D12_08.jsx';
import D12_09 from './D12_09.jsx';
import D12_10 from './D12_10.jsx';

const ITEMS = [
  { id: '01', label: "🟢 Ikki amal", C: D12_01 },
  { id: '02', label: "🟢 Qaysi birinchi", C: D12_02 },
  { id: '03', label: "🟡 Oraliq natija", C: D12_03 },
  { id: '04', label: "🟡 Mos ifoda", C: D12_04 },
  { id: '05', label: "🟡 Tartib", C: D12_05 },
  { id: '06', label: "🟡 Yashirin qo'shiluvchi", C: D12_06 },
  { id: '07', label: "🟡 Ikki amal javob", C: D12_07 },
  { id: '08', label: "🔴 Masala", C: D12_08 },
  { id: '09', label: "🟡 Xatoni top", C: D12_09 },
  { id: '10', label: "🔴 Qiyin masala", C: D12_10 },
];

const TITLE = "Dars 12 · Ikki amalli masala";

export default function Dars12Practice() {
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
