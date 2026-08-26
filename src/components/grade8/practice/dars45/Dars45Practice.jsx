// Dars45 amaliyoti — 10 topshiriq. Mavzu: PIFAGOR TEOREMASIGA TESKARI
// TEOREMA. Б7 blokining ikkinchi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §7,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 45-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 how_to_check         06 C TrueFalse  🟡 converse_claims
//   02 F MarkAll    🟢 impossible_marked    07 G CodeLock   🟡 code_checks
//   03 E TypeValue  🟢 right_angle_side     08 D PairSlots  🔴 verdict_pairs
//   04 J MatchPairs 🟡 triple_to_side       09 B Zones      🔴 right_or_not
//   05 I SwapOrder  🟡 check_steps          10 H ClozeBank  🔴 rule_words
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars45.jsx`): T1 — katet gipotenuzadan kichik (02);
// T2 — tenglik bajarilsa uchburchak to'g'ri burchakli va to'g'ri burchak eng
// katta tomonga qarama-qarshi (01, 03, 04, 06, 08, 09, 10); T3 — tekshirishdan
// oldin eng katta tomon aniqlanadi (01, 04, 05, 07).
// Adashishlar: З94 — 01, 04, 05, 10; З95 — 03, 06, 10; З91 va З92 — 07 ning
// banki; З16 — 08 va 09 butunlay hisobga tayanadi.
//
// 06-TOPSHIRIQDA JAVOB «HA, HA» (skelet §0a.1): ikkinchi da'vo birinchisining
// DAVOMI — teorema burchakning JOYINI ham aytadi, va o'quvchi buni «ortiqcha
// da'vo» deb rad etadi.
//
// UCHLIKLAR ATAYLAB `a, b, c` TARTIBIDA YOZILMAYDI: 04-topshiriqda eng katta
// tomon O'RTADA va ILDIZ bilan yozilgan (darslikning 99-betdagi masalasi).
// 08 va 09 da esa chegara holatlari bor — farq bittada (65 va 64, 145 va 144).
//
// 01 ning variantlari va 10 ning kartalari SO'Z BILAN (`Choice` va
// `ClozeBank` `L()` oladi), 04 ning bitta javobi ham (`targets[].label`).
// Qolgan mexanikalarning kartalari tarjima qilinmaydi (skelet §0a.4).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D45_01 from './D45_01.jsx';
import D45_02 from './D45_02.jsx';
import D45_03 from './D45_03.jsx';
import D45_04 from './D45_04.jsx';
import D45_05 from './D45_05.jsx';
import D45_06 from './D45_06.jsx';
import D45_07 from './D45_07.jsx';
import D45_08 from './D45_08.jsx';
import D45_09 from './D45_09.jsx';
import D45_10 from './D45_10.jsx';

const HEAD = {
  uz: 'Dars 45 amaliyoti — 10 topshiriq (teskari teorema)',
  ru: 'Практика урока 45 — 10 заданий (обратная теорема)',
  en: 'Lesson 45 practice — 10 tasks (the converse theorem)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D45_01 },
  { id: '02', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D45_02 },
  { id: '03', label: { uz: 'Tomon', ru: 'Сторона', en: 'Side' }, C: D45_03 },
  { id: '04', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D45_04 },
  { id: '05', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D45_05 },
  { id: '06', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D45_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D45_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D45_08 },
  { id: '09', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D45_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D45_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars45Practice({ lang = 'uz' }) {
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
