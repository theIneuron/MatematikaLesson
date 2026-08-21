// Dars38 amaliyoti — 10 topshiriq. Mavzu: TENGLAMALAR SISTEMASI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 38-dars raskladkasi: choice, build, bracket, build, sort, slots, order, build, chain, fix
//
// Darsning O'Z misollari ((0; 3), (1; 2), (2; 1), (3; 0), y = 1) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D38_01 from './D38_01.jsx';
import D38_02 from './D38_02.jsx';
import D38_03 from './D38_03.jsx';
import D38_04 from './D38_04.jsx';
import D38_05 from './D38_05.jsx';
import D38_06 from './D38_06.jsx';
import D38_07 from './D38_07.jsx';
import D38_08 from './D38_08.jsx';
import D38_09 from './D38_09.jsx';
import D38_10 from './D38_10.jsx';

const HEAD = {
  uz: "Dars 38 amaliyoti — 10 topshiriq (tenglamalar sistemasi)",
  ru: 'Практика урока 38 — 10 заданий (система уравнений)',
  en: 'Lesson 38 practice — 10 tasks (a system of equations)',
};

const ITEMS = [
  { id: '01', label: { uz: "Yechim nima", ru: 'Что такое решение', en: 'What a solution is' }, C: D38_01 },  // choice 🟢 ta'rif
  { id: '02', label: { uz: "Tekshirish", ru: 'Проверка', en: 'Check' }, C: D38_02 },  // build 🟢 (2; 1)
  { id: '03', label: { uz: "Juftlik", ru: 'Пара', en: 'A pair' }, C: D38_03 },  // bracket 🟢 x = 5, y = −2
  { id: '04', label: { uz: "Bittasi ma'lum", ru: 'Одно известно', en: 'One known' }, C: D38_04 },  // build 🟡 y = 3
  { id: '05', label: { uz: "Nechta yechim", ru: 'Сколько решений', en: 'How many' }, C: D38_05 },  // sort 🟡 parallel va bir xil
  { id: '06', label: { uz: "Ikki natija", ru: 'Два результата', en: 'Two results' }, C: D38_06 },  // slots 🟡 (3; 2)
  { id: '07', label: { uz: "Uch qadam", ru: 'Три шага', en: 'Three steps' }, C: D38_07 },  // order 🟡 y = x − 1, y = 4
  { id: '08', label: { uz: "Yig'indi va ayirma", ru: 'Сумма и разность', en: 'Sum and difference' }, C: D38_08 },  // build 🔴 10 va 2
  { id: '09', label: { uz: "Zanjir", ru: 'Цепочка', en: 'Chain' }, C: D38_09 },  // chain 🔴 y = 2x − 3, y = 5
  { id: '10', label: { uz: "Xato tekshirish", ru: 'Неверная проверка', en: 'Wrong check' }, C: D38_10 },  // fix 🔴 (2; 2)
];

export default function Dars38Practice({ lang = 'uz' }) {
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
