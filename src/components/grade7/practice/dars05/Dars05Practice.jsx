// Dars05 amaliyoti — 10 topshiriq. Mavzu: QAVSLARNI OCHISH QOIDASI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D05_01 from './D05_01.jsx';
import D05_02 from './D05_02.jsx';
import D05_03 from './D05_03.jsx';
import D05_04 from './D05_04.jsx';
import D05_05 from './D05_05.jsx';
import D05_06 from './D05_06.jsx';
import D05_07 from './D05_07.jsx';
import D05_08 from './D05_08.jsx';
import D05_09 from './D05_09.jsx';
import D05_10 from './D05_10.jsx';

const HEAD = {
  uz: "Dars 5 amaliyoti — 10 topshiriq (qavslarni ochish)",
  ru: 'Практика урока 5 — 10 заданий (раскрытие скобок)',
  en: 'Lesson 5 practice — 10 tasks (opening brackets)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: "O'qish", ru: 'Чтение', en: 'Reading' }, C: D05_01 },        // minusli qavsni o'qish 🟢 read_minus_bracket
  { id: '02', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D05_02 },        // manfiy son bilan 🟢 minus_bracket_value
  { id: '03', label: { uz: 'Ishora', ru: 'Знаки', en: 'Signs' }, C: D05_03 },           // qaysi ishora o'zgaradi 🟡 which_signs_flip
  { id: '04', label: { uz: "Yig'ish", ru: 'Собрать', en: 'Collect' }, C: D05_04 },      // ochib, yig'ish 🟡 open_and_collect
  { id: '05', label: { uz: 'Tekshir', ru: 'Проверка', en: 'Check' }, C: D05_05 },       // to'g'ri ochilganmi 🟡 opened_right
  { id: '06', label: { uz: 'Tuzatish', ru: 'Ошибка', en: 'Fix' }, C: D05_06 },          // yarim yo'lda qolgan minus 🟡 fix_half_flip
  { id: '07', label: { uz: 'Uchta qavs', ru: 'Три скобки', en: 'Three' }, C: D05_07 },  // uchta qavs 🔴 three_brackets
  { id: '08', label: { uz: 'Bir xil', ru: 'То же', en: 'Same' }, C: D05_08 },           // a − b − c ga teng 🔴 same_as_abc
  { id: '09', label: { uz: 'Qurish', ru: 'Сборка', en: 'Build' }, C: D05_09 },          // qavs qiymatni saqlaydi 🔴 build_bracket_value
  { id: '10', label: { uz: "Ta'sir", ru: "Что будет", en: "Effect" }, C: D05_10 },     // qavs olib tashlansa 🔴 bracket_effect
];

export default function Dars05Practice({ lang = 'uz' }) {
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
