// Dars28 amaliyoti — 10 topshiriq. Mavzu: o'nli kasrlarni ko'paytirish.
// Dastur: urok 7.x — o'nli kasrlarni ko'paytirish (butunga, kasrga).
// Imzo-mexanika = "yuza to'ri": ko'paytma to'rtburchak/lenta yuzasi sifatida sekin bo'yaladi.
// Ikki asosiy g'oya: (a) 1 dan kichikka ko'paytirsa natija kichrayadi; (b) ko'paytmada vergul = kasr xonalar yig'indisi.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D28_01 from './D28_01.jsx';
import D28_02 from './D28_02.jsx';
import D28_03 from './D28_03.jsx';
import D28_04 from './D28_04.jsx';
import D28_05 from './D28_05.jsx';
import D28_06 from './D28_06.jsx';
import D28_07 from './D28_07.jsx';
import D28_08 from './D28_08.jsx';
import D28_09 from './D28_09.jsx';
import D28_10 from './D28_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Katta yoki kichik', C: D28_01 },  // 🟢 MCQ 0,5×6<6 (mul_size)
  { id: '02', label: "2 · 0,2 to'rt marta", C: D28_02 },    // 🟢 input 0,2×4=0,8 (mul_tenth_int)
  { id: '03', label: "3 · O'nta 0,1", C: D28_03 },          // 🟢 Ha/Yo'q 0,1×10=1 (mul_tenth_ten)
  { id: '04', label: '4 · 2,5 uch marta', C: D28_04 },      // 🟡 input 2,5×3=7,5 (mul_mixed_int)
  { id: '05', label: '5 · Moslash', C: D28_05 },            // 🟡 4 juft ifoda→natija (mul_match)
  { id: '06', label: '6 · Xato qadam', C: D28_06 },         // 🟡 xatoni top vergul (mul_comma_error)
  { id: '07', label: '7 · Vergulni joyla', C: D28_07 },     // 🔴 konstruktor 0,48 (mul_place_comma)
  { id: '08', label: '8 · Masala', C: D28_08 },             // 🔴 1,5×4=6 litr (mul_word)
  { id: '09', label: "9 · Son o'qi", C: D28_09 },           // 🔴 0,4×4=1,6 marker (mul_numberline)
  { id: '10', label: '10 · Kasr × kasr', C: D28_10 },       // 🔴 MCQ 0,4×0,5=0,2 (mul_frac_frac)
];

export default function Dars28Practice() {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#0d9488' : '#d6dae3'),
    background: active ? '#0d9488' : '#fff', color: active ? '#fff' : '#374151',
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 28 amaliyoti — 10 topshiriq (o'nli kasrlarni ko'paytirish)</strong>
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
