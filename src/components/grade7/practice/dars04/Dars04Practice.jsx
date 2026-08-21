// Dars04 amaliyoti — 10 topshiriq. Mavzu: AYNIY O'ZGARTIRISHLAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 04-dars raskladkasi: choice, bracket, build, bracket, chain, fix, slots, sort, order, build

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D04_01 from './D04_01.jsx';
import D04_02 from './D04_02.jsx';
import D04_03 from './D04_03.jsx';
import D04_04 from './D04_04.jsx';
import D04_05 from './D04_05.jsx';
import D04_06 from './D04_06.jsx';
import D04_07 from './D04_07.jsx';
import D04_08 from './D04_08.jsx';
import D04_09 from './D04_09.jsx';
import D04_10 from './D04_10.jsx';

const HEAD = {
  uz: "Dars 4 amaliyoti — 10 topshiriq (ayniy o'zgartirishlar)",
  ru: 'Практика урока 4 — 10 заданий (тождественные преобразования)',
  en: 'Lesson 4 practice — 10 tasks (identity transformations)',
};

const ITEMS = [
  { id: '01', label: { uz: "Bitta son", ru: 'Одно число', en: 'One number' }, C: D04_01 },  // choice 🟢 isbot emas
  { id: '02', label: { uz: "Rad etish", ru: 'Опровержение', en: 'Refuting' }, C: D04_02 },  // bracket 🟢 (a + b)²
  { id: '03', label: { uz: "Qayta yozish", ru: 'Переписать', en: 'Rewriting' }, C: D04_03 },  // build 🟢 4(x + 3)
  { id: '04', label: { uz: "Qavsga olish", ru: 'Вынести', en: 'Take out' }, C: D04_04 },  // bracket 🟡 7a + 7b
  { id: '05', label: { uz: "Ikki nuqtada", ru: 'В двух точках', en: 'Two points' }, C: D04_05 },  // chain 🟡 3(x + 2) − x
  { id: '06', label: { uz: "Xato o'zgartirish", ru: 'Неверное преобразование', en: 'Wrong step' }, C: D04_06 },  // fix 🟡 5(a − 2)
  { id: '07', label: { uz: "Ikki had", ru: 'Два члена', en: 'Two terms' }, C: D04_07 },  // slots 🟡 6(2x − 5)
  { id: '08', label: { uz: "Ayniymi", ru: 'Тождество ли', en: 'Identity or not' }, C: D04_08 },  // sort 🔴 (x + 1)²
  { id: '09', label: { uz: "Isbot qadamlari", ru: 'Шаги доказательства', en: 'Proof steps' }, C: D04_09 },  // order 🔴 5(a + 2) − 3a
  { id: '10', label: { uz: "Ikki qavs", ru: 'Две скобки', en: 'Two brackets' }, C: D04_10 },  // build 🔴 3(x + 4) − 2(x − 1)
];

export default function Dars04Practice({ lang = 'uz' }) {
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
