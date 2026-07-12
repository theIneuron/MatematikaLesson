// Dars21 amaliyoti — 10 topshiriq (sonlar 21–100: o'nliklar va birliklar): ikki xonali son = o'nlik + birlik.
// Xilma-xil format: tanlash, razryad, zanjir, o'nlab sanash (mantiq), multi, M1-rasm, masala, yasash.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i syujeti (savat = 10 olma = 1 o'nlik; yakka olma = birlik). Sonlar 21–100.
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 34', C: D21_01 },        // read_place · 3 savat+4 olma=34 🟢
  { id: '02', label: '2 · O\'nlik', C: D21_02 },   // tens_count · 40=4 o'nlik 🟡
  { id: '03', label: '3 · Razryad', C: D21_03 },   // compose · 5 o'nlik 2 birlik=52 🟡
  { id: '04', label: '4 · Xona', C: D21_04 },      // digit_value · 47 birlik xonasi=7 🟡
  { id: '05', label: '5 · Zanjir', C: D21_05 },    // place_chain · 4 son → nechta o'nlik 🔴
  { id: '06', label: '6 · O\'nlab', C: D21_06 },   // LOGIC skip10 · 10,20,30,?,50→40 (yangi) 🔴
  { id: '07', label: '7 · O\'nligi 4', C: D21_07 },// tens_multi · o'nligi 4 barcha 🔴
  { id: '08', label: '8 · Qaysi', C: D21_08 },     // m1_position · 5 o'nlik 3 birlik=53 vs 35 🔴
  { id: '09', label: '9 · Masala', C: D21_09 },    // place_word · 3 savat 6 olma=36 🔴
  { id: '10', label: '10 · Yasa', C: D21_10 },     // YANGI build_two_digit · «Sonni yasang» 42 🔴
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 21 amaliyoti — 10 topshiriq (sonlar 21–100: o'nliklar va birliklar)</strong>
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
