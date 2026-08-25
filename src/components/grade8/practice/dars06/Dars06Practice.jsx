// Dars06 amaliyoti — 10 topshiriq. Mavzu: IFODALARNI ALMASHTIRISH.
//
// METODIST QARORI 2026-08-24: 2-6 darslar 1-DARSNING o'nta mexanikasida
// quriladi, har darsda BOSHQA ketma-ketlikda. Skelet va jadval:
// `src/books/grade8/DARS02_06_AMALIYOT_SKELET.md` §2 va §8.
//
// Ikki o'q alohida: QIYINLIK har doim 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴, MEXANIKA esa
// har darsda boshqa pozitsiyada. Qiyinlikni misol beradi, mexanika emas.
//
// 6-dars taqsimoti (mexanika · qiyinlik):
//   01 MarkAll   🟢   05 ClozeBank  🟡   09 SwapOrder 🔴
//   02 Choice    🟢   06 Zones      🟡   10 TypeValue 🔴
//   03 TrueFalse 🟢   07 MatchPairs 🟡
//   04 PairSlots 🟡   08 CodeLock   🔴
//
// Darsning tasdiqlari: qavs amallar tartibini o'zgartiradi (01, 02, 03, 07);
// tartib uch pog'onali — qavs, ko'paytirish va bo'lish, qo'shish va ayirish
// (05, 09); shart ORALIQ satrlardan ham yig'iladi va javobda ko'rinmasligi
// mumkin (04, 05, 08, 10).
// Adashishlar: chapdan o'ngga hisoblash — 01, 02, 03, 09; З2 (shart javobdan
// yig'ildi) — 04, 05, 08; harflarni qisqartirish — 06.
//
// Harflar: m (01) c (02) n (03) d (04) b (06) f (07) p (08) k (09) u (10) —
// bir topshiriq boshqasining yozuvini takrorlamaydi (TIPLAR §7.6).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
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
  uz: "Dars 6 amaliyoti — 10 topshiriq (ifodalarni almashtirish)",
  ru: 'Практика урока 6 — 10 заданий (преобразование выражений)',
  en: 'Lesson 6 practice — 10 tasks (transforming expressions)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D06_01 },
  { id: '02', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D06_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D06_03 },
  { id: '04', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D06_04 },
  { id: '05', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D06_05 },
  { id: '06', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D06_06 },
  { id: '07', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D06_07 },
  { id: '08', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D06_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D06_09 },
  { id: '10', label: { uz: 'Javob', ru: 'Ответ', en: 'Answer' }, C: D06_10 },
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
