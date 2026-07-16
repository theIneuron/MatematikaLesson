// Dars26 amaliyoti — 10 topshiriq. Mavzu: o'nli kasrlarni qo'shish va ayirish.
// Hero mexanika = "Vergulni ushlab tur" — ustma-ust ustun (vergul vergul ostida).
// Markaziy xato: o'ng chekka bo'yicha terish. To'g'ri: vergul bo'yicha (o'ndan o'ndan bilan).
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D26_01 from './D26_01.jsx';
import D26_02 from './D26_02.jsx';
import D26_03 from './D26_03.jsx';
import D26_04 from './D26_04.jsx';
import D26_05 from './D26_05.jsx';
import D26_06 from './D26_06.jsx';
import D26_07 from './D26_07.jsx';
import D26_08 from './D26_08.jsx';
import D26_09 from './D26_09.jsx';
import D26_10 from './D26_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: "1 · To'g'ri terish", C: D26_01 },   // 🟢 MCQ vergul ustma-ust vs o'ng chekka
  { id: '02', label: "2 · Natijani to'ldir", C: D26_02 }, // 🟢 2,5+1,3=3,8 fill
  { id: '03', label: "3 · 1,0 = 1 mi", C: D26_03 },       // 🟢 Ha/Yo'q nol o'ndan
  { id: '04', label: '4 · Xonani tekisla', C: D26_04 },   // 🟡 3,45+2,7=6,15 (2,70)
  { id: '05', label: '5 · Xatoni top', C: D26_05 },       // 🟡 4,2−1,15 moslash xatosi
  { id: '06', label: '6 · Moslash', C: D26_06 },          // 🟡 4 juft ifoda→natija
  { id: '07', label: '7 · Masala', C: D26_07 },           // 🔴 yugurish jami+farq
  { id: '08', label: '8 · Vergulni joyla', C: D26_08 },   // 🔴 konstruktor 4,15
  { id: '09', label: "9 · Son o'qi", C: D26_09 },         // 🔴 son o'qida 3,6+?=5 → 1,4 belgilash
  { id: '10', label: '10 · Butundan ayir', C: D26_10 },   // 🔴 5−0,4 MCQ
];

export default function Dars26Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#fe5b1a' : '#d6dae3'),
    background: active ? '#fe5b1a' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 26 amaliyoti — 10 topshiriq (o'nli kasrlarni qo'shish va ayirish)</strong>
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
