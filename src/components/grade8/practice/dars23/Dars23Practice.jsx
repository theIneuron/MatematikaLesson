// Dars23 amaliyoti — 10 topshiriq. Mavzu: SONLI TENGSIZLIKLAR.
//
// Metodist tasdig'i 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §5, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 23-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 difference_claims    06 H ClozeBank  🟡 rule_words
//   02 A Choice     🟢 which_greater        07 G CodeLock   🟡 code_differences
//   03 F MarkAll    🟢 positive_difference  08 D PairSlots  🔴 pair_compare
//   04 I SwapOrder  🟡 compare_steps        09 B Zones      🔴 first_bigger_or_smaller
//   05 E TypeValue  🟡 reverse_difference   10 J MatchPairs 🔴 pair_to_difference
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars23.jsx`): ayirma musbat bo'lsa birinchi son katta
// (01, 03, 06, 08, 10); manfiy bo'lsa kichik (01, 03, 06, 08, 09);
// taqqoslash AYIRMANING ISHORASIGA qaraydi, sonlarning ko'rinishiga emas
// (02, 04, 09, 10).
// Adashishlar: З49 — 03, 05, 07; З50 — 09, 10; З51 — 02, 09;
// З16 — razborlar ayirmani son bilan qayta hisoblaydi.
//
// BU DARSDA BLOK ALMASHADI: Б3 (kvadrat tenglamalar) tugadi, Б4
// (tengsizliklar) boshlandi. Shuning uchun 01-03 topshiriqlar ataylab
// sodda: yangi tilni o'rganish kerak, yangi hisobni emas.
//
// 03 VA 09 BIR ISHNI IKKI CHUQURLIKDA TEKSHIRADI: 03 da ayirma YOZILGAN va
// uni hisoblash kifoya, 09 da esa ayirmani o'zingiz tuzasiz.
//
// CHIZMA YO'Q: dars taqqoslash usuli haqida, son o'qi esa 25-darsdan
// boshlanadi (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D23_01 from './D23_01.jsx';
import D23_02 from './D23_02.jsx';
import D23_03 from './D23_03.jsx';
import D23_04 from './D23_04.jsx';
import D23_05 from './D23_05.jsx';
import D23_06 from './D23_06.jsx';
import D23_07 from './D23_07.jsx';
import D23_08 from './D23_08.jsx';
import D23_09 from './D23_09.jsx';
import D23_10 from './D23_10.jsx';

const HEAD = {
  uz: 'Dars 23 amaliyoti — 10 topshiriq (sonli tengsizliklar)',
  ru: 'Практика урока 23 — 10 заданий (числовые неравенства)',
  en: 'Lesson 23 practice — 10 tasks (numerical inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D23_01 },
  { id: '02', label: { uz: 'Qaysi katta', ru: 'Что больше', en: 'Which is greater' }, C: D23_02 },
  { id: '03', label: { uz: 'Musbat ayirma', ru: 'Положительная', en: 'Positive' }, C: D23_03 },
  { id: '04', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D23_04 },
  { id: '05', label: { uz: 'Teskari ayirma', ru: 'Обратная', en: 'Reversed' }, C: D23_05 },
  { id: '06', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D23_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D23_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D23_08 },
  { id: '09', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D23_09 },
  { id: '10', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D23_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars23Practice({ lang = 'uz' }) {
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
