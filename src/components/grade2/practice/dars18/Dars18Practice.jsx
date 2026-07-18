// Dars18 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D18_01 from './D18_01.jsx';
import D18_04 from './D18_04.jsx';
import D18_08 from './D18_08.jsx';
import D18_02 from './D18_02.jsx';
import D18_05 from './D18_05.jsx';
import D18_09 from './D18_09.jsx';
import D18_03 from './D18_03.jsx';
import D18_06 from './D18_06.jsx';
import D18_07 from './D18_07.jsx';
import D18_10 from './D18_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Aylantir · teng?", C: D18_01 },
  { id: '04', label: "🟡 Teng juftlar", C: D18_04 },
  { id: '08', label: "🔴 Jadval katagi", C: D18_08 },
  { id: '02', label: "🟢 Bo‘sh katak", C: D18_02 },
  { id: '05', label: "🟡 Qutini aylantir", C: D18_05 },
  { id: '09', label: "🔴 Kimda ko‘p", C: D18_09 },
  { id: '03', label: "🟢 Almashtir", C: D18_03 },
  { id: '06', label: "🔴 Xatoni top", C: D18_06 },
  { id: '07', label: "🟡 Bo‘sh katak 2", C: D18_07 },
  { id: '10', label: "🔴 Guruhla", C: D18_10 },
];

const TITLE = "Dars 18 · Mustahkamlash — o'rin almashish (a × b = b × a)";

export default function Dars18Practice() {
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
