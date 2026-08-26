// Dars32 amaliyoti — 10 topshiriq. Mavzu: BUTUN KO'RSATKICHLI DARAJANING
// XOSSALARI.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §4, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 32-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 equal_a5_marked        06 J MatchPairs 🟡 expr_to_power
//   02 A Choice     🟢 product_exponent       07 C TrueFalse  🟡 property_claims
//   03 E TypeValue  🟢 quotient_exponent      08 H ClozeBank  🔴 rule_words
//   04 I SwapOrder  🟡 simplify_steps         09 B Zones      🔴 equals_a6_or_not
//   05 D PairSlots  🟡 op_to_result           10 G CodeLock   🔴 code_exponents
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars32.jsx`): aᵖ·aᵠ = aᵖ⁺ᵠ (01, 02, 04, 05, 06, 08,
// 09, 10); aᵖ:aᵠ = aᵖ⁻ᵠ (01, 03, 05, 06, 08, 09, 10); (aᵖ)ᵠ = aᵖᵠ va
// xossalar istalgan butun p, q uchun to'g'ri (01, 04, 05, 06, 07, 08, 09, 10).
// Adashishlar: З64 — 01, 02, 03, 07, 08, 09, 10; З65 — 02, 03, 04, 07, 08,
// 09, 10; З16 — razborlar a = 2 qo'yib tekshiradi.
//
// 07-TOPSHIRIQDA JAVOB «YO'Q, HA» (skelet §0a.3): 31-40 da to'rt
// kombinatsiya aylanadi, 21-28 dagidek «Ha, Yo'q» takrorlanmaydi.
//
// DARSNING BUTUN OG'IRLIGI BITTA FARQDA: qavs bor-yo'qligi ko'rsatkichlar
// qo'shiladimi yoki ko'paytiriladimi degan savolni hal qiladi. Shu sababli
// 07-topshiriqda ikki yozuvda AYNAN o'sha uch son turadi va farq faqat
// qavsda; 09-topshiriqda esa to'rt juftlikning har biri bitta belgida.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D32_01 from './D32_01.jsx';
import D32_02 from './D32_02.jsx';
import D32_03 from './D32_03.jsx';
import D32_04 from './D32_04.jsx';
import D32_05 from './D32_05.jsx';
import D32_06 from './D32_06.jsx';
import D32_07 from './D32_07.jsx';
import D32_08 from './D32_08.jsx';
import D32_09 from './D32_09.jsx';
import D32_10 from './D32_10.jsx';

const HEAD = {
  uz: "Dars 32 amaliyoti — 10 topshiriq (darajaning xossalari)",
  ru: 'Практика урока 32 — 10 заданий (свойства степени)',
  en: 'Lesson 32 practice — 10 tasks (properties of powers)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметь', en: 'Mark' }, C: D32_01 },
  { id: '02', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D32_02 },
  { id: '03', label: { uz: "Ko'rsatkich", ru: 'Показатель', en: 'Exponent' }, C: D32_03 },
  { id: '04', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D32_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D32_05 },
  { id: '06', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D32_06 },
  { id: '07', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D32_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D32_08 },
  { id: '09', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D32_09 },
  { id: '10', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D32_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars32Practice({ lang = 'uz' }) {
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
