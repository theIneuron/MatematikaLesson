// Dars36 amaliyoti — 10 topshiriq. Mavzu: GRAFIKLARNI QURISH VA O'QISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 36-dars raskladkasi: choice, order, build, chain, sort, build, slots, build, bracket, fix
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D36_01 from './D36_01.jsx';
import D36_02 from './D36_02.jsx';
import D36_03 from './D36_03.jsx';
import D36_04 from './D36_04.jsx';
import D36_05 from './D36_05.jsx';
import D36_06 from './D36_06.jsx';
import D36_07 from './D36_07.jsx';
import D36_08 from './D36_08.jsx';
import D36_09 from './D36_09.jsx';
import D36_10 from './D36_10.jsx';

const HEAD = {
  uz: "Dars 36 amaliyoti — 10 topshiriq (grafiklarni qurish va o'qish)",
  ru: 'Практика урока 36 — 10 заданий (построение и чтение графиков)',
  en: 'Lesson 36 practice — 10 tasks (drawing and reading graphs)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Nechta nuqta', ru: 'Сколько точек', en: 'How many points' }, C: D36_01 },  // choice 🟢 how_many_points
  { id: '02', label: { uz: 'Qurish qadamlari', ru: 'Шаги построения', en: 'Steps of drawing' }, C: D36_02 },  // order 🟢 draw_order
  { id: '03', label: { uz: 'Nuqta grafikda', ru: 'Точка на графике', en: 'A point on the graph' }, C: D36_03 },  // build 🟢 point_on_line
  { id: '04', label: { uz: 'Ikki savol', ru: 'Два вопроса', en: 'Two questions' }, C: D36_04 },  // chain 🟡 graph_chain
  { id: '05', label: { uz: 'Uch juftlik', ru: 'Три пары', en: 'Three pairs' }, C: D36_05 },  // sort 🟡 graph_zones
  { id: '06', label: { uz: 'Grafikdan formula', ru: 'Формула по графику', en: 'Formula from a graph' }, C: D36_06 },  // build 🟡 read_graph
  { id: '07', label: { uz: 'Jadval', ru: 'Таблица', en: 'The table' }, C: D36_07 },  // slots 🟡 graph_table
  { id: '08', label: { uz: 'Kesishish nuqtasi', ru: 'Точка пересечения', en: 'The crossing point' }, C: D36_08 },  // build 🔴 graph_cross
  { id: '09', label: { uz: 'Tekshirish yozuvi', ru: 'Запись проверки', en: 'The check written out' }, C: D36_09 },  // bracket 🔴 graph_check_write
  { id: '10', label: { uz: 'Xato qadam', ru: 'Неверный шаг', en: 'The wrong step' }, C: D36_10 },  // fix 🔴 graph_fix
];

export default function Dars36Practice({ lang = 'uz' }) {
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
