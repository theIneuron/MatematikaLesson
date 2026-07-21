// Dars29 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D29_01 from './D29_01.jsx';
import D29_02 from './D29_02.jsx';
import D29_03 from './D29_03.jsx';
import D29_04 from './D29_04.jsx';
import D29_05 from './D29_05.jsx';
import D29_06 from './D29_06.jsx';
import D29_07 from './D29_07.jsx';
import D29_08 from './D29_08.jsx';
import D29_09 from './D29_09.jsx';
import D29_10 from './D29_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 Uchburchak yasash", C: D29_01 },
  { id: '02', label: "🟢 Kvadrat nuqtalari", C: D29_02 },
  { id: '03', label: "🟢 Ochiq shakl", C: D29_03 },
  { id: '04', label: "🟡 Kvadrat yasash", C: D29_04 },
  { id: '05', label: "🟡 Qaysi yopiq", C: D29_05 },
  { id: '06', label: "🟡 Shakl naqshi", C: D29_06 },
  { id: '07', label: "🟡 Qaysi ochiq", C: D29_07 },
  { id: '08', label: "🔴 To‘g‘ri to‘rtburchak", C: D29_08 },
  { id: '09', label: "🔴 Masala", C: D29_09 },
  { id: '10', label: "🔴 Umumlashtirish", C: D29_10 },
];

const TITLE = "Dars 29 · Shakl yasash";

export default function Dars29Practice() {
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
