// Dars21 amaliyoti — 10 topshiriq. Mavzu: to'g'ri, noto'g'ri va aralash sonlar.
// Dastur: urok 7.1 — frac_5_13. Markaziy xato: "noto'g'ri kasr — bu xato".
// Tur: tasniflash + sonlar nurida joylashuv (amal emas). Konversiya (noto'g'ri↔aralash) — Dars22.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. Formatlar xilma-xil (MCQ 2 ta, qolgani interaktiv).
// Setup neytral (usul oshkor emas), qoida faqat to'g'ri javobdan keyin. Ko'lam: maxraj/surat 2-12.
// Har topshiriq mustaqil jsx-question fayli; PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D21_01 from './D21_01.jsx';
import D21_02 from './D21_02.jsx';
import D21_03 from './D21_03.jsx';
import D21_04 from './D21_04.jsx';
import D21_05 from './D21_05.jsx';
import D21_06 from './D21_06.jsx';
import D21_07 from './D21_07.jsx';
import D21_08 from './D21_08.jsx';
import D21_09 from './D21_09.jsx';
import D21_10 from './D21_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Qanday son', C: D21_01 },      // 🟢 MCQ tasniflash (7/3 noto'g'ri)
  { id: '02', label: '2 · Saralash', C: D21_02 },        // 🟡 3 savatga saralash (chegara 8/8)
  { id: '03', label: '3 · Sonlar nurida', C: D21_03 },   // 🔴 noto'g'rini joylash (9/5)
  { id: '04', label: '4 · Moslang', C: D21_04 },         // 🟢 rasm↔son moslash (3/5,7/6,2⅓)
  { id: '05', label: "5 · Noto'g'rini yoz", C: D21_05 }, // 🔴 rasmdan noto'g'ri (9/4)
  { id: '06', label: "6 · Qaysi to'g'ri", C: D21_06 },   // 🟡 MCQ gap/misconception
  { id: '07', label: '7 · Hammasini top', C: D21_07 },   // 🔴 select-all noto'g'ri (chegara 9/9)
  { id: '08', label: '8 · Qaysi orada', C: D21_08 },     // 🟢 oraliqni bosish (8/5)
  { id: '09', label: '9 · Aralash tuz', C: D21_09 },     // 🟡 chip-konstruktor (2¾)
  { id: '10', label: '10 · Masala', C: D21_10 },         // 🔴 vaziyatli masala (11/4)
];

export default function Dars21Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 21 amaliyoti — 10 topshiriq (to'g'ri, noto'g'ri va aralash sonlar)</strong>
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
