// Dars15 amaliyoti — 10 topshiriq. Mavzu: ekvivalent (teng qiymatli) kasrlar — qoida.
// Qoida: surat va maxrajni bir xil songa ko'paytir (yoki bo'l). Misconception: faqat maxraj.
// Qahramonlar: Laylo, Javohir, Umid, Sabina, Aziza.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D15_01 from './D15_01.jsx';
import D15_02 from './D15_02.jsx';
import D15_03 from './D15_03.jsx';
import D15_04 from './D15_04.jsx';
import D15_05 from './D15_05.jsx';
import D15_06 from './D15_06.jsx';
import D15_07 from './D15_07.jsx';
import D15_08 from './D15_08.jsx';
import D15_09 from './D15_09.jsx';
import D15_10 from './D15_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Tartib bundle TASKS'dan olingan (qiyinlik bo'yicha aralashtirilgan): 🟢 · 🟡 · 🔴.
const ITEMS = [
  { id: '01', label: '1 · Teng lenta', C: D15_01 },        // teng bar 🟢 equal_bars
  { id: '04', label: '2 · Moslash', C: D15_04 },           // teng kasrlarni moslash 🟡 match_equal
  { id: '07', label: '3 · Xatoni top', C: D15_07 },        // xatoni top 🔴 find_wrong
  { id: '02', label: '4 · Qaysi teng', C: D15_02 },        // qaysi 1/2 ga teng 🟢 which_equal
  { id: '06', label: '5 · Retsept stakani', C: D15_06 },   // retsept stakani 🟡 recipe_glass
  { id: '09', label: '6 · Kichraytirish', C: D15_09 },     // qisqartirish 🔴 reduce_fill
  { id: '03', label: "7 · To'ldirish", C: D15_03 },        // lentani bo'lish 🟢 split_bar
  { id: '08', label: '8 · Aldanmang', C: D15_08 },         // provokatsiya 🔴 trap_denom
  { id: '05', label: "9 · Doirani bo'lish", C: D15_05 },   // doirani bo'lish 🟡 split_pie
  { id: '10', label: '10 · Zanjir', C: D15_10 },           // teng kasrlar zanjiri 🔴 equal_chain
];

export default function Dars15Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#fe5b1a' : '#d6dae3'),
    background: active ? '#fe5b1a' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif", whiteSpace: 'nowrap',
  });

  return (
    <div className="pq-fixroot" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* MOBIL_DESKTOP_MOSLASH.md naqshi: fixed root — body-skroll yo'q, tugma joyida;
          <640px da layout 390px etalon + zoom bilan real ekranga masshtablanadi. */}
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 15 amaliyoti — 10 topshiriq (ekvivalent kasrlar)</strong>
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
