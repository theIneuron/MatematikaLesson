// Dars16 amaliyoti — 10 topshiriq. Mavzu: BIR HADLARNI KO'PAYTIRISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D16_01 from './D16_01.jsx';
import D16_02 from './D16_02.jsx';
import D16_03 from './D16_03.jsx';
import D16_04 from './D16_04.jsx';
import D16_05 from './D16_05.jsx';
import D16_06 from './D16_06.jsx';
import D16_07 from './D16_07.jsx';
import D16_08 from './D16_08.jsx';
import D16_09 from './D16_09.jsx';
import D16_10 from './D16_10.jsx';

const HEAD = {
  uz: "Dars 16 amaliyoti — 10 topshiriq (bir hadlarni ko'paytirish)",
  ru: 'Практика урока 16 — 10 заданий (умножение одночленов)',
  en: 'Lesson 16 practice — 10 tasks (multiplying monomials)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
// Darsning o'z misollari (2a · 5b, 2a³ · 5a², 3a² · 4a³, 5a² · 2a)
// ATAYLAB takrorlanmadi: aks holda xotira tekshiriladi, ko'nikma emas.
const ITEMS = [
  { id: '01', label: { uz: 'Qoida', ru: 'Правило', en: 'Rule' }, C: D16_01 },                  // 4x² · 25x³ 🟢 mul_rule
  { id: '02', label: { uz: 'Ishora', ru: 'Знак', en: 'Sign' }, C: D16_02 },                    // −15a³ · 20a 🟢 mul_coef_sign
  { id: '03', label: { uz: 'Ikki uya', ru: 'Две клетки', en: 'Two cells' }, C: D16_03 },       // 12b⁴ · 8b³ 🟡 mul_two_slots
  { id: '04', label: { uz: 'Ikki harf', ru: 'Две буквы', en: 'Two letters' }, C: D16_04 },     // 5c²d · 40cd³ 🟡 mul_two_letters
  { id: '05', label: { uz: 'Bir xil', ru: 'То же', en: 'Same' }, C: D16_05 },                  // 36y⁵ 🟡 same_as_36y5
  { id: '06', label: { uz: "Ko'rsatkich", ru: 'Показатель', en: 'Exponent' }, C: D16_06 },     // 7x¹² · 8x⁹ 🟡 mul_big_exp
  { id: '07', label: { uz: 'Yig\'ish', ru: 'Собрать', en: 'Build' }, C: D16_07 },              // 6m²n · 4m³n³ 🔴 build_product
  { id: '08', label: { uz: 'Uchta', ru: 'Три', en: 'Three' }, C: D16_08 },                     // (−5a²) · 12a³ · (−2a) 🔴 mul_three_signs
  { id: '09', label: { uz: 'Daraja', ru: 'Степень', en: 'Degree' }, C: D16_09 },               // 9a³b² · 4ab⁴ 🔴 product_degree
  { id: '10', label: { uz: 'Uch javob', ru: 'Три ответа', en: 'Three answers' }, C: D16_10 },  // zonalar 🔴 product_zones
];

export default function Dars16Practice({ lang = 'uz' }) {
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
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
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
