// Dars28 amaliyoti — 10 topshiriq. Mavzu: FORMULALARNI QO'LLASH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 28-dars raskladkasi: choice, fix, build, slots, sort, slots, order, chain, build, bracket
//
// Darsning O'Z misollari ((2m + n)², (2m − n)(2m + n), (2y − 3)², (4x + 3)², (a + 6)(a − 6), (a + 6)²) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D28_01 from './D28_01.jsx';
import D28_02 from './D28_02.jsx';
import D28_03 from './D28_03.jsx';
import D28_04 from './D28_04.jsx';
import D28_05 from './D28_05.jsx';
import D28_06 from './D28_06.jsx';
import D28_07 from './D28_07.jsx';
import D28_08 from './D28_08.jsx';
import D28_09 from './D28_09.jsx';
import D28_10 from './D28_10.jsx';

const HEAD = {
  uz: "Dars 28 amaliyoti — 10 topshiriq (formulalarni qo'llash)",
  ru: 'Практика урока 28 — 10 заданий (применение формул)',
  en: 'Lesson 28 practice — 10 tasks (applying the formulas)',
};

const ITEMS = [
  { id: '01', label: { uz: "Qaysi formula", ru: 'Какая формула', en: 'Which formula' }, C: D28_01 },  // choice 🟢 (7x − 2)(7x + 2)
  { id: '02', label: { uz: "Xato had", ru: 'Неверный член', en: 'Wrong term' }, C: D28_02 },  // fix 🟢 (3a − 5)²
  { id: '03', label: { uz: "41 kvadrati", ru: 'Квадрат 41', en: '41 squared' }, C: D28_03 },  // build 🟢 41²
  { id: '04', label: { uz: "98 kvadrati", ru: 'Квадрат 98', en: '98 squared' }, C: D28_04 },  // slots 🟡 98²
  { id: '05', label: { uz: "Uch yozuv", ru: 'Три записи', en: 'Three records' }, C: D28_05 },  // sort 🟡 (6x ± 1)
  { id: '06', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D28_06 },  // slots 🟡 (5c + 4d)²
  { id: '07', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D28_07 },  // order 🟡 63 · 57
  { id: '08', label: { uz: "Ikki kvadrat", ru: 'Два квадрата', en: 'Two squares' }, C: D28_08 },  // chain 🔴 (x + 4)² − (x − 4)²
  { id: '09', label: { uz: "Ikki formula", ru: 'Две формулы', en: 'Two formulas' }, C: D28_09 },  // build 🔴 (2y + 3)² − (2y − 3)(2y + 3)
  { id: '10', label: { uz: "Teskari", ru: 'Обратно', en: 'Backwards' }, C: D28_10 },  // bracket 🔴 9m² − 4
];

export default function Dars28Practice({ lang = 'uz' }) {
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
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>{HEAD[lang] || HEAD.uz}</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {i + 1} · {item.label[lang] || item.label.uz}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id + '-' + lang} Question={q.C} lang={lang} showLanguageSwitch={false} title={null} />
      </div>
    </div>
  );
}
