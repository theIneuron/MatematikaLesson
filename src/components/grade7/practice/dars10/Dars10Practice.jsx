// Dars10 amaliyoti — 10 topshiriq. Mavzu: MODULLI CHIZIQLI TENGLAMA.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D10_01 from './D10_01.jsx';
import D10_02 from './D10_02.jsx';
import D10_03 from './D10_03.jsx';
import D10_04 from './D10_04.jsx';
import D10_05 from './D10_05.jsx';
import D10_06 from './D10_06.jsx';
import D10_07 from './D10_07.jsx';
import D10_08 from './D10_08.jsx';
import D10_09 from './D10_09.jsx';
import D10_10 from './D10_10.jsx';

const HEAD = {
  uz: "Dars 10 amaliyoti — 10 topshiriq (modulli tenglama)",
  ru: 'Практика урока 10 — 10 заданий (уравнения с модулем)',
  en: 'Lesson 10 practice — 10 tasks (equations with a modulus)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D10_01 },        // nechta ildiz 🟢 mod_two_roots
  { id: '02', label: { uz: 'Sonlar', ru: 'Числа', en: 'Numbers' }, C: D10_02 },           // qaysi sonlar mos 🟢 mod_which_numbers
  { id: '03', label: { uz: 'Ikki holat', ru: 'Два случая', en: 'Two cases' }, C: D10_03 },// ikki holat 🟡 mod_two_cases
  { id: '04', label: { uz: 'Nol', ru: 'Нуль', en: 'Zero' }, C: D10_04 },                  // modul nolga teng 🟡 mod_zero
  { id: '05', label: { uz: 'Ikkinchisi', ru: 'Второй', en: 'Second' }, C: D10_05 },       // ikkinchi holatni yozish 🟡 mod_second_case
  { id: '06', label: { uz: "Yo'q", ru: 'Нет корней', en: 'None' }, C: D10_06 },           // ildizi yo'q 🟡 mod_no_root
  { id: '07', label: { uz: 'Ajratish', ru: 'Один модуль', en: 'Isolate' }, C: D10_07 },   // modulni ajratish 🔴 mod_isolate
  { id: '08', label: { uz: 'Minus', ru: 'Минус', en: 'Minus' }, C: D10_08 },              // modul va minus 🔴 mod_outside_minus
  { id: '09', label: { uz: 'Musbat', ru: 'Положительный', en: 'Positive' }, C: D10_09 },  // musbat ildiz 🔴 mod_positive_root
  { id: '10', label: { uz: 'Sanash', ru: 'Число корней', en: 'Count' }, C: D10_10 },      // nechta ildiz bor 🔴 mod_root_count
];

export default function Dars10Practice({ lang = 'uz' }) {
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
