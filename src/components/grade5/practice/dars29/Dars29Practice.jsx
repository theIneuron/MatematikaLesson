// Dars29 amaliyoti — 10 topshiriq. Mavzu: o'nli kasrga bo'lish.
// Dastur: urok 7.9 — o'nli kasrga bo'lish (necha marta sig'adi, :0,5=×2, vergulni yo'qotish ×10/×10).
// Hero mexanika = "necha marta sig'adi": butun ichiga 0,5 li stakan/bo'lak birma-bir to'ladi.
// Markaziy xato: "bo'lish har doim kichiklashtiradi". To'g'ri: 1 dan kichikka bo'lsa — kattalashadi.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D29_01 from './D29_01.jsx';
import D29_02 from './D29_02.jsx';
import D29_03 from './D29_03.jsx';
import D29_04 from './D29_04.jsx';
import D29_05 from './D29_05.jsx';
import D29_06 from './D29_06.jsx';
import D29_07 from './D29_07.jsx';
import D29_08 from './D29_08.jsx';
import D29_09 from './D29_09.jsx';
import D29_10 from './D29_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Katta yoki kichik', C: D29_01 }, // 🟢 MCQ 6:0,5 (necha marta sig'adi)
  { id: '02', label: '2 · Necha stakan', C: D29_02 },      // 🟢 bo'sh katak 3:0,5=6
  { id: '03', label: "3 · Ha/Yo'q", C: D29_03 },           // 🟢 4:0,5=8 to'g'rimi
  { id: '04', label: "4 · Vergulni yo'qot", C: D29_04 },   // 🟡 bo'sh katak 2,4:0,6=4
  { id: '05', label: '5 · Moslash', C: D29_05 },           // 🟡 bo'luvchi→natija kattaligi
  { id: '06', label: '6 · Xatoni top', C: D29_06 },        // 🟡 6:0,5=3 (×0,5 chalkashligi)
  { id: '07', label: '7 · Butun bo\'lish', C: D29_07 },    // 🔴 konstruktor 1,5:0,3 → 15:3=5
  { id: '08', label: '8 · Masala', C: D29_08 },            // 🔴 4,5:0,5=9 ta bant
  { id: '09', label: "9 · Son o'qi", C: D29_09 },          // 🔴 2:0,4=5 marker
  { id: '10', label: "10 · Qaysi to'g'ri", C: D29_10 },    // 🔴 MCQ tuzoq 7:0,7=10
];

export default function Dars29Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 29 amaliyoti — 10 topshiriq (o'nli kasrga bo'lish)</strong>
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
