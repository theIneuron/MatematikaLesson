// Dars42 amaliyoti — 10 topshiriq. Mavzu: UCHBURCHAKLAR TENGLIGI ALOMATLARI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 42-dars raskladkasi: choice, bracket, fix, build, slots, build, sort, chain, build, order
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D42_01 from './D42_01.jsx';
import D42_02 from './D42_02.jsx';
import D42_03 from './D42_03.jsx';
import D42_04 from './D42_04.jsx';
import D42_05 from './D42_05.jsx';
import D42_06 from './D42_06.jsx';
import D42_07 from './D42_07.jsx';
import D42_08 from './D42_08.jsx';
import D42_09 from './D42_09.jsx';
import D42_10 from './D42_10.jsx';

const HEAD = {
  uz: 'Dars 42 amaliyoti — 10 topshiriq (uchburchaklar tengligi alomatlari)',
  ru: 'Практика урока 42 — 10 заданий (признаки равенства треугольников)',
  en: 'Lesson 42 practice — 10 tasks (congruence criteria)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Yetarlimi', ru: 'Достаточно ли', en: 'Is it enough' }, C: D42_01 },  // choice 🟢 eq_enough
  { id: '02', label: { uz: 'Moslik', ru: 'Соответствие', en: 'Correspondence' }, C: D42_02 },  // bracket 🟢 eq_bracket
  { id: '03', label: { uz: 'Xato xulosa', ru: 'Неверный вывод', en: 'The wrong claim' }, C: D42_03 },  // fix 🟢 eq_angles_fix
  { id: '04', label: { uz: 'Qaysi alomat', ru: 'Какой признак', en: 'Which criterion' }, C: D42_04 },  // build 🟡 eq_which_sign
  { id: '05', label: { uz: 'Mos elementlar', ru: 'Соответственные элементы', en: 'Matching elements' }, C: D42_05 },  // slots 🟡 eq_slots
  { id: '06', label: { uz: 'Uchinchi tomon', ru: 'Третья сторона', en: 'The third side' }, C: D42_06 },  // build 🟡 eq_third_side
  { id: '07', label: { uz: 'Uch alomat', ru: 'Три признака', en: 'Three criteria' }, C: D42_07 },  // sort 🟡 eq_signs_zones
  { id: '08', label: { uz: 'Ikki qadam', ru: 'Два шага', en: 'Two steps' }, C: D42_08 },  // chain 🔴 eq_chain
  { id: '09', label: { uz: 'Harf bilan', ru: 'С буквой', en: 'With a letter' }, C: D42_09 },  // build 🔴 eq_letter
  { id: '10', label: { uz: 'Isbot qadamlari', ru: 'Шаги доказательства', en: 'Steps of a proof' }, C: D42_10 },  // order 🔴 eq_order
];

export default function Dars42Practice({ lang = 'uz' }) {
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
