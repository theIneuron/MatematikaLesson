// Dars39 amaliyoti — 10 topshiriq. Mavzu: VARIANTLARNI SANASH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 39-dars raskladkasi: slots, choice, build, order, build, fix, chain, bracket, sort, build
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D39_01 from './D39_01.jsx';
import D39_02 from './D39_02.jsx';
import D39_03 from './D39_03.jsx';
import D39_04 from './D39_04.jsx';
import D39_05 from './D39_05.jsx';
import D39_06 from './D39_06.jsx';
import D39_07 from './D39_07.jsx';
import D39_08 from './D39_08.jsx';
import D39_09 from './D39_09.jsx';
import D39_10 from './D39_10.jsx';

const HEAD = {
  uz: 'Dars 39 amaliyoti — 10 topshiriq (variantlarni sanash)',
  ru: 'Практика урока 39 — 10 заданий (подсчёт вариантов)',
  en: 'Lesson 39 practice — 10 tasks (counting the options)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Ikki bosqich', ru: 'Два этапа', en: 'Two stages' }, C: D39_01 },  // slots 🟢 comb_slots
  { id: '02', label: { uz: "Qo'shish yoki ko'paytirish", ru: 'Сложить или умножить', en: 'Add or multiply' }, C: D39_02 },  // choice 🟢 comb_choice
  { id: '03', label: { uz: 'Borish va qaytish', ru: 'Туда и обратно', en: 'There and back' }, C: D39_03 },  // build 🟢 comb_build
  { id: '04', label: { uz: 'Uch bosqich', ru: 'Три этапа', en: 'Three stages' }, C: D39_04 },  // order 🟡 comb_order
  { id: '05', label: { uz: 'Takrorlash mumkin', ru: 'С повторением', en: 'Repeats allowed' }, C: D39_05 },  // build 🟡 comb_repeat
  { id: '06', label: { uz: 'Xato qadam', ru: 'Неверный шаг', en: 'The wrong step' }, C: D39_06 },  // fix 🟡 comb_fix
  { id: '07', label: { uz: 'Zanjir', ru: 'Цепочка', en: 'A chain' }, C: D39_07 },  // chain 🟡 comb_chain
  { id: '08', label: { uz: 'Takrorsiz yozuv', ru: 'Запись без повторений', en: 'The no-repeat record' }, C: D39_08 },  // bracket 🔴 comb_no_repeat
  { id: '09', label: { uz: 'Uch masala', ru: 'Три задачи', en: 'Three tasks' }, C: D39_09 },  // sort 🔴 comb_zones
  { id: '10', label: { uz: 'Uch xonali son', ru: 'Трёхзначное число', en: 'A three-digit number' }, C: D39_10 },  // build 🔴 comb_three_digit
];

export default function Dars39Practice({ lang = 'uz' }) {
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
