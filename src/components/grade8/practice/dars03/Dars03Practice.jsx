// Dars03 amaliyoti — 10 topshiriq. Mavzu: RATSIONAL KASRLARNI QISQARTIRISH.
//
// METODIST QARORI 2026-08-24: 2-6 darslar 1-DARSNING o'nta mexanikasida
// quriladi, har darsda BOSHQA ketma-ketlikda. Skelet va jadval:
// `src/books/grade8/DARS02_06_AMALIYOT_SKELET.md` §2 va §5.
//
// Ikki o'q alohida: QIYINLIK har doim 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴, MEXANIKA esa
// har darsda boshqa pozitsiyada. Qiyinlikni misol beradi, mexanika emas.
//
// 3-dars taqsimoti (mexanika · qiyinlik):
//   01 MarkAll   🟢   05 Zones      🟡   09 CodeLock   🔴
//   02 TrueFalse 🟢   06 SwapOrder  🟡   10 ClozeBank  🔴
//   03 TypeValue 🟢   07 Choice     🟡
//   04 MatchPairs 🟡  08 PairSlots  🔴
//
// Darsning uch tasdig'i qoplangan:
//   T1 faqat umumiy KO'PAYTUVCHI bo'yicha  — 01, 02, 04, 05, 08, 10
//   T2 taqiqni DASTLABKI kasr belgilaydi   — 03, 06, 07, 09, 10
//   T3 son qo'yish rad etadi                — 02, 03, 07, 08 (razborlarda)
// Adashishlar: З1 (had qisqartirildi) — 01, 02, 04, 05; З2 (taqiq yo'qoldi) —
// 03, 06, 07, 09, 10; З15 (ko'paytuvchi topilmadi) — 01, 04, 06, 08;
// З16 (son bilan tekshirilmadi) — razborlarning yarmi son qo'yishga yuboradi.
//
// Harflar: f (01) b (02) d (03) c (04) q (05) e (06) h (07) r (08) g (09) —
// bir topshiriq boshqasining yozuvini takrorlamaydi (TIPLAR §7.6).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
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
  uz: 'Dars 3 amaliyoti — 10 topshiriq (kasrlarni qisqartirish)',
  ru: 'Практика урока 3 — 10 заданий (сокращение дробей)',
  en: 'Lesson 3 practice — 10 tasks (cancelling fractions)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D03_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D03_02 },
  { id: '03', label: { uz: 'Teshik', ru: 'Дырка', en: 'The hole' }, C: D03_03 },
  { id: '04', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D03_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D03_05 },
  { id: '06', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D03_06 },
  { id: '07', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D03_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D03_08 },
  { id: '09', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D03_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D03_10 },
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
          <button key={item.id} type="button" data-q={item.id} style={chip(i === idx)} onClick={() => setIdx(i)}>
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
