// Dars02 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D02_01 from './D02_01.jsx';
import D02_05 from './D02_05.jsx';
import D02_08 from './D02_08.jsx';
import D02_02 from './D02_02.jsx';
import D02_06 from './D02_06.jsx';
import D02_09 from './D02_09.jsx';
import D02_03 from './D02_03.jsx';
import D02_07 from './D02_07.jsx';
import D02_10 from './D02_10.jsx';
import D02_04 from './D02_04.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Kodni o‘qing", C: D02_01 },
  { id: '05', label: "🟡 Moslash", C: D02_05 },
  { id: '08', label: "🔴 Marshrut", C: D02_08 },
  { id: '02', label: "🟢 Kodni yozing", C: D02_02 },
  { id: '06', label: "🟡 Kattasi qaysi", C: D02_06 },
  { id: '09', label: "🔴 Tryumlar", C: D02_09 },
  { id: '03', label: "🟢 Qaysi raqam", C: D02_03 },
  { id: '07', label: "🟡 Xatoni toping", C: D02_07 },
  { id: '10', label: "🔴 To'g'rimi?", C: D02_10 },
  { id: '04', label: "🟡 Bo'sh katak", C: D02_04 },
];

const TITLE = "Dars 2 · Sonlarni o'qish va yozish";

export default function Dars02Practice() {
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
