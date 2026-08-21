// Dars39 amaliyoti — 10 topshiriq. Mavzu: VARIANTLARNI SANASH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 39-dars raskladkasi: slots, choice, build, order, build, fix, chain, bracket, sort, build

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D39_01 from './D39_01.jsx';
import D39_02 from './D39_02.jsx';
import D39_03 from './D39_03.jsx';
import D39_04 from './D39_04.jsx';
import D39_05 from './D39_05.jsx';
import D39_06 from './D39_06.jsx';
import D39_07 from './D39_07.jsx';
import D39_08 from './D39_08.jsx';
import D39_09 from './D39_09.jsx';
import D39_10 from './D39_10.jsx';

const HEAD = {
  uz: "Dars 39 amaliyoti — 10 topshiriq (variantlarni sanash)",
  ru: 'Практика урока 39 — 10 заданий (подсчёт вариантов)',
  en: 'Lesson 39 practice — 10 tasks (counting options)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ko'paytirish", ru: 'Умножение', en: 'Multiplying' }, C: D39_01 },  // slots 🟢 3 · 4
  { id: '02', label: { uz: "Qanday amal", ru: 'Какое действие', en: 'Which operation' }, C: D39_02 },  // choice 🟢 4 va 3
  { id: '03', label: { uz: "Borish-qaytish", ru: 'Туда и обратно', en: 'There and back' }, C: D39_03 },  // build 🟢 5 · 6
  { id: '04', label: { uz: "Uch bosqich", ru: 'Три этапа', en: 'Three stages' }, C: D39_04 },  // order 🟡 2 · 3 · 4
  { id: '05', label: { uz: "Takror mumkin", ru: 'Повтор разрешён', en: 'Repeats allowed' }, C: D39_05 },  // build 🟡 3 · 3
  { id: '06', label: { uz: "Xato bo'lak", ru: 'Неверная часть', en: 'Wrong part' }, C: D39_06 },  // fix 🟡 4 · 3 = 7
  { id: '07', label: { uz: "Yangi tanlov", ru: 'Новый выбор', en: 'New choice' }, C: D39_07 },  // chain 🟡 3 · 5, keyin 2
  { id: '08', label: { uz: "Takrorsiz", ru: 'Без повторов', en: 'No repeats' }, C: D39_08 },  // bracket 🔴 4 · 3 · 2
  { id: '09', label: { uz: "Uch natija", ru: 'Три результата', en: 'Three results' }, C: D39_09 },  // sort 🔴 12 / 9 / 6
  { id: '10', label: { uz: "Uch xona", ru: 'Три разряда', en: 'Three places' }, C: D39_10 },  // build 🔴 3 · 2 · 1
];

export default function Dars39Practice({ lang = 'uz' }) {
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
