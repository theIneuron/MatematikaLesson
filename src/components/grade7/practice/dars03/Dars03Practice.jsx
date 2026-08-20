// Dars03 amaliyoti — 10 topshiriq. Mavzu: ARIFMETIK AMALLARNING XOSSALARI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da.
// Til platformadan keladi (LessonPage `lang` propi: uz|ru|en).
//
// Mexanikalar tartibi 2-darsdagidan boshqacha: yonma-yon ikki bir xil
// mexanika bo'lmasin va o'quvchi tartibga o'rganib qolmasin.
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10).
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D03_01 from './D03_01.jsx';
import D03_02 from './D03_02.jsx';
import D03_03 from './D03_03.jsx';
import D03_04 from './D03_04.jsx';
import D03_05 from './D03_05.jsx';
import D03_06 from './D03_06.jsx';
import D03_07 from './D03_07.jsx';
import D03_08 from './D03_08.jsx';
import D03_09 from './D03_09.jsx';
import D03_10 from './D03_10.jsx';

const HEAD = {
  uz: "Dars 3 amaliyoti — 10 topshiriq (amallarning xossalari)",
  ru: 'Практика урока 3 — 10 заданий (свойства действий)',
  en: 'Lesson 3 practice — 10 tasks (properties of operations)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D03_01 },        // qulay tartibda hisoblash 🟢 regroup_value
  { id: '02', label: { uz: 'Qulay', ru: 'Удобно', en: 'Handy' }, C: D03_02 },           // qaysi amal qulay 🟢 pick_handy_step
  { id: '03', label: { uz: 'Juftlik', ru: 'Пара', en: 'Pair' }, C: D03_03 },            // yumaloq juftlik 🟡 pair_to_hundred
  { id: '04', label: { uz: "Bo'lib", ru: 'По частям', en: 'In parts' }, C: D03_04 },    // bo'lib ko'paytirish 🟡 distribute_split
  { id: '05', label: { uz: 'Tuzatish', ru: 'Ошибка', en: 'Fix' }, C: D03_05 },          // yarim yo'lda qolgan taqsimot 🟡 fix_distribute
  { id: '06', label: { uz: 'Bir xil', ru: 'То же', en: 'Same' }, C: D03_06 },           // 12 · (7 + 3) ga teng 🟡 same_as_distributed
  { id: '07', label: { uz: 'Yumaloq', ru: 'Круглое', en: 'Round' }, C: D03_07 },        // yaqin yumaloq son 🔴 round_neighbour
  { id: '08', label: { uz: "Yig'ish", ru: 'Сборка', en: 'Build' }, C: D03_08 },         // uch ko'paytiruvchi 🔴 build_round_product
  { id: '09', label: { uz: 'Almashtirish', ru: 'Перестановка', en: 'Swap' }, C: D03_09 }, // qayerda ishlaydi 🔴 swap_works
  { id: '10', label: { uz: 'Xossa', ru: 'Свойство', en: 'Property' }, C: D03_10 },      // qaysi xossa ishlatilgan 🔴 name_property
];

export default function Dars03Practice({ lang = 'uz' }) {
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
      {/* MOBIL_DESKTOP_MOSLASH.md naqshi: fixed root — body-skroll yo'q, tugma joyida. */}
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
