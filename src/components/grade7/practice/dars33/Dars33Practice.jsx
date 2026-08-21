// Dars33 amaliyoti — 10 topshiriq. Mavzu: KOORDINATALAR TEKISLIGI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 33-dars raskladkasi: build, choice, fix, chain, build, order, bracket, build, sort, slots
//
// Darsning O'Z misollari ((0; 3), (2; 5), (3; 2), (5; 2), (−2; −3)) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D33_01 from './D33_01.jsx';
import D33_02 from './D33_02.jsx';
import D33_03 from './D33_03.jsx';
import D33_04 from './D33_04.jsx';
import D33_05 from './D33_05.jsx';
import D33_06 from './D33_06.jsx';
import D33_07 from './D33_07.jsx';
import D33_08 from './D33_08.jsx';
import D33_09 from './D33_09.jsx';
import D33_10 from './D33_10.jsx';

const HEAD = {
  uz: "Dars 33 amaliyoti — 10 topshiriq (koordinatalar tekisligi)",
  ru: 'Практика урока 33 — 10 заданий (координатная плоскость)',
  en: 'Lesson 33 practice — 10 tasks (the coordinate plane)',
};

const ITEMS = [
  { id: '01', label: { uz: "Yozuv", ru: 'Запись', en: 'Record' }, C: D33_01 },  // build 🟢 x = 4, y = −7
  { id: '02', label: { uz: "Qayerda", ru: 'Где', en: 'Where' }, C: D33_02 },  // choice 🟢 (0; −6)
  { id: '03', label: { uz: "Xato yozuv", ru: 'Неверная запись', en: 'Wrong record' }, C: D33_03 },  // fix 🟢 y o'qi
  { id: '04', label: { uz: "Simmetriya", ru: 'Симметрия', en: 'Symmetry' }, C: D33_04 },  // chain 🟡 (3; −2)
  { id: '05', label: { uz: "y o'qiga", ru: 'Относительно y', en: 'Across y' }, C: D33_05 },  // build 🟡 (−5; 2)
  { id: '06', label: { uz: "Tartib", ru: 'Порядок', en: 'Order' }, C: D33_06 },  // order 🟡 abssissa bo'yicha
  { id: '07', label: { uz: "O'qdagi nuqta", ru: 'Точка на оси', en: 'On an axis' }, C: D33_07 },  // bracket 🟡 x = −6
  { id: '08', label: { uz: "Boshga nisbatan", ru: 'Относительно начала', en: 'About origin' }, C: D33_08 },  // build 🔴 (4; −3)
  { id: '09', label: { uz: "Choraklar", ru: 'Четверти', en: 'Quadrants' }, C: D33_09 },  // sort 🔴 2 va 5
  { id: '10', label: { uz: "O'qish", ru: 'Прочитать', en: 'Read' }, C: D33_10 },  // slots 🔴 A(−4; 7)
];

export default function Dars33Practice({ lang = 'uz' }) {
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
