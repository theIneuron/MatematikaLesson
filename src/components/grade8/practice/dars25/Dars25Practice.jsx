// Dars25 amaliyoti — 10 topshiriq. Mavzu: BIR NOMA'LUMLI CHIZIQLI
// TENGSIZLIKLAR.
//
// Metodist tasdig'i 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §7, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 25-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 is_solution        06 J MatchPairs 🟡 inequality_to_solution
//   02 F MarkAll    🟢 solutions_marked   07 D PairSlots  🟡 reversed_reading
//   03 B Zones      🟢 strict_or_not      08 H ClozeBank  🔴 rule_words
//   04 E TypeValue  🟡 smallest_integer   09 C TrueFalse  🔴 solution_claims
//   05 G CodeLock   🟡 code_boundaries    10 I SwapOrder  🔴 solve_steps
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars25.jsx`): ax > b ko'rinishidagi yozuv chiziqli
// tengsizlik (05, 06, 10); yechim — tengsizlikni to'g'ri qiladigan qiymat
// (01, 02, 04, 06, 07, 09, 10); had ko'chirilganda ishorasi o'zgaradi,
// manfiy songa bo'linganda tengsizlik ishorasi buriladi (05, 08, 10).
// Adashishlar: З52 — 05, 06, 08, 09, 10; З54 — 01, 02, 03, 08, 09;
// З16 — 09, 10 va razborlar.
//
// 01 VA 02 — Z54 NING IKKI TOMONI: 01 da chegara yechim EMAS (qat'iy
// tengsizlik), 02 da esa chegara yechim BO'LADI (belgi ostida chiziq bor).
// Qoida «chegara kirmaydi» emas, «belgiga qarab».
//
// 04-TOPSHIRIQDA CHIZMA — son o'qi 0 dan 5 gacha, `?` ikki va uch orasida
// (skelet §2). U izlash joyini ko'rsatadi, javobni bermaydi.
//
// 07-TOPSHIRIQ 23-DARSGA QAYTADI: `4 < x` ni teskari o'qish — o'sha З49.
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D25_01 from './D25_01.jsx';
import D25_02 from './D25_02.jsx';
import D25_03 from './D25_03.jsx';
import D25_04 from './D25_04.jsx';
import D25_05 from './D25_05.jsx';
import D25_06 from './D25_06.jsx';
import D25_07 from './D25_07.jsx';
import D25_08 from './D25_08.jsx';
import D25_09 from './D25_09.jsx';
import D25_10 from './D25_10.jsx';

const HEAD = {
  uz: 'Dars 25 amaliyoti — 10 topshiriq (chiziqli tengsizliklar)',
  ru: 'Практика урока 25 — 10 заданий (линейные неравенства)',
  en: 'Lesson 25 practice — 10 tasks (linear inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Yechim', ru: 'Решение', en: 'Solution' }, C: D25_01 },
  { id: '02', label: { uz: 'Yechimlar', ru: 'Решения', en: 'Solutions' }, C: D25_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D25_03 },
  { id: '04', label: { uz: 'Eng kichik', ru: 'Наименьшее', en: 'Smallest' }, C: D25_04 },
  { id: '05', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D25_05 },
  { id: '06', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D25_06 },
  { id: '07', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D25_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D25_08 },
  { id: '09', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D25_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D25_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars25Practice({ lang = 'uz' }) {
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
