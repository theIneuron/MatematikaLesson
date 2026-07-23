// Dars 5 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D05_01 from './D05_01.jsx';
import D05_04 from './D05_04.jsx';
import D05_08 from './D05_08.jsx';
import D05_02 from './D05_02.jsx';
import D05_05 from './D05_05.jsx';
import D05_09 from './D05_09.jsx';
import D05_03 from './D05_03.jsx';
import D05_06 from './D05_06.jsx';
import D05_10 from './D05_10.jsx';
import D05_07 from './D05_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Chiziqda top", C: D05_01 },
  { id: '04', label: "🟡 Yumaloq yuzlik", C: D05_04 },
  { id: '08', label: "🔴 Xatoni top", C: D05_08 },
  { id: '02', label: "🟢 Yumaloq o'nlik", C: D05_02 },
  { id: '05', label: "🟡 O'rtadagi son", C: D05_05 },
  { id: '09', label: "🔴 Ikki qadam", C: D05_09 },
  { id: '03', label: "🟢 Moslashtir", C: D05_03 },
  { id: '06', label: "🟡 Yuzlikni ter", C: D05_06 },
  { id: '10', label: "🔴 Taxminiy hisob", C: D05_10 },
  { id: '07', label: "🟡 350 qayoqqa?", C: D05_07 },
];

const TITLE = "Dars 5 · Eng yaqin yumaloq son";

export default function Dars05Practice() {
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
