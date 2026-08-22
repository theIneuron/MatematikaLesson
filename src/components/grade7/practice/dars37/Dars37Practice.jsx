// Dars37 amaliyoti — 10 topshiriq. Mavzu: TO'G'RI PROPORSIONALLIK.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 37-dars raskladkasi: build, choice, order, sort, bracket, fix, build, slots, build, chain
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D37_01 from './D37_01.jsx';
import D37_02 from './D37_02.jsx';
import D37_03 from './D37_03.jsx';
import D37_04 from './D37_04.jsx';
import D37_05 from './D37_05.jsx';
import D37_06 from './D37_06.jsx';
import D37_07 from './D37_07.jsx';
import D37_08 from './D37_08.jsx';
import D37_09 from './D37_09.jsx';
import D37_10 from './D37_10.jsx';

const HEAD = {
  uz: "Dars 37 amaliyoti — 10 topshiriq (to'g'ri proporsionallik)",
  ru: 'Практика урока 37 — 10 заданий (прямая пропорциональность)',
  en: 'Lesson 37 practice — 10 tasks (direct proportion)',
};

const ITEMS = [
  { id: '01', label: { uz: 'k ni topish', ru: 'Найти k', en: 'Find k' }, C: D37_01 },  // build 🟢 prop_find_k
  { id: '02', label: { uz: 'Qaysi biri', ru: 'Какая из них', en: 'Which one' }, C: D37_02 },  // choice 🟢 which_prop
  { id: '03', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D37_03 },  // order 🟢 prop_order
  { id: '04', label: { uz: 'Uch formula', ru: 'Три формулы', en: 'Three formulas' }, C: D37_04 },  // sort 🟡 prop_zones
  { id: '05', label: { uz: 'Qoidani yozish', ru: 'Записать правило', en: 'Write the rule' }, C: D37_05 },  // bracket 🟡 prop_rule
  { id: '06', label: { uz: 'Xato qadam', ru: 'Неверный шаг', en: 'The wrong step' }, C: D37_06 },  // fix 🟡 prop_fix
  { id: '07', label: { uz: 'Formula va qiymat', ru: 'Формула и значение', en: 'Formula and value' }, C: D37_07 },  // build 🟡 prop_build
  { id: '08', label: { uz: 'Jadval', ru: 'Таблица', en: 'The table' }, C: D37_08 },  // slots 🔴 prop_table
  { id: '09', label: { uz: 'Necha barobar', ru: 'Во сколько раз', en: 'How many times' }, C: D37_09 },  // build 🔴 prop_times
  { id: '10', label: { uz: 'Zanjir', ru: 'Цепочка', en: 'A chain' }, C: D37_10 },  // chain 🔴 prop_chain
];

export default function Dars37Practice({ lang = 'uz' }) {
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
