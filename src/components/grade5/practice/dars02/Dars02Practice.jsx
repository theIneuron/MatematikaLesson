// Dars02 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: sonlarni taqqoslash va yaxlitlash.
// Darslik §5 (taqqoslash) va §38 (yaxlitlash) mashqlariga asoslangan. Syujet: rekordlar/geografiya.
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg · darslik manbasi.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz, aldov variantlar bilan.
const ITEMS = [
  { id: '01', label: '1 · Turli xonali', C: D02_01 },   // §5.2 compare_digits 🟢 (77417 > 8432)
  { id: '02', label: "2 · O'nlargacha", C: D02_02 },     // §38 round_ten 🟢 (238→240)
  { id: '03', label: '3 · Bir xil xonali', C: D02_03 },  // §5.3 compare_same 🟡 (36099 < 36106)
  { id: '04', label: '4 · Yuzlargacha', C: D02_04 },     // §38 round_hundred 🟡 (45849→45800)
  { id: '05', label: '5 · Minglargacha', C: D02_05 },    // §38 round_thousand 🟡 (1120738→1121000)
  { id: '06', label: '6 · Topishmoq', C: D02_06 },       // §5 Mashq 101 clue_compare 🟡 (305)
  { id: '07', label: '7 · Yirik sonlar', C: D02_07 },    // §5 Mashq 102g compare_big 🔴
  { id: '08', label: '8 · Aholi', C: D02_08 },           // §38 Mashq 850 round_big_context 🔴
  { id: '09', label: '9 · Xato top', C: D02_09 },        // §38 Mashq 851 round_error_check 🔴
  { id: '10', label: '10 · Yulduzchali', C: D02_10 },    // §5 Mashq 103 star_compare 🔴
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
