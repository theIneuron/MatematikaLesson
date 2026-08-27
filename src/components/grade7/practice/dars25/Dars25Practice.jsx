// Dars25 amaliyoti — 10 topshiriq. Mavzu: YIG'INDINING KVADRATI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 25-dars raskladkasi: build, choice, order, fix, slots, build, sort, build, bracket, chain
//
// Darsning O'Z misollari ((x + 1)², (x + 4)², (x + 6)², (x − 5)², (2a − 1)², (3a + 2)², (3y + 4)²) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D25_01 from './D25_01.jsx';
import D25_02 from './D25_02.jsx';
import D25_03 from './D25_03.jsx';
import D25_04 from './D25_04.jsx';
import D25_05 from './D25_05.jsx';
import D25_06 from './D25_06.jsx';
import D25_07 from './D25_07.jsx';
import D25_08 from './D25_08.jsx';
import D25_09 from './D25_09.jsx';
import D25_10 from './D25_10.jsx';

const HEAD = {
  uz: "Dars 25 amaliyoti — 10 topshiriq (yig'indining kvadrati)",
  ru: 'Практика урока 25 — 10 заданий (квадрат суммы)',
  en: 'Lesson 25 practice — 10 tasks (square of a sum)',
};

const ITEMS = [
  { id: '01', label: { uz: "Yig'ish", ru: 'Собрать', en: 'Build' }, C: D25_01 },  // build 🟢 (y + 8)²
  { id: '02', label: { uz: "O'rta had", ru: 'Средний член', en: 'Middle term' }, C: D25_02 },  // choice 🟢 (m + 6)²
  { id: '03', label: { uz: "Tartib", ru: 'Порядок', en: 'Order' }, C: D25_03 },  // order 🟢 (x + 9)²
  { id: '04', label: { uz: "Xato had", ru: 'Неверный член', en: 'Wrong term' }, C: D25_04 },  // fix 🟡 (2c + 7)²
  { id: '05', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D25_05 },  // slots 🟡 (5p + 2q)²
  { id: '06', label: { uz: "Ayirma", ru: 'Разность', en: 'Difference' }, C: D25_06 },  // build 🟡 (3n − 4)²
  { id: '07', label: { uz: "Uch natija", ru: 'Три результата', en: 'Three results' }, C: D25_07 },  // sort 🟡 (x ± 6)
  { id: '08', label: { uz: "Koeffitsiyent", ru: 'Коэффициент', en: 'Coefficient' }, C: D25_08 },  // build 🔴 (a + 3b)²
  { id: '09', label: { uz: "Tiklash", ru: 'Восстановить', en: 'Restore' }, C: D25_09 },  // bracket 🔴 49 + 14t + t²
  { id: '10', label: { uz: "Tekshirish", ru: 'Проверка', en: 'Check' }, C: D25_10 },  // chain 🔴 (2x + 5)², x = 1
];

export default function Dars25Practice({ lang = 'uz' }) {
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
