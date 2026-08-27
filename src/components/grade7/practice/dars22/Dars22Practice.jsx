// Dars22 amaliyoti — 10 topshiriq. Mavzu: UMUMIY KO'PAYTUVCHINI QAVSGA OLISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 22-dars raskladkasi: choice, bracket, order, slots, build, slots, chain, fix, build, sort
//
// Darsning O'Z misollari (12a² + 18a, 10x³ − 15x², 18a³b², 12a² − 9) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D22_01 from './D22_01.jsx';
import D22_02 from './D22_02.jsx';
import D22_03 from './D22_03.jsx';
import D22_04 from './D22_04.jsx';
import D22_05 from './D22_05.jsx';
import D22_06 from './D22_06.jsx';
import D22_07 from './D22_07.jsx';
import D22_08 from './D22_08.jsx';
import D22_09 from './D22_09.jsx';
import D22_10 from './D22_10.jsx';

const HEAD = {
  uz: "Dars 22 amaliyoti — 10 topshiriq (umumiy ko'paytuvchini qavsga olish)",
  ru: 'Практика урока 22 — 10 заданий (вынесение общего множителя)',
  en: 'Lesson 22 practice — 10 tasks (taking out a common factor)',
};

const ITEMS = [
  { id: '01', label: { uz: "Qaysi biri", ru: 'Какой множитель', en: 'Which factor' }, C: D22_01 },  // choice 🟢 20y³ + 35y²
  { id: '02', label: { uz: "Qavsga olish", ru: 'В скобку', en: 'Into a bracket' }, C: D22_02 },  // bracket 🟢 12c² + 18c
  { id: '03', label: { uz: "Tartib", ru: 'Порядок', en: 'Order' }, C: D22_03 },  // order 🟢 9x² − 36x
  { id: '04', label: { uz: "Uch bo'sh katak", ru: 'Три клетки', en: 'Three cells' }, C: D22_04 },  // slots 🟡 24m⁵ − 16m³
  { id: '05', label: { uz: "Minus", ru: 'Минус', en: 'Minus' }, C: D22_05 },  // build 🟡 −15t⁴ − 25t²
  { id: '06', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D22_06 },  // slots 🟡 21x⁴y − 14x²y³
  { id: '07', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D22_07 },  // chain 🟡 40n³ + 24n²
  { id: '08', label: { uz: "Xato bo'lak", ru: 'Неверная часть', en: 'Wrong part' }, C: D22_08 },  // fix 🔴 36z⁵ − 24z³
  { id: '09', label: { uz: "Umumiy qavs", ru: 'Общая скобка', en: 'Common bracket' }, C: D22_09 },  // build 🔴 x(x − 7) + 5(x − 7)
  { id: '10', label: { uz: "Uch yozuv", ru: 'Три записи', en: 'Three records' }, C: D22_10 },  // sort 🔴 4a² / 4a / 2a²
];

export default function Dars22Practice({ lang = 'uz' }) {
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
