// Dars23 amaliyoti — 10 topshiriq. Mavzu: GURUHLASH USULI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 23-dars raskladkasi: slots, choice, build, chain, sort, build, order, build, bracket, fix
//
// Darsning O'Z misollari ((3x² + 4)(x − 1), (b + 2)(a + 3), ab + 5a + 3b + 15) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D23_01 from './D23_01.jsx';
import D23_02 from './D23_02.jsx';
import D23_03 from './D23_03.jsx';
import D23_04 from './D23_04.jsx';
import D23_05 from './D23_05.jsx';
import D23_06 from './D23_06.jsx';
import D23_07 from './D23_07.jsx';
import D23_08 from './D23_08.jsx';
import D23_09 from './D23_09.jsx';
import D23_10 from './D23_10.jsx';

const HEAD = {
  uz: "Dars 23 amaliyoti — 10 topshiriq (guruhlash usuli)",
  ru: 'Практика урока 23 — 10 заданий (способ группировки)',
  en: 'Lesson 23 practice — 10 tasks (the grouping method)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ikki guruh", ru: 'Две группы', en: 'Two groups' }, C: D23_01 },  // slots 🟢 3m + 3n + km + kn
  { id: '02', label: { uz: "Qaysi guruhlash", ru: 'Какая группировка', en: 'Which grouping' }, C: D23_02 },  // choice 🟢 xy + 4x + 3y + 12
  { id: '03', label: { uz: "Umumiy qavs", ru: 'Общая скобка', en: 'Common bracket' }, C: D23_03 },  // build 🟢 x(y + 4) + 3(y + 4)
  { id: '04', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D23_04 },  // chain 🟡 2a + 2b + ca + cb
  { id: '05', label: { uz: "Uch ko'paytma", ru: 'Три произведения', en: 'Three products' }, C: D23_05 },  // sort 🟡 sonlar bir xil
  { id: '06', label: { uz: "Minusli guruh", ru: 'Группа с минусом', en: 'Minus group' }, C: D23_06 },  // build 🟡 mn − 3m + 4n − 12
  { id: '07', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D23_07 },  // order 🟡 6x² + 9x + 4x + 6
  { id: '08', label: { uz: "Ikki minus", ru: 'Два минуса', en: 'Two minuses' }, C: D23_08 },  // build 🔴 ab − 5a − 2b + 10
  { id: '09', label: { uz: "Guruhni qavsga", ru: 'Группа в скобке', en: 'Group in a bracket' }, C: D23_09 },  // bracket 🔴 12k² − 8k − 15k + 10
  { id: '10', label: { uz: "Xato qadam", ru: 'Неверный шаг', en: 'Wrong step' }, C: D23_10 },  // fix 🔴 x³ + x² + 4x + 4
];

export default function Dars23Practice({ lang = 'uz' }) {
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
