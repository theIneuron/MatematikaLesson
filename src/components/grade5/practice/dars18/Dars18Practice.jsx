// Dars18 amaliyoti — 10 topshiriq. Mavzu: bir xil maxrajli kasrlarni ayirish (frac_5_08).
// Natija ≤ 1, maxrajlar 5-12, zaym/butun aralashuvi yo'q. Markaziy xato: maxrajlarni ham ayirish.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. Mexanikalar xilma-xil (tap-tile, moslash, select-all,
// teskari amal, son o'qi, qadamba-qadam, xatoni tuzat, ortiqcha ma'lumotli masala).
// Kasrlar ikki qatorli, qoida faqat to'g'ri javobdan keyin.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D18_01 from './D18_01.jsx';
import D18_02 from './D18_02.jsx';
import D18_03 from './D18_03.jsx';
import D18_04 from './D18_04.jsx';
import D18_05 from './D18_05.jsx';
import D18_06 from './D18_06.jsx';
import D18_07 from './D18_07.jsx';
import D18_08 from './D18_08.jsx';
import D18_09 from './D18_09.jsx';
import D18_10 from './D18_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Sonni joylashtir', C: D18_01 }, // 🟢 tap-tile suratni joylashtirish (6/7−2/7)
  { id: '02', label: '2 · Moslash', C: D18_02 },       // 🟡 moslash (maxraj 8, eng sodda)
  { id: '03', label: "3 · Yo'qolgan son", C: D18_03 }, // 🔴 teskari amal (9/11−?/11=4/11)
  { id: '04', label: '4 · Barchasini tanla', C: D18_04 }, // 🟢 select-all (natija 2/5)
  { id: '05', label: '5 · Ayir va qisqartir', C: D18_05 }, // 🔴 ikki bosqich (7/8−1/8=3/4)
  { id: '06', label: "6 · Son o'qi", C: D18_06 },      // 🟡 orqaga sakrash (5/6−2/6)
  { id: '07', label: '7 · Qadamba-qadam', C: D18_07 }, // 🔴 ikki qadam zanjir (8/9−2/9−3/9)
  { id: '08', label: '8 · Kim haq?', C: D18_08 },      // 🟢 misconception (6/8−2/8, rasm)
  { id: '09', label: '9 · Xatoni tuzat', C: D18_09 },  // 🟡 to'g'ri suratni kiritish (10/12−4/12)
  { id: '10', label: '10 · Masala', C: D18_10 },       // 🔴 ortiqcha ma'lumotli masala (5/6−1/6=2/3)
];

export default function Dars18Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 18 amaliyoti — 10 topshiriq (bir xil maxrajli kasrlarni ayirish)</strong>
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
