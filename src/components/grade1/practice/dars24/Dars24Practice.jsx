// Dars24 amaliyoti — 10 topshiriq (yumaloq o'nliklarni qo'shish va ayirish): 20+30, 80−30 — o'nliklarni sanaymiz.
// Savollar 1-sinf sbornik zadach/primerlaridan (metodist talabi). Xilma-xil: qo'shish, ayirish, zanjir,
// bir xil javob (mantiq), multi, 100 dan ayirish, masala, interaktiv birlashtirish.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i, savat = 10 olma = 1 o'nlik (o'nlik-blok). Sonlar 0–100 (yumaloq o'nliklar).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D24_01 from './D24_01.jsx';
import D24_02 from './D24_02.jsx';
import D24_03 from './D24_03.jsx';
import D24_04 from './D24_04.jsx';
import D24_05 from './D24_05.jsx';
import D24_06 from './D24_06.jsx';
import D24_07 from './D24_07.jsx';
import D24_08 from './D24_08.jsx';
import D24_09 from './D24_09.jsx';
import D24_10 from './D24_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 20+30', C: D24_01 },      // round_add · 20+30=50 🟢
  { id: '02', label: '2 · 50+40', C: D24_02 },      // round_add · 50+40=90 🟡
  { id: '03', label: '3 · 70−30', C: D24_03 },      // round_sub · 70−30=40 🟡
  { id: '04', label: '4 · 90−20', C: D24_04 },      // round_sub · 90−20=70 🟡
  { id: '05', label: '5 · Zanjir', C: D24_05 },     // round_chain · 4 misol 🔴
  { id: '06', label: '6 · Bir xil', C: D24_06 },    // LOGIC equal · 30+20=70−20 (yangi) 🔴
  { id: '07', label: '7 · 100−70', C: D24_07 },     // round_sub · 100−70=30 (yuz=10 o'nlik) 🔴
  { id: '08', label: '8 · Javobi 50', C: D24_08 },  // round_multi · javobi 50 barcha 🔴
  { id: '09', label: '9 · Masala', C: D24_09 },     // round_word · 30+20=50 (sbornik) 🔴
  { id: '10', label: '10 · Birlashtir', C: D24_10 },// YANGI combine_tens · «Savatlarni birlashtiring» 🔴
];

export default function Dars24Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 24 amaliyoti — 10 topshiriq (yumaloq o'nliklarni qo'shish va ayirish)</strong>
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
