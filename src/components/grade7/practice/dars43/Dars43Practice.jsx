// Dars43 amaliyoti — 10 topshiriq. Mavzu: UCHBURCHAKLAR TENGLIGI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 43-dars raskladkasi: build, choice, build, sort, fix, slots, order, build, chain, bracket

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D43_01 from './D43_01.jsx';
import D43_02 from './D43_02.jsx';
import D43_03 from './D43_03.jsx';
import D43_04 from './D43_04.jsx';
import D43_05 from './D43_05.jsx';
import D43_06 from './D43_06.jsx';
import D43_07 from './D43_07.jsx';
import D43_08 from './D43_08.jsx';
import D43_09 from './D43_09.jsx';
import D43_10 from './D43_10.jsx';

const HEAD = {
  uz: "Dars 43 amaliyoti — 10 topshiriq (uchburchaklar tengligi)",
  ru: 'Практика урока 43 — 10 заданий (равенство треугольников)',
  en: 'Lesson 43 practice — 10 tasks (equality of triangles)',
};

const ITEMS = [
  { id: '01', label: { uz: "Perimetr", ru: 'Периметр', en: 'Perimeter' }, C: D43_01 },  // build 🟢 6, 8, 10
  { id: '02', label: { uz: "Yetarlimi", ru: 'Достаточно ли', en: 'Is it enough' }, C: D43_02 },  // choice 🟢 ikki tomon
  { id: '03', label: { uz: "Mos burchak", ru: 'Соответственный', en: 'Corresponding' }, C: D43_03 },  // build 🟢 40° va 70°
  { id: '04', label: { uz: "Qaysi belgi", ru: 'Какой признак', en: 'Which criterion' }, C: D43_04 },  // sort 🟡 uch belgi
  { id: '05', label: { uz: "Xato xulosa", ru: 'Неверный вывод', en: 'Wrong conclusion' }, C: D43_05 },  // fix 🟡 uch burchak
  { id: '06', label: { uz: "Mos elementlar", ru: 'Соответственные', en: 'Corresponding parts' }, C: D43_06 },  // slots 🟡 AB = 8
  { id: '07', label: { uz: "Uchinchi tomon", ru: 'Третья сторона', en: 'Third side' }, C: D43_07 },  // order 🟡 P = 30
  { id: '08', label: { uz: "Yon tomon", ru: 'Боковая', en: 'The leg' }, C: D43_08 },  // build 🔴 P = 32, asos 12
  { id: '09', label: { uz: "Harf bilan", ru: 'С буквой', en: 'With a letter' }, C: D43_09 },  // chain 🔴 P = 27
  { id: '10', label: { uz: "Moslik", ru: 'Соответствие', en: 'Correspondence' }, C: D43_10 },  // bracket 🔴 AB = A₁B₁
];

export default function Dars43Practice({ lang = 'uz' }) {
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
