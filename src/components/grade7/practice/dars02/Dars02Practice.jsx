// Dars02 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: O'ZGARUVCHILI IFODALAR.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da. Ya'ni bitta nuqson bitta joyda
// tuzatiladi (CLAUDE.md §5).
//
// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz yo'q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D02_01 from './D02_01.jsx';
import D02_02 from './D02_02.jsx';
import D02_03 from './D02_03.jsx';
import D02_04 from './D02_04.jsx';
import D02_05 from './D02_05.jsx';
import D02_06 from './D02_06.jsx';
import D02_07 from './D02_07.jsx';
import D02_08 from './D02_08.jsx';
import D02_09 from './D02_09.jsx';
import D02_10 from './D02_10.jsx';

const HEAD = {
  uz: "Dars 2 amaliyoti — 10 topshiriq (o'zgaruvchili ifodalar)",
  ru: 'Практика урока 2 — 10 заданий (выражения с переменными)',
  en: 'Lesson 2 practice — 10 tasks (expressions with variables)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Mexanikalar tartibi: yonma-yon ikki bir xil mexanika bo'lmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
const ITEMS = [
  { id: '01', label: { uz: 'Belgi', ru: 'Знак', en: 'Sign' }, C: D02_01 },              // yashiringan ko'paytirish 🟢 invisible_sign
  { id: '02', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D02_02 },        // manfiy son qo'yish 🟢 substitute_neg
  { id: '03', label: { uz: 'Ikki harf', ru: 'Две буквы', en: 'Two letters' }, C: D02_03 }, // ikki o'zgaruvchi 🟡 two_vars
  { id: '04', label: { uz: 'Qayerda', ru: 'Где', en: 'Where' }, C: D02_04 },            // belgi qayerda yashiringan 🟡 sign_places
  { id: '05', label: { uz: 'Bir xil', ru: 'То же', en: 'Same' }, C: D02_05 },           // 12a ga teng yozuvlar 🟡 same_as_12a
  { id: '06', label: { uz: 'Tuzatish', ru: 'Ошибка', en: 'Fix' }, C: D02_06 },          // qo'yish qatorini tuzatish 🟡 fix_substitution
  { id: '07', label: { uz: 'Zanjir', ru: 'Цепочка', en: 'Chain' }, C: D02_07 },         // bir harf ikki joyda 🔴 chain_substitute
  { id: '08', label: { uz: "O'zgarmas", ru: 'Не зависит', en: 'Fixed' }, C: D02_08 },   // qiymat x ga bog'liq emas 🔴 independent_of_x
  { id: '09', label: { uz: 'Vaziyat', ru: 'Ситуация', en: 'Situation' }, C: D02_09 },   // vaziyatdan yozuvga 🔴 situation_to_expr
  { id: '10', label: { uz: 'Chegara', ru: 'Граница', en: 'Edge' }, C: D02_10 },         // qiymati yo'q holat 🔴 zones_value_x
];

export default function Dars02Practice({ lang = 'uz' }) {
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
