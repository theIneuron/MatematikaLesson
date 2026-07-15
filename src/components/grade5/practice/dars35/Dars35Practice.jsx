// Dars35 amaliyoti — 10 topshiriq. Mavzu: yuza (to'rtburchak va kvadrat).
// Hero mexanika = yuzani plitka bilan to'ldirish (ichi qatorma-qator to'ladi). Yuza = ICHI, chegara (perimetr) EMAS.
// Markaziy xato: tomonlarni qo'shish (perimetr) yuza deb olinadi. To'g'ri: S = a × b.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D35_01 from './D35_01.jsx';
import D35_02 from './D35_02.jsx';
import D35_03 from './D35_03.jsx';
import D35_04 from './D35_04.jsx';
import D35_05 from './D35_05.jsx';
import D35_06 from './D35_06.jsx';
import D35_07 from './D35_07.jsx';
import D35_08 from './D35_08.jsx';
import D35_09 from './D35_09.jsx';
import D35_10 from './D35_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Yuza nima', C: D35_01 },        // 🟢 MCQ · area_concept
  { id: '02', label: '2 · Plitkalar', C: D35_02 },        // 🟢 input 5×3=15 · area_rect
  { id: '03', label: "3 · Ha/Yo'q", C: D35_03 },          // 🟢 kvadrat 4×4=16 · area_square
  { id: '04', label: '4 · Taqqoslash', C: D35_04 },       // 🟡 A=2,5×4=10 · B=5×2=10 → teng · area_compare
  { id: '05', label: '5 · Yuzalarni moslash', C: D35_05 }, // 🔴 moslash · bir xil perimetr, har xil yuza · area_match
  { id: '06', label: '6 · Xatoni top', C: D35_06 },       // 🟡 atirgul maydoni · 5+3+5+3 perimetr xato · area_error
  { id: '07', label: '7 · Teskari', C: D35_07 },          // 🔴 24:6=4 · area_inverse
  { id: '08', label: '8 · Gilam', C: D35_08 },            // 🔴 4×3,5=14 · area_word
  { id: '09', label: '9 · Yuza+perimetr', C: D35_09 },    // 🔴 6×2 → 12 va 16 · area_vs_peri
  { id: '10', label: '10 · Kvadrat tomoni', C: D35_10 },  // 🔴 49→7 · area_square_inverse
];

export default function Dars35Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#d97706' : '#d6dae3'),
    background: active ? '#d97706' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 35 amaliyoti — 10 topshiriq (yuza)</strong>
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
