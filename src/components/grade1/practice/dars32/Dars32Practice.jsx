// Dars32 amaliyoti — 10 topshiriq (FAZO VA CHIZIQLAR — Блок 7 geometriya boshlanishi).
// YADRO: chiziq turlari to'g'ri/egri/siniq; nuqta va kesma; orasida/chetda. SONSIZ — tanish-ajratish.
// Mexanika: P11 (top-bos), P10 (saralash), multi, mantiq, kesma chizish. Olma-arifmetika YO'Q — geometriya doskasi syujeti.
// Ramp: 2🟢 / 4🟡 / 4🔴 (geometriya introsi — plan yengilroq: recognition-based).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D32_01 from './D32_01.jsx';
import D32_02 from './D32_02.jsx';
import D32_03 from './D32_03.jsx';
import D32_04 from './D32_04.jsx';
import D32_05 from './D32_05.jsx';
import D32_06 from './D32_06.jsx';
import D32_07 from './D32_07.jsx';
import D32_08 from './D32_08.jsx';
import D32_09 from './D32_09.jsx';
import D32_10 from './D32_10.jsx';

const ITEMS = [
  { id: '01', label: '1 · To\'g\'ri', C: D32_01 },     // find_straight (P11) 🟢
  { id: '02', label: '2 · Egri', C: D32_02 },          // find_curved (P11) 🟢
  { id: '03', label: '3 · Siniq', C: D32_03 },         // find_broken (P11) 🟡
  { id: '04', label: '4 · Saralash', C: D32_04 },      // sort_2 (P10) to'g'ri/egri 🟡
  { id: '05', label: '5 · Kesma', C: D32_05 },         // find_segment (P11) 🟡
  { id: '06', label: '6 · Orasida', C: D32_06 },       // between (fazoviy) 🟡
  { id: '07', label: '7 · Saralash 3', C: D32_07 },    // sort_3 (P10) to'g'ri/egri/siniq 🔴
  { id: '08', label: '8 · Barcha to\'g\'ri', C: D32_08 }, // multi barcha to'g'ri chiziq 🔴
  { id: '09', label: '9 · Ortiqcha', C: D32_09 },      // LOGIC ortiqchani top 🔴
  { id: '10', label: '10 · Kesma chiz', C: D32_10 },   // build kesma (2 nuqta ulash) 🔴
];

export default function Dars32Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 32 amaliyoti — 10 topshiriq (fazo va chiziqlar)</strong>
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
