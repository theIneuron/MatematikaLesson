// Dars35 amaliyoti — 10 topshiriq. Mavzu: O'RTACHA QIYMAT, MODA, MEDIANA.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §7, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 35-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 average_claims       06 H ClozeBank  🟡 rule_words
//   02 E TypeValue  🟢 mean_value           07 I SwapOrder  🟡 median_steps
//   03 A Choice     🟢 which_mode           08 B Zones      🔴 mode_or_none
//   04 F MarkAll    🟡 median_five_marked   09 G CodeLock   🔴 code_three_measures
//   05 D PairSlots  🟡 row_to_median        10 J MatchPairs 🔴 median_odd_even
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars35.jsx`): o'rtacha — yig'indi soniga bo'linadi
// (01, 02, 06, 09); moda — eng ko'p uchraydigan qiymat va u o'rtachaga
// teng bo'lmasligi mumkin (01, 03, 06, 08, 09); mediana toq qatorda
// o'rtadagi son, juft qatorda ikkitasining o'rtachasi (04, 05, 07, 09, 10).
// Adashishlar: З71 — 01, 02, 03, 06, 09; З72 — 04, 05, 07, 10;
// З16 — razborlar yig'indini va sanoqni qayta hisoblaydi.
//
// 01-TOPSHIRIQDA IKKALA JAVOB HAM «HA» (skelet §0a.3), va aynan shu З71 ni
// sindiradi: bitta qatorda moda to'rtga, o'rtacha esa beshga teng — ikki
// javob ham to'g'ri, lekin ular teng emas.
//
// 09-TOPSHIRIQ UCH O'LCHOVNI BIR QATORDA AJRATADI: 2, 2, 3, 5, 8 uchun
// moda ikki, mediana uch, o'rtacha to'rt. Bu З71 ning to'g'ridan-to'g'ri
// raddiyasi, va kod aynan shu uch sondan yig'iladi.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D35_01 from './D35_01.jsx';
import D35_02 from './D35_02.jsx';
import D35_03 from './D35_03.jsx';
import D35_04 from './D35_04.jsx';
import D35_05 from './D35_05.jsx';
import D35_06 from './D35_06.jsx';
import D35_07 from './D35_07.jsx';
import D35_08 from './D35_08.jsx';
import D35_09 from './D35_09.jsx';
import D35_10 from './D35_10.jsx';

const HEAD = {
  uz: "Dars 35 amaliyoti — 10 topshiriq (o'rtacha, moda, mediana)",
  ru: 'Практика урока 35 — 10 заданий (среднее, мода, медиана)',
  en: 'Lesson 35 practice — 10 tasks (mean, mode, median)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D35_01 },
  { id: '02', label: { uz: "O'rtacha", ru: 'Среднее', en: 'Mean' }, C: D35_02 },
  { id: '03', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D35_03 },
  { id: '04', label: { uz: 'Belgilash', ru: 'Отметь', en: 'Mark' }, C: D35_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D35_05 },
  { id: '06', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D35_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D35_07 },
  { id: '08', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D35_08 },
  { id: '09', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D35_09 },
  { id: '10', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D35_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars35Practice({ lang = 'uz' }) {
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
