// Dars34 amaliyoti — 10 topshiriq. Mavzu: FUNKSIYA TUSHUNCHASI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 34-dars raskladkasi: choice, sort, bracket, build, slots, build, fix, order, build, chain
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D34_01 from './D34_01.jsx';
import D34_02 from './D34_02.jsx';
import D34_03 from './D34_03.jsx';
import D34_04 from './D34_04.jsx';
import D34_05 from './D34_05.jsx';
import D34_06 from './D34_06.jsx';
import D34_07 from './D34_07.jsx';
import D34_08 from './D34_08.jsx';
import D34_09 from './D34_09.jsx';
import D34_10 from './D34_10.jsx';

const HEAD = {
  uz: 'Dars 34 amaliyoti — 10 topshiriq (funksiya tushunchasi)',
  ru: 'Практика урока 34 — 10 заданий (понятие функции)',
  en: 'Lesson 34 practice — 10 tasks (the idea of a function)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Funksiyami', ru: 'Функция ли', en: 'Is it a function' }, C: D34_01 },  // choice 🟢 is_function
  { id: '02', label: { uz: 'Uch qiymat', ru: 'Три значения', en: 'Three values' }, C: D34_02 },  // sort 🟢 fn_values_zones
  { id: '03', label: { uz: "Qo'yish yozuvi", ru: 'Запись подстановки', en: 'The substitution' }, C: D34_03 },  // bracket 🟢 fn_substitute
  { id: '04', label: { uz: 'Ikki had', ru: 'Два члена', en: 'Two terms' }, C: D34_04 },  // build 🟡 fn_two_terms
  { id: '05', label: { uz: 'Jadval', ru: 'Таблица', en: 'The table' }, C: D34_05 },  // slots 🟡 fn_table
  { id: '06', label: { uz: 'Teskari savol', ru: 'Обратный вопрос', en: 'The reverse question' }, C: D34_06 },  // build 🟡 fn_reverse
  { id: '07', label: { uz: 'Xato qadam', ru: 'Неверный шаг', en: 'The wrong step' }, C: D34_07 },  // fix 🟡 fn_neg_fix
  { id: '08', label: { uz: 'Hisoblash tartibi', ru: 'Порядок вычисления', en: 'Order of computing' }, C: D34_08 },  // order 🔴 fn_order
  { id: '09', label: { uz: 'Harfli argument', ru: 'Буквенный аргумент', en: 'A letter argument' }, C: D34_09 },  // build 🔴 fn_letter_arg
  { id: '10', label: { uz: 'Zanjir', ru: 'Цепочка', en: 'A chain' }, C: D34_10 },  // chain 🔴 fn_chain
];

export default function Dars34Practice({ lang = 'uz' }) {
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
