// Dars31 amaliyoti — 10 topshiriq (IKKI QADAMLI masala).
// P25 ikki qadamli yechim: BOR EDI, keyin ketma-ket IKKI amal (keldi + / ketdi −). Avval 1-qadam, keyin 2-qadam.
// Xilma-xil: 2-qadam (a+b−c, a−b−c), qadamlarni qurish (P25), zanjir, xato qadam (P13), multi (javobi-N),
//   do'kon masalasi, yechim tuzish (P25).
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i syujeti, savat=o'nlik + yakka olma=birlik (D24-30 modeli).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D31_01 from './D31_01.jsx';
import D31_02 from './D31_02.jsx';
import D31_03 from './D31_03.jsx';
import D31_04 from './D31_04.jsx';
import D31_05 from './D31_05.jsx';
import D31_06 from './D31_06.jsx';
import D31_07 from './D31_07.jsx';
import D31_08 from './D31_08.jsx';
import D31_09 from './D31_09.jsx';
import D31_10 from './D31_10.jsx';

const ITEMS = [
  { id: '01', label: '1 · 4+3−2', C: D31_01 },        // two_step · 4+3−2=5 🟢
  { id: '02', label: '2 · 7+3−5', C: D31_02 },        // two_step · 7+3−5=5 🟡
  { id: '03', label: '3 · 9−2−3', C: D31_03 },        // two_step · 9−2−3=4 🟡
  { id: '04', label: '4 · Qadamlar', C: D31_04 },     // build_steps (P25) · 7+2−4=5 (2 slot) 🟡
  { id: '05', label: '5 · 8+4−3', C: D31_05 },        // two_step · 8+4−3=9 🔴
  { id: '06', label: '6 · Zanjir', C: D31_06 },       // chain · 4 ikki qadamli 🔴
  { id: '07', label: '7 · Xato', C: D31_07 },         // find_error (P13) · qaysi qadam xato 🔴
  { id: '08', label: '8 · Javobi 6', C: D31_08 },     // multi · javobi 6 barcha 🔴
  { id: '09', label: '9 · Do\'kon', C: D31_09 },      // two_step_word · 7+4−3=8 🔴
  { id: '10', label: '10 · Yechim', C: D31_10 },      // build_solution (P25) · «Yechimni tuzing» 5+3−2 🔴
];

export default function Dars31Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 31 amaliyoti — 10 topshiriq (ikki qadamli masala)</strong>
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
