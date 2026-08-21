// Dars48 amaliyoti — 10 topshiriq. Mavzu: YUZALAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 48-dars raskladkasi: choice, bracket, slots, build, order, chain, slots, sort, fix, build

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D48_01 from './D48_01.jsx';
import D48_02 from './D48_02.jsx';
import D48_03 from './D48_03.jsx';
import D48_04 from './D48_04.jsx';
import D48_05 from './D48_05.jsx';
import D48_06 from './D48_06.jsx';
import D48_07 from './D48_07.jsx';
import D48_08 from './D48_08.jsx';
import D48_09 from './D48_09.jsx';
import D48_10 from './D48_10.jsx';

const HEAD = {
  uz: "Dars 48 amaliyoti — 10 topshiriq (yuzalar)",
  ru: 'Практика урока 48 — 10 заданий (площади)',
  en: 'Lesson 48 practice — 10 tasks (areas)',
};

const ITEMS = [
  { id: '01', label: { uz: "Yuza", ru: 'Площадь', en: 'Area' }, C: D48_01 },  // choice 🟢 a · b
  { id: '02', label: { uz: "Uchburchak", ru: 'Треугольник', en: 'Triangle' }, C: D48_02 },  // bracket 🟢 a · h : 2
  { id: '03', label: { uz: "Yuza va perimetr", ru: 'Площадь и периметр', en: 'Area and perimeter' }, C: D48_03 },  // slots 🟢 12 va 5
  { id: '04', label: { uz: "Uchburchak yuzasi", ru: 'Площадь треугольника', en: 'Triangle area' }, C: D48_04 },  // build 🟡 10 va 6
  { id: '05', label: { uz: "Kvadrat", ru: 'Квадрат', en: 'Square' }, C: D48_05 },  // order 🟡 tomon 9
  { id: '06', label: { uz: "Ikki barobar", ru: 'Вдвое', en: 'Twice' }, C: D48_06 },  // chain 🟡 8 va 15
  { id: '07', label: { uz: "Teskari masala", ru: 'Обратная задача', en: 'Reverse task' }, C: D48_07 },  // slots 🟡 S = 24
  { id: '08', label: { uz: "Uch yuza", ru: 'Три площади', en: 'Three areas' }, C: D48_08 },  // sort 🔴 24 / 48 / 12
  { id: '09', label: { uz: "Ikkiga bo'lish", ru: 'Деление на два', en: 'The halving' }, C: D48_09 },  // fix 🔴 10 va 4
  { id: '10', label: { uz: "Tomonni topish", ru: 'Найти сторону', en: 'Find the side' }, C: D48_10 },  // build 🔴 S = 45
];

export default function Dars48Practice({ lang = 'uz' }) {
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
