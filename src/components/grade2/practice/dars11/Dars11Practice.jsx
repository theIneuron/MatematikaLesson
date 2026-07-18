// Dars11 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D11_01 from './D11_01.jsx';
import D11_04 from './D11_04.jsx';
import D11_08 from './D11_08.jsx';
import D11_02 from './D11_02.jsx';
import D11_05 from './D11_05.jsx';
import D11_09 from './D11_09.jsx';
import D11_03 from './D11_03.jsx';
import D11_06 from './D11_06.jsx';
import D11_10 from './D11_10.jsx';
import D11_07 from './D11_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Joylang (25)", C: D11_01 },
  { id: '04', label: "🟡 Bo'sh katak", C: D11_04 },
  { id: '08', label: "🔴 Ustun almashishi", C: D11_08 },
  { id: '02', label: "🟢 Bir xonali", C: D11_02 },
  { id: '05', label: "🟡 Yoyilgan shakl", C: D11_05 },
  { id: '09', label: "🔴 Masala", C: D11_09 },
  { id: '03', label: "🟢 Qaysi ustun", C: D11_03 },
  { id: '06', label: "🟡 To'g'ri tuzilma", C: D11_06 },
  { id: '10', label: "🔴 Ustundagi raqamlar", C: D11_10 },
  { id: '07', label: "🟡 Ayirishni tuzing", C: D11_07 },
];

const TITLE = "Dars 11 · Stolbik tuzish";

export default function Dars11Practice() {
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
