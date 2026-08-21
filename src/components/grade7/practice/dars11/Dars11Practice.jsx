// Dars11 amaliyoti — 10 topshiriq. Mavzu: MASALALARNI TENGLAMA BILAN YECHISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D11_01 from './D11_01.jsx';
import D11_02 from './D11_02.jsx';
import D11_03 from './D11_03.jsx';
import D11_04 from './D11_04.jsx';
import D11_05 from './D11_05.jsx';
import D11_06 from './D11_06.jsx';
import D11_07 from './D11_07.jsx';
import D11_08 from './D11_08.jsx';
import D11_09 from './D11_09.jsx';
import D11_10 from './D11_10.jsx';

const HEAD = {
  uz: "Dars 11 amaliyoti — 10 topshiriq (masala va tenglama)",
  ru: 'Практика урока 11 — 10 заданий (задачи через уравнение)',
  en: 'Lesson 11 practice — 10 tasks (problems via equations)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: 'Tenglama', ru: 'Уравнение', en: 'Equation' }, C: D11_01 },     // masalaning tenglamasi 🟢 pick_equation
  { id: '02', label: { uz: 'Javob', ru: 'Ответ', en: 'Answer' }, C: D11_02 },              // javobni topish 🟢 solve_and_answer
  { id: '03', label: { uz: 'Tuzish', ru: 'Составь', en: 'Compose' }, C: D11_03 },          // tenglamani tuzish 🟡 build_equation_books
  { id: '04', label: { uz: 'Yechish', ru: 'Решение', en: 'Solve' }, C: D11_04 },           // yechish va javob 🟡 solve_books
  { id: '05', label: { uz: 'Ikki barobar', ru: 'В два раза', en: 'Twice' }, C: D11_05 },   // ikki barobar ko'p 🟡 twice_as_many
  { id: '06', label: { uz: 'Kimning', ru: 'Про кого', en: 'Whose' }, C: D11_06 },          // Alida nechta marka 🟡 solve_twice
  { id: '07', label: { uz: 'Ikki son', ru: 'Два числа', en: 'Two numbers' }, C: D11_07 },  // farqi ma'lum 🔴 sum_and_diff
  { id: '08', label: { uz: 'Ketma-ket', ru: 'Подряд', en: 'In a row' }, C: D11_08 },       // uch ketma-ket son 🔴 consecutive_three
  { id: '09', label: { uz: 'Qolgani', ru: 'Осталось', en: 'Left' }, C: D11_09 },           // yegan va qolgan 🔴 build_boxes_eaten
  { id: '10', label: { uz: 'Uch javob', ru: 'Три ответа', en: 'Three' }, C: D11_10 },      // uch masala, uch javob 🔴 answer_zones
];

export default function Dars11Practice({ lang = 'uz' }) {
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
