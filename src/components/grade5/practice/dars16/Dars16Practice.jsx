// Dars16 amaliyoti — 10 topshiriq. Mavzu: kasrlarni qisqartirish.
// Qisqartirish = surat va maxrajni umumiy bo'luvchiga bo'lish. Misconception: faqat bittasini bo'lish.
// Qahramonlar: Sanjar, Aziza, Javohir, Umid, Sabina, Laylo.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D16_01 from './D16_01.jsx';
import D16_02 from './D16_02.jsx';
import D16_03 from './D16_03.jsx';
import D16_04 from './D16_04.jsx';
import D16_05 from './D16_05.jsx';
import D16_06 from './D16_06.jsx';
import D16_07 from './D16_07.jsx';
import D16_08 from './D16_08.jsx';
import D16_09 from './D16_09.jsx';
import D16_10 from './D16_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg.
// Tartib bundle TASKS bo'yicha — oson/o'rta/qiyin aralashtirilgan.
const ITEMS = [
  { id: '01', label: '1 · Bir qadam', C: D16_01 },              // 🟢 reduce_one
  { id: '04', label: "2 · Bo'laklarni guruhla", C: D16_04 },   // 🟡 group_reduce (vizual, animatsiyali)
  { id: '07', label: '3 · Xatoni top', C: D16_07 },            // 🔴 find_wrong
  { id: '02', label: '4 · Sodda shakl', C: D16_02 },           // 🟡 which_reduced (12/18)
  { id: '06', label: '5 · Retsept stakani', C: D16_06 },       // 🟡 recipe_glass (6 bo'lak)
  { id: '09', label: '6 · Bir zarbda', C: D16_09 },            // 🔴 reduce_gcd (Sabina/ustoz)
  { id: '03', label: "7 · Tug'ilgan kun torti", C: D16_03 },   // 🟡 cake_equal (tort, Ha/Yo'q)
  { id: '08', label: '8 · Aldanmang', C: D16_08 },             // 🔴 trap_one
  { id: '05', label: '9 · Moslash', C: D16_05 },               // 🟡 match_reduce
  { id: '10', label: '10 · Teng juft', C: D16_10 },            // 🔴 which_two_equal
];

export default function Dars16Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 16 amaliyoti — 10 topshiriq (kasrlarni qisqartirish)</strong>
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
