// Dars04 amaliyoti — 10 topshiriq. Mavzu: KASRLARNI QO'SHISH VA AYIRISH.
//
// METODIST QARORI 2026-08-24: 2-6 darslar 1-DARSNING o'nta mexanikasida
// quriladi, har darsda BOSHQA ketma-ketlikda. Skelet va jadval:
// `src/books/grade8/DARS02_06_AMALIYOT_SKELET.md` §2 va §6.
//
// Ikki o'q alohida: QIYINLIK har doim 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴, MEXANIKA esa
// har darsda boshqa pozitsiyada. Qiyinlikni misol beradi, mexanika emas.
//
// 4-dars taqsimoti (mexanika · qiyinlik):
//   01 Choice    🟢   05 CodeLock   🟡   09 MatchPairs 🔴
//   02 MarkAll   🟢   06 TypeValue  🟡   10 PairSlots  🔴
//   03 TrueFalse 🟢   07 Zones      🟡
//   04 ClozeBank 🟡   08 SwapOrder  🔴
//
// Darsning tasdiqlari: bir xil maxrajda suratlar qo'shiladi (01, 02, 04, 07);
// boshqa maxrajda umumiy maxrajga keltiriladi (04, 08, 09, 10); shart esa
// HAR BIR dastlabki maxrajdan yig'iladi (03, 04, 05, 06, 08).
// Adashishlar: З24 (maxrajlar ham qo'shildi) — 01, 02, 04, 07; З25 (ayirishda
// qavs yo'q) — 02; З15 (keltirmasdan qo'shildi) — 07, 08; З2 (shart bitta
// maxrajdan yoki javobdan) — 03, 04, 05, 06, 08;
// З16 — razborlarning yarmi son qo'yishga yuboradi.
//
// Harflar: b (01) c (02) d (03) w (05) u (06) k (07) g (08) t (09) f (10) —
// bir topshiriq boshqasining yozuvini takrorlamaydi (TIPLAR §7.6).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D04_01 from './D04_01.jsx';
import D04_02 from './D04_02.jsx';
import D04_03 from './D04_03.jsx';
import D04_04 from './D04_04.jsx';
import D04_05 from './D04_05.jsx';
import D04_06 from './D04_06.jsx';
import D04_07 from './D04_07.jsx';
import D04_08 from './D04_08.jsx';
import D04_09 from './D04_09.jsx';
import D04_10 from './D04_10.jsx';

const HEAD = {
  uz: "Dars 4 amaliyoti — 10 topshiriq (kasrlarni qo'shish va ayirish)",
  ru: 'Практика урока 4 — 10 заданий (сложение и вычитание дробей)',
  en: 'Lesson 4 practice — 10 tasks (adding and subtracting fractions)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D04_01 },
  { id: '02', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D04_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D04_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D04_04 },
  { id: '05', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D04_05 },
  { id: '06', label: { uz: 'Teshik', ru: 'Дырка', en: 'The hole' }, C: D04_06 },
  { id: '07', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D04_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D04_08 },
  { id: '09', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D04_09 },
  { id: '10', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D04_10 },
];

export default function Dars04Practice({ lang = 'uz' }) {
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
