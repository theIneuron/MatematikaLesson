// Dars12 amaliyoti — 10 topshiriq. Mavzu: TENGLAMA TUZISHGA MASALALAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D12_01 from './D12_01.jsx';
import D12_02 from './D12_02.jsx';
import D12_03 from './D12_03.jsx';
import D12_04 from './D12_04.jsx';
import D12_05 from './D12_05.jsx';
import D12_06 from './D12_06.jsx';
import D12_07 from './D12_07.jsx';
import D12_08 from './D12_08.jsx';
import D12_09 from './D12_09.jsx';
import D12_10 from './D12_10.jsx';

const HEAD = {
  uz: "Dars 12 amaliyoti — 10 topshiriq (matnli masalalar)",
  ru: 'Практика урока 12 — 10 заданий (текстовые задачи)',
  en: 'Lesson 12 practice — 10 tasks (word problems)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: "Yo'l", ru: 'Движение', en: 'Motion' }, C: D12_01 },           // yo'l masalasi 🟢 speed_equation
  { id: '02', label: { uz: 'Tezlik', ru: 'Скорость', en: 'Speed' }, C: D12_02 },           // tezlikni topish 🟢 find_speed
  { id: '03', label: { uz: 'Sarfladi', ru: 'Потратила', en: 'Spent' }, C: D12_03 },        // sarflandi va qoldi 🟡 build_spent
  { id: '04', label: { uz: 'Uch barobar', ru: 'В три раза', en: 'Three times' }, C: D12_04 }, // uch barobar ko'p 🟡 three_times_more
  { id: '05', label: { uz: 'Kamaydi', ru: 'Уменьшили', en: 'Reduced' }, C: D12_05 },       // kamaytirildi 🟡 reduced_by
  { id: '06', label: { uz: 'Lenta', ru: 'Лента', en: 'Ribbon' }, C: D12_06 },              // lentani bo'lish 🟡 ribbon_parts
  { id: '07', label: { uz: "Ikki bo'lak", ru: "Два участка", en: "Two legs" }, C: D12_07 }, // yo'lning ikki bo'lagi 🔴 two_leg_trip
  { id: '08', label: { uz: 'Yoshlar', ru: 'Возраст', en: 'Ages' }, C: D12_08 },            // ota va o'g'il 🔴 father_and_son
  { id: '09', label: { uz: 'Xarid', ru: 'Покупка', en: 'Purchase' }, C: D12_09 },          // daftar va ruchka 🔴 build_notebooks
  { id: '10', label: { uz: 'Uch javob', ru: 'Три ответа', en: 'Three' }, C: D12_10 },      // uch tenglama, uch javob 🔴 word_answer_zones
];

export default function Dars12Practice({ lang = 'uz' }) {
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
