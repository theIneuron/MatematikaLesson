// Dars36 amaliyoti — 10 topshiriq. Mavzu: uchburchak yuzasi.
// Dastur: 5-sinf — uchburchak yuzasi S = (asos × balandlik) : 2.
// Imzo-mexanika = to'rtburchak diagonal bo'yicha yarmiga bo'linadi, bitta uchburchak yoritiladi.
// Markaziy xato: (1) 2 ga bo'lishni unutish; (2) qiya yon tomonni balandlik deb olish.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D36_01 from './D36_01.jsx';
import D36_02 from './D36_02.jsx';
import D36_03 from './D36_03.jsx';
import D36_04 from './D36_04.jsx';
import D36_05 from './D36_05.jsx';
import D36_06 from './D36_06.jsx';
import D36_07 from './D36_07.jsx';
import D36_08 from './D36_08.jsx';
import D36_09 from './D36_09.jsx';
import D36_10 from './D36_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Formula', C: D36_01 },       // 🟢 MCQ · tri_formula
  { id: '02', label: '2 · Yuzani top', C: D36_02 },    // 🟢 bo'sh katak · tri_basic
  { id: '03', label: '3 · Yarmimi?', C: D36_03 },      // 🟢 Ha/Yo'q · tri_half
  { id: '04', label: "4 · O'nli", C: D36_04 },         // 🟡 bo'sh katak o'nli · tri_decimal
  { id: '05', label: '5 · Balandlik', C: D36_05 },     // 🟡 tap · tri_height_pick
  { id: '06', label: '6 · Xatoni top', C: D36_06 },    // 🟡 xatoni top · tri_error
  { id: '07', label: '7 · Balandlikni top', C: D36_07 }, // 🔴 teskari · tri_inverse_h
  { id: '08', label: '8 · Bayroq', C: D36_08 },        // 🔴 masala o'nli · tri_word
  { id: '09', label: "9 · To'g'ri yuza", C: D36_09 },  // 🔴 MCQ ikki tuzoq · tri_check
  { id: '10', label: '10 · Asosni top', C: D36_10 },   // 🔴 teskari · tri_inverse_b
];

export default function Dars36Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#db2777' : '#d6dae3'),
    background: active ? '#db2777' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 36 amaliyoti — 10 topshiriq (uchburchak yuzasi)</strong>
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
