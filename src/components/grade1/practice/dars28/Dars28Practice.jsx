// Dars28 amaliyoti — 10 topshiriq (masala tuzilishi. Yig'indiga masala): shart→savol→amal→javob; birlashtirilsa qo'shamiz.
// Savollar sbornikdan; metodist talabi bilan QIYIN SONLAR — ikki xonali yig'indi masala (o'tishsiz, ≤99, razryad bo'yicha).
// Xilma-xil: yig'indi masala, amal tanlash, zanjir (D09_06 naqsh), qaysi savol (mantiq), Ha/Yo'q, multi, masala, yechim-tuzish.
// Ramp: 1🟢 / 3🟡 / 6🔴. Olma bog'i syujeti, savat=o'nlik + yakka olma=birlik (D24-27 modeli).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D28_01 from './D28_01.jsx';
import D28_02 from './D28_02.jsx';
import D28_03 from './D28_03.jsx';
import D28_04 from './D28_04.jsx';
import D28_05 from './D28_05.jsx';
import D28_06 from './D28_06.jsx';
import D28_07 from './D28_07.jsx';
import D28_08 from './D28_08.jsx';
import D28_09 from './D28_09.jsx';
import D28_10 from './D28_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): prototip kodi · syujet · qiyinlik
const ITEMS = [
  { id: '01', label: '1 · 23+14', C: D28_01 },        // sum · 23+14=37 🟢
  { id: '02', label: '2 · 34+25', C: D28_02 },        // sum · 34+25=59 (olma) 🟡
  { id: '03', label: '3 · 42+13', C: D28_03 },        // sum · 42+13=55 (olma) 🟡
  { id: '04', label: '4 · Amal', C: D28_04 },         // choose_op · 34 va 25 birlashtirilsa → + 🟡
  { id: '05', label: '5 · Zanjir', C: D28_05 },       // sum_chain · 4 ikki xonali misol (D09_06 naqsh) 🔴
  { id: '06', label: '6 · Savol', C: D28_06 },        // LOGIC question · qaysi qism savol (yangi) 🔴
  { id: '07', label: '7 · Ha/Yo\'q', C: D28_07 },     // sum_tf · 34+25=59 to'g'rimi 🔴
  { id: '08', label: '8 · Javobi 59', C: D28_08 },    // sum_multi · javobi 59 barcha 🔴
  { id: '09', label: '9 · 32+24', C: D28_09 },        // sum_word · 32+24=56 (olma) 🔴
  { id: '10', label: '10 · Yechim', C: D28_10 },      // YANGI build_solution · «Yechimni tuzing» 34+25 🔴
];

export default function Dars28Practice() {
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
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 28 amaliyoti — 10 topshiriq (masala tuzilishi. Yig'indiga masala)</strong>
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
