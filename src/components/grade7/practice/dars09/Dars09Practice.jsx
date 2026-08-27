// Dars09 amaliyoti — 10 topshiriq. Mavzu: TENGLAMALARNI YECHISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D09_01 from './D09_01.jsx';
import D09_02 from './D09_02.jsx';
import D09_03 from './D09_03.jsx';
import D09_04 from './D09_04.jsx';
import D09_05 from './D09_05.jsx';
import D09_06 from './D09_06.jsx';
import D09_07 from './D09_07.jsx';
import D09_08 from './D09_08.jsx';
import D09_09 from './D09_09.jsx';
import D09_10 from './D09_10.jsx';

const HEAD = {
  uz: "Dars 9 amaliyoti — 10 topshiriq (tenglamalarni yechish)",
  ru: 'Практика урока 9 — 10 заданий (решение уравнений)',
  en: 'Lesson 9 practice — 10 tasks (solving equations)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: 'Birinchi', ru: 'Первый шаг', en: 'First step' }, C: D09_01 },  // birinchi qadam 🟢 first_step_plan
  { id: '02', label: { uz: 'Qavs', ru: 'Скобка', en: 'Bracket' }, C: D09_02 },            // qavsli oddiy tenglama 🟢 bracket_simple
  { id: '03', label: { uz: 'Yechim', ru: 'Решение', en: 'Solution' }, C: D09_03 },        // to'liq yechim 🟡 full_solution
  { id: '04', label: { uz: "Ko'paytir", ru: 'Что умножать', en: 'Multiply' }, C: D09_04 }, // nimani ko'paytirish 🟡 which_to_multiply
  { id: '05', label: { uz: 'Tuzatish', ru: 'Ошибка', en: 'Fix' }, C: D09_05 },            // qavs yarim ochilgan 🟡 fix_half_bracket
  { id: '06', label: { uz: 'Qaysi tomon', ru: 'Куда собрать', en: 'Which side' }, C: D09_06 }, // noma'lum o'ngda 🟡 unknown_right
  { id: '07', label: { uz: 'Ildizi ikki', ru: 'Корень два', en: 'Root two' }, C: D09_07 },  // ildizi ikkiga teng 🔴 root_is_two
  { id: '08', label: { uz: 'Ikki qavs', ru: 'Две скобки', en: 'Two brackets' }, C: D09_08 }, // ikki qavsli tenglama 🔴 two_brackets_equation
  { id: '09', label: { uz: 'Tekshir', ru: 'Проверка', en: 'Check' }, C: D09_09 },         // ildizni tekshirish 🔴 build_root_check
  { id: '10', label: { uz: 'Ildizlar', ru: 'Корни', en: 'Roots' }, C: D09_10 },           // uch tenglama, uch ildiz 🔴 solve_zones
];

export default function Dars09Practice({ lang = 'uz' }) {
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
