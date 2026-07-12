// Dars22 amaliyoti — 10 topshiriq (ikki xonali sonlarni taqqoslash): >, <, = — avval o'nliklar, teng bo'lsa birliklar.
// Xilma-xil format: belgi-tanlash, rasm-taqqoslash, zanjir, oraliq son (mantiq), multi, masala, interaktiv timsoh.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i + timsoh (og'zi katta songa ochiladi) syujeti. Sonlar 21–100.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D22_01 from './D22_01.jsx';
import D22_02 from './D22_02.jsx';
import D22_03 from './D22_03.jsx';
import D22_04 from './D22_04.jsx';
import D22_05 from './D22_05.jsx';
import D22_06 from './D22_06.jsx';
import D22_07 from './D22_07.jsx';
import D22_08 from './D22_08.jsx';
import D22_09 from './D22_09.jsx';
import D22_10 from './D22_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Belgi', C: D22_01 },      // compare_sign · 30>20 🟢
  { id: '02', label: '2 · 45·52', C: D22_02 },      // compare_sign · 45<52 (o'nlik) 🟡
  { id: '03', label: '3 · Katta', C: D22_03 },      // compare_pick · 42 vs 24 rasm 🟡
  { id: '04', label: '4 · Birlik', C: D22_04 },     // compare_units · 36>34 (teng o'nlik) 🟡
  { id: '05', label: '5 · Zanjir', C: D22_05 },     // compare_chain · 4 juft belgi 🔴
  { id: '06', label: '6 · Oraliq', C: D22_06 },     // LOGIC between · 40<?<50 (yangi) 🔴
  { id: '07', label: '7 · 40 dan', C: D22_07 },     // compare_multi · 40 dan katta barcha 🔴
  { id: '08', label: '8 · Teng?', C: D22_08 },      // compare_units · 45 vs 48 (M2 teng-tuzoq) 🔴
  { id: '09', label: '9 · Masala', C: D22_09 },     // compare_word · Anvar 34 / Zuhra 43 🔴
  { id: '10', label: '10 · Timsoh', C: D22_10 },    // YANGI compare_croc · «Timsoh qaysi tomonga?» 🔴
];

export default function Dars22Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 22 amaliyoti — 10 topshiriq (ikki xonali sonlarni taqqoslash)</strong>
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
