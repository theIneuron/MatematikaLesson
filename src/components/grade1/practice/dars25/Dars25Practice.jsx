// Dars25 amaliyoti — 10 topshiriq (ikki xonali + bir xonali, o'tishsiz): 34+5 — birlikni birlikka, o'nlik o'zgarmaydi.
// Savollar 1-sinf sbornik/primerlaridan anchor (logiclike/nsportal: 16+3, 12+5, 11+7, 34+5). Faqat qo'shish.
// Xilma-xil: qo'shish, zanjir (D09_06 naqsh), qaysi xona o'zgaradi (mantiq), Ha/Yo'q, multi, masala, birlik qo'shish.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i: savat=o'nlik, yakka olma=birlik; +N yakka olma birliklarga qo'shiladi.
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 34+5', C: D25_01 },        // td_add · 34+5=39 🟢
  { id: '02', label: '2 · 42+3', C: D25_02 },        // td_add · 42+3=45 🟡
  { id: '03', label: '3 · 53+4', C: D25_03 },        // td_add · 53+4=57 🟡
  { id: '04', label: '4 · 65+2', C: D25_04 },        // td_add · 65+2=67 🟡
  { id: '05', label: '5 · Zanjir', C: D25_05 },      // td_chain · 4 misol (D09_06 naqsh) 🔴
  { id: '06', label: '6 · Xona', C: D25_06 },        // LOGIC place · qaysi xona o'zgaradi (yangi) 🔴
  { id: '07', label: '7 · Ha/Yo\'q', C: D25_07 },    // td_tf · 53+4=57 to'g'rimi 🔴
  { id: '08', label: '8 · Javobi 39', C: D25_08 },   // td_multi · javobi 39 barcha 🔴
  { id: '09', label: '9 · Masala', C: D25_09 },      // td_word · 32+5=37 (sbornik) 🔴
  { id: '10', label: '10 · Qo\'sh', C: D25_10 },     // YANGI add_units · «Birlik qo'shing» 34+5 🔴
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 25 amaliyoti — 10 topshiriq (ikki xonali + bir xonali, o'tishsiz)</strong>
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
