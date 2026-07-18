// Dars09 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D09_01 from './D09_01.jsx';
import D09_04 from './D09_04.jsx';
import D09_08 from './D09_08.jsx';
import D09_02 from './D09_02.jsx';
import D09_05 from './D09_05.jsx';
import D09_09 from './D09_09.jsx';
import D09_03 from './D09_03.jsx';
import D09_06 from './D09_06.jsx';
import D09_10 from './D09_10.jsx';
import D09_07 from './D09_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 O'tkazing", C: D09_01 },
  { id: '04', label: "🟡 Guruhlang", C: D09_04 },
  { id: '08', label: "🔴 Yashirin birlik", C: D09_08 },
  { id: '02', label: "🟢 Nechta ko'chadi", C: D09_02 },
  { id: '05', label: "🟡 Ko'chuvchi bilan", C: D09_05 },
  { id: '09', label: "🔴 Ortiqchasini toping", C: D09_09 },
  { id: '03', label: "🟢 Ajrating", C: D09_03 },
  { id: '06', label: "🟡 To'g'ri yechim", C: D09_06 },
  { id: '10', label: "🔴 Ko'chuvchi qayerga", C: D09_10 },
  { id: '07', label: "🟡 Masala", C: D09_07 },
];

const TITLE = "Dars 9 · Qo'shish (o'tishli)";

export default function Dars09Practice() {
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
