// Dars38 amaliyoti — 10 topshiriq. Mavzu: CHIZIQLI TENGLAMALAR SISTEMASI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 38-dars raskladkasi: choice, build, bracket, build, sort, slots, order, build, chain, fix
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D38_01 from './D38_01.jsx';
import D38_02 from './D38_02.jsx';
import D38_03 from './D38_03.jsx';
import D38_04 from './D38_04.jsx';
import D38_05 from './D38_05.jsx';
import D38_06 from './D38_06.jsx';
import D38_07 from './D38_07.jsx';
import D38_08 from './D38_08.jsx';
import D38_09 from './D38_09.jsx';
import D38_10 from './D38_10.jsx';

const HEAD = {
  uz: 'Dars 38 amaliyoti — 10 topshiriq (chiziqli tenglamalar sistemasi)',
  ru: 'Практика урока 38 — 10 заданий (системы линейных уравнений)',
  en: 'Lesson 38 practice — 10 tasks (systems of linear equations)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Yechim nima', ru: 'Что такое решение', en: 'What a solution is' }, C: D38_01 },  // choice 🟢 sys_what
  { id: '02', label: { uz: 'Tekshirish', ru: 'Проверка', en: 'The check' }, C: D38_02 },  // build 🟢 sys_check
  { id: '03', label: { uz: 'Javobni yozish', ru: 'Записать ответ', en: 'Write the answer' }, C: D38_03 },  // bracket 🟢 sys_pair
  { id: '04', label: { uz: "Qo'yish usuli", ru: 'Способ подстановки', en: 'Substitution method' }, C: D38_04 },  // build 🟡 sys_substitution
  { id: '05', label: { uz: 'Nechta yechim', ru: 'Сколько решений', en: 'How many solutions' }, C: D38_05 },  // sort 🟡 sys_zones
  { id: '06', label: { uz: "Qo'shish usuli", ru: 'Способ сложения', en: 'Adding method' }, C: D38_06 },  // slots 🟡 sys_add
  { id: '07', label: { uz: 'Qadamlar tartibi', ru: 'Порядок шагов', en: 'Order of steps' }, C: D38_07 },  // order 🟡 sys_order
  { id: '08', label: { uz: "Qo'shish", ru: 'Сложение', en: 'Adding' }, C: D38_08 },  // build 🔴 sys_add_coef
  { id: '09', label: { uz: 'Zanjir', ru: 'Цепочка', en: 'A chain' }, C: D38_09 },  // chain 🔴 sys_chain
  { id: '10', label: { uz: 'Xato xulosa', ru: 'Неверный вывод', en: 'The wrong claim' }, C: D38_10 },  // fix 🔴 sys_fix
];

export default function Dars38Practice({ lang = 'uz' }) {
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
