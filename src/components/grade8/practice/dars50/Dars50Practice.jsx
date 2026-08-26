// Dars50 amaliyoti — 10 topshiriq. Mavzu: TO'G'RI CHIZIQ VA AYLANA, URINMA.
// Б7 blokining yettinchi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §12,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 50-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 what_is_tangent      06 H ClozeBank  🟡 rule_words
//   02 F MarkAll    🟢 tangent_marked       07 J MatchPairs 🟡 cases_to_result
//   03 C TrueFalse  🟢 tangent_claims       08 E TypeValue  🔴 units_case
//   04 I SwapOrder  🟡 tangent_proof        09 G CodeLock   🔴 code_chords
//   05 B Zones      🟡 secant_or_not        10 D PairSlots  🔴 three_cases
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars50.jsx`): T1 — uch holat (d > R, d = R, d < R) va
// AB = 2√(R² − d²) (02, 03, 05, 07, 08, 09, 10); T2 — urinma radiusga
// perpendikulyar (01, 04, 06); T3 — tashqi nuqtadan ikki urinma teng
// (04 ning razborida).
// Adashishlar: З106 — 08 (darslikning 424-mashqi); З107 — 03, 05, 06, 10;
// З16 — 08, 09, 10 hisob bilan tekshiriladi.
//
// 03-TOPSHIRIQDA JAVOB «YO'Q, YO'Q» (skelet §0a.1): ikkala da'vo ham yolg'on
// va ular BITTA chegarani (d = R) ikki yoqdan buzadi — «ikki nuqta» va
// «nuqta yo'q». To'g'ri javob ikkisining orasida.
//
// BIRLIKLAR SETUP MATNIDA, KARTADA EMAS (skelet §0a.4): birlik nomlari uch
// tilda boshqacha yoziladi, shuning uchun З106 ni tekshiradigan topshiriq
// `TypeValue` da turadi — javob son, savol esa tarjima qilinadigan matnda.
//
// CHIZMA YO'Q: aylananing chizmasi 48 va 49-darslarda ishlatildi, bu dars esa
// CHIZIQ bilan aylananing joylashishi haqida va uni SON bilan tekshirish
// aniqroq — masofani radius bilan solishtirish (skelet §2).
//
// 01 ning variantlari, 06 ning kartalari va 07 ning ikki javobi SO'Z BILAN
// (`Choice`, `ClozeBank`, `MatchPairs` ning `targets[].label` i `L()` oladi).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D50_01 from './D50_01.jsx';
import D50_02 from './D50_02.jsx';
import D50_03 from './D50_03.jsx';
import D50_04 from './D50_04.jsx';
import D50_05 from './D50_05.jsx';
import D50_06 from './D50_06.jsx';
import D50_07 from './D50_07.jsx';
import D50_08 from './D50_08.jsx';
import D50_09 from './D50_09.jsx';
import D50_10 from './D50_10.jsx';

const HEAD = {
  uz: "Dars 50 amaliyoti — 10 topshiriq (to'g'ri chiziq va aylana, urinma)",
  ru: 'Практика урока 50 — 10 заданий (прямая и окружность, касательная)',
  en: 'Lesson 50 practice — 10 tasks (the line and the circle, the tangent)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D50_01 },
  { id: '02', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D50_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D50_03 },
  { id: '04', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D50_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D50_05 },
  { id: '06', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D50_06 },
  { id: '07', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D50_07 },
  { id: '08', label: { uz: 'Nuqtalar', ru: 'Точки', en: 'Points' }, C: D50_08 },
  { id: '09', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D50_09 },
  { id: '10', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D50_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars50Practice({ lang = 'uz' }) {
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
