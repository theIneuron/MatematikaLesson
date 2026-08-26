// Dars33 amaliyoti — 10 topshiriq. Mavzu: SONNING STANDART KO'RINISHI.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §5, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 33-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 standard_claims          06 I SwapOrder  🟡 to_standard_steps
//   02 E TypeValue  🟢 exponent_big             07 H ClozeBank  🟡 rule_words
//   03 B Zones      🟢 standard_or_not          08 A Choice     🔴 which_standard
//   04 F MarkAll    🟡 negative_exponent_marked 09 J MatchPairs 🔴 number_to_standard
//   05 G CodeLock   🟡 code_exponents           10 D PairSlots  🔴 standard_to_number
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars33.jsx`): son a · 10ⁿ ko'rinishida, a birdan
// o'ngacha (01, 03, 07, 08); katta son uchun n musbat, kichik son uchun n
// manfiy (02, 04, 05, 06, 07, 09, 10); nolni standart shaklda yozib
// bo'lmaydi (03).
// Adashishlar: З66 — 01, 03, 07, 08; З67 — 02, 04, 05, 06, 07, 08;
// З16 — razborlar standart yozuvni qayta ochib, asl songa qaytaradi.
//
// 01-TOPSHIRIQDA IKKALA JAVOB HAM «YO'Q» (skelet §0a.3). Ular bitta
// shartning IKKI tomonini ko'rsatadi: mantissa o'ndan katta va birdan
// kichik. O'quvchi odatda faqat bittasini eslaydi.
//
// 08-TOPSHIRIQNING IKKI XATO VARIANTI TO'G'RI SONNI BERADI. Bu ataylab:
// standart ko'rinishning butun mazmuni yagona yozuvda, ya'ni «qiymati
// to'g'ri» degani «yozuvi to'g'ri» degani emas.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D33_01 from './D33_01.jsx';
import D33_02 from './D33_02.jsx';
import D33_03 from './D33_03.jsx';
import D33_04 from './D33_04.jsx';
import D33_05 from './D33_05.jsx';
import D33_06 from './D33_06.jsx';
import D33_07 from './D33_07.jsx';
import D33_08 from './D33_08.jsx';
import D33_09 from './D33_09.jsx';
import D33_10 from './D33_10.jsx';

const HEAD = {
  uz: "Dars 33 amaliyoti — 10 topshiriq (sonning standart ko'rinishi)",
  ru: 'Практика урока 33 — 10 заданий (стандартный вид числа)',
  en: 'Lesson 33 practice — 10 tasks (standard form of a number)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D33_01 },
  { id: '02', label: { uz: "Ko'rsatkich", ru: 'Показатель', en: 'Exponent' }, C: D33_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D33_03 },
  { id: '04', label: { uz: 'Belgilash', ru: 'Отметь', en: 'Mark' }, C: D33_04 },
  { id: '05', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D33_05 },
  { id: '06', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D33_06 },
  { id: '07', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D33_07 },
  { id: '08', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D33_08 },
  { id: '09', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D33_09 },
  { id: '10', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D33_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars33Practice({ lang = 'uz' }) {
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
