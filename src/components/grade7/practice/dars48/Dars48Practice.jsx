// Dars48 amaliyoti — 10 topshiriq. Mavzu: YAKUNIY TAKRORLASH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 48-dars raskladkasi: choice, bracket, slots, build, order, chain, slots, sort, fix, build
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D48_01 from './D48_01.jsx';
import D48_02 from './D48_02.jsx';
import D48_03 from './D48_03.jsx';
import D48_04 from './D48_04.jsx';
import D48_05 from './D48_05.jsx';
import D48_06 from './D48_06.jsx';
import D48_07 from './D48_07.jsx';
import D48_08 from './D48_08.jsx';
import D48_09 from './D48_09.jsx';
import D48_10 from './D48_10.jsx';

const HEAD = {
  uz: 'Dars 48 amaliyoti — 10 topshiriq (yakuniy takrorlash)',
  ru: 'Практика урока 48 — 10 заданий (итоговое повторение)',
  en: 'Lesson 48 practice — 10 tasks (final revision)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Ikki fakt birga', ru: 'Два факта вместе', en: 'Two facts at once' }, C: D48_01 },  // choice 🟢 rev_ext_sum
  { id: '02', label: { uz: 'Tenglikni yozish', ru: 'Записать равенство', en: 'Write the equality' }, C: D48_02 },  // bracket 🟢 rev_bracket
  { id: '03', label: { uz: 'Ikki fakt birga', ru: 'Два факта вместе', en: 'Two facts at once' }, C: D48_03 },  // slots 🟢 rev_iso_sum
  { id: '04', label: { uz: 'Parallel chiziqlar', ru: 'Параллельные прямые', en: 'Parallel lines' }, C: D48_04 },  // build 🟡 rev_par_letter
  { id: '05', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D48_05 },  // order 🟡 rev_rt_iso
  { id: '06', label: { uz: 'Ikki chegara', ru: 'Две границы', en: 'Two bounds' }, C: D48_06 },  // chain 🟡 rev_ineq_chain
  { id: '07', label: { uz: 'Tenglik va perimetr', ru: 'Равенство и периметр', en: 'Equality and perimeter' }, C: D48_07 },  // slots 🟡 rev_eq_perimeter
  { id: '08', label: { uz: "Nega bo'lmaydi", ru: 'Почему нельзя', en: 'Why not' }, C: D48_08 },  // sort 🔴 rev_zones
  { id: '09', label: { uz: 'Xato qadam', ru: 'Неверный шаг', en: 'The wrong step' }, C: D48_09 },  // fix 🔴 rev_fix
  { id: '10', label: { uz: 'Uch fakt birga', ru: 'Три факта вместе', en: 'Three facts at once' }, C: D48_10 },  // build 🔴 rev_iso_ext
];

export default function Dars48Practice({ lang = 'uz' }) {
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
        /* TELEFONDA SARLAVHA JOY YEMASIN (metodist QA si, 2026-08-22): o'nta
           tugma besh qatorga yoyilib, topshiriq ekrandan pastga tushib ketardi.
           Tor ekranda tugmalar BITTA qatorda, yon tomonga suriladi. */
        @media (max-width:639.98px){
          .pq-fixroot{width:390px;}
          .pq-head{padding:46px 10px 7px !important;}
          .pq-title{font-size:12.5px !important;margin-bottom:2px;}
          .pq-chips{flex-wrap:nowrap !important;overflow-x:auto;scrollbar-width:none;}
          .pq-chips::-webkit-scrollbar{display:none;}
        }
      `}</style>
      <div className="pq-head" style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong className="pq-title" style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>{HEAD[lang] || HEAD.uz}</strong>
        <div className="pq-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', width: '100%' }}>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {i + 1} · {item.label[lang] || item.label.uz}
          </button>
        ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id + '-' + lang} Question={q.C} lang={lang} showLanguageSwitch={false} title={null} />
      </div>
    </div>
  );
}
