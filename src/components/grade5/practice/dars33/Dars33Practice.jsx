// Dars33 amaliyoti — 10 topshiriq. Mavzu: geometriya boshi (chiziq, burchak, aylana).
// BU DARS KONSEPTUAL — hisob yo'q, tanib olish/solishtirish/tasniflash. O'nli kasr yo'q.
// Imzo-mexanika = "geometriya galereyasi": aniq SVG shakllar, burchak sekin ochiladi.
// Markaziy xato: burchak kattaligi ochilishga bog'liq, tomon uzunligiga emas (D33_04, D33_06).
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Chiziqni ula', C: D33_01 },     // 🟢 moslash — chiziq turi ↔ ta'rif
  { id: '02', label: '2 · Qaysi nur', C: D33_02 },        // 🟢 MCQ — nurni tanla
  { id: '03', label: "3 · To'g'ri burchakmi", C: D33_03 },// 🟢 Ha/Yo'q — 90°
  { id: '04', label: '4 · Qaysi katta', C: D33_04 },      // 🟡 solishtir — ochilish (kattasini bos)
  { id: '05', label: '5 · Burchak turi', C: D33_05 },     // 🟡 moslash — burchak turi ↔ figura
  { id: '06', label: '6 · Xatoni top', C: D33_06 },       // 🟡 xatoni top — uzun tomon xato
  { id: '07', label: '7 · Aylana', C: D33_07 },           // 🔴 MCQ — aylana vs doira
  { id: '08', label: '8 · Tartibla', C: D33_08 },         // 🔴 tartibla — ochilishi bo'yicha
  { id: '09', label: '9 · Nechta burchak', C: D33_09 },   // 🔴 sanab top (input) — 4
  { id: '10', label: '10 · Kitob burchagi', C: D33_10 },  // 🔴 masala — to'g'ri burchak
];

export default function Dars33Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#0891b2' : '#d6dae3'),
    background: active ? '#0891b2' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 33 amaliyoti — 10 topshiriq (geometriya boshi)</strong>
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
