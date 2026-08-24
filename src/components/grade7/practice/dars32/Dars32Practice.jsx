// Dars32 amaliyoti — 10 topshiriq. Mavzu: ALGEBRAIK KASRLAR: QISQARTIRISH VA UMUMIY MAXRAJ.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 32-dars raskladkasi: choice, chain, build, bracket, order, build, slots, fix, build, sort
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D32_01 from './D32_01.jsx';
import D32_02 from './D32_02.jsx';
import D32_03 from './D32_03.jsx';
import D32_04 from './D32_04.jsx';
import D32_05 from './D32_05.jsx';
import D32_06 from './D32_06.jsx';
import D32_07 from './D32_07.jsx';
import D32_08 from './D32_08.jsx';
import D32_09 from './D32_09.jsx';
import D32_10 from './D32_10.jsx';

const HEAD = {
  uz: 'Dars 32 amaliyoti — 10 topshiriq (algebraik kasrlar: qisqartirish va umumiy maxraj)',
  ru: 'Практика урока 32 — 10 заданий (алгебраические дроби: сокращение и общий знаменатель)',
  en: 'Lesson 32 practice — 10 tasks (algebraic fractions and common denominators)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Qisqartirish', ru: 'Сокращение', en: 'Cancelling' }, C: D32_01 },  // choice 🟢 frac_can_cancel
  { id: '02', label: { uz: 'Ikki qadam', ru: 'Два шага', en: 'Two steps' }, C: D32_02 },  // chain 🟢 frac_chain
  { id: '03', label: { uz: "Bo\\'lish", ru: 'Деление', en: 'Division' }, C: D32_03 },  // build 🟢 frac_build
  { id: '04', label: { uz: 'Umumiy maxraj', ru: 'Общий знаменатель', en: 'Common denominator' }, C: D32_04 },  // bracket 🟡 frac_common_denom
  { id: '05', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D32_05 },  // order 🟡 frac_order
  { id: '06', label: { uz: 'Bir xil maxraj', ru: 'Одинаковый знаменатель', en: 'Same denominator' }, C: D32_06 },  // build 🟡 frac_add_same
  { id: '07', label: { uz: 'Keltirish', ru: 'Приведение', en: 'Bringing to one denominator' }, C: D32_07 },  // slots 🟡 frac_to_common
  { id: '08', label: { uz: 'Xato had', ru: 'Неверный член', en: 'The wrong term' }, C: D32_08 },  // fix 🔴 frac_fix
  { id: '09', label: { uz: 'Kvadrat bilan', ru: 'С квадратом', en: 'With a square' }, C: D32_09 },  // build 🔴 frac_square
  { id: '10', label: { uz: 'Uch juftlik', ru: 'Три пары', en: 'Three pairs' }, C: D32_10 },  // sort 🔴 frac_denom_zones
];

export default function Dars32Practice({ lang = 'uz' }) {
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
