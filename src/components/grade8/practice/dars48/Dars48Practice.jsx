// Dars48 amaliyoti — 10 topshiriq. Mavzu: AYLANA, MARKAZIY BURCHAK.
// Б7 blokining beshinchi amaliyoti, aylana qismining boshi.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §10,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 48-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 arc_claims           06 F MarkAll    🟡 diameter_marked
//   02 E TypeValue  🟢 major_arc            07 H ClozeBank  🟡 rule_words
//   03 B Zones      🟢 equal_or_subtract    08 I SwapOrder  🔴 arc_steps
//   04 G CodeLock   🟡 code_arcs            09 D PairSlots  🔴 arc_pairs
//   05 J MatchPairs 🟡 angle_to_major       10 A Choice     🔴 why_subtract
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars48.jsx`): T1 — markazdan o'tuvchi vatar diametr
// (06, 07); T2 — yoyning gradus o'lchovi (01, 02, 03, 04, 05, 07, 08, 09, 10);
// T3 — ikki yoyning yig'indisi 360° (01, 04, 08).
// Adashishlar: З102 — 06, 07; З103 — 02, 03, 05, 08, 09, 10;
// З16 — razborlar javobni «ikki yoyni qo'shib 360» bilan tekshiradi.
//
// 01-TOPSHIRIQDA JAVOB «HA, HA» (skelet §0a.1): ikki da'vo bir xil AB yozuvi
// haqida, lekin ular IKKI boshqa yoyni bildiradi.
//
// 06-TOPSHIRIQDA BIRINCHI AYLANALI CHIZMA. `fig.jsx` ga `circ` turi metodist
// ruxsati bilan qo'shildi (skelet §0a.2): vatarning markazdan o'tishini yozuv
// bilan berish (`O ∈ AB`) ta'rifni yodlatadi, chizma esa ko'rsatadi. Chizmada
// faqat markaz nuqtasi bor, boshqa belgi yo'q.
//
// CHEGARA HOLATI IKKI JOYDA: 03 da `180°` (ikki qoida bir xil javob beradi)
// va 05 da `180° ↔ 180°`. Bu D37_04 dagi `90°` naqshining davomi: chegara
// istisno emas, o'sha qoidaning natijasi.
//
// 07 ning kartalari va 10 ning variantlari SO'Z BILAN (`ClozeBank` va
// `Choice` `L()` oladi). Qolgan mexanikalarning kartalari tarjima qilinmaydi
// (skelet §0a.4); `⌒`, `∠`, `°` belgilari uch tilda bir xil o'qiladi.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D48_01 from './D48_01.jsx';
import D48_02 from './D48_02.jsx';
import D48_03 from './D48_03.jsx';
import D48_04 from './D48_04.jsx';
import D48_05 from './D48_05.jsx';
import D48_06 from './D48_06.jsx';
import D48_07 from './D48_07.jsx';
import D48_08 from './D48_08.jsx';
import D48_09 from './D48_09.jsx';
import D48_10 from './D48_10.jsx';

const HEAD = {
  uz: 'Dars 48 amaliyoti — 10 topshiriq (aylana, markaziy burchak)',
  ru: 'Практика урока 48 — 10 заданий (окружность, центральный угол)',
  en: 'Lesson 48 practice — 10 tasks (the circle, the central angle)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D48_01 },
  { id: '02', label: { uz: 'Yoy', ru: 'Дуга', en: 'Arc' }, C: D48_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D48_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D48_04 },
  { id: '05', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D48_05 },
  { id: '06', label: { uz: 'Figuralar', ru: 'Фигуры', en: 'Figures' }, C: D48_06 },
  { id: '07', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D48_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D48_08 },
  { id: '09', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D48_09 },
  { id: '10', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D48_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars48Practice({ lang = 'uz' }) {
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
