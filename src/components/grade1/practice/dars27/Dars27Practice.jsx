// Dars27 amaliyoti — 10 topshiriq (ikki xonali va 100 dan ayirish): 68−25 — o'nlikdan o'nlik, birlikdan birlik + 100−N.
// Savollar 1-sinf sbornik/primerlaridan anchor (68−25=43, 57−24=33, 100−40=60). Faqat ayirish (minus U+2212).
// Xilma-xil: ayirish, 100 dan ayirish, zanjir (D09_06 naqsh), xato topish (mantiq), Ha/Yo'q, multi, masala, razryad-olish.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i: savat=o'nlik, yakka olma=birlik; razryad bo'yicha olib ketamiz; 100=10 savat.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D27_01 from './D27_01.jsx';
import D27_02 from './D27_02.jsx';
import D27_03 from './D27_03.jsx';
import D27_04 from './D27_04.jsx';
import D27_05 from './D27_05.jsx';
import D27_06 from './D27_06.jsx';
import D27_07 from './D27_07.jsx';
import D27_08 from './D27_08.jsx';
import D27_09 from './D27_09.jsx';
import D27_10 from './D27_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 68−25', C: D27_01 },       // ts_sub · 68−25=43 🟢
  { id: '02', label: '2 · 57−24', C: D27_02 },       // ts_sub · 57−24=33 🟡
  { id: '03', label: '3 · 48−13', C: D27_03 },       // ts_sub · 48−13=35 🟡
  { id: '04', label: '4 · 100−40', C: D27_04 },      // ts_sub100 · 100−40=60 🟡
  { id: '05', label: '5 · Zanjir', C: D27_05 },      // ts_chain · 4 misol (D09_06 naqsh) 🔴
  { id: '06', label: '6 · Xato', C: D27_06 },        // LOGIC error · xato topish (yangi) 🔴
  { id: '07', label: '7 · Ha/Yo\'q', C: D27_07 },    // ts_tf · 57−24=33 to'g'rimi 🔴
  { id: '08', label: '8 · Ayirmasi 34', C: D27_08 }, // ts_multi · ayirmasi 34 barcha 🔴
  { id: '09', label: '9 · Masala', C: D27_09 },      // ts_word · 56−23=33 (sbornik) 🔴
  { id: '10', label: '10 · Razryad', C: D27_10 },    // YANGI remove_place · «Razryad bo'yicha oling» 🔴
];

export default function Dars27Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 27 amaliyoti — 10 topshiriq (ikki xonali va 100 dan ayirish)</strong>
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
