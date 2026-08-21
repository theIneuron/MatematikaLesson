// Dars37 amaliyoti — 10 topshiriq. Mavzu: TO'G'RI PROPORSIONALLIK.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 37-dars raskladkasi: build, choice, order, sort, bracket, fix, build, slots, build, chain
//
// Darsning O'Z misollari ((2; 12), (2; 6), (3; 12), (4; −8), (5; 20), k = 15) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D37_01 from './D37_01.jsx';
import D37_02 from './D37_02.jsx';
import D37_03 from './D37_03.jsx';
import D37_04 from './D37_04.jsx';
import D37_05 from './D37_05.jsx';
import D37_06 from './D37_06.jsx';
import D37_07 from './D37_07.jsx';
import D37_08 from './D37_08.jsx';
import D37_09 from './D37_09.jsx';
import D37_10 from './D37_10.jsx';

const HEAD = {
  uz: "Dars 37 amaliyoti — 10 topshiriq (to'g'ri proporsionallik)",
  ru: 'Практика урока 37 — 10 заданий (прямая пропорциональность)',
  en: 'Lesson 37 practice — 10 tasks (direct proportion)',
};

const ITEMS = [
  { id: '01', label: { uz: "k ni topish", ru: 'Найти k', en: 'Find k' }, C: D37_01 },  // build 🟢 (2; 10)
  { id: '02', label: { uz: "Qaysi biri", ru: 'Какая из них', en: 'Which one' }, C: D37_02 },  // choice 🟢 y = 7x
  { id: '03', label: { uz: "Manfiy k", ru: 'Отрицательный k', en: 'Negative k' }, C: D37_03 },  // order 🟢 (4; −12)
  { id: '04', label: { uz: "Uch formula", ru: 'Три формулы', en: 'Three rules' }, C: D37_04 },  // sort 🟡 y = −6x
  { id: '05', label: { uz: "Boshdan", ru: 'Через начало', en: 'Through origin' }, C: D37_05 },  // bracket 🟡 y = 8x
  { id: '06', label: { uz: "Ishora", ru: 'Знак', en: 'Sign' }, C: D37_06 },  // fix 🟡 y = 3x, x = −2
  { id: '07', label: { uz: "Formulani tuzish", ru: 'Составить формулу', en: 'Build the rule' }, C: D37_07 },  // build 🟡 (3; 12)
  { id: '08', label: { uz: "Jadval", ru: 'Таблица', en: 'Table' }, C: D37_08 },  // slots 🔴 y = −2x
  { id: '09', label: { uz: "Manfiy nuqta", ru: 'Отрицательная точка', en: 'Negative point' }, C: D37_09 },  // build 🔴 (−4; 20)
  { id: '10', label: { uz: "Zanjir", ru: 'Цепочка', en: 'Chain' }, C: D37_10 },  // chain 🔴 (2; 6), x = 10
];

export default function Dars37Practice({ lang = 'uz' }) {
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
