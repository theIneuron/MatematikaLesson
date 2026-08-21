// Dars36 amaliyoti — 10 topshiriq. Mavzu: GRAFIKLARNI QURISH VA O'QISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 36-dars raskladkasi: choice, order, build, chain, sort, build, slots, build, bracket, fix
//
// Darsning O'Z misollari ((1; 3), (2; 1), (2; −3), (3; 2), (4; 2)) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D36_01 from './D36_01.jsx';
import D36_02 from './D36_02.jsx';
import D36_03 from './D36_03.jsx';
import D36_04 from './D36_04.jsx';
import D36_05 from './D36_05.jsx';
import D36_06 from './D36_06.jsx';
import D36_07 from './D36_07.jsx';
import D36_08 from './D36_08.jsx';
import D36_09 from './D36_09.jsx';
import D36_10 from './D36_10.jsx';

const HEAD = {
  uz: "Dars 36 amaliyoti — 10 topshiriq (grafiklarni qurish va o'qish)",
  ru: 'Практика урока 36 — 10 заданий (построение и чтение графиков)',
  en: 'Lesson 36 practice — 10 tasks (drawing and reading graphs)',
};

const ITEMS = [
  { id: '01', label: { uz: "Nechta nuqta", ru: 'Сколько точек', en: 'How many points' }, C: D36_01 },  // choice 🟢 to'g'ri chiziq
  { id: '02', label: { uz: "Qadamlar", ru: 'Шаги', en: 'Steps' }, C: D36_02 },  // order 🟢 y = 2x + 3
  { id: '03', label: { uz: "Tekshirish", ru: 'Проверка', en: 'Check' }, C: D36_03 },  // build 🟢 (2; 7)
  { id: '04', label: { uz: "Ikki savol", ru: 'Два вопроса', en: 'Two questions' }, C: D36_04 },  // chain 🟡 y = −x + 6
  { id: '05', label: { uz: "Qaysi formula", ru: 'Какая формула', en: 'Which rule' }, C: D36_05 },  // sort 🟡 nuqta juftlari
  { id: '06', label: { uz: "Grafikdan", ru: 'По графику', en: 'From graph' }, C: D36_06 },  // build 🟡 (0; −4), (2; 0)
  { id: '07', label: { uz: "Jadval", ru: 'Таблица', en: 'Table' }, C: D36_07 },  // slots 🟡 y = 4 − x
  { id: '08', label: { uz: "Manfiy x", ru: 'Отрицательный x', en: 'Negative x' }, C: D36_08 },  // build 🔴 y = 2x + 5
  { id: '09', label: { uz: "x o'qi", ru: 'Ось x', en: 'The x axis' }, C: D36_09 },  // bracket 🔴 y = 3x − 12
  { id: '10', label: { uz: "Xato bo'lak", ru: 'Неверная часть', en: 'Wrong part' }, C: D36_10 },  // fix 🔴 y = −2x + 1
];

export default function Dars36Practice({ lang = 'uz' }) {
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
