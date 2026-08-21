// Dars42 amaliyoti — 10 topshiriq. Mavzu: UCHBURCHAK BURCHAKLARI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 42-dars raskladkasi: choice, bracket, fix, build, slots, build, sort, chain, build, order

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
  uz: "Dars 42 amaliyoti — 10 topshiriq (uchburchak burchaklari)",
  ru: 'Практика урока 42 — 10 заданий (углы треугольника)',
  en: 'Lesson 42 practice — 10 tasks (angles of a triangle)',
};

const ITEMS = [
  { id: '01', label: { uz: "Yig'indi", ru: 'Сумма', en: 'The sum' }, C: D42_01 },  // choice 🟢 180°
  { id: '02', label: { uz: "Tenglik", ru: 'Равенство', en: 'Equality' }, C: D42_02 },  // bracket 🟢 ∠A + ∠B + ∠C
  { id: '03', label: { uz: "Bunday yo'q", ru: 'Такого нет', en: 'Impossible' }, C: D42_03 },  // fix 🟢 70 80 40
  { id: '04', label: { uz: "Uchinchi burchak", ru: 'Третий угол', en: 'Third angle' }, C: D42_04 },  // build 🟡 55° va 65°
  { id: '05', label: { uz: "To'g'ri burchakli", ru: 'Прямоугольный', en: 'Right-angled' }, C: D42_05 },  // slots 🟡 90° va 35°
  { id: '06', label: { uz: "Teng yonli", ru: 'Равнобедренный', en: 'Isosceles' }, C: D42_06 },  // build 🟡 asos 70°
  { id: '07', label: { uz: "Turlari", ru: 'Виды', en: 'Kinds' }, C: D42_07 },  // sort 🟡 60 / 90 / 120
  { id: '08', label: { uz: "Harfli burchaklar", ru: 'Углы с буквой', en: 'With letters' }, C: D42_08 },  // chain 🔴 3x, 2x, 100°
  { id: '09', label: { uz: "Tashqi burchak", ru: 'Внешний угол', en: 'Exterior' }, C: D42_09 },  // build 🔴 130° va 60°
  { id: '10', label: { uz: "Nisbat", ru: 'Отношение', en: 'Ratio' }, C: D42_10 },  // order 🔴 1 : 2 : 3
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
