// Dars27 amaliyoti — 10 topshiriq. Mavzu: SONLI ORALIQLAR VA ULARNING
// BELGILANISHI.
//
// Metodist tasdig'i 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §9, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 27-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 interval_claims          06 H ClozeBank  🟡 rule_words
//   02 E TypeValue  🟢 count_integers_in        07 A Choice     🟡 inequality_to_interval
//   03 F MarkAll    🟢 belongs_marked           08 I SwapOrder  🔴 write_interval_steps
//   04 D PairSlots  🟡 notation_to_inequality   09 J MatchPairs 🔴 interval_to_picture
//   05 B Zones      🟡 three_inside             10 G CodeLock   🔴 code_smallest_integer
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars27.jsx`): a ≤ x ≤ b to'plami kesma, [a; b]
// (01, 02, 04, 05, 06); a < x < b to'plami interval, (a; b) (01, 04, 05,
// 06, 09); bitta chegarasi kirgan to'plam yarim-interval (03, 04, 07, 08, 09).
// Adashishlar: З54 — 02, 03, 05, 10; З56 — 01, 05, 06, 07, 08, 09;
// З16 — razborlar chegara sonini tengsizlikka qo'yib tekshiradi.
//
// 04-TOPSHIRIQ SKELETDAN OG'DI, VA SABABI YOZILGAN: `PairSlots` karta
// matnini tarjima qilmaydi, shuning uchun javoblar so'z bilan emas,
// TENGSIZLIK bilan yozildi. Mazmun o'zgarmadi.
//
// 09-TOPSHIRIQDA CHIZMA — to'rt oraliqning to'rt surati (skelet §0a.2).
// `fig.jsx` ga `spans` maydoni qo'shildi: ikki doiracha to'plamni
// anglatmaydi, oraliqning O'ZI chizilishi kerak. Bu 21-30 blokida umumiy
// qatlamga qilingan YAGONA qo'shimcha, va u additiv — 7-20 darslarning
// chizmalari o'zgarmadi.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D27_01 from './D27_01.jsx';
import D27_02 from './D27_02.jsx';
import D27_03 from './D27_03.jsx';
import D27_04 from './D27_04.jsx';
import D27_05 from './D27_05.jsx';
import D27_06 from './D27_06.jsx';
import D27_07 from './D27_07.jsx';
import D27_08 from './D27_08.jsx';
import D27_09 from './D27_09.jsx';
import D27_10 from './D27_10.jsx';

const HEAD = {
  uz: 'Dars 27 amaliyoti — 10 topshiriq (sonli oraliqlar)',
  ru: 'Практика урока 27 — 10 заданий (числовые промежутки)',
  en: 'Lesson 27 practice — 10 tasks (number intervals)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D27_01 },
  { id: '02', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D27_02 },
  { id: '03', label: { uz: 'Tegishli', ru: 'Принадлежит', en: 'Belongs' }, C: D27_03 },
  { id: '04', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D27_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D27_05 },
  { id: '06', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D27_06 },
  { id: '07', label: { uz: 'Yozuv', ru: 'Запись', en: 'Notation' }, C: D27_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D27_08 },
  { id: '09', label: { uz: 'Chizmalar', ru: 'Рисунки', en: 'Pictures' }, C: D27_09 },
  { id: '10', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D27_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars27Practice({ lang = 'uz' }) {
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
