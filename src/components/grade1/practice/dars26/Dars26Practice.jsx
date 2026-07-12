// Dars26 amaliyoti — 10 topshiriq (ikki xonali + ikki xonali, o'tishsiz): 34+25 — o'nlikka o'nlik, birlikka birlik.
// Savollar 1-sinf sbornik/primerlaridan anchor (logiclike/infourok: 45+23=68, 34+25=59). Faqat qo'shish.
// Xilma-xil: qo'shish, zanjir (D09_06 naqsh), to'g'ri guruhlash (mantiq), Ha/Yo'q, multi, masala, razryad-birlashtirish.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i: savat=o'nlik, yakka olma=birlik; ikki son razryad bo'yicha birlashadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D26_01 from './D26_01.jsx';
import D26_02 from './D26_02.jsx';
import D26_03 from './D26_03.jsx';
import D26_04 from './D26_04.jsx';
import D26_05 from './D26_05.jsx';
import D26_06 from './D26_06.jsx';
import D26_07 from './D26_07.jsx';
import D26_08 from './D26_08.jsx';
import D26_09 from './D26_09.jsx';
import D26_10 from './D26_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 34+25', C: D26_01 },       // tt_add · 34+25=59 🟢
  { id: '02', label: '2 · 42+13', C: D26_02 },       // tt_add · 42+13=55 🟡
  { id: '03', label: '3 · 53+24', C: D26_03 },       // tt_add · 53+24=77 🟡
  { id: '04', label: '4 · 45+23', C: D26_04 },       // tt_add · 45+23=68 (sbornik) 🟡
  { id: '05', label: '5 · Zanjir', C: D26_05 },      // tt_chain · 4 misol (D09_06 naqsh) 🔴
  { id: '06', label: '6 · Guruh', C: D26_06 },       // LOGIC group · to'g'ri guruhlash (yangi) 🔴
  { id: '07', label: '7 · Ha/Yo\'q', C: D26_07 },    // tt_tf · 53+24=77 to'g'rimi 🔴
  { id: '08', label: '8 · Javobi 59', C: D26_08 },   // tt_multi · javobi 59 barcha 🔴
  { id: '09', label: '9 · Masala', C: D26_09 },      // tt_word · 32+24=56 (sbornik) 🔴
  { id: '10', label: '10 · Razryad', C: D26_10 },    // YANGI combine_place · «Razryad bo'yicha qo'shing» 🔴
];

export default function Dars26Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 26 amaliyoti — 10 topshiriq (ikki xonali + ikki xonali, o'tishsiz)</strong>
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
