// Dars06 amaliyoti — 10 topshiriq. Mavzu: O'XSHASH HADLAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D06_01 from './D06_01.jsx';
import D06_02 from './D06_02.jsx';
import D06_03 from './D06_03.jsx';
import D06_04 from './D06_04.jsx';
import D06_05 from './D06_05.jsx';
import D06_06 from './D06_06.jsx';
import D06_07 from './D06_07.jsx';
import D06_08 from './D06_08.jsx';
import D06_09 from './D06_09.jsx';
import D06_10 from './D06_10.jsx';

const HEAD = {
  uz: "Dars 6 amaliyoti — 10 topshiriq (o'xshash hadlar)",
  ru: 'Практика урока 6 — 10 заданий (подобные слагаемые)',
  en: 'Lesson 6 practice — 10 tasks (like terms)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: "O'xshash", ru: 'Подобные', en: 'Alike' }, C: D06_01 },      // o'xshash hadlarni topish 🟢 find_like_terms
  { id: '02', label: { uz: 'Koeffitsiyent', ru: 'Коэффициент', en: 'Coefficient' }, C: D06_02 }, // koeffitsiyentlar bilan 🟢 collect_coef
  { id: '03', label: { uz: 'Ikki guruh', ru: 'Две группы', en: 'Two groups' }, C: D06_03 },     // harflilar va sonlar 🟡 two_groups
  { id: '04', label: { uz: 'Bir xil', ru: 'То же', en: 'Same' }, C: D06_04 },            // 5y ga teng yozuvlar 🟡 same_as_5y
  { id: '05', label: { uz: 'Tuzatish', ru: 'Ошибка', en: 'Fix' }, C: D06_05 },           // sonni koeffitsiyentga qo'shgan 🟡 fix_mixed_group
  { id: '06', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D06_06 },         // avval soddalashtirish 🟡 simplify_then_value
  { id: '07', label: { uz: 'Qavs', ru: 'Скобка', en: 'Bracket' }, C: D06_07 },           // qavsdan keyin yig'ish 🔴 bracket_then_collect
  { id: '08', label: { uz: 'Qolganlar', ru: 'Не выйдет', en: 'Cannot' }, C: D06_08 },    // soddalashmaydiganlar 🔴 cannot_simplify
  { id: '09', label: { uz: 'Guruh', ru: 'Группа', en: 'Group' }, C: D06_09 },            // uch guruhli yozuv 🔴 pick_one_group
  { id: '10', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D06_10 },       // nechta had qoladi 🔴 terms_left
];

export default function Dars06Practice({ lang = 'uz' }) {
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
