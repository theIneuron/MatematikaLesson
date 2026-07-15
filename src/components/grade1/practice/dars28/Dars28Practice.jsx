// Dars28 amaliyoti — 10 topshiriq (masala tuzilishi. Yig'indiga masala): shart→savol→amal→javob; birlashtirilsa qo'shamiz.
// SODDALASHTIRILDI (metodist talabi 2026-07-15): o'quvchi savolni tushunmagani sabab — SONLAR 10 ICHIDA
// (bir xonali, o'nlik/razryad YO'Q), matn qisqa, murakkab formatlar (zanjir/ko'p-tanlov/mantiq) olib tashlandi.
// Diqqat — savol MA'NOSIda: "jami → qo'shamiz". Olma bog'i syujeti; yakka olma modeli.
// Xilma-xil: yig'indi masala (sonli), amal tanlash (+/−), qizil+yashil, to'g'ri-noto'g'ri, shart+savol tuzilishi.
// Ramp: 3🟢 / 6🟡 / 1🔴.
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
  { id: '01', label: '1 · 3+2', C: D28_01 },              // sum · 3+2=5 🟢
  { id: '02', label: '2 · 4+2', C: D28_02 },              // sum · Anvar+Zuhra 4+2=6 🟢
  { id: '03', label: '3 · 5+3', C: D28_03 },              // sum · 5+3=8 🟢
  { id: '04', label: '4 · Amal', C: D28_04 },             // choose_op · 4 va 3 birlashsa → + 🟡
  { id: '05', label: '5 · 2+5', C: D28_05 },              // sum · Zuhra+Jasur 2+5=7 🟡
  { id: '06', label: '6 · Qizil+yashil', C: D28_06 },     // sum · 3 qizil + 3 yashil = 6 🟡
  { id: '07', label: '7 · To\'g\'rimi', C: D28_07 },      // sum_tf · 5+3=8 to'g'rimi (Ha) 🟡
  { id: '08', label: '8 · 6+2', C: D28_08 },              // sum · 6+2=8 🟡
  { id: '09', label: '9 · 5+4', C: D28_09 },              // sum · Anvar+Ra'no 5+4=9 🔴
  { id: '10', label: '10 · Masala', C: D28_10 },          // sum_structure · shart+savol 6+3=9 🔴
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
