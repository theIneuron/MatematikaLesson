// Dars35 amaliyoti — 10 topshiriq (MASSA — KILOGRAMM, Блок 7 o'lchov).
// YADRO: og'irroq/yengilroq (ikki pallali tarozi — og'ir tomon pastga); kilogramm (kg); kg da sanoq/qo'shish.
// Mexanika: tarozi-o'qish (P26), belgi (P4), taqqoslash, muvozanat, qo'shish, masala, interaktiv muvozanatlash.
// Ramp: 2🟢 / 4🟡 / 4🔴. Misconception: M1 KATTA=OG'IR (hajm≠massa — qarshi-namuna: kichik metall og'ir), M2 og'ir tomonni teskari, M3 birlik.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D35_01 from './D35_01.jsx';
import D35_02 from './D35_02.jsx';
import D35_03 from './D35_03.jsx';
import D35_04 from './D35_04.jsx';
import D35_05 from './D35_05.jsx';
import D35_06 from './D35_06.jsx';
import D35_07 from './D35_07.jsx';
import D35_08 from './D35_08.jsx';
import D35_09 from './D35_09.jsx';
import D35_10 from './D35_10.jsx';

const ITEMS = [
  { id: '01', label: '1 · Og\'ir', C: D35_01 },         // which_heavier (tarozi) 🟢
  { id: '02', label: '2 · Necha kg', C: D35_02 },       // read_kg 🟢
  { id: '03', label: '3 · 5 vs 3', C: D35_03 },         // compare_kg 🟡
  { id: '04', label: '4 · Belgi', C: D35_04 },          // sign >/</= (P4) 🟡
  { id: '05', label: '5 · Katta≠og\'ir', C: D35_05 },   // size!=mass (M1 counter) 🟡
  { id: '06', label: '6 · Muvozanat', C: D35_06 },      // balance_equal 🟡
  { id: '07', label: '7 · 2+3 kg', C: D35_07 },         // add_kg 🔴
  { id: '08', label: '8 · Javobi 5kg', C: D35_08 },     // multi javobi 5 kg 🔴
  { id: '09', label: '9 · Masala', C: D35_09 },         // mass word 8-3 kg 🔴
  { id: '10', label: '10 · Muvozanatla', C: D35_10 },   // interactive balance 🔴
];

export default function Dars35Practice() {
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
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 35 amaliyoti — 10 topshiriq (massa — kilogramm)</strong>
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
