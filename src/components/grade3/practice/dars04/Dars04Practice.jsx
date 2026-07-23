// Dars 4 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D04_01 from './D04_01.jsx';
import D04_04 from './D04_04.jsx';
import D04_08 from './D04_08.jsx';
import D04_02 from './D04_02.jsx';
import D04_05 from './D04_05.jsx';
import D04_09 from './D04_09.jsx';
import D04_03 from './D04_03.jsx';
import D04_06 from './D04_06.jsx';
import D04_10 from './D04_10.jsx';
import D04_07 from './D04_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Belgini qo'y", C: D04_01 },
  { id: '04', label: "🟡 987 va 879", C: D04_04 },
  { id: '08', label: "🔴 519 va 591", C: D04_08 },
  { id: '02', label: "🟢 348 va 523", C: D04_02 },
  { id: '05', label: "🟡 Tengmi?", C: D04_05 },
  { id: '09', label: "🔴 Masala (minora)", C: D04_09 },
  { id: '03', label: "🟢 Qaysi baland?", C: D04_03 },
  { id: '06', label: "🟡 600 va 599", C: D04_06 },
  { id: '10', label: "🔴 Eng katta son", C: D04_10 },
  { id: '07', label: "🟡 Tartibla", C: D04_07 },
];

const TITLE = "Dars 4 · Uch xonali sonlarni taqqoslash";

export default function Dars04Practice() {
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
