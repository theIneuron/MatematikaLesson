// Dars19 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D19_01 from './D19_01.jsx';
import D19_04 from './D19_04.jsx';
import D19_08 from './D19_08.jsx';
import D19_02 from './D19_02.jsx';
import D19_05 from './D19_05.jsx';
import D19_09 from './D19_09.jsx';
import D19_03 from './D19_03.jsx';
import D19_06 from './D19_06.jsx';
import D19_07 from './D19_07.jsx';
import D19_10 from './D19_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Teng ulash", C: D19_01 },
  { id: '04', label: "🟡 Moslash", C: D19_04 },
  { id: '08', label: "🔴 Masala", C: D19_08 },
  { id: '02', label: "🟢 12 ÷ 3", C: D19_02 },
  { id: '05', label: "🟡 Teng ulanganmi?", C: D19_05 },
  { id: '09', label: "🔴 Xatoni top", C: D19_09 },
  { id: '03', label: "🟢 Bo‘sh katak", C: D19_03 },
  { id: '06', label: "🟡 5 sandiqqa ul", C: D19_06 },
  { id: '07', label: "🟡 Urug‘", C: D19_07 },
  { id: '10', label: "🔴 Javobni ter", C: D19_10 },
];

const TITLE = "Dars 19 · Bo'lish ma'nosi (teng ulash)";

export default function Dars19Practice() {
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
