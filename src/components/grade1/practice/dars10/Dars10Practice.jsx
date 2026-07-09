// Dars10 amaliyoti — 10 topshiriq (10 ichida qo'shish va ayirish): yuk-lifti son o'qi + LOGIC.
// Kuchaytirilgan ramp: 1🟢 / 3🟡 / 6🔴. Fabrika syujeti (lift = vertikal son o'qi 0-10).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D10_01 from './D10_01.jsx';
import D10_02 from './D10_02.jsx';
import D10_03 from './D10_03.jsx';
import D10_04 from './D10_04.jsx';
import D10_05 from './D10_05.jsx';
import D10_06 from './D10_06.jsx';
import D10_07 from './D10_07.jsx';
import D10_08 from './D10_08.jsx';
import D10_09 from './D10_09.jsx';
import D10_10 from './D10_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Yo\'l', C: D10_01 },       // P10 · Robot 4 dan 3 oldinga — Dars09 spirali (0-10) 🟢
  { id: '02', label: '2 · Yuqoriga', C: D10_02 },   // P10 · Lift 3 dan 5 tepaga — qaysi qavat? 🟡
  { id: '03', label: '3 · Pastga', C: D10_03 },     // P10 · Lift 9 dan 4 pastga — qayerda? 🟡
  { id: '04', label: '4 · Yozuv', C: D10_04 },      // P8 · Konveyer-rasmga mos: «6 + 2» 🟡
  { id: '05', label: '5 · Detektiv', C: D10_05 },   // P10 · Lift 2 da edi endi 8 da — nima qildi? 🔴
  { id: '06', label: '6 · Zanjir', C: D10_06 },     // P8 · ARALASH: 6+3, 10−4, 5+4, 8−6 🔴
  { id: '07', label: '7 · Mantiq', C: D10_07 },     // LOGIC · Ortiqchani top: 3 ta 10, 1 boshqacha 🔴
  { id: '08', label: '8 · Kartalar', C: D10_08 },   // P10 · Natijasi YETTI — 5 tadan 4 (10−4 tuzoq) 🔴
  { id: '09', label: '9 · Masala', C: D10_09 },     // P9 · Aralash 2 bosqich: 4+5−2=7 🔴
  { id: '10', label: '10 · Mashina', C: D10_10 },   // YANGI · Sehrli mashina: qoida «+3» funksiya 🔴
];

export default function Dars10Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 10 amaliyoti — 10 topshiriq (10 ichida qo'shish va ayirish)</strong>
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
