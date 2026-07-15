// Dars27 amaliyoti — 10 topshiriq. Mavzu: o'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish.
// Hero mexanika = "vergul siljiydi": ×10/100/1000 da vergul o'ngga, :10/100/1000 da chapga qadam-baqadam sakraydi.
// Markaziy xato: "×10 = o'ngga nol qo'shish" (2,5 × 10 = 2,50). To'g'ri: VERGUL siljiydi (2,5 × 10 = 25).
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D27_01 from './D27_01.jsx';
import D27_02 from './D27_02.jsx';
import D27_03 from './D27_03.jsx';
import D27_04 from './D27_04.jsx';
import D27_05 from './D27_05.jsx';
import D27_06 from './D27_06.jsx';
import D27_07 from './D27_07.jsx';
import D27_08 from './D27_08.jsx';
import D27_09 from './D27_09.jsx';
import D27_10 from './D27_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · 2,5 × 10', C: D27_01 },        // 🟢 MCQ (shift_x10)
  { id: '02', label: '2 · 4,7 × 100', C: D27_02 },       // 🟢 bo'sh katak (shift_x100)
  { id: '03', label: '3 · Moslash', C: D27_03 },         // 🟢 moslash 4 juft (shift_match)
  { id: '04', label: '4 · Vergul joyi', C: D27_04 },     // 🟡 konstruktor: vergul joyini tanlash (shift_div10_build)
  { id: '05', label: '5 · Xatoni top', C: D27_05 },      // 🟡 xatoni top (shift_error)
  { id: '06', label: "6 · Ha/Yo'q", C: D27_06 },         // 🟡 ha/yo'q (shift_yesno)
  { id: '07', label: '7 · Konstruktor', C: D27_07 },     // 🔴 yo'nalish+qadam (shift_steps)
  { id: '08', label: '8 · Masala', C: D27_08 },          // 🔴 masala input (shift_word)
  { id: '09', label: '9 · Amalni tanla', C: D27_09 },    // 🔴 amal tanlash (shift_missing_op)
  { id: '10', label: '10 · Zanjir', C: D27_10 },         // 🔴 zanjir input (shift_chain)
];

export default function Dars27Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#6d28d9' : '#d6dae3'),
    background: active ? '#6d28d9' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 27 amaliyoti — 10 topshiriq (o'nli kasrni 10, 100, 1000 ga ko'paytirish va bo'lish)</strong>
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
