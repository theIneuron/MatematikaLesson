// Dars40 amaliyoti — 10 topshiriq. Mavzu: KESMA VA UZUNLIK.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 40-dars raskladkasi: choice, chain, slots, build, bracket, build, sort, order, build, fix

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D40_01 from './D40_01.jsx';
import D40_02 from './D40_02.jsx';
import D40_03 from './D40_03.jsx';
import D40_04 from './D40_04.jsx';
import D40_05 from './D40_05.jsx';
import D40_06 from './D40_06.jsx';
import D40_07 from './D40_07.jsx';
import D40_08 from './D40_08.jsx';
import D40_09 from './D40_09.jsx';
import D40_10 from './D40_10.jsx';

const HEAD = {
  uz: "Dars 40 amaliyoti — 10 topshiriq (kesma va uzunlik)",
  ru: 'Практика урока 40 — 10 заданий (отрезок и длина)',
  en: 'Lesson 40 practice — 10 tasks (segments and length)',
};

const ITEMS = [
  { id: '01', label: { uz: "Qolgan bo'lak", ru: 'Остаток', en: 'The rest' }, C: D40_01 },  // choice 🟢 AB = 12, AC = 5
  { id: '02', label: { uz: "O'rta nuqta", ru: 'Середина', en: 'Midpoint' }, C: D40_02 },  // chain 🟢 5 va 9
  { id: '03', label: { uz: "Ikki nuqta", ru: 'Две точки', en: 'Two points' }, C: D40_03 },  // slots 🟢 AB = 24, AK = 5
  { id: '04', label: { uz: "Bo'lakni topish", ru: 'Найти часть', en: 'Find the part' }, C: D40_04 },  // build 🟡 AB = 30, AC = 12
  { id: '05', label: { uz: "Tenglik", ru: 'Равенство', en: 'Equality' }, C: D40_05 },  // bracket 🟡 AB = AC + CB
  { id: '06', label: { uz: "Harf bilan", ru: 'С буквой', en: 'With a letter' }, C: D40_06 },  // build 🟡 3x + 12 = 27
  { id: '07', label: { uz: "Uch holat", ru: 'Три случая', en: 'Three cases' }, C: D40_07 },  // sort 🟡 8 / 12 / 20
  { id: '08', label: { uz: "Ikki marta yarim", ru: 'Дважды половина', en: 'Halved twice' }, C: D40_08 },  // order 🔴 AB = 36
  { id: '09', label: { uz: "Nisbat", ru: 'Отношение', en: 'Ratio' }, C: D40_09 },  // build 🔴 2 : 3, AB = 25
  { id: '10', label: { uz: "Xato hisob", ru: 'Неверный расчёт', en: 'Wrong figure' }, C: D40_10 },  // fix 🔴 CB = 21
];

export default function Dars40Practice({ lang = 'uz' }) {
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
