// Dars03 amaliyoti — 10 topshiriq. Mavzu: ustun shaklida qo'shish va ayirish.
// Darslik §7 (qo'shish) va §8 (ayirish). Qiyinlik: 2 oson · 4 o'rta · 4 qiyin.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Aldov (trap) variantlar bilan.
const ITEMS = [
  { id: '01', label: "1 · Yig'indi", C: D03_01 },              // ustunda qo'shish 🟢 sum_input
  { id: '02', label: '2 · Ayirish mumkinmi', C: D03_02 },       // ayirib bo'ladimi 🟢 can_subtract
  { id: '03', label: "3 · Ustunda qo'shish", C: D03_03 },       // o'tkazma bilan 🟡 column_add
  { id: '04', label: '4 · Ustunda ayirish', C: D03_04 },        // qarz bilan 🟡 column_sub
  { id: '05', label: '5 · Tekshirish', C: D03_05 },             // ayirmani tekshirish 🟡 sub_check
  { id: '06', label: '6 · Masala', C: D03_06 },                 // matnli ayirish 🟡 word_sub
  { id: '07', label: "7 · Qulay qo'shish", C: D03_07 },         // guruhlash 🔴 qulay_add
  { id: '08', label: "8 · Uchta qo'shiluvchi", C: D03_08 },     // yangi razryad 🔴 column_add
  { id: '09', label: '9 · Ketma-ket', C: D03_09 },              // bir necha son 🔴 multi_sum
  { id: '10', label: '10 · Qulay ayirish', C: D03_10 },         // yig'indidan ayirish 🔴 qulay_sub
];

export default function Dars03Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 3 amaliyoti — 10 topshiriq (ustun shaklida qo'shish va ayirish)</strong>
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
