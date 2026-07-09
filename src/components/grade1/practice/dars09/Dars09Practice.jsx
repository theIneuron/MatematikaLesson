// Dars09 amaliyoti — 10 topshiriq (5 ichida qo'shish va ayirish): son o'qida sakrash + LOGIC.
// Kuchaytirilgan ramp: 1🟢 / 3🟡 / 6🔴. Hovuz bo'yida syujeti (qurbaqa = son o'qi modeli).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D09_01 from './D09_01.jsx';
import D09_02 from './D09_02.jsx';
import D09_03 from './D09_03.jsx';
import D09_04 from './D09_04.jsx';
import D09_05 from './D09_05.jsx';
import D09_06 from './D09_06.jsx';
import D09_07 from './D09_07.jsx';
import D09_08 from './D09_08.jsx';
import D09_09 from './D09_09.jsx';
import D09_10 from './D09_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Takror', C: D09_01 },     // P9 · Bargda 5 baqa, 2 suvga sakradi — Dars08 spirali 🟢
  { id: '02', label: '2 · Oldinga', C: D09_02 },    // P10 · O'qda 1 dan 2 oldinga — qayerga yetdi? 🟡
  { id: '03', label: '3 · Orqaga', C: D09_03 },     // P10 · 4 dan 1 orqaga — qayerda? 🟡
  { id: '04', label: '4 · Yozuv', C: D09_04 },      // P8 · Arkka mos yozuv: «2 + 3» (3+2 aldamchi!) 🟡
  { id: '05', label: '5 · Detektiv', C: D09_05 },   // P10 · 5 da edi, endi 2 da — nima qilgan? 🔴
  { id: '06', label: '6 · Zanjir', C: D09_06 },     // P8 · ARALASH: 2+3, 5−4, 1+2, 4−2 🔴
  { id: '07', label: '7 · Mantiq', C: D09_07 },     // LOGIC · Analogiya: katta→kichik 🔴
  { id: '08', label: '8 · Barglar', C: D09_08 },    // P10 · Natijasi TO'RT — 5 tadan 4 (5−2 tuzoq) 🔴
  { id: '09', label: '9 · Masala', C: D09_09 },     // P9 · Aralash 2 bosqich: 3+2−1=4 🔴
  { id: '10', label: '10 · Sakrat', C: D09_10 },    // YANGI · Qurbaqani o'zi sakratadi: 2+3 o'qda 🔴
];

export default function Dars09Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 9 amaliyoti — 10 topshiriq (5 ichida qo'shish va ayirish)</strong>
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
