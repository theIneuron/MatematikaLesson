// Dars01 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: atrofimizdagi katta sonlar.
// Syujet: rasadxona (Bekzod, Madina, Nilufar, Sardor) + kundalik katta sonlar (shaharlar).
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Barcha topshiriqlar darslik §1 (o'qish/yozish/sinflar/xonalar) mashqlariga asoslangan.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Aldov (trap) variantlar bilan.
const ITEMS = [
  { id: '01', label: "1 · O'qish", C: D01_01 },        // katta sonni o'qish 🟢 read_number (30 622 000)
  { id: '02', label: '2 · Xona', C: D01_02 },          // raqamning xonasi 🟢 digit_place (5837, 8→yuzlik)
  { id: '03', label: '3 · Sinflar', C: D01_03 },       // sinflarga ajratish 🟡 class_group (Mashq 3)
  { id: '04', label: "4 · Yig'ish", C: D01_04 },       // xona birliklaridan yig'ish 🟡 place_value_build (Mashq 2)
  { id: '05', label: "5 · So'zdan son", C: D01_05 },   // so'zdan songa 🟡 words_to_number (Mashq 11)
  { id: '06', label: '6 · Nechta ming', C: D01_06 },   // millionda nechta ming 🟡 magnitude_relation (Mashq 13)
  { id: '07', label: '7 · Topishmoq', C: D01_07 },     // xona shartlaridan son 🔴 clue_number (Mashq 2)
  { id: '08', label: '8 · Nolli sinf', C: D01_08 },    // nol sinfli sonni o'qish 🔴 read_zero_class (2-misol)
  { id: '09', label: '9 · Qonuniyat', C: D01_09 },     // ketma-ketlik qonuniyati 🔴 sequence_pattern (Mashq 27)
  { id: '10', label: '10 · Turli raqam', C: D01_10 },  // nechta turli raqam 🔴 distinct_digits (Mashq 25)
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 1 amaliyoti — 10 topshiriq (katta sonlar)</strong>
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
