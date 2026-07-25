// Dars34 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D34_01 from './D34_01.jsx';
import D34_02 from './D34_02.jsx';
import D34_03 from './D34_03.jsx';
import D34_04 from './D34_04.jsx';
import D34_05 from './D34_05.jsx';
import D34_06 from './D34_06.jsx';
import D34_07 from './D34_07.jsx';
import D34_08 from './D34_08.jsx';
import D34_09 from './D34_09.jsx';
import D34_10 from './D34_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tartib monolitdagi kabi (osondan qiyinga).
const ITEMS = [
  { id: '01', label: "🟢 1 hafta = kun", C: D34_01 },
  { id: '02', label: "🟢 Dushanbadan keyin", C: D34_02 },
  { id: '03', label: "🟢 Kunlarni tartibla", C: D34_03 },
  { id: '04', label: "🟡 1 yil = oy", C: D34_04 },
  { id: '05', label: "🟡 Sanani top", C: D34_05 },
  { id: '06', label: "🟡 Dam olish kunlari", C: D34_06 },
  { id: '07', label: "🟡 Yanvardan keyin", C: D34_07 },
  { id: '08', label: "🔴 2 kundan keyin", C: D34_08 },
  { id: '09', label: "🔴 Masala", C: D34_09 },
  { id: '10', label: "🔴 Oylarni tartibla", C: D34_10 },
];

const TITLE = "Dars 34 · Kalendar";

export default function Dars34Practice() {
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
