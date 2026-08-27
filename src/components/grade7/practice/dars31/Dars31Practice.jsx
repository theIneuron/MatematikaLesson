// Dars31 amaliyoti — 10 topshiriq. Mavzu: KUBLAR YIG'INDISI VA AYIRMASI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 31-dars raskladkasi: bracket, choice, fix, slots, build, sort, order, build, chain, build
//
// Darsning O'Z misollari ((x + 1)(x² − x + 1), (x + 1)(x² + x + 1), (a − 3)³, (x + 1)³) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D31_01 from './D31_01.jsx';
import D31_02 from './D31_02.jsx';
import D31_03 from './D31_03.jsx';
import D31_04 from './D31_04.jsx';
import D31_05 from './D31_05.jsx';
import D31_06 from './D31_06.jsx';
import D31_07 from './D31_07.jsx';
import D31_08 from './D31_08.jsx';
import D31_09 from './D31_09.jsx';
import D31_10 from './D31_10.jsx';

const HEAD = {
  uz: "Dars 31 amaliyoti — 10 topshiriq (kublar yig'indisi va ayirmasi)",
  ru: 'Практика урока 31 — 10 заданий (сумма и разность кубов)',
  en: 'Lesson 31 practice — 10 tasks (sum and difference of cubes)',
};

const ITEMS = [
  { id: '01', label: { uz: "Kublar yig'indisi", ru: 'Сумма кубов', en: 'Sum of cubes' }, C: D31_01 },  // bracket 🟢 x³ + 27
  { id: '02', label: { uz: "To'liqsiz kvadrat", ru: 'Неполный квадрат', en: 'Incomplete square' }, C: D31_02 },  // choice 🟢 a³ − 8
  { id: '03', label: { uz: "Xato bo'lak", ru: 'Неверная часть', en: 'Wrong part' }, C: D31_03 },  // fix 🟢 m³ + 64
  { id: '04', label: { uz: "Koeffitsiyent", ru: 'Коэффициент', en: 'Coefficient' }, C: D31_04 },  // slots 🟡 8k³ − 125
  { id: '05', label: { uz: "Son oldinda", ru: 'Число впереди', en: 'Number first' }, C: D31_05 },  // build 🟡 27 + t³
  { id: '06', label: { uz: "Qaysi turi", ru: 'Какой вид', en: 'Which kind' }, C: D31_06 },  // sort 🟡 x³ va 8
  { id: '07', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D31_07 },  // order 🟡 64a³ − 1
  { id: '08', label: { uz: "Katta son", ru: 'Большое число', en: 'Big number' }, C: D31_08 },  // build 🔴 p³ − 216
  { id: '09', label: { uz: "Tekshirish", ru: 'Проверка', en: 'Check' }, C: D31_09 },  // chain 🔴 y³ + 1000
  { id: '10', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D31_10 },  // build 🔴 125x³ + 8y³
];

export default function Dars31Practice({ lang = 'uz' }) {
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
