// Dars25 amaliyoti — 10 topshiriq. Mavzu: o'nli kasrlarni solishtirish va yaxlitlash.
// Dastur: urok 7.5 — o'nli kasrlar (solishtirish, yaxlitlash).
// Hero mexanika = razryadli solishtirish taxtasi (ustma-ust, hal qiluvchi xona) + yaxlitlash son o'qi.
// Markaziy xato: "ko'p raqam = katta" (0,45 > 0,5). To'g'ri: xonama-xona (o'ndandan).
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D25_01 from './D25_01.jsx';
import D25_02 from './D25_02.jsx';
import D25_03 from './D25_03.jsx';
import D25_04 from './D25_04.jsx';
import D25_05 from './D25_05.jsx';
import D25_06 from './D25_06.jsx';
import D25_07 from './D25_07.jsx';
import D25_08 from './D25_08.jsx';
import D25_09 from './D25_09.jsx';
import D25_10 from './D25_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Qaysi kichik', C: D25_01 },    // 🟢 0,7 vs 0,4 lenta (kichigini)
  { id: '02', label: '2 · Yaqin butun', C: D25_02 },     // 🟡 yaxlit-butun moslash (yuzdanli)
  { id: '03', label: '3 · Razryad', C: D25_03 },         // 🔴 0,62 vs 0,7 belgi (belgilanmagan xona)
  { id: '04', label: "4 · Butungacha", C: D25_04 },      // 🟢 3,6→4 son o'qi
  { id: '05', label: "5 · O'ndangacha", C: D25_05 },     // 🔴 3,76→3,8 fill
  { id: '06', label: '6 · Tartibla', C: D25_06 },        // 🟡 0,68<0,7<0,75 order (yuzdanli)
  { id: '07', label: '7 · Masala', C: D25_07 },          // 🔴 0,8 vs 0,75 banka
  { id: '08', label: "8 · Ha/Yo'q", C: D25_08 },         // 🟢 0,5=0,50?
  { id: '09', label: '9 · Xatoni top', C: D25_09 },      // 🟡 0,45>0,5 xato
  { id: '10', label: "10 · Qaysi to'g'ri", C: D25_10 },  // 🔴 2,97→3,0 o'tkazmali MCQ
];

export default function Dars25Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 25 amaliyoti — 10 topshiriq (o'nli kasrlarni solishtirish va yaxlitlash)</strong>
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
