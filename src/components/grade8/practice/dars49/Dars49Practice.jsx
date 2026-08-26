// Dars49 amaliyoti — 10 topshiriq. Mavzu: AYLANA VATARI VA DIAMETRINING
// XOSSALARI. Б7 blokining oltinchi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §11,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 49-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 perp_diameter_marked 06 B Zones      🟡 possible_chord
//   02 C TrueFalse  🟢 chord_claims         07 E TypeValue  🟡 distance_to_chord
//   03 A Choice     🟢 when_bisects         08 D PairSlots  🔴 chord_pairs
//   04 H ClozeBank  🟡 rule_words           09 J MatchPairs 🔴 same_radius
//   05 G CodeLock   🟡 code_chords          10 I SwapOrder  🔴 bisect_proof
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars49.jsx`): T1 — vatarga perpendikulyar diametr uni
// va yoyni teng ikkiga bo'ladi (01, 02, 03, 04, 10); T2 — vatar diametridan
// katta bo'lmaydi (04, 06); T3 — R² = d² + (vatar : 2)² (02, 05, 07, 08, 09).
// Adashishlar: З104 — 02, 04, 05, 07, 08; З105 — 01, 02, 03;
// З16 — 05, 07, 08, 09 butunlay hisobga tayanadi.
//
// 02-TOPSHIRIQDA JAVOB «HA, YO'Q» (skelet §0a.1).
//
// 01-TOPSHIRIQDA CHIZMA: olti aylana, har birida vatar va uni kesib o'tuvchi
// diametr (`fig.jsx` -> `circ`). Perpendikulyarlik kvadratchasi QO'YILMAYDI —
// u aynan so'ralayotgan narsa (skelet §2).
//
// UCHLIKLAR 44-DARSDAN KELADI: 8-15-17 (08), 7-24-25 (07), 5-12-13 (02, 09),
// 3-4-5 (09), 9-12-15 (08). Aylana bo'limi Pifagor bo'limining davomi.
//
// 03 ning variantlari va 04 ning kartalari SO'Z BILAN (`Choice` va
// `ClozeBank` `L()` oladi). Qolgan mexanikalarning kartalari tarjima
// qilinmaydi (skelet §0a.4).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D49_01 from './D49_01.jsx';
import D49_02 from './D49_02.jsx';
import D49_03 from './D49_03.jsx';
import D49_04 from './D49_04.jsx';
import D49_05 from './D49_05.jsx';
import D49_06 from './D49_06.jsx';
import D49_07 from './D49_07.jsx';
import D49_08 from './D49_08.jsx';
import D49_09 from './D49_09.jsx';
import D49_10 from './D49_10.jsx';

const HEAD = {
  uz: 'Dars 49 amaliyoti — 10 topshiriq (vatar va diametr)',
  ru: 'Практика урока 49 — 10 заданий (хорда и диаметр)',
  en: 'Lesson 49 practice — 10 tasks (the chord and the diameter)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Figuralar', ru: 'Фигуры', en: 'Figures' }, C: D49_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D49_02 },
  { id: '03', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D49_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D49_04 },
  { id: '05', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D49_05 },
  { id: '06', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D49_06 },
  { id: '07', label: { uz: 'Masofa', ru: 'Расстояние', en: 'Distance' }, C: D49_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D49_08 },
  { id: '09', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D49_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D49_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars49Practice({ lang = 'uz' }) {
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
