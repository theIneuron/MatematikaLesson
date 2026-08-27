// Dars35 amaliyoti — 10 topshiriq. Mavzu: CHIZIQLI FUNKSIYA.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 35-dars raskladkasi: build, choice, chain, slots, fix, order, bracket, sort, order, build
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

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

const HEAD = {
  uz: 'Dars 35 amaliyoti — 10 topshiriq (chiziqli funksiya)',
  ru: 'Практика урока 35 — 10 заданий (линейная функция)',
  en: 'Lesson 35 practice — 10 tasks (the linear function)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Qiymatni topish', ru: 'Найти значение', en: 'Find the value' }, C: D35_01 },  // build 🟢 lin_value
  { id: '02', label: { uz: 'k ning ishorasi', ru: 'Знак k', en: 'The sign of k' }, C: D35_02 },  // choice 🟢 k_sign
  { id: '03', label: { uz: 'Ikki savol', ru: 'Два вопроса', en: 'Two questions' }, C: D35_03 },  // chain 🟢 lin_chain
  { id: '04', label: { uz: 'k va b', ru: 'k и b', en: 'k and b' }, C: D35_04 },  // slots 🟡 k_and_b
  { id: '05', label: { uz: 'Xato qadam', ru: 'Неверный шаг', en: 'The wrong step' }, C: D35_05 },  // fix 🟡 lin_fix
  { id: '06', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D35_06 },  // order 🟡 lin_order
  { id: '07', label: { uz: "x o'qini kesish", ru: 'Пересечение с осью x', en: 'The x intercept' }, C: D35_07 },  // bracket 🟡 lin_cross
  { id: '08', label: { uz: 'Uch formula', ru: 'Три формулы', en: 'Three formulas' }, C: D35_08 },  // sort 🔴 k_zones
  { id: '09', label: { uz: 'Ikki nuqtadan', ru: 'По двум точкам', en: 'From two points' }, C: D35_09 },  // order 🔴 lin_from_points
  { id: '10', label: { uz: 'Teskari savol', ru: 'Обратный вопрос', en: 'The reverse question' }, C: D35_10 },  // build 🔴 lin_which_x
];

export default function Dars35Practice({ lang = 'uz' }) {
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
