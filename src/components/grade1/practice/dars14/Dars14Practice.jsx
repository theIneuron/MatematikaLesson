// Dars14 amaliyoti — 10 topshiriq (Sonlar 11–15): 1 o'nlik + birliklar = o'n bir…o'n besh.
// Kuchaytirilgan ramp: 1🟢 / 3🟡 / 6🔴. Yagona model: 10 UYALI TO'LA YASHIK/QUTI (2×5) = o'nlik,
// yakka buyumlar yashikning O'NG tomonida. Har topshiriqda o'z sahnasi va buyumi (tuxum, olma,
// konfet, ayiqcha, koptok, poyezd, pechene, qalam, nok) — zerikarli takror yo'q.
// Misconception qalqoni: 14 = "1 va 4" EMAS, balki 10 va 4 (to'la yashik + to'rt yakka).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D14_01 from './D14_01.jsx';
import D14_02 from './D14_02.jsx';
import D14_03 from './D14_03.jsx';
import D14_04 from './D14_04.jsx';
import D14_05 from './D14_05.jsx';
import D14_06 from './D14_06.jsx';
import D14_07 from './D14_07.jsx';
import D14_08 from './D14_08.jsx';
import D14_09 from './D14_09.jsx';
import D14_10 from './D14_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Karton', C: D14_01 },     // P13 · tuxum kartoni: to'la karton = 10 — Dars13 spirali 🟢
  { id: '02', label: '2 · O\'n bir', C: D14_02 },   // P13 · olma yashigi: to'la yashik + 1 = 11 🟡
  { id: '03', label: '3 · Konfet', C: D14_03 },     // P13 · konfet qutisi: to'la quti + 4 = ? (14) 🟡
  { id: '04', label: '4 · Ayiqcha', C: D14_04 },    // P13 · ayiqcha yashigi: 13 uchun nechta yakka? (3) 🟡
  { id: '05', label: '5 · Ajrat', C: D14_05 },      // P13 · koptoklar: 14 = 10 + ? (4) 🔴
  { id: '06', label: '6 · Zanjir', C: D14_06 },     // P13 · «Olma bozori» 2×2: to'la yashik + N = 1N 🔴
  { id: '07', label: '7 · Poyezd', C: D14_07 },     // LOGIC · vagonlar ketma-ketligi 11,12,_,14,15 🔴
  { id: '08', label: '8 · Barchasi', C: D14_08 },   // P08 · pechene: 13 ga teng barcha kartalar multi (tuzoq) 🔴
  { id: '09', label: '9 · O\'rin', C: D14_09 },     // P13 · qalam qutisi: 14 = nechta o'nlik + nechta birlik 🔴
  { id: '10', label: '10 · Yasab ol', C: D14_10 },  // YANGI · nok yashigi bor, N yakka qo'shib 13 yasaydi 🔴
];

export default function Dars14Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 14 amaliyoti — 10 topshiriq (Sonlar 11–15)</strong>
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
