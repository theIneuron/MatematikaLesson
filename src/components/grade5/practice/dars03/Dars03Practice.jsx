// Dars03 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: ustun shaklida qo'shish va ayirish.
// Darslik §7 (qo'shish) va §8 (ayirish) mashqlariga asoslangan.
// Har topshiriq mustaqil jsx-question fayli; PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D03_01 from './D03_01.jsx';
import D03_02 from './D03_02.jsx';
import D03_03 from './D03_03.jsx';
import D03_04 from './D03_04.jsx';
import D03_05 from './D03_05.jsx';
import D03_06 from './D03_06.jsx';
import D03_07 from './D03_07.jsx';
import D03_08 from './D03_08.jsx';
import D03_09 from './D03_09.jsx';
import D03_10 from './D03_10.jsx';

// Metodik xarita: mavzu · qiyinlik · teg · darslik manbasi.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz.
const ITEMS = [
  { id: '01', label: "1 · Yig'indi", C: D03_01 },      // §7 Mashq 137 sum_input 🟢
  { id: '02', label: "2 · Bo'ladimi", C: D03_02 }, // §8 Mashq 161 can_subtract 🟢
  { id: '03', label: '3 · Столбик +', C: D03_03 },     // §7 column_add 🟡 (70046+48992)
  { id: '04', label: '4 · Столбик −', C: D03_04 },     // §8 column_sub 🟡 (75319−8642)
  { id: '05', label: '5 · Xato top', C: D03_05 },      // §8 Mashq 162 sub_check 🟡
  { id: '06', label: '6 · Xarid', C: D03_06 },         // §8 Mashq 165 word_sub 🟡
  { id: '07', label: '7 · Qulay +', C: D03_07 },       // §7 qulay_add 🔴
  { id: '08', label: '8 · Yirik +', C: D03_08 },       // §7 Mashq 137g column_add 🔴 (yangi razryad)
  { id: '09', label: "9 · Ko'p son", C: D03_09 },      // §7 Mashq 138 multi_sum 🔴
  { id: '10', label: '10 · Qulay −', C: D03_10 },      // §8 Mashq 172 qulay_sub 🔴
];

export default function Dars03Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 3 amaliyoti — 10 topshiriq (qo'shish va ayirish)</strong>
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
