// Dars19 amaliyoti — 10 topshiriq. Mavzu: har xil maxrajli kasrlarni qo'shish (etalon v14 mavzusi).
// Dastur: urok 6.3 — frac_5_06. Markaziy xato: 1/2 + 1/3 = 2/5 (maxrajlarni ham qo'shish).
// Usul: umumiy maxrajga VIZUAL/EKVIVALENT orqali keltirish (formal NOK yo'q). Karra juftlar,
// 🔴 da o'zaro tub. Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. Hero mexanika = QAYTA BO'LISH.
// Har topshiriq mustaqil jsx-question fayli; PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D19_01 from './D19_01.jsx';
import D19_02 from './D19_02.jsx';
import D19_03 from './D19_03.jsx';
import D19_04 from './D19_04.jsx';
import D19_05 from './D19_05.jsx';
import D19_06 from './D19_06.jsx';
import D19_07 from './D19_07.jsx';
import D19_08 from './D19_08.jsx';
import D19_09 from './D19_09.jsx';
import D19_10 from './D19_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: "1 · Qayta bo'l", C: D19_01 },      // 🟢 reslice + fill (1/2+1/4)
  { id: '02', label: '2 · Moslash', C: D19_02 },         // 🟡 ekvivalent /12 (moslash)
  { id: '03', label: "3 · O'zaro tub", C: D19_03 },      // 🔴 o'zaro tub uch katak (2/5+1/2)
  { id: '04', label: '4 · Umumiy maxraj', C: D19_04 },   // 🟢 test/LCD tanlash (1/3+1/6)
  { id: '05', label: '5 · Ulushni tanla', C: D19_05 },   // 🔴 interaktiv qayta bo'lish (etalon)
  { id: '06', label: "6 · Son o'qi", C: D19_06 },        // 🟡 choraklar son o'qi (1/2+1/4)
  { id: '07', label: '7 · Masala+qisqar', C: D19_07 },   // 🔴 story+reduce (1/6+1/3=1/2)
  { id: '08', label: "8 · Yetmaganini top", C: D19_08 }, // 🟢 teskari tenglama (1/4+?/8=3/8)
  { id: '09', label: '9 · Xatoni top', C: D19_09 },      // 🟡 etalon xatosi (1/2+1/3=2/5)
  { id: '10', label: '10 · Masala', C: D19_10 },         // 🔴 o'zaro tub masala (1/4+1/3=7/12)
];

export default function Dars19Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 19 amaliyoti — 10 topshiriq (har xil maxrajli kasrlarni qo'shish)</strong>
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
