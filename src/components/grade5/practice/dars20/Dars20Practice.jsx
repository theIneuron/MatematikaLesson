// Dars20 amaliyoti — 10 topshiriq. Mavzu: har xil maxrajli kasrlarni ayirish.
// Dastur: urok 6.4 — frac_5_12. Markaziy xato: umumiy maxrajga keltirmasdan ayirish.
// Usul: umumiy maxrajga vizual/ekvivalent orqali keltirish (formal NOK yo'q). Karra juftlar,
// 🔴 da o'zaro tub. Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. Hero mexanika = TAFOVUT/FARQ.
// Har topshiriq mustaqil jsx-question fayli; PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D20_01 from './D20_01.jsx';
import D20_02 from './D20_02.jsx';
import D20_03 from './D20_03.jsx';
import D20_04 from './D20_04.jsx';
import D20_05 from './D20_05.jsx';
import D20_06 from './D20_06.jsx';
import D20_07 from './D20_07.jsx';
import D20_08 from './D20_08.jsx';
import D20_09 from './D20_09.jsx';
import D20_10 from './D20_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: "1 · Qayta bo'l", C: D20_01 },      // 🟢 reslice take-away (3/4−1/2)
  { id: '02', label: '2 · Moslash', C: D20_02 },         // 🟡 ayirma↔natija eng sodda
  { id: '03', label: "3 · O'n ikkidan", C: D20_03 },     // 🔴 o'zaro tub uch-katak (3/4−2/3)
  { id: '04', label: '4 · Umumiy maxraj', C: D20_04 },   // 🟢 test/LCD (3/4−1/6)
  { id: '05', label: '5 · Tafovut', C: D20_05 },         // 🔴 gap/farq bar (2/3−1/2)
  { id: '06', label: "6 · Son o'qi", C: D20_06 },        // 🟡 orqaga sakrash (5/6−1/2)
  { id: '07', label: '7 · Masala+qisqar', C: D20_07 },   // 🔴 story+reduce (5/6−1/3=1/2)
  { id: '08', label: "8 · Belgila", C: D20_08 },         // 🟢 select-all: natijasi 1/3 (5/6−1/2, 3/4−5/12)
  { id: '09', label: '9 · Xatoni top', C: D20_09 },      // 🟡 misconception (5/8−1/2=4/6)
  { id: '10', label: '10 · Masala', C: D20_10 },         // 🔴 o'zaro tub masala (3/4−1/3=5/12)
];

export default function Dars20Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 20 amaliyoti — 10 topshiriq (har xil maxrajli kasrlarni ayirish)</strong>
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
