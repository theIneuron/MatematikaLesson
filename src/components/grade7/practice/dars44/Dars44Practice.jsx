// Dars44 amaliyoti — 10 topshiriq. Mavzu: UCHBURCHAK BURCHAKLARINING YIG'INDISI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// 44-dars raskladkasi: choice, bracket, slots, fix, order, build, sort, chain, bracket, build
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
//
// MAVZU DARS BILAN SVERKA QILINDI (metodist qarori 2026-08-22): amaliyot
// mavzusi `src/lessons/grade7.js` dagi nazariy darsning mavzusiga mos.

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D44_01 from './D44_01.jsx';
import D44_02 from './D44_02.jsx';
import D44_03 from './D44_03.jsx';
import D44_04 from './D44_04.jsx';
import D44_05 from './D44_05.jsx';
import D44_06 from './D44_06.jsx';
import D44_07 from './D44_07.jsx';
import D44_08 from './D44_08.jsx';
import D44_09 from './D44_09.jsx';
import D44_10 from './D44_10.jsx';

const HEAD = {
  uz: "Dars 44 amaliyoti — 10 topshiriq (uchburchak burchaklarining yig'indisi)",
  ru: 'Практика урока 44 — 10 заданий (сумма углов треугольника)',
  en: 'Lesson 44 practice — 10 tasks (the angle sum)',
};

const ITEMS = [
  { id: '01', label: { uz: "Burchaklar yig'indisi", ru: 'Сумма углов', en: 'Sum of angles' }, C: D44_01 },  // choice 🟢 sum_value
  { id: '02', label: { uz: 'Tenglikni yozish', ru: 'Записать равенство', en: 'Write the equality' }, C: D44_02 },  // bracket 🟢 sum_bracket
  { id: '03', label: { uz: 'Uchinchi burchak', ru: 'Третий угол', en: 'The third angle' }, C: D44_03 },  // slots 🟢 sum_third_ext
  { id: '04', label: { uz: 'Bunday uchburchak', ru: 'Такой треугольник', en: 'Such a triangle' }, C: D44_04 },  // fix 🟡 sum_fix
  { id: '05', label: { uz: 'Uch qadam', ru: 'Три шага', en: 'Three steps' }, C: D44_05 },  // order 🟡 sum_order
  { id: '06', label: { uz: 'Teng yonli', ru: 'Равнобедренный', en: 'Isosceles' }, C: D44_06 },  // build 🟡 sum_iso
  { id: '07', label: { uz: "Uch to'plam", ru: 'Три набора', en: 'Three sets' }, C: D44_07 },  // sort 🟡 sum_zones
  { id: '08', label: { uz: 'Harf bilan', ru: 'С буквой', en: 'With a letter' }, C: D44_08 },  // chain 🔴 sum_letters
  { id: '09', label: { uz: 'Tashqi burchak', ru: 'Внешний угол', en: 'The exterior angle' }, C: D44_09 },  // bracket 🔴 sum_exterior
  { id: '10', label: { uz: 'Nisbat bilan', ru: 'По отношению', en: 'By ratio' }, C: D44_10 },  // build 🔴 sum_ratio
];

export default function Dars44Practice({ lang = 'uz' }) {
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
