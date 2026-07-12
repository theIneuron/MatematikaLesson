// Dars15 amaliyoti — 10 topshiriq (Sonlar 16–20): 1 o'nlik + birliklar = o'n olti…yigirma.
// Yumshoq ramp: 2🟢 / 5🟡 / 3🔴. Qalam do'koni syujeti (1 dasta + yakka; 20 = 2 dasta).
// Darslik 5-bob "11 dan 20 gacha sonlar" mashq turlari: o'qish, tuzish, taqqoslash (> <),
// sonlar qatori, o'sish tartibi, ajratish, yasash.
// Misconception qalqoni: 18 = "1 va 8" EMAS, balki 10 va 8; 20 = 2 o'nlik (2 dasta).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D15_01 from './D15_01.jsx';
import D15_02 from './D15_02.jsx';
import D15_03 from './D15_03.jsx';
import D15_04 from './D15_04.jsx';
import D15_05 from './D15_05.jsx';
import D15_06 from './D15_06.jsx';
import D15_07 from './D15_07.jsx';
import D15_08 from './D15_08.jsx';
import D15_09 from './D15_09.jsx';
import D15_10 from './D15_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · O\'n besh', C: D15_01 },  // o'qish · 1 dasta + 5 = 15 — Dars14 spirali 🟢
  { id: '02', label: '2 · O\'n olti', C: D15_02 },  // o'qish · 1 dasta + 6 = 16 🟢
  { id: '03', label: '3 · O\'n yetti', C: D15_03 }, // o'qish · 1 dasta + 7 = 17 🟡
  { id: '04', label: '4 · O\'n sakkiz', C: D15_04 },// tuzish · 18 uchun nechta yakka (8) 🟡
  { id: '05', label: '5 · Taqqosla', C: D15_05 },   // taqqoslash · 16 ◻ 13 (> < =) 🟡
  { id: '06', label: '6 · Qaysi katta', C: D15_06 },// taqqoslash · 17 yoki 15 — kattasini bosish 🟡
  { id: '07', label: '7 · Qator', C: D15_07 },      // sonlar qatori · 15,16,_,18 → 17 🟡
  { id: '08', label: '8 · Ajrat', C: D15_08 },      // ajratish · 19 = 10 + ? (9) 🔴
  { id: '09', label: '9 · Tartibla', C: D15_09 },   // o'sish tartibi · 16 17 18 20 (tap-ketma-ket) 🔴
  { id: '10', label: '10 · Yasab ol', C: D15_10 },  // yasash · 10 yakka qo'shib 2-dasta = 20 🔴
];

export default function Dars15Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 15 amaliyoti — 10 topshiriq (Sonlar 16–20)</strong>
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
