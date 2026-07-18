// Dars06 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D06_01 from './D06_01.jsx';
import D06_04 from './D06_04.jsx';
import D06_08 from './D06_08.jsx';
import D06_02 from './D06_02.jsx';
import D06_05 from './D06_05.jsx';
import D06_09 from './D06_09.jsx';
import D06_03 from './D06_03.jsx';
import D06_06 from './D06_06.jsx';
import D06_10 from './D06_10.jsx';
import D06_07 from './D06_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Kemani o'qing", C: D06_01 },
  { id: '04', label: "🟡 Masofa", C: D06_04 },
  { id: '08', label: "🔴 Bo'lakni belgilang", C: D06_08 },
  { id: '02', label: "🟢 Qaysi belgi", C: D06_02 },
  { id: '05', label: "🟡 O'rtasini toping", C: D06_05 },
  { id: '09', label: "🔴 Yashirin son", C: D06_09 },
  { id: '03', label: "🟢 Ikki belgi orasi", C: D06_03 },
  { id: '06', label: "🟡 Yo'nalish", C: D06_06 },
  { id: '10', label: "🔴 Teng ikkiga bo'ling", C: D06_10 },
  { id: '07', label: "🟡 Sakrash uzunligi", C: D06_07 },
];

const TITLE = "Dars 6 · Son o'qi";

export default function Dars06Practice() {
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
