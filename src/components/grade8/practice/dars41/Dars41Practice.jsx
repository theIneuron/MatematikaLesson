// Dars41 amaliyoti — 10 topshiriq. Mavzu: UCHBURCHAKNING YUZI.
// Б6 blokining beshinchi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §3,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 41-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 area_claims          06 H ClozeBank  🟡 rule_words
//   02 B Zones      🟢 same_area_groups     07 J MatchPairs 🟡 base_height_to_area
//   03 F MarkAll    🟢 equal_area_marked    08 I SwapOrder  🔴 double_steps
//   04 G CodeLock   🟡 code_areas           09 D PairSlots  🔴 area_back
//   05 A Choice     🟡 which_formula        10 E TypeValue  🔴 rect_from_triangle
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars41.jsx`): T1 — S = ½a·h (01, 02, 04, 06, 07, 09,
// 10); T2 — to'g'ri burchaklida yuza ikki katetning yarim ko'paytmasi (04, 05,
// 07); T3 — asosi va balandligi teng uchburchaklar tengdosh (01, 03, 10).
// Adashishlar: З85 — 01, 02, 04, 06, 07, 08, 09, 10; З86 — 04, 05, 06;
// З16 — razborlar javobni har joyda son bilan tekshiradi.
//
// 01-TOPSHIRIQDA JAVOB «YO'Q, HA» (skelet §0a.1).
//
// 03-TOPSHIRIQDA CHIZMA: olti uchburchak, uchtasining asosi va balandligi bir
// xil, qiyaligi boshqa (`fig.jsx` -> `poly`). Chizmada hech qanday belgi yo'q —
// balandlik chizilsa javob oldindan aytilgan bo'lardi (skelet §2).
//
// 05-TOPSHIRIQNING VARIANTLARI SO'Z BILAN: `Choice` ning `label` i massiv
// bo'lmasa `tr()` dan o'tadi. Qolgan mexanikalarning kartalari tarjima
// qilinmaydi (skelet §0a.4).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D41_01 from './D41_01.jsx';
import D41_02 from './D41_02.jsx';
import D41_03 from './D41_03.jsx';
import D41_04 from './D41_04.jsx';
import D41_05 from './D41_05.jsx';
import D41_06 from './D41_06.jsx';
import D41_07 from './D41_07.jsx';
import D41_08 from './D41_08.jsx';
import D41_09 from './D41_09.jsx';
import D41_10 from './D41_10.jsx';

const HEAD = {
  uz: 'Dars 41 amaliyoti — 10 topshiriq (uchburchakning yuzi)',
  ru: 'Практика урока 41 — 10 заданий (площадь треугольника)',
  en: 'Lesson 41 practice — 10 tasks (the area of the triangle)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D41_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D41_02 },
  { id: '03', label: { uz: 'Figuralar', ru: 'Фигуры', en: 'Figures' }, C: D41_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D41_04 },
  { id: '05', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D41_05 },
  { id: '06', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D41_06 },
  { id: '07', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D41_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D41_08 },
  { id: '09', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D41_09 },
  { id: '10', label: { uz: 'Yuza', ru: 'Площадь', en: 'Area' }, C: D41_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars41Practice({ lang = 'uz' }) {
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
