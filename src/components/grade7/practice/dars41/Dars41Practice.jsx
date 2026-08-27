// Dars41 amaliyoti — 10 topshiriq. Mavzu: UCHBURCHAK VA UNING TURLARI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 41-dars raskladkasi: order, choice, build, fix, sort, slots, bracket, build, order, chain
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D41_01 from './D41_01.jsx';
import D41_02 from './D41_02.jsx';
import D41_03 from './D41_03.jsx';
import D41_04 from './D41_04.jsx';
import D41_05 from './D41_05.jsx';
import D41_06 from './D41_06.jsx';
import D41_07 from './D41_07.jsx';
import D41_08 from './D41_08.jsx';
import D41_09 from './D41_09.jsx';
import D41_10 from './D41_10.jsx';

const HEAD = {
  uz: 'Dars 41 amaliyoti — 10 topshiriq (uchburchak va uning turlari)',
  ru: 'Практика урока 41 — 10 заданий (треугольник и виды)',
  en: 'Lesson 41 practice — 10 tasks (triangle and its kinds)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Ikki nom', ru: 'Два имени', en: 'Two names' }, C: D41_01 },  // order 🟢 kind_two_names
  { id: '02', label: { uz: "Burchaklar bo'yicha", ru: 'По углам', en: 'By angles' }, C: D41_02 },  // choice 🟢 kind_equilateral
  { id: '03', label: { uz: 'Uch teng tomon', ru: 'Три равные стороны', en: 'Three equal sides' }, C: D41_03 },  // build 🟢 kind_three_equal
  { id: '04', label: { uz: 'Xato xulosa', ru: 'Неверный вывод', en: 'The wrong claim' }, C: D41_04 },  // fix 🟡 kind_fix
  { id: '05', label: { uz: "Uch to'plam", ru: 'Три набора', en: 'Three sets' }, C: D41_05 },  // sort 🟡 kind_zones
  { id: '06', label: { uz: 'Nom va perimetr', ru: 'Имя и периметр', en: 'Name and perimeter' }, C: D41_06 },  // slots 🟡 kind_name_perimeter
  { id: '07', label: { uz: 'Formula', ru: 'Формула', en: 'Formula' }, C: D41_07 },  // bracket 🟡 kind_formula
  { id: '08', label: { uz: 'Nom va perimetr', ru: 'Имя и периметр', en: 'Name and perimeter' }, C: D41_08 },  // build 🔴 kind_long_p
  { id: '09', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D41_09 },  // order 🔴 kind_leg_from_p
  { id: '10', label: { uz: 'Harf bilan', ru: 'С буквой', en: 'With a letter' }, C: D41_10 },  // chain 🔴 kind_letter_p
];

export default function Dars41Practice({ lang = 'uz' }) {
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
