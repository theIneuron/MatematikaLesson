// Dars15 amaliyoti — 10 topshiriq. Mavzu: BIR HAD.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D15_01 from './D15_01.jsx';
import D15_02 from './D15_02.jsx';
import D15_03 from './D15_03.jsx';
import D15_04 from './D15_04.jsx';
import D15_05 from './D15_05.jsx';
import D15_06 from './D15_06.jsx';
import D15_07 from './D15_07.jsx';
import D15_08 from './D15_08.jsx';
import D15_09 from './D15_09.jsx';
import D15_10 from './D15_10.jsx';

const HEAD = {
  uz: "Dars 15 amaliyoti — 10 topshiriq (bir had)",
  ru: 'Практика урока 15 — 10 заданий (одночлен)',
  en: 'Lesson 15 practice — 10 tasks (monomials)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: 'Bir had', ru: 'Одночлен', en: 'Monomial' }, C: D15_01 },          // bu bir hadmi 🟢 is_monomial
  { id: '02', label: { uz: 'Koeffitsiyent', ru: 'Коэффициент', en: 'Coefficient' }, C: D15_02 }, // koeffitsiyent 🟢 coefficient
  { id: '03', label: { uz: "Ko'paytirish", ru: 'Умножение', en: 'Multiply' }, C: D15_03 },   // bir hadlarni ko'paytirish 🟡 mul_monomials
  { id: '04', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D15_04 },              // bir hadning qiymati 🟡 monomial_value
  { id: '05', label: { uz: "O'xshash", ru: 'Подобные', en: 'Alike' }, C: D15_05 },           // o'xshash bir hadlar 🟡 like_monomials
  { id: '06', label: { uz: 'Standart', ru: 'Стандартный', en: 'Standard' }, C: D15_06 },      // standart ko'rinish 🟡 standard_form
  { id: '07', label: { uz: 'Daraja', ru: 'В степень', en: 'To a power' }, C: D15_07 },        // darajaga ko'tarish 🔴 monomial_power
  { id: '08', label: { uz: 'Bir xil', ru: 'То же', en: 'Same' }, C: D15_08 },                 // 6x³ ga teng 🔴 same_as_6x3
  { id: '09', label: { uz: 'Ikki harf', ru: 'Две буквы', en: 'Two letters' }, C: D15_09 },    // ikki harfli bir had 🔴 two_letter_value
  { id: '10', label: { uz: 'Darajasi', ru: 'Степень', en: 'Degree' }, C: D15_10 },            // bir hadning darajasi 🔴 monomial_degree
];

export default function Dars15Practice({ lang = 'uz' }) {
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
