// Dars46 amaliyoti — 10 topshiriq. Mavzu: TO'G'RI BURCHAKLI UCHBURCHAK VA TOMONLAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 46-dars raskladkasi: choice, chain, sort, build, bracket, order, chain, fix, slots, build
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

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
  uz: "Dars 46 amaliyoti — 10 topshiriq (to'g'ri burchakli uchburchak va tomonlar)",
  ru: 'Практика урока 46 — 10 заданий (прямоугольный треугольник и соотношения)',
  en: 'Lesson 46 practice — 10 tasks (right triangles and side relations)',
};

const ITEMS = [
  { id: '01', label: { uz: "To'g'ri burchakli uchburchak", ru: 'Прямоугольный треугольник', en: 'Right triangle' }, C: D46_01 },  // choice 🟢 rt_hypotenuse
  { id: '02', label: { uz: 'Ikki qadam', ru: 'Два шага', en: 'Two steps' }, C: D46_02 },  // chain 🟢 rt_acute_chain
  { id: '03', label: { uz: 'Tomon qanday', ru: 'Какая сторона', en: 'Which side' }, C: D46_03 },  // sort 🟢 side_zones
  { id: '04', label: { uz: 'Uchburchak tengsizligi', ru: 'Неравенство треугольника', en: 'Triangle inequality' }, C: D46_04 },  // build 🟡 tri_ineq
  { id: '05', label: { uz: 'Tengsizlikni yozish', ru: 'Записать неравенство', en: 'Write the inequality' }, C: D46_05 },  // bracket 🟡 ineq_bracket
  { id: '06', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D46_06 },  // order 🟡 rt_order
  { id: '07', label: { uz: 'Ikki chegara', ru: 'Две границы', en: 'Two bounds' }, C: D46_07 },  // chain 🟡 ineq_chain
  { id: '08', label: { uz: 'Chegaradagi holat', ru: 'Граничный случай', en: 'The boundary case' }, C: D46_08 },  // fix 🔴 ineq_fix
  { id: '09', label: { uz: 'Harf bilan', ru: 'С буквой', en: 'With a letter' }, C: D46_09 },  // slots 🔴 rt_letters
  { id: '10', label: { uz: 'Eng katta tomon', ru: 'Наибольшая сторона', en: 'The largest side' }, C: D46_10 },  // build 🔴 side_biggest
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
