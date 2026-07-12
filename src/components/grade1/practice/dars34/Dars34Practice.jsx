// Dars34 amaliyoti — 10 topshiriq (DETSIMETR VA METR — uzunlik o'lchovi, Блок 7).
// YADRO: chizg'ich bilan o'lchash (sm); 1 dm = 10 sm; 1 m = 10 dm; uzunliklarni qo'shish. Variantlar MATN ("10 sm").
// Mexanika: o'lcha (P16), birlik-o'tkazish (P26), taqqoslash, qaysi-birlik, uzunlik-qo'shish, interaktiv o'lchash. Chizg'ich sahnasi.
// Ramp: 2🟢 / 4🟡 / 4🔴. Misconception: M1 dm↔sm, M2 1 dm=1 sm, M3 qo'shishda birlikni unutish.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D34_01 from './D34_01.jsx';
import D34_02 from './D34_02.jsx';
import D34_03 from './D34_03.jsx';
import D34_04 from './D34_04.jsx';
import D34_05 from './D34_05.jsx';
import D34_06 from './D34_06.jsx';
import D34_07 from './D34_07.jsx';
import D34_08 from './D34_08.jsx';
import D34_09 from './D34_09.jsx';
import D34_10 from './D34_10.jsx';

const ITEMS = [
  { id: '01', label: '1 · O\'lcha 6', C: D34_01 },      // measure_cm 6 sm 🟢
  { id: '02', label: '2 · O\'lcha 8', C: D34_02 },      // measure_cm 8 sm 🟢
  { id: '03', label: '3 · O\'lcha 9', C: D34_03 },      // measure_cm 9 sm 🟡
  { id: '04', label: '4 · 1 dm', C: D34_04 },           // convert 1 dm=10 sm (M2) 🟡
  { id: '05', label: '5 · 2 dm', C: D34_05 },           // convert 2 dm=20 sm 🟡
  { id: '06', label: '6 · Qaysi uzun', C: D34_06 },     // compare 6 sm vs 1 dm (M1) 🟡
  { id: '07', label: '7 · Qaysi birlik', C: D34_07 },   // unit-sense (qalam→sm, eshik→m) 🔴
  { id: '08', label: '8 · 1 m', C: D34_08 },            // convert 1 m=10 dm 🔴
  { id: '09', label: '9 · Uzunlik qo\'sh', C: D34_09 }, // length add 8 sm+5 sm=13 sm (M3) 🔴
  { id: '10', label: '10 · O\'lcha', C: D34_10 },       // interactive measure (tap ruler mark) 🔴
];

export default function Dars34Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 34 amaliyoti — 10 topshiriq (detsimetr va metr)</strong>
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
