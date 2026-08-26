// Dars44 amaliyoti — 10 topshiriq. Mavzu: PIFAGOR TEOREMASI VA UNING ISBOTI.
// Б7 blokining birinchi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §6,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 44-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 pythagoras_claims    06 H ClozeBank  🟡 rule_words
//   02 B Zones      🟢 equality_holds       07 E TypeValue  🟡 rhombus_side
//   03 A Choice     🟢 which_is_hypotenuse  08 J MatchPairs 🔴 mixed_sides
//   04 G CodeLock   🟡 code_hypotenuse      09 I SwapOrder  🔴 proof_steps
//   05 D PairSlots  🟡 sides_back           10 F MarkAll    🔴 true_equalities
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars44.jsx`): T1 — gipotenuza to'g'ri burchakka
// qarama-qarshi va eng katta tomon (03, 06, 08, 10); T2 — c² = a² + b²
// (01, 02, 04, 05, 06, 07, 08, 10); T3 — isbot: to'rt uchburchak bitta
// kvadrat ichida ikki xil joylashtiriladi (09).
// Adashishlar: З91 — 01, 02, 04, 06, 07, 10; З92 — 05, 10; З93 — 03, 08, 10;
// З16 — razborlar kvadratlarni son bilan qo'shib tekshiradi.
//
// 01-TOPSHIRIQDA JAVOB «HA, YO'Q» (skelet §0a.1).
//
// BU DARSDA FAQAT TENGLIK TEKSHIRILADI, XULOSA CHIQARILMAYDI: «tenglik
// bajarildi, demak uchburchak to'g'ri burchakli» degan yo'nalish TESKARI
// teorema va u 45-dars. Shuning uchun 02-topshiriqning zonalari
// «a² + b² = c²» va «a² + b² ≠ c²» deb yozilgan (skelet §6).
//
// CHIZMA YO'Q, VA BU ATAYLAB (skelet §2): Pifagor bloki yozuv va hisob
// haqida. 09-topshiriq isbotning chizmasini takrorlamaydi — u nazariy darsda
// `SquareSwap` pribori bilan ko'rsatilgan, amaliyot faqat TARTIBNI tekshiradi.
//
// 03 ning variantlari va 06 ning kartalari SO'Z BILAN (`Choice` va
// `ClozeBank` `L()` oladi). Qolgan mexanikalarning kartalari tarjima
// qilinmaydi (skelet §0a.4). 10-topshiriqda ildiz `frac.jsx` ning
// `{ r: ... }` tokeni bilan chiziladi (skelet §0a.5).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D44_01 from './D44_01.jsx';
import D44_02 from './D44_02.jsx';
import D44_03 from './D44_03.jsx';
import D44_04 from './D44_04.jsx';
import D44_05 from './D44_05.jsx';
import D44_06 from './D44_06.jsx';
import D44_07 from './D44_07.jsx';
import D44_08 from './D44_08.jsx';
import D44_09 from './D44_09.jsx';
import D44_10 from './D44_10.jsx';

const HEAD = {
  uz: 'Dars 44 amaliyoti — 10 topshiriq (Pifagor teoremasi)',
  ru: 'Практика урока 44 — 10 заданий (теорема Пифагора)',
  en: 'Lesson 44 practice — 10 tasks (the Pythagorean theorem)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D44_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D44_02 },
  { id: '03', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D44_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D44_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D44_05 },
  { id: '06', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D44_06 },
  { id: '07', label: { uz: 'Tomon', ru: 'Сторона', en: 'Side' }, C: D44_07 },
  { id: '08', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D44_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D44_09 },
  { id: '10', label: { uz: 'Tenglik', ru: 'Равенство', en: 'Equality' }, C: D44_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars44Practice({ lang = 'uz' }) {
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
