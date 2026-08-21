// Dars35 amaliyoti — 10 topshiriq. Mavzu: CHIZIQLI FUNKSIYA.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 35-dars raskladkasi: build, choice, chain, slots, fix, order, bracket, sort, order, build
//
// Darsning O'Z misollari ((1; 4), (2; 3), (3; 4), (2; −4), y = 2) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D35_01 from './D35_01.jsx';
import D35_02 from './D35_02.jsx';
import D35_03 from './D35_03.jsx';
import D35_04 from './D35_04.jsx';
import D35_05 from './D35_05.jsx';
import D35_06 from './D35_06.jsx';
import D35_07 from './D35_07.jsx';
import D35_08 from './D35_08.jsx';
import D35_09 from './D35_09.jsx';
import D35_10 from './D35_10.jsx';

const HEAD = {
  uz: "Dars 35 amaliyoti — 10 topshiriq (chiziqli funksiya)",
  ru: 'Практика урока 35 — 10 заданий (линейная функция)',
  en: 'Lesson 35 practice — 10 tasks (the linear function)',
};

const ITEMS = [
  { id: '01', label: { uz: "Qiymat", ru: 'Значение', en: 'Value' }, C: D35_01 },  // build 🟢 y = 3x − 2
  { id: '02', label: { uz: "k ishorasi", ru: 'Знак k', en: 'Sign of k' }, C: D35_02 },  // choice 🟢 y = −4x + 1
  { id: '03', label: { uz: "Ikki nuqta", ru: 'Две точки', en: 'Two points' }, C: D35_03 },  // chain 🟢 y = 2x + 3
  { id: '04', label: { uz: "k va b", ru: 'k и b', en: 'k and b' }, C: D35_04 },  // slots 🟡 y = −5x + 7
  { id: '05', label: { uz: "Kesish", ru: 'Пересечение', en: 'Crossing' }, C: D35_05 },  // fix 🟡 y = 4x − 3
  { id: '06', label: { uz: "Manfiy x", ru: 'Отрицательный x', en: 'Negative x' }, C: D35_06 },  // order 🟡 y = −3x + 4
  { id: '07', label: { uz: "Kesish nuqtasi", ru: 'Точка пересечения', en: 'Crossing point' }, C: D35_07 },  // bracket 🟡 y = 7x − 9
  { id: '08', label: { uz: "Uch formula", ru: 'Три формулы', en: 'Three rules' }, C: D35_08 },  // sort 🔴 k > 0 / < 0 / = 0
  { id: '09', label: { uz: "Nol qiymat", ru: 'Нулевое значение', en: 'Zero value' }, C: D35_09 },  // order 🔴 y = 2x − 10
  { id: '10', label: { uz: "Ikki nuqtadan", ru: 'По двум точкам', en: 'From two points' }, C: D35_10 },  // build 🔴 (0; 1) va (1; 4)
];

export default function Dars35Practice({ lang = 'uz' }) {
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
