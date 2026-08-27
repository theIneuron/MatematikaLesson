// Dars43 amaliyoti — 10 topshiriq. Mavzu: TENG YONLI UCHBURCHAK.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 43-dars raskladkasi: build, choice, build, sort, fix, slots, order, build, chain, bracket
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D43_01 from './D43_01.jsx';
import D43_02 from './D43_02.jsx';
import D43_03 from './D43_03.jsx';
import D43_04 from './D43_04.jsx';
import D43_05 from './D43_05.jsx';
import D43_06 from './D43_06.jsx';
import D43_07 from './D43_07.jsx';
import D43_08 from './D43_08.jsx';
import D43_09 from './D43_09.jsx';
import D43_10 from './D43_10.jsx';

const HEAD = {
  uz: 'Dars 43 amaliyoti — 10 topshiriq (teng yonli uchburchak)',
  ru: 'Практика урока 43 — 10 заданий (равнобедренный треугольник)',
  en: 'Lesson 43 practice — 10 tasks (the isosceles triangle)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Asosdagi burchaklar', ru: 'Углы при основании', en: 'Base angles' }, C: D43_01 },  // build 🟢 iso_base_equal
  { id: '02', label: { uz: 'Teskari tomon', ru: 'Обратное свойство', en: 'The converse' }, C: D43_02 },  // choice 🟢 iso_converse
  { id: '03', label: { uz: 'Yon tomon va perimetr', ru: 'Боковая и периметр', en: 'Leg and perimeter' }, C: D43_03 },  // build 🟢 iso_side_p
  { id: '04', label: { uz: 'Teng yonlimi', ru: 'Равнобедренный ли', en: 'Isosceles or not' }, C: D43_04 },  // sort 🟡 iso_zones
  { id: '05', label: { uz: 'Xato xulosa', ru: 'Неверный вывод', en: 'The wrong claim' }, C: D43_05 },  // fix 🟡 iso_fix
  { id: '06', label: { uz: 'Uchidan tushgan chiziq', ru: 'Линия из вершины', en: 'The line from the apex' }, C: D43_06 },  // slots 🟡 iso_median
  { id: '07', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D43_07 },  // order 🟡 iso_leg_order
  { id: '08', label: { uz: 'Harf bilan', ru: 'С буквой', en: 'With a letter' }, C: D43_08 },  // build 🔴 iso_letter_sides
  { id: '09', label: { uz: 'Ikki qadam', ru: 'Два шага', en: 'Two steps' }, C: D43_09 },  // chain 🔴 iso_chain
  { id: '10', label: { uz: 'Xossani yozish', ru: 'Записать свойство', en: 'Write the property' }, C: D43_10 },  // bracket 🔴 iso_bracket
];

export default function Dars43Practice({ lang = 'uz' }) {
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
