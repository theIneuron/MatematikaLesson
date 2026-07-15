// Dars02 amaliyoti — 10 topshiriq. Mavzu: ko'p xonali sonlarni taqqoslash va yaxlitlash.
// Syujet: rekordlar / geografiya. Darslik §5 (taqqoslash) va §38 (yaxlitlash).
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D02_01 from './D02_01.jsx';
import D02_02 from './D02_02.jsx';
import D02_03 from './D02_03.jsx';
import D02_04 from './D02_04.jsx';
import D02_05 from './D02_05.jsx';
import D02_06 from './D02_06.jsx';
import D02_07 from './D02_07.jsx';
import D02_08 from './D02_08.jsx';
import D02_09 from './D02_09.jsx';
import D02_10 from './D02_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: '1 · Turli xonali', C: D02_01 },     // turli xonali taqqoslash 🟢 compare_digits
  { id: '02', label: "2 · O'nlargacha", C: D02_02 },      // o'nlargacha yaxlitlash 🟢 round_ten
  { id: '03', label: '3 · Bir xil xonali', C: D02_03 },   // bir xil xonali taqqoslash 🟡 compare_same
  { id: '04', label: '4 · Yuzlargacha', C: D02_04 },      // yuzlargacha yaxlitlash 🟡 round_hundred
  { id: '05', label: '5 · Minglargacha', C: D02_05 },     // minglargacha yaxlitlash 🟡 round_thousand
  { id: '06', label: '6 · Topishmoq', C: D02_06 },        // son topishmog'i 🟡 clue_compare
  { id: '07', label: '7 · Yirik sonlar', C: D02_07 },     // yirik sonlarni taqqoslash 🔴 compare_big
  { id: '08', label: '8 · Aholi', C: D02_08 },            // milliongacha yaxlitlash 🔴 round_big_context
  { id: '09', label: '9 · Xato top', C: D02_09 },         // to'g'ri yaxlitlashni topish 🔴 round_error_check
  { id: '10', label: '10 · Yulduzchali', C: D02_10 },     // yulduzchali taqqoslash 🔴 star_compare
];

export default function Dars02Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#2563eb' : '#d6dae3'),
    background: active ? '#2563eb' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif", whiteSpace: 'nowrap',
  });

  return (
    <div className="pq-fixroot" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* MOBIL_DESKTOP_MOSLASH.md naqshi: fixed root — body-skroll yo'q, tugma joyida;
          <640px da layout 390px etalon + zoom bilan real ekranga masshtablanadi. */}
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 2 amaliyoti — 10 topshiriq (taqqoslash va yaxlitlash)</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id} Question={q.C} />
      </div>
    </div>
  );
}
