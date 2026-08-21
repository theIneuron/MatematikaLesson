// Dars46 amaliyoti — 10 topshiriq. Mavzu: TOMONLAR VA BURCHAKLAR MUNOSABATI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 46-dars raskladkasi: choice, chain, sort, build, bracket, order, chain, fix, slots, build

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D46_01 from './D46_01.jsx';
import D46_02 from './D46_02.jsx';
import D46_03 from './D46_03.jsx';
import D46_04 from './D46_04.jsx';
import D46_05 from './D46_05.jsx';
import D46_06 from './D46_06.jsx';
import D46_07 from './D46_07.jsx';
import D46_08 from './D46_08.jsx';
import D46_09 from './D46_09.jsx';
import D46_10 from './D46_10.jsx';

const HEAD = {
  uz: "Dars 46 amaliyoti — 10 topshiriq (tomonlar va burchaklar munosabati)",
  ru: 'Практика урока 46 — 10 заданий (соотношения сторон и углов)',
  en: 'Lesson 46 practice — 10 tasks (sides and angles)',
};

const ITEMS = [
  { id: '01', label: { uz: "Katta burchak", ru: 'Больший угол', en: 'Larger angle' }, C: D46_01 },  // choice 🟢 qarshisida
  { id: '02', label: { uz: "Katta va kichik", ru: 'Больше и меньше', en: 'Largest and smallest' }, C: D46_02 },  // chain 🟢 80 60 40
  { id: '03', label: { uz: "Tomon qanday", ru: 'Какая сторона', en: 'Which side' }, C: D46_03 },  // sort 🟢 85 / 35 / 60
  { id: '04', label: { uz: "Tengsizlik", ru: 'Неравенство', en: 'Inequality' }, C: D46_04 },  // build 🟡 3, 4, 8
  { id: '05', label: { uz: "Yozish", ru: 'Записать', en: 'Write it' }, C: D46_05 },  // bracket 🟡 a + b > c
  { id: '06', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D46_06 },  // order 🟡 6, 7, 15
  { id: '07', label: { uz: "Chegara", ru: 'Граница', en: 'The bound' }, C: D46_07 },  // chain 🟡 4 va 9
  { id: '08', label: { uz: "Chegaradagi holat", ru: 'Граничный случай', en: 'Boundary case' }, C: D46_08 },  // fix 🔴 2, 3, 5
  { id: '09', label: { uz: "Ikki chegara", ru: 'Две границы', en: 'Two bounds' }, C: D46_09 },  // slots 🔴 7 va 10
  { id: '10', label: { uz: "Eng katta tomon", ru: 'Наибольшая сторона', en: 'Largest side' }, C: D46_10 },  // build 🔴 40° va 60°
];

export default function Dars46Practice({ lang = 'uz' }) {
  usePracticeZoom();
  const [idx, setIdx] = useState(0);
  const q = ITEMS[idx] || ITEMS[0];

  const chip = (active) => ({
    padding: '7px 11px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
    border: '1.5px solid ' + (active ? '#fe5b1a' : '#d6dae3'),
    background: active ? '#fe5b1a' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: "'Manrope', system-ui, sans-serif", whiteSpace: 'nowrap',
  });

  return (
    <div className="pq-fixroot" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {/* MOBIL_DESKTOP_MOSLASH.md naqshi + AMALIYOT_GLOBAL_STANDART.md 1-band: fon #fff7ed. */}
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff7ed;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>{HEAD[lang] || HEAD.uz}</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {i + 1} · {item.label[lang] || item.label.uz}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id + '-' + lang} Question={q.C} lang={lang} showLanguageSwitch={false} title={null} />
      </div>
    </div>
  );
}
