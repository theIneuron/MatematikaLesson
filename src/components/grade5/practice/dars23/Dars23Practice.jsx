// Dars23 amaliyoti — 10 topshiriq. Mavzu: aralash sonlarni qo'shish va ayirish.
// Dastur: urok 7.3 — frac_5_15. Kasr qismlari bir xil maxrajli; ko'pi zaymsiz, 1-2 zaymli.
// Markaziy xato: zaymni unutish (kichik kasrdan ayirish) / o'tkazmani unutish.
// Hero mexanika = butun ustuni + kasr ustuni; zaym («1 butunni maydala») va o'tkazma tugmalari.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D23_01 from './D23_01.jsx';
import D23_02 from './D23_02.jsx';
import D23_03 from './D23_03.jsx';
import D23_04 from './D23_04.jsx';
import D23_05 from './D23_05.jsx';
import D23_06 from './D23_06.jsx';
import D23_07 from './D23_07.jsx';
import D23_08 from './D23_08.jsx';
import D23_09 from './D23_09.jsx';
import D23_10 from './D23_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: "1 · Ustunli qo'sh", C: D23_01 },   // 🟢 sodda qo'shish (4 2/7 + 3 3/7)
  { id: '02', label: '2 · Moslash', C: D23_02 },         // 🟡 amal↔natija (zaym/o'tkazma aralash)
  { id: '03', label: '3 · Zaym bilan', C: D23_03 },      // 🔴 zaymli ayirish (5 2/9 − 2 7/9)
  { id: '04', label: '4 · Sodda ayir', C: D23_04 },      // 🟢 sodda ayirish (5 5/6 − 2 1/6)
  { id: '05', label: "5 · O'tkazma", C: D23_05 },        // 🔴 o'tkazmali qo'shish (4 5/6 + 2 5/6)
  { id: '06', label: "6 · Son o'qi", C: D23_06 },        // 🟡 aralash sakrash (1 4/5 + 1 1/5 = 3)
  { id: '07', label: '7 · Masala+zaym', C: D23_07 },     // 🔴 ko'p qadamli + ortiqcha ma'lumot (9 2/7 − 3 1/7 − 2 6/7)
  { id: '08', label: "8 · To'ldir", C: D23_08 },         // 🟢 butungacha (4 − 3 2/5)
  { id: '09', label: '9 · Xatoni top', C: D23_09 },      // 🟡 zaymni unutish (5 1/6 − 2 5/6)
  { id: '10', label: "10 · Qaysi to'g'ri", C: D23_10 },  // 🔴 teskari + o'tkazma MCQ (? 4/5 + 1 3/5 = 5 2/5)
];

export default function Dars23Practice() {
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
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 23 amaliyoti — 10 topshiriq (aralash sonlarni qo'shish va ayirish)</strong>
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
