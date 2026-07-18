// Dars10 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D10_01 from './D10_01.jsx';
import D10_04 from './D10_04.jsx';
import D10_08 from './D10_08.jsx';
import D10_02 from './D10_02.jsx';
import D10_05 from './D10_05.jsx';
import D10_09 from './D10_09.jsx';
import D10_03 from './D10_03.jsx';
import D10_06 from './D10_06.jsx';
import D10_10 from './D10_10.jsx';
import D10_07 from './D10_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Kassetani oching", C: D10_01 },
  { id: '04', label: "🟡 Qarz kerakmi", C: D10_04 },
  { id: '08', label: "🔴 Yashirin birlik", C: D10_08 },
  { id: '02', label: "🟢 Qarzdan keyin birlik", C: D10_02 },
  { id: '05', label: "🔴 Qarz bilan yeching", C: D10_05 },
  { id: '09', label: "🔴 Ortiqchasini toping", C: D10_09 },
  { id: '03', label: "🟢 Qarzdan keyin o'nlik", C: D10_03 },
  { id: '06', label: "🟡 Tekshiring", C: D10_06 },
  { id: '10', label: "🔴 Qarz qayerdan", C: D10_10 },
  { id: '07', label: "🟡 Masala", C: D10_07 },
];

const TITLE = "Dars 10 · Ayirish (o'tishli)";

export default function Dars10Practice() {
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
