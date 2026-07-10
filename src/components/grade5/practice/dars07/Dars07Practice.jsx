// Dars07 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: butun sonlarni taqqoslash, qarama-qarshi sonlar.
// Manba: 5-sinf nazariy Dars07 (butun sonlarni taqqoslash, qarama-qarshi sonlar, ishora almashtirish).
// Modul (|a|) 5-sinf ko'lamidan tashqarida — bu darsda ishlatilmaydi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D07_01 from './D07_01.jsx';
import D07_02 from './D07_02.jsx';
import D07_03 from './D07_03.jsx';
import D07_04 from './D07_04.jsx';
import D07_05 from './D07_05.jsx';
import D07_06 from './D07_06.jsx';
import D07_07 from './D07_07.jsx';
import D07_08 from './D07_08.jsx';
import D07_09 from './D07_09.jsx';
import D07_10 from './D07_10.jsx';

// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Maslahatsiz.
const ITEMS = [
  { id: '01', label: '1 · Qarama-qarshi', C: D07_01 }, // opposite 🟢 (5→-5)
  { id: '02', label: '2 · Qarshi belgi', C: D07_02 },  // opposite_sign 🟢 (musbat→manfiy)
  { id: '03', label: '3 · Taqqoslash', C: D07_03 },    // compare_neg_pos 🟡 (-4<2)
  { id: '04', label: '4 · Qaysi kichik', C: D07_04 },  // compare_two_neg 🟡 (-17<-11)
  { id: '05', label: '5 · Nol', C: D07_05 },           // zero_rule 🟡 (0>-3)
  { id: '06', label: '6 · Qarshisi', C: D07_06 },      // opposite_of_neg 🟡 (-8→8)
  { id: '07', label: '7 · Tartibla', C: D07_07 },      // order_integers 🔴
  { id: '08', label: '8 · Aziza xatosi', C: D07_08 },  // opposite_error 🔴 (4→-4)
  { id: '09', label: '9 · Eng sovuq', C: D07_09 },     // temp_coldest 🔴 (-8)
  { id: '10', label: '10 · Qaytadi', C: D07_10 },      // opposite_double 🔴 (-4)
];

export default function Dars07Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 7 amaliyoti — 10 topshiriq (butun sonlarni taqqoslash)</strong>
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
