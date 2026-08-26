// Dars34 amaliyoti — 10 topshiriq. Mavzu: MA'LUMOTLARNI YIG'ISH VA
// IFODALASH.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §6, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 34-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 which_variation_row   06 G CodeLock   🟡 code_frequencies
//   02 F MarkAll    🟢 frequency_marked      07 H ClozeBank  🟡 rule_words
//   03 C TrueFalse  🟢 data_claims           08 E TypeValue  🔴 missing_frequency
//   04 D PairSlots  🟡 variant_to_relative   09 I SwapOrder  🔴 table_steps
//   05 J MatchPairs 🟡 frequency_to_relative 10 B Zones      🔴 frequency_or_relative
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars34.jsx`): o'sish tartibidagi qator variatsion
// qator (01, 07, 09); chastota va nisbiy chastota (02, 03, 04, 05, 06, 07,
// 10); chastotalar yig'indisi tanlanma hajmiga teng (06, 08, 09).
// Adashishlar: З69 — 03, 04, 06, 07, 10; З70 — 08, 09;
// З16 — razborlar chastotalarni qayta sanaydi va yig'indini tekshiradi.
//
// 03-TOPSHIRIQDA JAVOB «HA, YO'Q» (skelet §0a.3): 31-40 da to'rt
// kombinatsiya aylanadi.
//
// DARSNING TANLANMASI TAKRORLANMAYDI: nazariy darsda o'z tanlanmasi bor,
// amaliyotda esa boshqasi — o'quvchilar bir haftada nechta kitob o'qigani
// (01-04). 06 va 08 da yana boshqa ma'lumot: har topshiriq o'z sahnasida.
//
// 10-TOPSHIRIQDA TANLANMA UMUMAN YO'Q. Bu ataylab: chastota butun son,
// nisbiy chastota esa noldan birgacha bo'lgan ulush — sonning KO'RINISHI
// javobni beradi, va bu З69 ning eng sof shakli.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D34_01 from './D34_01.jsx';
import D34_02 from './D34_02.jsx';
import D34_03 from './D34_03.jsx';
import D34_04 from './D34_04.jsx';
import D34_05 from './D34_05.jsx';
import D34_06 from './D34_06.jsx';
import D34_07 from './D34_07.jsx';
import D34_08 from './D34_08.jsx';
import D34_09 from './D34_09.jsx';
import D34_10 from './D34_10.jsx';

const HEAD = {
  uz: "Dars 34 amaliyoti — 10 topshiriq (ma'lumotlarni yig'ish)",
  ru: 'Практика урока 34 — 10 заданий (сбор и представление данных)',
  en: 'Lesson 34 practice — 10 tasks (collecting and representing data)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D34_01 },
  { id: '02', label: { uz: 'Belgilash', ru: 'Отметь', en: 'Mark' }, C: D34_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D34_03 },
  { id: '04', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D34_04 },
  { id: '05', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D34_05 },
  { id: '06', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D34_06 },
  { id: '07', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D34_07 },
  { id: '08', label: { uz: 'Chastota', ru: 'Частота', en: 'Frequency' }, C: D34_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D34_09 },
  { id: '10', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D34_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars34Practice({ lang = 'uz' }) {
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
