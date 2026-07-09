// Dars05 amaliyoti — 10 topshiriq (sonning tarkibi 2–5): P5 tarkib + P6 son uyi + LOGIC.
// 5 oson (3🟢/2🟡) + 5 qiyin (🔴) — metodist talabi. Sirk syujeti.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D05_01 from './D05_01.jsx';
import D05_02 from './D05_02.jsx';
import D05_03 from './D05_03.jsx';
import D05_04 from './D05_04.jsx';
import D05_05 from './D05_05.jsx';
import D05_06 from './D05_06.jsx';
import D05_07 from './D05_07.jsx';
import D05_08 from './D05_08.jsx';
import D05_09 from './D05_09.jsx';
import D05_10 from './D05_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Yashirin', C: D05_01 },   // P5 · Jonglyor: jami 3, chapda 2 — o'ngida nechta? 🟢
  { id: '02', label: '2 · Belgi', C: D05_02 },      // P2 · Masxaraboz sharlari: 5 ▢ 7 — spiral (Dars04) 🟢
  { id: '03', label: '3 · Likopcha', C: D05_03 },   // P5 · Itlar: jami 4 suyak, ochiqda 1 — yopig'ida? 🟢
  { id: '04', label: '4 · Son uyi', C: D05_04 },    // P6 · Chodir: tomda 5, qavatda 2 va ? 🟡
  { id: '05', label: '5 · Teng bo\'l', C: D05_05 }, // P5 · 4 koptokni ikki kaftga teng bo'lish 🟡
  { id: '06', label: '6 · Zanjir', C: D05_06 },     // P6 · 5 uyining 3 qavati birdaniga 🔴
  { id: '07', label: '7 · Mantiq', C: D05_07 },     // LOGIC · Parad ABB: sher-koptok-koptok-? 🔴
  { id: '08', label: '8 · Juftlar', C: D05_08 },    // P5 · 5 bo'ladigan BARCHA juftlarni top 🔴
  { id: '09', label: '9 · Qop', C: D05_09 },        // P5 · Sehrgar: jami 5, stolda 2 — qopda? 🔴
  { id: '10', label: '10 · Tarozi', C: D05_10 },    // YANGI · Dorboz tarozisi: jonli tilt, 5=2+3 🔴
];

export default function Dars05Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 5 amaliyoti — 10 topshiriq (sonning tarkibi 2–5)</strong>
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
