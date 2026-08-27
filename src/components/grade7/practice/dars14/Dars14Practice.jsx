// Dars14 amaliyoti — 10 topshiriq. Mavzu: DARAJA XOSSALARI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D14_01 from './D14_01.jsx';
import D14_02 from './D14_02.jsx';
import D14_03 from './D14_03.jsx';
import D14_04 from './D14_04.jsx';
import D14_05 from './D14_05.jsx';
import D14_06 from './D14_06.jsx';
import D14_07 from './D14_07.jsx';
import D14_08 from './D14_08.jsx';
import D14_09 from './D14_09.jsx';
import D14_10 from './D14_10.jsx';

const HEAD = {
  uz: "Dars 14 amaliyoti — 10 topshiriq (daraja xossalari)",
  ru: 'Практика урока 14 — 10 заданий (свойства степеней)',
  en: 'Lesson 14 practice — 10 tasks (properties of powers)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: "Ko'paytirish", ru: 'Умножение', en: 'Multiply' }, C: D14_01 },   // ko'rsatkichlar qo'shiladi 🟢 mul_same_base
  { id: '02', label: { uz: 'Sonlar', ru: 'Числа', en: 'Numbers' }, C: D14_02 },              // sonli asos 🟢 mul_numeric
  { id: '03', label: { uz: 'Ikki xossa', ru: 'Два свойства', en: 'Two rules' }, C: D14_03 }, // bo'lish va daraja darajasi 🟡 div_and_power
  { id: '04', label: { uz: 'Tengliklar', ru: 'Равенства', en: 'Equalities' }, C: D14_04 },   // qaysi tenglik to'g'ri 🟡 props_true_eq
  { id: '05', label: { uz: 'Asoslar', ru: 'Основания', en: 'Bases' }, C: D14_05 },           // asoslar bir xilmi 🟡 same_base_only
  { id: '06', label: { uz: "Bo'lish", ru: 'Деление', en: 'Divide' }, C: D14_06 },           // bo'lish, sonli asos 🟡 div_numeric
  { id: '07', label: { uz: "Ko'paytma", ru: 'Произведение', en: 'Product' }, C: D14_07 },   // ko'paytmani darajaga 🔴 power_of_product
  { id: '08', label: { uz: 'Bir xil', ru: 'То же', en: 'Same' }, C: D14_08 },                // a⁶ ga teng yozuvlar 🔴 same_as_a6
  { id: '09', label: { uz: 'Zanjir', ru: 'Подряд', en: 'Chain' }, C: D14_09 },               // ikki xossa ketma-ket 🔴 two_props_chain
  { id: '10', label: { uz: 'Uch natija', ru: 'Три результата', en: 'Three' }, C: D14_10 },   // uch amal, uch natija 🔴 props_zones
];

export default function Dars14Practice({ lang = 'uz' }) {
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
        /* TELEFONDA SARLAVHA JOY YEMASIN (metodist QA si, 2026-08-22): o'nta
           tugma besh qatorga yoyilib, topshiriq ekrandan pastga tushib ketardi.
           Tor ekranda tugmalar BITTA qatorda, yon tomonga suriladi. */
        @media (max-width:639.98px){
          .pq-fixroot{width:390px;}
          .pq-head{padding:46px 10px 7px !important;}
          .pq-title{font-size:12.5px !important;margin-bottom:2px;}
          .pq-chips{flex-wrap:nowrap !important;overflow-x:auto;scrollbar-width:none;}
          .pq-chips::-webkit-scrollbar{display:none;}
        }
      `}</style>
      <div className="pq-head" style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong className="pq-title" style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>{HEAD[lang] || HEAD.uz}</strong>
        <div className="pq-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', width: '100%' }}>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {i + 1} · {item.label[lang] || item.label.uz}
          </button>
        ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id + '-' + lang} Question={q.C} lang={lang} showLanguageSwitch={false} title={null} />
      </div>
    </div>
  );
}
