// Dars37 amaliyoti — 10 topshiriq. Mavzu: hajm va o'lchov birliklari.
// Dastur: hajm = birlik kublar soni; V = a × b × c; kub V = qirra³; sm/sm²/sm³/litr.
// Hero mexanika = kubchalar bilan qatlam-qatlam to'ldirish (3D quti).
// Markaziy xato: YUZA ↔ HAJM chalkashligi (bir qatlamni butun hajm deb olish).
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D37_01 from './D37_01.jsx';
import D37_02 from './D37_02.jsx';
import D37_03 from './D37_03.jsx';
import D37_04 from './D37_04.jsx';
import D37_05 from './D37_05.jsx';
import D37_06 from './D37_06.jsx';
import D37_07 from './D37_07.jsx';
import D37_08 from './D37_08.jsx';
import D37_09 from './D37_09.jsx';
import D37_10 from './D37_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Hajm nima', C: D37_01 },        // 🟢 MCQ · vol_concept
  { id: '02', label: '2 · Necha kubcha', C: D37_02 },     // 🟢 bo'sh katak 3×2×2=12
  { id: '03', label: '3 · Kub hajmi', C: D37_03 },        // 🟢 Ha/Yo'q qirra 2 → 8
  { id: '04', label: '4 · Parallelepiped', C: D37_04 },   // 🟡 vizual-MCQ 4×3×2=24
  { id: '05', label: '5 · Birliklar', C: D37_05 },        // 🟡 moslash sm/sm²/sm³/litr
  { id: '06', label: '6 · Qatlamlab', C: D37_06 },        // 🟡 konstruktor 6×3=18
  { id: '07', label: '7 · Xatoni top', C: D37_07 },       // 🔴 yuza↔hajm xato
  { id: '08', label: '8 · Masala', C: D37_08 },           // 🔴 o'nli 4×3×1,5=18
  { id: '09', label: '9 · Yuza va hajm', C: D37_09 },     // 🔴 ikki maydon 9 va 27
  { id: '10', label: '10 · Qaysi birlik', C: D37_10 },    // 🔴 MCQ sm³
];

export default function Dars37Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 37 amaliyoti — 10 topshiriq (hajm va o'lchov birliklari)</strong>
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
