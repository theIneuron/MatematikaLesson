// Dars31 amaliyoti — 10 topshiriq. Mavzu: BUTUN KO'RSATKICHLI DARAJA.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §3, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 31-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 zero_power_value      06 F MarkAll    🟡 equal_one_marked
//   02 B Zones      🟢 defined_or_not        07 D PairSlots  🟡 base_to_value
//   03 C TrueFalse  🟢 power_claims          08 E TypeValue  🔴 denominator_of_power
//   04 J MatchPairs 🟡 power_to_value        09 G CodeLock   🔴 code_exponents
//   05 I SwapOrder  🟡 neg_power_steps       10 H ClozeBank  🔴 rule_words
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars31.jsx`): a ≠ 0 bo'lsa a⁰ = 1 (01, 03, 06, 09,
// 10); a ≠ 0 va n natural bo'lsa a⁻ⁿ = 1/aⁿ (02, 04, 05, 07, 08, 09, 10);
// a = 0 uchun bu darajalar aniqlanmagan (02, 06, 10).
// Adashishlar: З62 — 01, 06, 10; З63 — 04, 05, 07, 08, 09, 10;
// З16 — razborlar darajani ko'paytma yoki bo'lish bilan qayta hisoblaydi.
//
// 03-TOPSHIRIQDA IKKALA JAVOB HAM «HA» (skelet §0a.3). 21-28 darslarning
// sakkiztasida ham javob «Ha, Yo'q» bo'lgan, ya'ni mexanikani mazmunsiz
// yengish mumkin edi. 31-40 da to'rt kombinatsiya aylanadi.
//
// 08-TOPSHIRIQ MAXRAJNI SO'RAYDI, DARAJANING QIYMATINI EMAS: `TypeValue`
// faqat butun sonni qabul qiladi (`parseInt`), 3⁻⁴ esa kasr. Mazmun
// o'zgarmadi — maxrajni topish uchun manfiy ko'rsatkichni ochish kerak.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D31_01 from './D31_01.jsx';
import D31_02 from './D31_02.jsx';
import D31_03 from './D31_03.jsx';
import D31_04 from './D31_04.jsx';
import D31_05 from './D31_05.jsx';
import D31_06 from './D31_06.jsx';
import D31_07 from './D31_07.jsx';
import D31_08 from './D31_08.jsx';
import D31_09 from './D31_09.jsx';
import D31_10 from './D31_10.jsx';

const HEAD = {
  uz: "Dars 31 amaliyoti — 10 topshiriq (butun ko'rsatkichli daraja)",
  ru: 'Практика урока 31 — 10 заданий (степень с целым показателем)',
  en: 'Lesson 31 practice — 10 tasks (power with an integer exponent)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D31_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D31_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D31_03 },
  { id: '04', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D31_04 },
  { id: '05', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D31_05 },
  { id: '06', label: { uz: 'Belgilash', ru: 'Отметь', en: 'Mark' }, C: D31_06 },
  { id: '07', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D31_07 },
  { id: '08', label: { uz: 'Maxraj', ru: 'Знаменатель', en: 'Denominator' }, C: D31_08 },
  { id: '09', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D31_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D31_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars31Practice({ lang = 'uz' }) {
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
