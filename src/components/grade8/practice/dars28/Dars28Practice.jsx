// Dars28 amaliyoti — 10 topshiriq. Mavzu: TENGSIZLIKLAR YORDAMIDA
// MASALALAR YECHISH.
//
// Metodist tasdig'i 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §10, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 28-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 condition_to_inequality  06 G CodeLock   🟡 code_min_values
//   02 C TrueFalse  🟢 answer_claims            07 I SwapOrder  🟡 word_steps
//   03 B Zones      🟢 fits_condition           08 D PairSlots  🔴 solution_to_answer
//   04 H ClozeBank  🟡 rule_words               09 F MarkAll    🔴 valid_answers_marked
//   05 E TypeValue  🟡 max_count                10 J MatchPairs 🔴 words_to_inequality
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars28.jsx`): noma'lum harf bilan belgilanadi va
// shart tengsizlikka aylantiriladi (01, 04, 07, 10); tengsizlik yechiladi
// (05, 06, 07, 09); yechimdan shartga zid qiymatlar chiqarib tashlanadi
// (02, 03, 05, 07, 08, 09).
// Adashishlar: З54 — 06, 09; З57 — 02, 03, 04, 07, 08, 09;
// З16 — 05 va razborlar javobni masalaning o'ziga qo'yib tekshiradi.
//
// 21-DARSDAN FARQI BITTA SO'ZDA: u yerda «teng» degan shart TENGLAMA
// berardi, bu yerda «yetadi», «kamida», «ko'pi bilan» — va TENGSIZLIK
// chiqadi. 10-topshiriq aynan shu tilni tekshiradi.
//
// 09-TOPSHIRIQDA CHIZMA — `x < 4,5` ning surati (skelet §0a.2, `spans`).
// U yechimni ko'rsatadi, lekin masalaning shartini emas: minus ikki
// chizmada bor, javobda esa yo'q. Bu farq topshiriqning o'zagi.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q. Ismlar o'zbekcha: Aziz, Nodira.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D28_01 from './D28_01.jsx';
import D28_02 from './D28_02.jsx';
import D28_03 from './D28_03.jsx';
import D28_04 from './D28_04.jsx';
import D28_05 from './D28_05.jsx';
import D28_06 from './D28_06.jsx';
import D28_07 from './D28_07.jsx';
import D28_08 from './D28_08.jsx';
import D28_09 from './D28_09.jsx';
import D28_10 from './D28_10.jsx';

const HEAD = {
  uz: 'Dars 28 amaliyoti — 10 topshiriq (tengsizliklar bilan masalalar)',
  ru: 'Практика урока 28 — 10 заданий (задачи с неравенствами)',
  en: 'Lesson 28 practice — 10 tasks (word problems with inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Tengsizlik', ru: 'Неравенство', en: 'Inequality' }, C: D28_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D28_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D28_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D28_04 },
  { id: '05', label: { uz: "Eng ko'pi", ru: 'Не больше', en: 'At most' }, C: D28_05 },
  { id: '06', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D28_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D28_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D28_08 },
  { id: '09', label: { uz: 'Mos javoblar', ru: 'Подходящие', en: 'Fitting' }, C: D28_09 },
  { id: '10', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D28_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars28Practice({ lang = 'uz' }) {
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
