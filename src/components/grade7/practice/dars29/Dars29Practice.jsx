// Dars29 amaliyoti — 10 topshiriq. Mavzu: FORMULALAR BILAN AJRATISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 29-dars raskladkasi: order, choice, sort, fix, build, chain, slots, build, bracket, build
//
// Darsning O'Z misollari ((2a − 5)², (3 − x)², (3x − 2)², (3x − 4)(3x + 4), (2a − 5)(2a + 5)) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D29_01 from './D29_01.jsx';
import D29_02 from './D29_02.jsx';
import D29_03 from './D29_03.jsx';
import D29_04 from './D29_04.jsx';
import D29_05 from './D29_05.jsx';
import D29_06 from './D29_06.jsx';
import D29_07 from './D29_07.jsx';
import D29_08 from './D29_08.jsx';
import D29_09 from './D29_09.jsx';
import D29_10 from './D29_10.jsx';

const HEAD = {
  uz: "Dars 29 amaliyoti — 10 topshiriq (formulalar bilan ajratish)",
  ru: 'Практика урока 29 — 10 заданий (разложение с формулами)',
  en: 'Lesson 29 practice — 10 tasks (factorising with formulas)',
};

const ITEMS = [
  { id: '01', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D29_01 },  // order 🟢 25 − b²
  { id: '02', label: { uz: "To'liq kvadrat", ru: 'Полный квадрат', en: 'Perfect square' }, C: D29_02 },  // choice 🟢 x² + 14x + 49
  { id: '03', label: { uz: "Uch yozuv", ru: 'Три записи', en: 'Three records' }, C: D29_03 },  // sort 🟢 m² va 64
  { id: '04', label: { uz: "Xato qadam", ru: 'Неверный шаг', en: 'Wrong step' }, C: D29_04 },  // fix 🟡 9y² − 30y + 25
  { id: '05', label: { uz: "Avval umumiy", ru: 'Сначала общий', en: 'Common first' }, C: D29_05 },  // build 🟡 5a² − 45
  { id: '06', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D29_06 },  // chain 🟡 2x² + 12x + 18
  { id: '07', label: { uz: "Uch ko'paytuvchi", ru: 'Три множителя', en: 'Three factors' }, C: D29_07 },  // slots 🟡 3k³ − 12k
  { id: '08', label: { uz: "Ikki marta", ru: 'Дважды', en: 'Twice' }, C: D29_08 },  // build 🔴 a⁴ − 16
  { id: '09', label: { uz: "Kvadrat ichida", ru: 'Квадрат внутри', en: 'Square inside' }, C: D29_09 },  // bracket 🔴 x² + 10x + 25 − y²
  { id: '10', label: { uz: "Umumiy va kvadrat", ru: 'Общий и квадрат', en: 'Common and square' }, C: D29_10 },  // build 🔴 2m² − 8m + 8
];

export default function Dars29Practice({ lang = 'uz' }) {
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
