// Dars21 amaliyoti — 10 topshiriq. Mavzu: KO'PHADLARNI KO'PAYTIRISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 21-dars raskladkasi: bracket, choice, build, chain, sort, order, fix, build, slots, build
//
// Darsning O'Z misollari ((2y + 1)(3y − 2), (3x − 1)(2x + 7), (a − 3)(a + 3), (x + 1)(x + 6), (x − 4)(x − 5)) ataylab takrorlanmadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D21_01 from './D21_01.jsx';
import D21_02 from './D21_02.jsx';
import D21_03 from './D21_03.jsx';
import D21_04 from './D21_04.jsx';
import D21_05 from './D21_05.jsx';
import D21_06 from './D21_06.jsx';
import D21_07 from './D21_07.jsx';
import D21_08 from './D21_08.jsx';
import D21_09 from './D21_09.jsx';
import D21_10 from './D21_10.jsx';

const HEAD = {
  uz: "Dars 21 amaliyoti — 10 topshiriq (ko'phadlarni ko'paytirish)",
  ru: 'Практика урока 21 — 10 заданий (умножение многочленов)',
  en: 'Lesson 21 practice — 10 tasks (multiplying polynomials)',
};

const ITEMS = [
  { id: '01', label: { uz: "Tiklash", ru: 'Восстановить', en: 'Restore' }, C: D21_01 },  // bracket 🟢 m² + 9m + 20
  { id: '02', label: { uz: "Nechta", ru: 'Сколько', en: 'How many' }, C: D21_02 },  // choice 🟢 (a + 3)(a + 7)
  { id: '03', label: { uz: "Yig'ish", ru: 'Собрать', en: 'Build' }, C: D21_03 },  // build 🟢 (x + 5)(x + 2)
  { id: '04', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D21_04 },  // chain 🟡 (y + 6)(y − 4)
  { id: '05', label: { uz: "Uch javob", ru: 'Три ответа', en: 'Three answers' }, C: D21_05 },  // sort 🟡 ishora farqi
  { id: '06', label: { uz: "Tartib", ru: 'Порядок', en: 'Order' }, C: D21_06 },  // order 🟡 (2a + 3)(a + 4)
  { id: '07', label: { uz: "Xato had", ru: 'Неверный член', en: 'Wrong term' }, C: D21_07 },  // fix 🟡 (b + 5)(b − 2)
  { id: '08', label: { uz: "Ikki minus", ru: 'Два минуса', en: 'Two minuses' }, C: D21_08 },  // build 🔴 (3n − 4)(2n − 5)
  { id: '09', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D21_09 },  // slots 🔴 (2p + q)(3p − 4q)
  { id: '10', label: { uz: "Olti ko'paytma", ru: 'Шесть произведений', en: 'Six products' }, C: D21_10 },  // build 🔴 (k + 3)(k² − 2k + 5)
];

export default function Dars21Practice({ lang = 'uz' }) {
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
