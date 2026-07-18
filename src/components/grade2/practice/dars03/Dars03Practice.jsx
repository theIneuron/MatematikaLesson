// Dars03 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D03_01 from './D03_01.jsx';
import D03_05 from './D03_05.jsx';
import D03_08 from './D03_08.jsx';
import D03_02 from './D03_02.jsx';
import D03_06 from './D03_06.jsx';
import D03_09 from './D03_09.jsx';
import D03_03 from './D03_03.jsx';
import D03_07 from './D03_07.jsx';
import D03_10 from './D03_10.jsx';
import D03_04 from './D03_04.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Ko'p tanlov", C: D03_01 },
  { id: '05', label: "🟡 Teng juftlar", C: D03_05 },
  { id: '08', label: "🔴 Abak", C: D03_08 },
  { id: '02', label: "🟢 Ikki katak", C: D03_02 },
  { id: '06', label: "🟡 Tenglama yig‘ing", C: D03_06 },
  { id: '09', label: "🔴 Qism-butun", C: D03_09 },
  { id: '03', label: "🟢 Yorliq joylash", C: D03_03 },
  { id: '07', label: "🟡 Kerakli qismlar", C: D03_07 },
  { id: '10', label: "🔴 Tartiblash", C: D03_10 },
  { id: '04', label: "🟡 Yoqilg'i shkalasi", C: D03_04 },
];

const TITLE = "Dars 3 · Sonning razryad tarkibi";

export default function Dars03Practice() {
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
