// Dars30 amaliyoti — 10 topshiriq (tarkibli masala: JADVAL bilan — jami va qoldi).
// P24 masala-jadvali: BOR EDI (было) · O'ZGARISH (keldi +/ketdi −) · NATIJA (jami/qoldi). Bola bo'sh katakni to'ldiradi.
// Xilma-xil: jadval-jami, jadval-qoldi, amal tanlash (P14), teskari (boshi ?), zanjir, xato topish (P13),
//   multi (natija-N), ikki xonali, jadvalni to'ldirish (P15).
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i syujeti, savat=o'nlik + yakka olma=birlik (D24-29 modeli).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D30_01 from './D30_01.jsx';
import D30_02 from './D30_02.jsx';
import D30_03 from './D30_03.jsx';
import D30_04 from './D30_04.jsx';
import D30_05 from './D30_05.jsx';
import D30_06 from './D30_06.jsx';
import D30_07 from './D30_07.jsx';
import D30_08 from './D30_08.jsx';
import D30_09 from './D30_09.jsx';
import D30_10 from './D30_10.jsx';

const ITEMS = [
  { id: '01', label: '1 · 5+3', C: D30_01 },          // table_sum · 5+3=8 🟢
  { id: '02', label: '2 · 6+4', C: D30_02 },          // table_sum · 6+4=10 🟡
  { id: '03', label: '3 · 9−4', C: D30_03 },          // table_rem · 9−4=5 🟡
  { id: '04', label: '4 · Amal', C: D30_04 },         // choose_op (P14) · jadvalда qaysi amal 🟡
  { id: '05', label: '5 · Boshi ?', C: D30_05 },      // table_missing · ?+3=8 → boshi 5 🔴
  { id: '06', label: '6 · Zanjir', C: D30_06 },       // table_chain · ko'p qatorli jadval 🔴
  { id: '07', label: '7 · Xato', C: D30_07 },         // find_error (P13) · jadvalда xato natija 🔴
  { id: '08', label: '8 · Natija 10', C: D30_08 },    // multi · natijasi 10 barcha 🔴
  { id: '09', label: '9 · 34+25', C: D30_09 },        // table_sum · 34+25=59 (ikki xonali) 🔴
  { id: '10', label: '10 · To\'ldir', C: D30_10 },    // build_table (P15+P24) · «Jadvalni to'ldiring» 🔴
];

export default function Dars30Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 30 amaliyoti — 10 topshiriq (tarkibli masala: jadval bilan)</strong>
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
