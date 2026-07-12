// Dars36 amaliyoti — 10 topshiriq (PIKTOGRAMMA VA JADVAL — ma'lumotlar bilan ishlash, Блок 7).
// YADRO: piktogramma (1 rasm = 1 dona) va sodda jadvalni o'qish; "qaysi ko'p/kam"; jami; farq.
// Mexanika: piktogramma-o'qish (P20), jadval-o'qish, taqqoslash, jami, multi, diagramma-to'ldirish.
// Ramp: 2🟢 / 4🟡 / 4🔴. Misconception: M1 rasmlarni noto'g'ri sanash, M2 uzun qator=ko'p teskari, M3 jadval qatorini chalkashtirish.
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

const ITEMS = [
  { id: '01', label: '1 · Nechta olma', C: D36_01 },    // read_picto olma 🟢
  { id: '02', label: '2 · Nechta nok', C: D36_02 },     // read_picto nok 🟢
  { id: '03', label: '3 · Qaysi ko\'p', C: D36_03 },    // which_most 🟡
  { id: '04', label: '4 · Qaysi kam', C: D36_04 },      // which_least 🟡
  { id: '05', label: '5 · Nechta kam', C: D36_05 },     // compare_diff 🟡
  { id: '06', label: '6 · Jadval', C: D36_06 },         // read_table 🟡
  { id: '07', label: '7 · Jami', C: D36_07 },           // total 🔴
  { id: '08', label: '8 · Belgilang', C: D36_08 },      // multi (=5) 🔴
  { id: '09', label: '9 · Ikki qator', C: D36_09 },     // two_rows_sum 🔴
  { id: '10', label: '10 · To\'ldir', C: D36_10 },      // build_picto (interactive) 🔴
];

export default function Dars36Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 36 amaliyoti — 10 topshiriq (piktogramma va jadval)</strong>
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
