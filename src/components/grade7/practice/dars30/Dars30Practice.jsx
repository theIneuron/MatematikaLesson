// Dars30 amaliyoti — 10 topshiriq. Mavzu: BUTUN IFODALARNI IXCHAMLASH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 30-dars raskladkasi: choice, build, chain, order, bracket, build, sort, slots, build, fix
//
// Darsning O'Z misollari ((2x − 1)² − 4x², (a + 5)² − a², (x + 2)² − x², 10a + 25, 12x + 18) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D30_01 from './D30_01.jsx';
import D30_02 from './D30_02.jsx';
import D30_03 from './D30_03.jsx';
import D30_04 from './D30_04.jsx';
import D30_05 from './D30_05.jsx';
import D30_06 from './D30_06.jsx';
import D30_07 from './D30_07.jsx';
import D30_08 from './D30_08.jsx';
import D30_09 from './D30_09.jsx';
import D30_10 from './D30_10.jsx';

const HEAD = {
  uz: "Dars 30 amaliyoti — 10 topshiriq (butun ifodalarni ixchamlash)",
  ru: 'Практика урока 30 — 10 заданий (упрощение целых выражений)',
  en: 'Lesson 30 practice — 10 tasks (simplifying whole expressions)',
};

const ITEMS = [
  { id: '01', label: { uz: "Birinchi qadam", ru: 'Первый шаг', en: 'First step' }, C: D30_01 },  // choice 🟢 3(x + 2) − (x − 4)
  { id: '02', label: { uz: "Ixchamlash", ru: 'Упрощение', en: 'Simplify' }, C: D30_02 },  // build 🟢 3(x + 2) − (x − 4)
  { id: '03', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D30_03 },  // chain 🟢 5(y − 3) + 2(y + 4)
  { id: '04', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D30_04 },  // order 🟡 (x + 6)² − x²
  { id: '05', label: { uz: "Yozuvni tuzish", ru: 'Составить запись', en: 'Build record' }, C: D30_05 },  // bracket 🟡 8 − 3(k − 2)
  { id: '06', label: { uz: "Minus va ko'paytuvchi", ru: 'Минус и множитель', en: 'Minus and factor' }, C: D30_06 },  // build 🟡 8 − 3(k − 2)
  { id: '07', label: { uz: "Uch natija", ru: 'Три результата', en: 'Three results' }, C: D30_07 },  // sort 🟡 3(x + 2) bilan
  { id: '08', label: { uz: "Harflar yo'qoladi", ru: 'Буквы исчезают', en: 'Letters vanish' }, C: D30_08 },  // slots 🔴 (a + 4)² − (a + 1)(a + 7)
  { id: '09', label: { uz: "Ikki formula", ru: 'Две формулы', en: 'Two formulas' }, C: D30_09 },  // build 🔴 (x + 5)² − (x + 5)(x − 5)
  { id: '10', label: { uz: "Xato had", ru: 'Неверный член', en: 'Wrong term' }, C: D30_10 },  // fix 🔴 4 − 2(x − 3)
];

export default function Dars30Practice({ lang = 'uz' }) {
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
