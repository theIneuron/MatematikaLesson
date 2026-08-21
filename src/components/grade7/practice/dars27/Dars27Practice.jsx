// Dars27 amaliyoti — 10 topshiriq. Mavzu: YIG'INDINING KUBI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 27-dars raskladkasi: order, choice, chain, fix, slots, sort, build, bracket, slots, build
//
// Darsning O'Z misollari ((2x + 1)³, (3x + 1)³, (a − 1)³, (x + 1)³, (x + 2)³, (y − 2)³) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D27_01 from './D27_01.jsx';
import D27_02 from './D27_02.jsx';
import D27_03 from './D27_03.jsx';
import D27_04 from './D27_04.jsx';
import D27_05 from './D27_05.jsx';
import D27_06 from './D27_06.jsx';
import D27_07 from './D27_07.jsx';
import D27_08 from './D27_08.jsx';
import D27_09 from './D27_09.jsx';
import D27_10 from './D27_10.jsx';

const HEAD = {
  uz: "Dars 27 amaliyoti — 10 topshiriq (yig'indining kubi)",
  ru: 'Практика урока 27 — 10 заданий (куб суммы)',
  en: 'Lesson 27 practice — 10 tasks (cube of a sum)',
};

const ITEMS = [
  { id: '01', label: { uz: "Tartib", ru: 'Порядок', en: 'Order' }, C: D27_01 },  // order 🟢 (x + 4)³
  { id: '02', label: { uz: "Koeffitsiyentlar", ru: 'Коэффициенты', en: 'Coefficients' }, C: D27_02 },  // choice 🟢 (a + b)³
  { id: '03', label: { uz: "Tekshirish", ru: 'Проверка', en: 'Check' }, C: D27_03 },  // chain 🟢 (m + 5)³, m = 1
  { id: '04', label: { uz: "Xato had", ru: 'Неверный член', en: 'Wrong term' }, C: D27_04 },  // fix 🟡 (n + 2)³
  { id: '05', label: { uz: "Koeffitsiyent", ru: 'Коэффициент', en: 'Coefficient' }, C: D27_05 },  // slots 🟡 (2a + 3)³
  { id: '06', label: { uz: "Qaysi yozuv", ru: 'Какая запись', en: 'Which record' }, C: D27_06 },  // sort 🟡 kub va kvadrat
  { id: '07', label: { uz: "Ayirma", ru: 'Разность', en: 'Difference' }, C: D27_07 },  // build 🟡 (n − 3)³
  { id: '08', label: { uz: "Tiklash", ru: 'Восстановить', en: 'Restore' }, C: D27_08 },  // bracket 🔴 8 + 12y + 6y² + y³
  { id: '09', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D27_09 },  // slots 🔴 (p + 2q)³
  { id: '10', label: { uz: "Minus", ru: 'Минус', en: 'Minus' }, C: D27_10 },  // build 🔴 (3k − 1)³
];

export default function Dars27Practice({ lang = 'uz' }) {
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
