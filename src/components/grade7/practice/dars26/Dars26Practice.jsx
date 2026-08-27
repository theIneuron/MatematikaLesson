// Dars26 amaliyoti — 10 topshiriq. Mavzu: KVADRATLAR AYIRMASI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 26-dars raskladkasi: choice, sort, build, chain, build, bracket, slots, order, build, fix
//
// Darsning O'Z misollari ((25 − x)(25 + x), (2m − 5n)(2m + 5n), (2y − 7)(2y + 7), (a − 6)(a + 6), (x + 3)(x − 3)) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D26_01 from './D26_01.jsx';
import D26_02 from './D26_02.jsx';
import D26_03 from './D26_03.jsx';
import D26_04 from './D26_04.jsx';
import D26_05 from './D26_05.jsx';
import D26_06 from './D26_06.jsx';
import D26_07 from './D26_07.jsx';
import D26_08 from './D26_08.jsx';
import D26_09 from './D26_09.jsx';
import D26_10 from './D26_10.jsx';

const HEAD = {
  uz: "Dars 26 amaliyoti — 10 topshiriq (kvadratlar ayirmasi)",
  ru: 'Практика урока 26 — 10 заданий (разность квадратов)',
  en: 'Lesson 26 practice — 10 tasks (difference of squares)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ayirma", ru: 'Разность', en: 'Difference' }, C: D26_01 },  // choice 🟢 (n − 9)(n + 9)
  { id: '02', label: { uz: "Uch yozuv", ru: 'Три записи', en: 'Three records' }, C: D26_02 },  // sort 🟢 (x ± 5)
  { id: '03', label: { uz: "Koeffitsiyent", ru: 'Коэффициент', en: 'Coefficient' }, C: D26_03 },  // build 🟢 (6k + 5)(6k − 5)
  { id: '04', label: { uz: "Ajratish", ru: 'Разложить', en: 'Factorise' }, C: D26_04 },  // chain 🟡 121 − t²
  { id: '05', label: { uz: "Ikki kvadrat", ru: 'Два квадрата', en: 'Two squares' }, C: D26_05 },  // build 🟡 100a² − 9
  { id: '06', label: { uz: "Og'zaki", ru: 'Устно', en: 'Mentally' }, C: D26_06 },  // bracket 🟡 51 · 49
  { id: '07', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D26_07 },  // slots 🟡 (3x + 8y)(3x − 8y)
  { id: '08', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D26_08 },  // order 🔴 84 · 76
  { id: '09', label: { uz: "Ikki marta", ru: 'Дважды', en: 'Twice' }, C: D26_09 },  // build 🔴 16m⁴ − 81
  { id: '10', label: { uz: "Xato qadam", ru: 'Неверный шаг', en: 'Wrong step' }, C: D26_10 },  // fix 🔴 25y² − 36
];

export default function Dars26Practice({ lang = 'uz' }) {
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
