// Dars17 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D17_01 from './D17_01.jsx';
import D17_04 from './D17_04.jsx';
import D17_08 from './D17_08.jsx';
import D17_02 from './D17_02.jsx';
import D17_06 from './D17_06.jsx';
import D17_09 from './D17_09.jsx';
import D17_03 from './D17_03.jsx';
import D17_05 from './D17_05.jsx';
import D17_07 from './D17_07.jsx';
import D17_10 from './D17_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Antennalarni sana", C: D17_01 },
  { id: '04', label: "🟡 Skip-sanash", C: D17_04 },
  { id: '08', label: "🔴 Savatlarga ajrat", C: D17_08 },
  { id: '02', label: "🟢 8 × 5", C: D17_02 },
  { id: '06', label: "🟡 To'qqiz sirri", C: D17_06 },
  { id: '09', label: "🔴 Masala", C: D17_09 },
  { id: '03', label: "🟢 Bo'sh katak", C: D17_03 },
  { id: '05', label: "🟡 Moslash", C: D17_05 },
  { id: '07', label: "🟡 To'g'rimi?", C: D17_07 },
  { id: '10', label: "🔴 Javobni ter", C: D17_10 },
];

const TITLE = "Dars 17 · ×8 va ×9 jadvali";

export default function Dars17Practice() {
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
