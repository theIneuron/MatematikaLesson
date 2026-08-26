// Dars47 amaliyoti — 10 topshiriq. Mavzu: PIFAGOR TEOREMASI BILAN MASALALAR
// YECHISH. Б7 blokining to'rtinchi amaliyoti, Pifagor qismining yakuni.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §9,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 47-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 egypt_multiples      06 G CodeLock   🟡 code_tests
//   02 E TypeValue  🟢 equilateral_h2       07 J MatchPairs 🟡 figures_to_answer
//   03 A Choice     🟢 half_base            08 H ClozeBank  🔴 rule_words
//   04 C TrueFalse  🟡 rope_claims          09 D PairSlots  🔴 rhombus_pairs
//   05 I SwapOrder  🟡 letter_steps         10 B Zones      🔴 equation_groups
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// 47-DARS YOLG'IZ QATOR (skelet §0a.3): bu MASALA YECHISH darsi, yangi tasdiq
// kiritmaydi, faqat 44-46 ni ishga soladi. Uning mexanika tartibi qolgan
// hamma darsdan kamida SAKKIZ pozitsiyada farq qiladi — bunday tartib butun
// bo'shliqda bittagina ekan (`FEACIGJHDB`).
//
// Darsning tasdiqlari (`Dars47.jsx`): T1 — 3, 4, 5 uchligi tekshirish vositasi
// (01, 04); T2 — noma'lum harf bilan belgilanadi va tenglama yechiladi (05,
// 06, 10); T3 — teng tomonlida balandlik yarim asosga qo'llashdan topiladi
// (02, 03, 07, 08).
// Adashishlar: З99 — 05, 06; З100 — 02, 03, 08; З101 — 01, 04;
// З91 — 06 ning banki; З16 — 02, 06, 09, 10 hisobga tayanadi.
//
// 04-TOPSHIRIQDA JAVOB «YO'Q, HA» (skelet §0a.1).
//
// 02 va 08 BIR MASALANING ikki qismi: 02 da balandlikning kvadrati (yetmish
// besh), 08 da esa balandlikning o'zi va yuza. 07 va 09 da bitta uchlik
// (8, 15, 17) ikki boshqa figurada chiqadi — bu ataylab.
//
// 03 ning variantlari, 08 ning kartalari va 07 ning chap ustuni SO'Z BILAN
// (`Choice`, `ClozeBank`, `MatchPairs` ning `items[].label` i `L()` oladi).
// Qolgan mexanikalarning kartalari tarjima qilinmaydi (skelet §0a.4).
// Ildizlar `frac.jsx` ning `{ r: ... }` tokeni bilan (skelet §0a.5).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D47_01 from './D47_01.jsx';
import D47_02 from './D47_02.jsx';
import D47_03 from './D47_03.jsx';
import D47_04 from './D47_04.jsx';
import D47_05 from './D47_05.jsx';
import D47_06 from './D47_06.jsx';
import D47_07 from './D47_07.jsx';
import D47_08 from './D47_08.jsx';
import D47_09 from './D47_09.jsx';
import D47_10 from './D47_10.jsx';

const HEAD = {
  uz: 'Dars 47 amaliyoti — 10 topshiriq (Pifagor bilan masalalar)',
  ru: 'Практика урока 47 — 10 заданий (задачи по теореме Пифагора)',
  en: 'Lesson 47 practice — 10 tasks (problems with the Pythagorean theorem)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D47_01 },
  { id: '02', label: { uz: 'Kvadrat', ru: 'Квадрат', en: 'Square' }, C: D47_02 },
  { id: '03', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D47_03 },
  { id: '04', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D47_04 },
  { id: '05', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D47_05 },
  { id: '06', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D47_06 },
  { id: '07', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D47_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D47_08 },
  { id: '09', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D47_09 },
  { id: '10', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D47_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars47Practice({ lang = 'uz' }) {
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
