// Dars22 amaliyoti — 10 topshiriq. Mavzu: aralash sonni noto'g'ri kasrga o'tkazish va aksincha.
// Dastur: urok 7.2 — frac_5_14. Markaziy xato: butun+maxraj (qo'shish) ko'paytirish o'rniga.
// YANGI mexanikalar (oldingi darslardan farqli): konversiya-mashinasi, butunga qadoqlash,
// butunlarni ajratib olish hisoblagichi, ikki-ko'rinishli slayder, o'tkazishlarni tasdiqlash.
// Daraja 3🟢 / 3🟡 / 4🔴, tartib aralash. PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D22_01 from './D22_01.jsx';
import D22_02 from './D22_02.jsx';
import D22_03 from './D22_03.jsx';
import D22_04 from './D22_04.jsx';
import D22_05 from './D22_05.jsx';
import D22_06 from './D22_06.jsx';
import D22_07 from './D22_07.jsx';
import D22_08 from './D22_08.jsx';
import D22_09 from './D22_09.jsx';
import D22_10 from './D22_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): tur · daraja · teg
const ITEMS = [
  { id: '01', label: '1 · Mashina', C: D22_01 },        // 🟢 konversiya mashinasi qora quti (2⅗→13/5)
  { id: '02', label: '2 · Qadoqla', C: D22_02 },        // 🟡 bo'laklarni butunga (11/3→3⅔)
  { id: '03', label: '3 · Ajratib ol', C: D22_03 },     // 🔴 butunlarni ol hisoblagich (23/6→3⅚)
  { id: '04', label: '4 · Yashirin surat', C: D22_04 }, // 🟢 4¼ = ?/4 (17/4)
  { id: '05', label: "5 · To'g'rilarini top", C: D22_05 }, // 🔴 ikki yo'nalishli tasdiqlash
  { id: '06', label: '6 · Slayder', C: D22_06 },        // 🟡 ikki ko'rinishli slayder (11/3→3⅔)
  { id: '07', label: '7 · Masala', C: D22_07 },         // 🔴 19/4 pitssa → 4¾
  { id: '08', label: '8 · Qaysi teng', C: D22_08 },     // 🟢 test 16/5 = 3⅕
  { id: '09', label: '9 · Xatoni top', C: D22_09 },     // 🟡 o'tkazish xatosi (3⅖=8/5)
  { id: '10', label: "10 · Son o'qi", C: D22_10 },      // 🔴 nuqtani aralash yoz (17/5→3⅖)
];

export default function Dars22Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 22 amaliyoti — 10 topshiriq (aralash ↔ noto'g'ri kasr o'tkazish)</strong>
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
