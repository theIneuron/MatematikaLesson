// Dars36 amaliyoti — 10 topshiriq. Mavzu: KOMBINATORIKA, PEREBOR VA
// ASOSIY QONUN.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §8, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 36-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 no_repeat_marked      06 J MatchPairs 🟡 digits_to_count
//   02 C TrueFalse  🟢 count_claims          07 D PairSlots  🟡 expr_to_value
//   03 E TypeValue  🟢 product_rule          08 A Choice     🔴 which_count
//   04 G CodeLock   🟡 code_three_counts     09 B Zones      🔴 equals_12_or_not
//   05 H ClozeBank  🟡 rule_words            10 I SwapOrder  🔴 count_steps
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars36.jsx`): perebor — bittasini ham qoldirmay
// sanash (01, 02, 06, 10); A dan C ga m·n yo'l (03, 04, 05, 06, 08, 09,
// 10); ketma-ket bosqichlar ko'paytiriladi, faqat bittasi tanlanadigan
// holatlar qo'shiladi (05, 07, 08, 09, 10).
// Adashishlar: З73 — 01, 02, 06, 10; З74 — 03, 04, 05, 07, 08, 09;
// З16 — razborlar kichik holatlarda pereborni to'liq yozib tekshiradi.
//
// 02-TOPSHIRIQDA IKKALA JAVOB HAM «YO'Q» (skelet §0a.3), va sabab bitta:
// javoblar ALMASHTIRILGAN — takrorsiz oltita, takrorli to'qqizta. Bu З73
// ning o'zi, va ikkala «yo'q» har ikki holni alohida sanashga majbur qiladi.
//
// 03-TOPSHIRIQDA `expr` YO'Q ATAYLAB: `3 · 4` yozuvi amalni oldindan aytib
// qo'yardi, savol esa aynan shu — qo'shiladimi yoki ko'paytiriladimi.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D36_01 from './D36_01.jsx';
import D36_02 from './D36_02.jsx';
import D36_03 from './D36_03.jsx';
import D36_04 from './D36_04.jsx';
import D36_05 from './D36_05.jsx';
import D36_06 from './D36_06.jsx';
import D36_07 from './D36_07.jsx';
import D36_08 from './D36_08.jsx';
import D36_09 from './D36_09.jsx';
import D36_10 from './D36_10.jsx';

const HEAD = {
  uz: 'Dars 36 amaliyoti — 10 topshiriq (kombinatorika)',
  ru: 'Практика урока 36 — 10 заданий (комбинаторика)',
  en: 'Lesson 36 practice — 10 tasks (combinatorics)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметь', en: 'Mark' }, C: D36_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D36_02 },
  { id: '03', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D36_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D36_04 },
  { id: '05', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D36_05 },
  { id: '06', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D36_06 },
  { id: '07', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D36_07 },
  { id: '08', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D36_08 },
  { id: '09', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D36_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D36_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars36Practice({ lang = 'uz' }) {
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
