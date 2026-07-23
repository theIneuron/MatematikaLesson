// Dars 7 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D07_01 from './D07_01.jsx';
import D07_04 from './D07_04.jsx';
import D07_08 from './D07_08.jsx';
import D07_02 from './D07_02.jsx';
import D07_05 from './D07_05.jsx';
import D07_09 from './D07_09.jsx';
import D07_03 from './D07_03.jsx';
import D07_06 from './D07_06.jsx';
import D07_10 from './D07_10.jsx';
import D07_07 from './D07_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Ustunda qo'sh", C: D07_01 },
  { id: '04', label: "🟡 To'g'ri yozuv", C: D07_04 },
  { id: '08', label: "🔴 Ikki o'tkazish", C: D07_08 },
  { id: '02', label: "🟢 Moslashtir", C: D07_02 },
  { id: '05', label: "🟡 O'tkazish bilan", C: D07_05 },
  { id: '09', label: "🔴 Masala (do'kon)", C: D07_09 },
  { id: '03', label: "🟢 Ustunda ayir", C: D07_03 },
  { id: '06', label: "🟡 Qarz olish", C: D07_06 },
  { id: '10', label: "🔴 Ikki qarz", C: D07_10 },
  { id: '07', label: "🟡 Xatoni top", C: D07_07 },
];

const TITLE = "Dars 7 · Yozma qo'shish va ayirish";

export default function Dars07Practice() {
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
