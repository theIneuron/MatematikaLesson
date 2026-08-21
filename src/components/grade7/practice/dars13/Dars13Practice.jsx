// Dars13 amaliyoti — 10 topshiriq. Mavzu: NATURAL KO'RSATKICHLI DARAJA.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D13_01 from './D13_01.jsx';
import D13_02 from './D13_02.jsx';
import D13_03 from './D13_03.jsx';
import D13_04 from './D13_04.jsx';
import D13_05 from './D13_05.jsx';
import D13_06 from './D13_06.jsx';
import D13_07 from './D13_07.jsx';
import D13_08 from './D13_08.jsx';
import D13_09 from './D13_09.jsx';
import D13_10 from './D13_10.jsx';

const HEAD = {
  uz: "Dars 13 amaliyoti — 10 topshiriq (daraja)",
  ru: 'Практика урока 13 — 10 заданий (степень)',
  en: 'Lesson 13 practice — 10 tasks (powers)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: "Ma'no", ru: 'Смысл', en: 'Meaning' }, C: D13_01 },            // daraja nimani bildiradi 🟢 power_meaning
  { id: '02', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D13_02 },           // darajani hisoblash 🟢 power_value
  { id: '03', label: { uz: 'Bir xil', ru: 'То же', en: 'Same' }, C: D13_03 },              // 2⁶ ga teng yozuvlar 🟡 same_as_64
  { id: '04', label: { uz: 'Manfiy asos', ru: 'Минус в базе', en: 'Neg. base' }, C: D13_04 }, // manfiy asos 🟡 negative_base
  { id: '05', label: { uz: 'Qavs', ru: 'Скобка', en: 'Bracket' }, C: D13_05 },             // qavs bor va qavs yo'q 🟡 bracket_vs_none
  { id: '06', label: { uz: 'Katta', ru: 'Что больше', en: 'Bigger' }, C: D13_06 },         // qaysi biri katta 🟡 compare_powers
  { id: '07', label: { uz: 'Tengliklar', ru: 'Равенства', en: 'Equalities' }, C: D13_07 }, // to'g'ri tengliklar 🔴 power_true_eq
  { id: '08', label: { uz: "Ko'paytma", ru: 'Произведение', en: 'Product' }, C: D13_08 }, // darajalar ko'paytmasi 🔴 powers_product
  { id: '09', label: { uz: 'Katta son', ru: 'Большие числа', en: 'Big numbers' }, C: D13_09 }, // 10³ − 2⁵ 🔴 power_expression
  { id: '10', label: { uz: 'Ishora', ru: 'Знак', en: 'Sign' }, C: D13_10 },                // uch yozuv, uch qiymat 🔴 sign_power_zones
];

export default function Dars13Practice({ lang = 'uz' }) {
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
      {/* MOBIL_DESKTOP_MOSLASH.md naqshi: fixed root — body-skroll yo'q, tugma joyida;
          <640px da layout 390px etalon + zoom bilan real ekranga masshtablanadi. */}
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
