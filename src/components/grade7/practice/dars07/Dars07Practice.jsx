// Dars07 amaliyoti — 10 topshiriq. Mavzu: TENGLAMA ILDIZI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D07_01 from './D07_01.jsx';
import D07_02 from './D07_02.jsx';
import D07_03 from './D07_03.jsx';
import D07_04 from './D07_04.jsx';
import D07_05 from './D07_05.jsx';
import D07_06 from './D07_06.jsx';
import D07_07 from './D07_07.jsx';
import D07_08 from './D07_08.jsx';
import D07_09 from './D07_09.jsx';
import D07_10 from './D07_10.jsx';

const HEAD = {
  uz: "Dars 7 amaliyoti — 10 topshiriq (tenglama ildizi)",
  ru: 'Практика урока 7 — 10 заданий (корень уравнения)',
  en: 'Lesson 7 practice — 10 tasks (the root of an equation)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: 'Ildiz', ru: 'Корень', en: 'Root' }, C: D07_01 },              // qaysi son ildiz 🟢 which_is_root
  { id: '02', label: { uz: 'Toping', ru: 'Найди', en: 'Find' }, C: D07_02 },              // ildizni topish 🟢 find_root_simple
  { id: '03', label: { uz: 'Qaysi', ru: 'Какие', en: 'Which' }, C: D07_03 },              // uchlik qaysi tenglamada ildiz 🟡 root_for_which
  { id: '04', label: { uz: 'Qator', ru: 'Строка', en: 'Line' }, C: D07_04 },              // tekshirish qatorini yig'ish 🟡 build_check_line
  { id: '05', label: { uz: 'Tekshir', ru: 'Проверка', en: 'Check' }, C: D07_05 },         // tekshirishni tugatish 🔴 check_chain
  { id: '06', label: { uz: "Noma'lum", ru: 'Неизвестное', en: 'Unknown' }, C: D07_06 },  // noma'lum qayerda 🟡 unknown_where
  { id: '07', label: { uz: 'Ishora', ru: 'Знак', en: 'Sign' }, C: D07_07 },               // manfiy ko'paytuvchi 🔴 root_negative_coef
  { id: '08', label: { uz: "Ildiz yo'q", ru: 'Нет корней', en: 'No roots' }, C: D07_08 },// ildizi yo'q tenglamalar 🔴 no_root
  { id: '09', label: { uz: 'Tuzish', ru: 'Составь', en: 'Compose' }, C: D07_09 },         // shartdan tenglamaga 🔴 compose_equation
  { id: '10', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D07_10 },        // nechta ildiz 🔴 how_many_roots
];

export default function Dars07Practice({ lang = 'uz' }) {
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
