// Dars20 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D20_01 from './D20_01.jsx';
import D20_04 from './D20_04.jsx';
import D20_08 from './D20_08.jsx';
import D20_02 from './D20_02.jsx';
import D20_06 from './D20_06.jsx';
import D20_09 from './D20_09.jsx';
import D20_03 from './D20_03.jsx';
import D20_05 from './D20_05.jsx';
import D20_07 from './D20_07.jsx';
import D20_10 from './D20_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Oila a‘zosi", C: D20_01 },
  { id: '04', label: "🟡 Oila juftlari", C: D20_04 },
  { id: '08', label: "🔴 Bo‘sh katak", C: D20_08 },
  { id: '02', label: "🟢 Almashtir", C: D20_02 },
  { id: '06', label: "🟡 Oilani yig‘", C: D20_06 },
  { id: '09', label: "🔴 Masala", C: D20_09 },
  { id: '03', label: "🟢 To‘g‘rimi?", C: D20_03 },
  { id: '05', label: "🟡 Bo‘sh a‘zo", C: D20_05 },
  { id: '07', label: "🔴 Begonani top", C: D20_07 },
  { id: '10', label: "🔴 Javobni ter", C: D20_10 },
];

const TITLE = "Dars 20 · Ko'paytirish va bo'lish bog'lanishi";

export default function Dars20Practice() {
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
