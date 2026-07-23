// Dars 1 (3-sinf) amaliyoti — 10 topshiriq, grade2 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D01_01 from './D01_01.jsx';
import D01_04 from './D01_04.jsx';
import D01_08 from './D01_08.jsx';
import D01_02 from './D01_02.jsx';
import D01_05 from './D01_05.jsx';
import D01_09 from './D01_09.jsx';
import D01_03 from './D01_03.jsx';
import D01_06 from './D01_06.jsx';
import D01_10 from './D01_10.jsx';
import D01_07 from './D01_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik aralash — 🟢🟡🔴 navbatlashadi.
const ITEMS = [
  { id: '01', label: "🟢 Nechta yuzlik?", C: D01_01 },
  { id: '04', label: "🟡 Sonni ter", C: D01_04 },
  { id: '08', label: "🔴 Razryad savatlari", C: D01_08 },
  { id: '02', label: "🟢 Sonni yig'", C: D01_02 },
  { id: '05', label: "🟡 Son o'qi", C: D01_05 },
  { id: '09', label: "🔴 Oldingi son", C: D01_09 },
  { id: '03', label: "🟢 Rasmni o'qi", C: D01_03 },
  { id: '06', label: "🟡 Nechta o'nlik?", C: D01_06 },
  { id: '10', label: "🔴 Minglik blok", C: D01_10 },
  { id: '07', label: "🟡 Raqam qiymati", C: D01_07 },
];

const TITLE = "Dars 1 · Yuzliklar, o'nliklar va birliklar";

export default function Dars01Practice() {
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
