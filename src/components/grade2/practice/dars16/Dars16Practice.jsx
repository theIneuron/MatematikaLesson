// Dars16 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D16_01 from './D16_01.jsx';
import D16_04 from './D16_04.jsx';
import D16_08 from './D16_08.jsx';
import D16_02 from './D16_02.jsx';
import D16_06 from './D16_06.jsx';
import D16_09 from './D16_09.jsx';
import D16_03 from './D16_03.jsx';
import D16_05 from './D16_05.jsx';
import D16_07 from './D16_07.jsx';
import D16_10 from './D16_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Teng guruhlar", C: D16_01 },
  { id: '04', label: "🟡 Skip-sanash", C: D16_04 },
  { id: '08', label: "🔴 Savatlarga ajrat", C: D16_08 },
  { id: '02', label: "🟢 6 × 4", C: D16_02 },
  { id: '06', label: "🟡 Ko'paytmani qur", C: D16_06 },
  { id: '09', label: "🔴 Masala", C: D16_09 },
  { id: '03', label: "🟢 Bo'sh katak", C: D16_03 },
  { id: '05', label: "🟡 Moslash", C: D16_05 },
  { id: '07', label: "🟡 To'g'rimi?", C: D16_07 },
  { id: '10', label: "🔴 Javobni ter", C: D16_10 },
];

const TITLE = "Dars 16 · ×6 va ×7 jadvali";

export default function Dars16Practice() {
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
