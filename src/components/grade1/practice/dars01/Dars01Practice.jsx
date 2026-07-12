// Dars01 amaliyoti — 10 topshiriq (osondan qiyinga), P1 + P2 variatsiyalari.
// Ra'noning tongi syujeti bo'ylab: bog' → Anvar → Bit → Zuhra → Jasur → chaman → bozor → kun oxiri.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D01_01 from './D01_01.jsx';
import D01_02 from './D01_02.jsx';
import D01_03 from './D01_03.jsx';
import D01_04 from './D01_04.jsx';
import D01_05 from './D01_05.jsx';
import D01_06 from './D01_06.jsx';
import D01_07 from './D01_07.jsx';
import D01_08 from './D01_08.jsx';
import D01_09 from './D01_09.jsx';
import D01_10 from './D01_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Lola', C: D01_01 },    // P1 · Ra'noning bog'i — nechta lola? 🟢
  { id: '02', label: '2 · Baliq', C: D01_02 },   // P1 · Anvarning akvariumi — nechta baliq? 🟢
  { id: '03', label: '3 · Chiroq', C: D01_03 },  // P2 · Bit robot — nechta chiroq yondi? (sanab raqamni tanla) 🟢
  { id: '04', label: '4 · Yulduz', C: D01_04 },  // P1 · Zuhra osmonda — nechta yulduz? 🟡
  { id: '05', label: '5 · Shar', C: D01_05 },    // P2 · Jasur — qaysi shodada 4 ta shar? 🟡
  { id: '06', label: '6 · Barmoq', C: D01_06 },  // P1 · Barmoq o'yini — nechta barmoq? 🟡
  { id: '07', label: '7 · Kapalak', C: D01_07 }, // P1 · Bog' — asalarilar orasidan faqat kapalak 🔴
  { id: '08', label: '8 · Karta', C: D01_08 },   // P2 · Zuhra — qaysi kartada 5 ta yulduzcha? 🟡
  { id: '09', label: '9 · Birga', C: D01_09 },   // P1 · Ra'no va Anvar — aralash mevani birga sana (3+2) 🔴
  { id: '10', label: '10 · Quvvat', C: D01_10 }, // P2 · Robot — 4 qutidan qaysida 5 ta ⚡? 🔴
];

export default function Dars01Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 1 amaliyoti — 10 topshiriq (sanash 1–5)</strong>
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
