// Dars05 amaliyoti — 10 topshiriq. Mavzu: KASRLARNI KO'PAYTIRISH VA BO'LISH.
//
// METODIST QARORI 2026-08-24: 2-6 darslar 1-DARSNING o'nta mexanikasida
// quriladi, har darsda BOSHQA ketma-ketlikda. Skelet va jadval:
// `src/books/grade8/DARS02_06_AMALIYOT_SKELET.md` §2 va §7.
//
// Ikki o'q alohida: QIYINLIK har doim 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴, MEXANIKA esa
// har darsda boshqa pozitsiyada. Qiyinlikni misol beradi, mexanika emas.
//
// 5-dars taqsimoti (mexanika · qiyinlik):
//   01 TrueFalse 🟢   05 Choice     🟡   09 TypeValue 🔴
//   02 Zones     🟢   06 MatchPairs 🟡   10 CodeLock  🔴
//   03 MarkAll   🟢   07 PairSlots  🟡
//   04 SwapOrder 🟡   08 ClozeBank  🔴
//
// Darsning tasdiqlari: ko'paytirishda surat suratga, maxraj maxrajga
// (01, 02); bo'lishda IKKINCHI kasr ag'dariladi (01, 02, 03, 04, 08);
// shart uch joydan, uchinchisi bo'luvchining SURATIDAN (05, 07, 08, 10);
// qisqargan ko'paytuvchi javobda ko'rinmaydi (09).
// Adashishlar: З26 (nolga bo'lish e'tiborsiz) — 05, 07, 08, 10;
// З2 (shart javobdan yig'ildi) — 09, 10; amal belgisiga qaramaslik — 01, 06.
//
// Harflar: e (01) g (02) n (03) k (04) h (05) m (06) f (07) s (09) v (10) —
// bir topshiriq boshqasining yozuvini takrorlamaydi (TIPLAR §7.6).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D05_01 from './D05_01.jsx';
import D05_02 from './D05_02.jsx';
import D05_03 from './D05_03.jsx';
import D05_04 from './D05_04.jsx';
import D05_05 from './D05_05.jsx';
import D05_06 from './D05_06.jsx';
import D05_07 from './D05_07.jsx';
import D05_08 from './D05_08.jsx';
import D05_09 from './D05_09.jsx';
import D05_10 from './D05_10.jsx';

const HEAD = {
  uz: "Dars 5 amaliyoti — 10 topshiriq (kasrlarni ko'paytirish va bo'lish)",
  ru: 'Практика урока 5 — 10 заданий (умножение и деление дробей)',
  en: 'Lesson 5 practice — 10 tasks (multiplying and dividing fractions)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D05_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D05_02 },
  { id: '03', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D05_03 },
  { id: '04', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D05_04 },
  { id: '05', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D05_05 },
  { id: '06', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D05_06 },
  { id: '07', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D05_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D05_08 },
  { id: '09', label: { uz: 'Teshik', ru: 'Дырка', en: 'The hole' }, C: D05_09 },
  { id: '10', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D05_10 },
];

export default function Dars05Practice({ lang = 'uz' }) {
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
