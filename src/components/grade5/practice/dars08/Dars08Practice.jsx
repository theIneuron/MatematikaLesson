// Dars08 amaliyoti — 10 topshiriq. Mavzu: sonning darajasi, kvadrat va kub.
// Har topshiriq UNIKAL mexanika + animatsiya. Tartib aralashtirilgan.
// Qahramonlar: Bekzod, Madina, Nilufar, Sardor, Aziza.
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D08_01 from './D08_01.jsx';
import D08_02 from './D08_02.jsx';
import D08_03 from './D08_03.jsx';
import D08_04 from './D08_04.jsx';
import D08_05 from './D08_05.jsx';
import D08_06 from './D08_06.jsx';
import D08_07 from './D08_07.jsx';
import D08_08 from './D08_08.jsx';
import D08_09 from './D08_09.jsx';
import D08_10 from './D08_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Darslik §18 (Sonning darajasi. Kvadrati va kubi) mashqlariga asoslangan.
// Ko'rsatish tartibi aralashtirilgan (oson/o'rta/qiyin navbatma-navbat).
const ITEMS = [
  { id: '01', label: '1 · Kvadrat', C: D08_01 },        // kvadrat to'ri 🟢 square_simple (5²=25)
  { id: '04', label: '2 · Moslash', C: D08_04 },        // kvadratlarni moslash 🟡 square_match
  { id: '07', label: '3 · Ming', C: D08_07 },           // 10³ nollar 🔴 cube_ten (10³=1000)
  { id: '02', label: '4 · Daraja', C: D08_02 },         // daraja shaklida 🟢 write_as_power (6⁴)
  { id: '06', label: "5 · Daraja o'qish", C: D08_06 },  // asos/ko'rsatkich 🟡 read_power (3⁵)
  { id: '09', label: '6 · Taqqoslash', C: D08_09 },     // 3² va 2³ 🔴 power_vs_power
  { id: '03', label: '7 · Darajani qur', C: D08_03 },   // interaktiv quruvchi 🟡 build_power (3⁴=81)
  { id: '10', label: '8 · Masala', C: D08_10 },         // kub qutisi hajmi 🔴 cube_context (5³=125)
  { id: '05', label: '9 · Xatoni top', C: D08_05 },     // xato tenglik 🟡 find_wrong_power (6²≠12)
  { id: '08', label: '10 · Aqlli kvadrat', C: D08_08 }, // 9×10−9 usuli 🔴 square_big (9²=81)
];

export default function Dars08Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 8 amaliyoti — 10 topshiriq (daraja, kvadrat va kub)</strong>
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
