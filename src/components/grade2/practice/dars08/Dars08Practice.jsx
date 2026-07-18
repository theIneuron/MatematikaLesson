// Dars08 amaliyoti — 10 topshiriq, grade1/grade5 uslubidagi host.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost from '../PracticeHost.jsx';
import D08_01 from './D08_01.jsx';
import D08_04 from './D08_04.jsx';
import D08_08 from './D08_08.jsx';
import D08_02 from './D08_02.jsx';
import D08_05 from './D08_05.jsx';
import D08_09 from './D08_09.jsx';
import D08_03 from './D08_03.jsx';
import D08_06 from './D08_06.jsx';
import D08_10 from './D08_10.jsx';
import D08_07 from './D08_07.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): qiyinlik · tartib host'da aralashtirilgan.
const ITEMS = [
  { id: '01', label: "🟢 Olib tashlang", C: D08_01 },
  { id: '04', label: "🟡 Teskari tekshiruv", C: D08_04 },
  { id: '08', label: "🔴 Stolbik yeching", C: D08_08 },
  { id: '02', label: "🟢 Rollar", C: D08_02 },
  { id: '05', label: "🟡 Yashirin ayriluvchi", C: D08_05 },
  { id: '09', label: "🔴 Yetishmagan raqam", C: D08_09 },
  { id: '03', label: "🟢 To'g'rimi?", C: D08_03 },
  { id: '06', label: "🟡 Nechta qoldi", C: D08_06 },
  { id: '10', label: "🔴 Qarzsizni tanlang", C: D08_10 },
  { id: '07', label: "🟡 Fakt oilasi", C: D08_07 },
];

const TITLE = "Dars 8 · Ayirish (o'tishsiz)";

export default function Dars08Practice() {
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
