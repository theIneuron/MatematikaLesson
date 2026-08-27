// Dars08 amaliyoti — 10 topshiriq. Mavzu: CHIZIQLI TENGLAMA.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D08_01 from './D08_01.jsx';
import D08_02 from './D08_02.jsx';
import D08_03 from './D08_03.jsx';
import D08_04 from './D08_04.jsx';
import D08_05 from './D08_05.jsx';
import D08_06 from './D08_06.jsx';
import D08_07 from './D08_07.jsx';
import D08_08 from './D08_08.jsx';
import D08_09 from './D08_09.jsx';
import D08_10 from './D08_10.jsx';

const HEAD = {
  uz: "Dars 8 amaliyoti — 10 topshiriq (chiziqli tenglama)",
  ru: 'Практика урока 8 — 10 заданий (линейное уравнение)',
  en: 'Lesson 8 practice — 10 tasks (a linear equation)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: 'Chiziqli', ru: 'Линейное', en: 'Linear' }, C: D08_01 },        // qaysi tenglama chiziqli 🟢 is_linear
  { id: '02', label: { uz: 'Bir qadam', ru: 'Один шаг', en: 'One step' }, C: D08_02 },     // bir qadamli tenglama 🟢 one_step
  { id: '03', label: { uz: "Ko'chirish", ru: 'Перенос', en: 'Move' }, C: D08_03 },        // nimani ko'chirish kerak 🟡 what_to_move
  { id: '04', label: { uz: 'Qadamlar', ru: 'Шаги', en: 'Steps' }, C: D08_04 },             // yechim qadamlari 🟡 solve_steps
  { id: '05', label: { uz: 'Tuzatish', ru: 'Ошибка', en: 'Fix' }, C: D08_05 },             // ko'chirishda ishora 🟡 fix_move_sign
  { id: '06', label: { uz: 'Ikki tomon', ru: 'Две части', en: 'Both sides' }, C: D08_06 }, // noma'lum ikki tomonda 🟡 unknown_both_sides
  { id: '07', label: { uz: 'Bir ildiz', ru: 'Тот же корень', en: 'Same root' }, C: D08_07 }, // ildizi bir xil 🔴 same_root
  { id: '08', label: { uz: 'Qavs', ru: 'Скобка', en: 'Bracket' }, C: D08_08 },             // qavsli tenglama 🔴 bracket_equation
  { id: '09', label: { uz: 'Tuzish', ru: 'Составь', en: 'Compose' }, C: D08_09 },          // masaladan tenglamaga 🔴 compose_linear
  { id: '10', label: { uz: 'Ildizlar', ru: 'Корни', en: 'Roots' }, C: D08_10 },            // uch tenglama, uch ildiz 🔴 root_zones
];

export default function Dars08Practice({ lang = 'uz' }) {
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
