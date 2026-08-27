// Dars01 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: SONLI IFODALAR.
// Bu 1-darsning HAQIQIY amaliyoti (metodist qarori 2026-08-20): ilgari
// shu yerda boshqa to'plam turgan edi, u olib tashlandi.
// Tuzilma, uslub va jsx-question kontrakti 5-sinf amaliyotidan olingan,
// matematikasi esa 7-sinfning. 5-sinfning O'ZIGA tegilmagan.
// Syujet YO'Q: 7-sinfda sahna yozuvning o'zi (metodist qarori 2026-08-19).
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D01_01 from './D01_01.jsx';
import D01_02 from './D01_02.jsx';
import D01_03 from './D01_03.jsx';
import D01_04 from './D01_04.jsx';
import D01_05 from './D01_05.jsx';
import D01_06 from './D01_06.jsx';
import D01_07 from './D01_07.jsx';
import D01_08 from './D01_08.jsx';
import D01_09 from './D01_09.jsx';
import D01_10 from './D01_10.jsx';

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Barcha topshiriqlar darslik §1 (sonli ifodalar, amallar tartibi) mavzusida.
// Sonlar 7-sinf darajasida: manfiy sonlar, o'nli va oddiy kasrlar, uch-to'rt xonali sonlar.
// 03, 04, 08 -- harfli ifodalar (metodist topshirigi 2026-08-20, ikkinchi tur).
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Aldov (trap) variantlar bilan.
// Sarlavha uch tilda: chip nomlari ham (metodist 2026-08-20 -- sayt RU ga
// o'tganda amaliyot ham RU bo'lishi kerak, chip qatori esa sarlavhaning qismi).
const HEAD = {
  uz: "Dars 1 amaliyoti — 10 topshiriq (sonli ifodalar)",
  ru: 'Практика урока 1 — 10 заданий (числовые выражения)',
  en: 'Lesson 1 practice — 10 tasks (numeric expressions)',
};

const ITEMS = [
  { id: '01', label: { uz: "Tartib", ru: 'Порядок', en: 'Order' }, C: D01_01 },     // uchta o'qishdan to'g'risini tanlash 🟢 read_order
  { id: '02', label: { uz: "Birinchi amal", ru: 'Первое действие', en: 'First step' }, C: D01_02 },// birinchi bajariladigan amalni tanlash 🟢 first_step
  { id: '03', label: { uz: "Yig'indi", ru: 'Сумма', en: 'Sum' }, C: D01_03 },       // harfli ifodalarni qo'shish 🟡 add_expressions
  { id: '04', label: { uz: "Ochish", ru: 'Знаки', en: 'Signs' }, C: D01_04 },       // qavs ochilganda ishora 🟡 open_bracket_signs
  { id: '05', label: { uz: "Qiymat", ru: 'Значение', en: 'Value' }, C: D01_05 },    // qiymatni hisoblab yozish 🟡 write_value
  { id: '06', label: { uz: "Tuzatish", ru: 'Ошибка', en: 'Fix' }, C: D01_06 },      // xato qatorni topib tuzatish 🟡 fix_line
  { id: '07', label: { uz: "Zanjir", ru: 'Цепочка', en: 'Chain' }, C: D01_07 },     // oraliq qiymatlar zanjiri 🔴 value_chain
  { id: '08', label: { uz: "Harflar", ru: 'Буквы', en: 'Letters' }, C: D01_08 },    // harf o'rniga son, qiymati 12 🔴 substitute_value
  { id: '09', label: { uz: "Yig'ish", ru: 'Сборка', en: 'Assemble' }, C: D01_09 },  // kartalardan yozuv yig'ish 🔴 build_value
  { id: '10', label: { uz: "Ishora", ru: 'Знак', en: 'Sign' }, C: D01_10 },         // qiymat ishorasi bo'yicha zonalarga 🔴 sort_by_sign
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz YO'Q: sayt qobig'ida allaqachon UZ/RU/EN turadi, va
// ikkita almashtirgich bir-biri bilan kelishmasdi -- yuqoridagisi bosilsa
// topshiriq o'zbekchada qolardi (metodist 2026-08-20).
export default function Dars01Practice({ lang = 'uz' }) {
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
