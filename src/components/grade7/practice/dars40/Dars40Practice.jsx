// Dars40 amaliyoti — 10 topshiriq. Mavzu: CHIZIQLAR VA BURCHAKLAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 40-dars raskladkasi: choice, chain, slots, build, bracket, build, sort, order, build, fix
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D40_01 from './D40_01.jsx';
import D40_02 from './D40_02.jsx';
import D40_03 from './D40_03.jsx';
import D40_04 from './D40_04.jsx';
import D40_05 from './D40_05.jsx';
import D40_06 from './D40_06.jsx';
import D40_07 from './D40_07.jsx';
import D40_08 from './D40_08.jsx';
import D40_09 from './D40_09.jsx';
import D40_10 from './D40_10.jsx';

const HEAD = {
  uz: 'Dars 40 amaliyoti — 10 topshiriq (chiziqlar va burchaklar)',
  ru: 'Практика урока 40 — 10 заданий (прямые и углы)',
  en: 'Lesson 40 practice — 10 tasks (lines and angles)',
};

const ITEMS = [
  { id: '01', label: { uz: "Qo'shni burchak", ru: 'Смежный угол', en: 'Adjacent angle' }, C: D40_01 },  // choice 🟢 ang_adjacent
  { id: '02', label: { uz: 'Ikki qadam', ru: 'Два шага', en: 'Two steps' }, C: D40_02 },  // chain 🟢 ang_chain
  { id: '03', label: { uz: "Kesma bo'laklari", ru: 'Части отрезка', en: 'Parts of a segment' }, C: D40_03 },  // slots 🟢 seg_slots
  { id: '04', label: { uz: 'Vertikal burchaklar', ru: 'Вертикальные углы', en: 'Vertical angles' }, C: D40_04 },  // build 🟡 ang_vert_letter
  { id: '05', label: { uz: 'Tenglamani yozish', ru: 'Записать уравнение', en: 'Write the equation' }, C: D40_05 },  // bracket 🟡 ang_equality
  { id: '06', label: { uz: 'Bissektrisa', ru: 'Биссектриса', en: 'The bisector' }, C: D40_06 },  // build 🟡 ang_bisector
  { id: '07', label: { uz: 'Uch juftlik', ru: 'Три пары', en: 'Three pairs' }, C: D40_07 },  // sort 🟡 ang_pair_zones
  { id: '08', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D40_08 },  // order 🔴 seg_half_twice
  { id: '09', label: { uz: 'Nisbat bilan', ru: 'По отношению', en: 'By ratio' }, C: D40_09 },  // build 🔴 ang_ratio
  { id: '10', label: { uz: 'Xato qadam', ru: 'Неверный шаг', en: 'The wrong step' }, C: D40_10 },  // fix 🔴 ang_fix
];

export default function Dars40Practice({ lang = 'uz' }) {
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
