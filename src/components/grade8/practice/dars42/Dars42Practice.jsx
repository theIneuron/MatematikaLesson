// Dars42 amaliyoti — 10 topshiriq. Mavzu: TRAPETSIYANING YUZI.
// Б6 blokining oltinchi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §4,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 42-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 which_formula        06 C TrueFalse  🟡 midline_claims
//   02 E TypeValue  🟢 area_from_bases      07 F MarkAll    🟡 height_marked
//   03 B Zones      🟢 same_area_groups     08 D PairSlots  🔴 trap_back
//   04 J MatchPairs 🟡 find_missing         09 H ClozeBank  🔴 rule_words
//   05 G CodeLock   🟡 code_areas           10 I SwapOrder  🔴 diagonal_steps
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars42.jsx`): T1 — S = (a+b)/2 · h (01, 02, 03, 04,
// 08, 09, 10); T2 — S = m·h, o'rta chiziq bilan (05, 06, 08); T3 — balandlik
// yon tomon EMAS (01, 07, 09, 10).
// Adashishlar: З87 — 01, 02, 05, 09; З88 — 01, 07, 09, 10;
// З16 — razborlar javobni son bilan tekshiradi.
//
// 06-TOPSHIRIQDA JAVOB «HA, HA» (skelet §0a.1): ikkala da'vo ham rost, va
// yuk razborga o'tadi — o'quvchi bittasini yolg'on deb kutadi.
//
// 07-TOPSHIRIQDA CHIZMA: sakkiz trapetsiya, har birida bitta kesma
// (`fig.jsx` -> `poly`, `segs`). Kesmaning uslubi hamma joyda bir xil:
// punktir qo'yilsa, u «alohida» bo'lib ko'rinardi va javobni ochib qo'yardi.
// «Balandlik tashqarida» holati IKKITA — biri chapga, biri o'ngga qiya
// trapetsiyada, skelet talab qilgandek. Figuralar sakkizta, rad etilganlar
// to'rt xil (oxirgisi yon tomonga perpendikulyar kesma), belgilanadigan
// figura to'rtta.
//
// 01-TOPSHIRIQNING VARIANTLARI SO'Z BILAN, 09 ning kartalari ham
// (`Choice` va `ClozeBank` `L()` oladi). Qolgan mexanikalarning kartalari
// tarjima qilinmaydi (skelet §0a.4).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D42_01 from './D42_01.jsx';
import D42_02 from './D42_02.jsx';
import D42_03 from './D42_03.jsx';
import D42_04 from './D42_04.jsx';
import D42_05 from './D42_05.jsx';
import D42_06 from './D42_06.jsx';
import D42_07 from './D42_07.jsx';
import D42_08 from './D42_08.jsx';
import D42_09 from './D42_09.jsx';
import D42_10 from './D42_10.jsx';

const HEAD = {
  uz: 'Dars 42 amaliyoti — 10 topshiriq (trapetsiyaning yuzi)',
  ru: 'Практика урока 42 — 10 заданий (площадь трапеции)',
  en: 'Lesson 42 practice — 10 tasks (the area of the trapezoid)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D42_01 },
  { id: '02', label: { uz: 'Yuza', ru: 'Площадь', en: 'Area' }, C: D42_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D42_03 },
  { id: '04', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D42_04 },
  { id: '05', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D42_05 },
  { id: '06', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D42_06 },
  { id: '07', label: { uz: 'Figuralar', ru: 'Фигуры', en: 'Figures' }, C: D42_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D42_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D42_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D42_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars42Practice({ lang = 'uz' }) {
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
