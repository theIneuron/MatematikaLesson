// Dars17 amaliyoti — 10 topshiriq. Mavzu: BIR HADNING DARAJASI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 17-dars: build, choice, build, fix, sort, order, slots, build, chain, bracket
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21, "tem chto est"):
//   build/order/bracket -> BuildLine (answerSeq bilan, tartib muhim)
//   slots/chain         -> SlotsBank (bir va ikki qatorli)
//   fix                 -> TapTerms (chuqur yechimdagi xato qadamni belgilash)
//   sort                -> Zones
//   choice              -> Choice, faqat bitta (2-o'rin, isinish)
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D17_01 from './D17_01.jsx';
import D17_02 from './D17_02.jsx';
import D17_03 from './D17_03.jsx';
import D17_04 from './D17_04.jsx';
import D17_05 from './D17_05.jsx';
import D17_06 from './D17_06.jsx';
import D17_07 from './D17_07.jsx';
import D17_08 from './D17_08.jsx';
import D17_09 from './D17_09.jsx';
import D17_10 from './D17_10.jsx';

const HEAD = {
  uz: "Dars 17 amaliyoti — 10 topshiriq (bir hadning darajasi)",
  ru: 'Практика урока 17 — 10 заданий (степень одночлена)',
  en: 'Lesson 17 practice — 10 tasks (power of a monomial)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · teg
// Darsning o'z misollari ((2a)³, (5a)², (3a²)², (2a³)⁴, (a²)³, (2ab²)³,
// (−2a²b)³, (−2x³)³, 10a⁴:5a², 12a⁵b³:3a²b) ATAYLAB takrorlanmadi.
const ITEMS = [
  { id: '01', label: { uz: "Yig'ish", ru: 'Собрать', en: 'Build' }, C: D17_01 },              // build 🟢 (4x³)²
  { id: '02', label: { uz: 'Koeffitsiyent', ru: 'Коэффициент', en: 'Coefficient' }, C: D17_02 }, // choice 🟢 (5y⁴)³
  { id: '03', label: { uz: 'Uch bo\'lak', ru: 'Три части', en: 'Three parts' }, C: D17_03 },  // build 🟢 (3a²b)⁴
  { id: '04', label: { uz: 'Xato qadam', ru: 'Неверный шаг', en: 'Wrong step' }, C: D17_04 }, // fix 🟡 (−2m³)⁵
  { id: '05', label: { uz: 'Uch javob', ru: 'Три ответа', en: 'Three answers' }, C: D17_05 }, // sort 🟡 zonalar
  { id: '06', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D17_06 },               // order 🟡 (2c²d³)⁵
  { id: '07', label: { uz: 'Bo\'lish', ru: 'Деление', en: 'Division' }, C: D17_07 },          // slots 🟡 24n⁷ : 6n²
  { id: '08', label: { uz: 'Manfiy asos', ru: 'Минус', en: 'Minus' }, C: D17_08 },            // build 🔴 (−3p²q³)³
  { id: '09', label: { uz: 'Zanjir', ru: 'Цепочка', en: 'Chain' }, C: D17_09 },               // chain 🔴 (2z⁵)⁴ · 3z³
  { id: '10', label: { uz: 'Qavs', ru: 'Скобка', en: 'Bracket' }, C: D17_10 },                // bracket 🔴 (−7a)²
];

export default function Dars17Practice({ lang = 'uz' }) {
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
      {/* MOBIL_DESKTOP_MOSLASH.md naqshi: fixed root — body-skroll yo'q, tugma joyida;
          <640px da layout 390px etalon + zoom bilan real ekranga masshtablanadi. */}
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
