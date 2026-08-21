// Dars24 amaliyoti — 10 topshiriq. Mavzu: KO'PHADNI BIR HADGA BO'LISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 24-dars raskladkasi: choice, fix, sort, order, build, chain, fix, slots, build, bracket
//
// Darsning O'Z misollari ((12a⁵ − 8a³) : 4a², (20a⁴ − 5a²) : 5a², (a³ + a²) : a²) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D24_01 from './D24_01.jsx';
import D24_02 from './D24_02.jsx';
import D24_03 from './D24_03.jsx';
import D24_04 from './D24_04.jsx';
import D24_05 from './D24_05.jsx';
import D24_06 from './D24_06.jsx';
import D24_07 from './D24_07.jsx';
import D24_08 from './D24_08.jsx';
import D24_09 from './D24_09.jsx';
import D24_10 from './D24_10.jsx';

const HEAD = {
  uz: "Dars 24 amaliyoti — 10 topshiriq (ko'phadni bir hadga bo'lish)",
  ru: 'Практика урока 24 — 10 заданий (деление многочлена на одночлен)',
  en: 'Lesson 24 practice — 10 tasks (dividing a polynomial by a monomial)',
};

const ITEMS = [
  { id: '01', label: { uz: "Har had", ru: 'Каждый член', en: 'Every term' }, C: D24_01 },  // choice 🟢 (18x⁴ + 12x²) : 6x²
  { id: '02', label: { uz: "Xato had", ru: 'Неверный член', en: 'Wrong term' }, C: D24_02 },  // fix 🟢 (24m⁴ − 18m³ + 6m²) : 6m²
  { id: '03', label: { uz: "Uch bo'linma", ru: 'Три частных', en: 'Three quotients' }, C: D24_03 },  // sort 🟢 3a² / 3a / 3
  { id: '04', label: { uz: "Tartib", ru: 'Порядок', en: 'Order' }, C: D24_04 },  // order 🟡 (28p⁵ − 21p³) : 7p²
  { id: '05', label: { uz: "Uch had", ru: 'Три члена', en: 'Three terms' }, C: D24_05 },  // build 🟡 (45c⁶ + 27c⁴ − 9c²) : 9c²
  { id: '06', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D24_06 },  // chain 🟡 (32n⁵ − 20n³) : 4n²
  { id: '07', label: { uz: "Ortiqcha harf", ru: 'Лишняя буква', en: 'Extra letter' }, C: D24_07 },  // fix 🟡 (30a⁴b − 18a³b² + 12a²b) : 6a²b
  { id: '08', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D24_08 },  // slots 🔴 (56x⁷y³ − 42x⁵y²) : 14x⁴y²
  { id: '09', label: { uz: "Uch bo'linma", ru: 'Три частных', en: 'Three quotients' }, C: D24_09 },  // build 🔴 (48z⁵ − 36z⁴ + 12z³) : 12z³
  { id: '10', label: { uz: "Teskari", ru: 'Обратно', en: 'Backwards' }, C: D24_10 },  // bracket 🔴 bo'linuvchini tiklash
];

export default function Dars24Practice({ lang = 'uz' }) {
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
