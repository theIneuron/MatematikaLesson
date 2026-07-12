// Dars33 amaliyoti — 10 topshiriq (SHAKLLAR — Блок 7 geometriya).
// YADRO: doira/kvadrat/uchburchak/to'rtburchak; burchaklar soni; simmetriya (ko'zgu); hajmli shakllar (shar/kub/silindr, tekis↔hajmli).
// Mexanika: P11 top-bos, P10 saralash, burchak-sanash, simmetrik-top, multi, hajmli, ko'zgu-to'ldirish. Sonsiz — tanish. Geometriya doskasi.
// Ramp: 2🟢 / 4🟡 / 4🔴 (recognition-based).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D33_01 from './D33_01.jsx';
import D33_02 from './D33_02.jsx';
import D33_03 from './D33_03.jsx';
import D33_04 from './D33_04.jsx';
import D33_05 from './D33_05.jsx';
import D33_06 from './D33_06.jsx';
import D33_07 from './D33_07.jsx';
import D33_08 from './D33_08.jsx';
import D33_09 from './D33_09.jsx';
import D33_10 from './D33_10.jsx';

const ITEMS = [
  { id: '01', label: '1 · Doira', C: D33_01 },          // find_circle (P11) 🟢
  { id: '02', label: '2 · Uchburchak', C: D33_02 },     // find_triangle (P11) 🟢
  { id: '03', label: '3 · Kvadrat', C: D33_03 },        // find_square (P11, M1 to'rtburchak-tuzoq) 🟡
  { id: '04', label: '4 · Burchaklar', C: D33_04 },     // angle_count 🟡
  { id: '05', label: '5 · Saralash', C: D33_05 },       // sort by corners (P10) 🟡
  { id: '06', label: '6 · Simmetrik', C: D33_06 },      // find_symmetric (M4) 🟡
  { id: '07', label: '7 · Saralash 3', C: D33_07 },     // sort_3 shakl (P10) 🔴
  { id: '08', label: '8 · To\'rtburchak', C: D33_08 },  // multi to'rtburchaklar 🔴
  { id: '09', label: '9 · Shar', C: D33_09 },           // solid/flat (M5, hajmli) 🔴
  { id: '10', label: '10 · Ko\'zgu', C: D33_10 },       // symmetry build (ko'zgu-to'ldirish) 🔴
];

export default function Dars33Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 33 amaliyoti — 10 topshiriq (shakllar)</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PracticeHost key={q.id} Question={q.C} />
      </div>
    </div>
  );
}
