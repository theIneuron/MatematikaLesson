// Dars24 amaliyoti — 10 topshiriq. Mavzu: o'nli kasr tushunchasi (vergul yozuvi, o'ndan/yuzdan).
// Dastur: urok 7.4 — o'nli kasrlar. Kasr↔o'nli ko'prigi (3/10=0,3, 7/100=0,07).
// Hero mexanika = razryad yozuvi + o'ndan/yuzdan panjaralari (10-lenta, 100-katak to'r).
// Markaziy xato: nol o'rin egallovchini unutish (0,07↔0,7) va maxraj 10/100 razryadini adashtirish.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Lentadan', C: D24_01 },        // 🟢 lenta→0,3
  { id: '02', label: '2 · Moslash', C: D24_02 },         // 🟡 kasr↔o'nli
  { id: '03', label: "3 · Yuzdan to'r", C: D24_03 },     // 🔴 100-katak→0,47
  { id: '04', label: '4 · Kasrga', C: D24_04 },          // 🟢 0,6→6/10
  { id: '05', label: "5 · Nol o'rin", C: D24_05 },       // 🔴 7/100→0,07
  { id: '06', label: "6 · Son o'qi", C: D24_06 },        // 🟡 0,4 tap
  { id: '07', label: '7 · Masala', C: D24_07 },          // 🔴 2 3/10→2,3
  { id: '08', label: "8 · Ha/Yo'q", C: D24_08 },         // 🟢 0,3=3/10?
  { id: '09', label: '9 · Xatoni top', C: D24_09 },      // 🟡 3/10=0,03 xato
  { id: '10', label: '10 · Qaysi kasr', C: D24_10 },     // 🔴 0,07=7/100 MCQ
];

export default function Dars24Practice() {
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
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 24 amaliyoti — 10 topshiriq (o'nli kasr tushunchasi)</strong>
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
