// Dars41 amaliyoti — 10 topshiriq. Mavzu: BURCHAK VA UNING O'LCHOVI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 41-dars raskladkasi: order, choice, build, fix, sort, slots, bracket, build, order, chain

import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D41_01 from './D41_01.jsx';
import D41_02 from './D41_02.jsx';
import D41_03 from './D41_03.jsx';
import D41_04 from './D41_04.jsx';
import D41_05 from './D41_05.jsx';
import D41_06 from './D41_06.jsx';
import D41_07 from './D41_07.jsx';
import D41_08 from './D41_08.jsx';
import D41_09 from './D41_09.jsx';
import D41_10 from './D41_10.jsx';

const HEAD = {
  uz: "Dars 41 amaliyoti — 10 topshiriq (burchak va uning o'lchovi)",
  ru: 'Практика урока 41 — 10 заданий (угол и его мера)',
  en: 'Lesson 41 practice — 10 tasks (angles and their measure)',
};

const ITEMS = [
  { id: '01', label: { uz: "Qo'shni", ru: 'Смежный', en: 'Adjacent' }, C: D41_01 },  // order 🟢 50°
  { id: '02', label: { uz: "Burchak turi", ru: 'Вид угла', en: 'Kind' }, C: D41_02 },  // choice 🟢 95°
  { id: '03', label: { uz: "Qo'shnisini topish", ru: 'Найти смежный', en: 'Find adjacent' }, C: D41_03 },  // build 🟢 40°
  { id: '04', label: { uz: "Vertikal", ru: 'Вертикальный', en: 'Vertical' }, C: D41_04 },  // fix 🟡 65°
  { id: '05', label: { uz: "Uch tur", ru: 'Три вида', en: 'Three kinds' }, C: D41_05 },  // sort 🟡 35 / 90 / 120
  { id: '06', label: { uz: "Bissektrisa", ru: 'Биссектриса', en: 'Bisector' }, C: D41_06 },  // slots 🟡 76°
  { id: '07', label: { uz: "Tenglik", ru: 'Равенство', en: 'Equality' }, C: D41_07 },  // bracket 🟡 ∠1 + ∠2 = 180°
  { id: '08', label: { uz: "Ikki barobar", ru: 'Вдвое', en: 'Twice' }, C: D41_08 },  // build 🔴 x va 2x
  { id: '09', label: { uz: "Harf bilan", ru: 'С буквой', en: 'With a letter' }, C: D41_09 },  // order 🔴 3x = 75°
  { id: '10', label: { uz: "Zanjir", ru: 'Цепочка', en: 'Chain' }, C: D41_10 },  // chain 🔴 118°
];

export default function Dars41Practice({ lang = 'uz' }) {
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
