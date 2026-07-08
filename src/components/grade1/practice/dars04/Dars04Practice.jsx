// Dars04 amaliyoti — 10 topshiriq (taqqoslash 10 gacha): P4 ko'p/kam/teng + P2 belgi.
// 6 oson (🟢) + 4 qiyin (🔴) — metodist talabi. Hayvonot bog'i syujeti.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D04_01 from './D04_01.jsx';
import D04_02 from './D04_02.jsx';
import D04_03 from './D04_03.jsx';
import D04_04 from './D04_04.jsx';
import D04_05 from './D04_05.jsx';
import D04_06 from './D04_06.jsx';
import D04_07 from './D04_07.jsx';
import D04_08 from './D04_08.jsx';
import D04_09 from './D04_09.jsx';
import D04_10 from './D04_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · Mantiq', C: D04_01 },     // LOGIC · Parad naqshi: fil, maymun, fil, maymun, ? 🟢
  { id: '02', label: '2 · Sanash', C: D04_02 },     // P2 · Pingvin hovuzi: nechta baliq? (7) — spiral 🟢
  { id: '03', label: '3 · Kam', C: D04_03 },        // P4 · Quyonlar: qayerda sabzi kam? (6/4) 🟢
  { id: '04', label: '4 · Teng', C: D04_04 },       // P4 · Pandalar: teng yoki teng emas? (5/5) 🟢
  { id: '05', label: '5 · Belgi', C: D04_05 },      // P2 · Fillar: 7 ▢ 4 — belgini tanla 🟢
  { id: '06', label: '6 · Sonlar', C: D04_06 },     // P4 · Jirafalar: qaysi son katta? (8/6) 🟢
  { id: '07', label: '7 · Zanjir', C: D04_07 },     // P4 · To'tilar: 3 juftga belgi (5_8, 9_6, 7_7) 🔴
  { id: '08', label: '8 · Teng qil', C: D04_08 },   // P4 · Ayiqlar: olma qo'shib teng qil (6/4→6/6) 🔴
  { id: '09', label: '9 · Qafas', C: D04_09 },      // P4 · Sirli qafas: 5 < ▢ — barcha mosini top 🔴
  { id: '10', label: '10 · Timsoh', C: D04_10 },    // YANGI · Timsohni ovqatlantir — og'iz ko'p tomonga 🔴
];

export default function Dars04Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 4 amaliyoti — 10 topshiriq (taqqoslash: ko'p, kam, teng)</strong>
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
