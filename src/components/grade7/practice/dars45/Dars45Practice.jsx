// Dars45 amaliyoti — 10 topshiriq. Mavzu: PARALLEL TO'G'RI CHIZIQLAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 45-dars raskladkasi: order, choice, fix, chain, build, fix, slots, bracket, build, sort

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D45_01 from './D45_01.jsx';
import D45_02 from './D45_02.jsx';
import D45_03 from './D45_03.jsx';
import D45_04 from './D45_04.jsx';
import D45_05 from './D45_05.jsx';
import D45_06 from './D45_06.jsx';
import D45_07 from './D45_07.jsx';
import D45_08 from './D45_08.jsx';
import D45_09 from './D45_09.jsx';
import D45_10 from './D45_10.jsx';

const HEAD = {
  uz: "Dars 45 amaliyoti — 10 topshiriq (parallel to'g'ri chiziqlar)",
  ru: 'Практика урока 45 — 10 заданий (параллельные прямые)',
  en: 'Lesson 45 practice — 10 tasks (parallel lines)',
};

const ITEMS = [
  { id: '01', label: { uz: "Bir tomonli", ru: 'Односторонние', en: 'Same-side' }, C: D45_01 },  // order 🟢 65°
  { id: '02', label: { uz: "Almashinuvchi", ru: 'Накрест лежащие', en: 'Alternate' }, C: D45_02 },  // choice 🟢 teng
  { id: '03', label: { uz: "Xato yozuv", ru: 'Неверная запись', en: 'Wrong record' }, C: D45_03 },  // fix 🟢 70°
  { id: '04', label: { uz: "Mos va qo'shni", ru: 'Соответственный и смежный', en: 'Corresponding and adjacent' }, C: D45_04 },  // chain 🟡 48°
  { id: '05', label: { uz: "Bir tomonli burchak", ru: 'Односторонний угол', en: 'Same-side angle' }, C: D45_05 },  // build 🟡 118°
  { id: '06', label: { uz: "Xato xulosa", ru: 'Неверный вывод', en: 'Wrong conclusion' }, C: D45_06 },  // fix 🟡 uch xossa
  { id: '07', label: { uz: "Ikki juft", ru: 'Две пары', en: 'Two pairs' }, C: D45_07 },  // slots 🟡 75°
  { id: '08', label: { uz: "Parallellik sharti", ru: 'Условие параллельности', en: 'Parallel condition' }, C: D45_08 },  // bracket 🔴 x = 70°
  { id: '09', label: { uz: "Harf bilan", ru: 'С буквой', en: 'With a letter' }, C: D45_09 },  // build 🔴 2x va 3x
  { id: '10', label: { uz: "Uch juftlik", ru: 'Три пары', en: 'Three pairs' }, C: D45_10 },  // sort 🔴 70 / 110 / 50
];

export default function Dars45Practice({ lang = 'uz' }) {
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
