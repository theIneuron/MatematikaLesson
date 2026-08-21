// Dars47 amaliyoti — 10 topshiriq. Mavzu: PIFAGOR TEOREMASI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 47-dars raskladkasi: slots, choice, bracket, chain, fix, sort, build, order, build, chain

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D47_01 from './D47_01.jsx';
import D47_02 from './D47_02.jsx';
import D47_03 from './D47_03.jsx';
import D47_04 from './D47_04.jsx';
import D47_05 from './D47_05.jsx';
import D47_06 from './D47_06.jsx';
import D47_07 from './D47_07.jsx';
import D47_08 from './D47_08.jsx';
import D47_09 from './D47_09.jsx';
import D47_10 from './D47_10.jsx';

const HEAD = {
  uz: "Dars 47 amaliyoti — 10 topshiriq (Pifagor teoremasi)",
  ru: 'Практика урока 47 — 10 заданий (теорема Пифагора)',
  en: 'Lesson 47 practice — 10 tasks (the Pythagorean theorem)',
};

const ITEMS = [
  { id: '01', label: { uz: "Gipotenuza", ru: 'Гипотенуза', en: 'Hypotenuse' }, C: D47_01 },  // slots 🟢 6 va 8
  { id: '02', label: { uz: "Nimaga teng", ru: 'Чему равен', en: 'What it equals' }, C: D47_02 },  // choice 🟢 c²
  { id: '03', label: { uz: "Formula", ru: 'Формула', en: 'Formula' }, C: D47_03 },  // bracket 🟢 c² = a² + b²
  { id: '04', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D47_04 },  // chain 🟡 9 va 12
  { id: '05', label: { uz: "Xato bo'lak", ru: 'Неверная часть', en: 'Wrong part' }, C: D47_05 },  // fix 🟡 5 va 12
  { id: '06', label: { uz: "Uch juftlik", ru: 'Три пары', en: 'Three pairs' }, C: D47_06 },  // sort 🟡 5 / 13 / 25
  { id: '07', label: { uz: "Katetni topish", ru: 'Найти катет', en: 'Find the leg' }, C: D47_07 },  // build 🟡 c = 13, a = 5
  { id: '08', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D47_08 },  // order 🔴 8 va 17
  { id: '09', label: { uz: "Teskari teorema", ru: 'Обратная теорема', en: 'The converse' }, C: D47_09 },  // build 🔴 9, 40, 41
  { id: '10', label: { uz: "Katta sonlar", ru: 'Большие числа', en: 'Bigger numbers' }, C: D47_10 },  // chain 🔴 20 va 21
];

export default function Dars47Practice({ lang = 'uz' }) {
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
