// Dars26 amaliyoti — 10 topshiriq. Mavzu: BIR NOMA'LUMLI TENGSIZLIKLAR
// SISTEMASI.
//
// Metodist tasdig'i 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §8, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 26-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 both_true_marked  06 G CodeLock   🟡 code_integers
//   02 B Zones      🟢 in_or_out         07 E TypeValue  🟡 count_integers
//   03 C TrueFalse  🟢 system_claims     08 I SwapOrder  🔴 system_steps
//   04 D PairSlots  🟡 range_to_count    09 H ClozeBank  🔴 rule_words
//   05 A Choice     🟡 system_solution   10 J MatchPairs 🔴 system_to_answer
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars26.jsx`): yechim HAR IKKI tengsizlikni to'g'ri
// qiladi (01, 02, 09); sistemani yechish yechimlarning yo'qligini aniqlash
// ham demakdir (03, 05, 10); har tengsizlik alohida yechiladi va yechimlar
// kesishtiriladi (03, 05, 08, 09, 10).
// Adashishlar: З54 — 01, 02, 04, 06, 07; З55 — 01, 05, 08, 09, 10;
// З16 — razborlar sonni IKKALA tengsizlikka qo'yib tekshiradi.
//
// 01 VA 02 — Z54 NING IKKI TOMONI: 01 da tengsizliklar qat'iy va chegaralar
// chetda qoladi, 02 da esa belgilar ostida chiziq bor va chegaralar yechim
// bo'ladi. 06-topshiriqda ikkalasi BITTA yozuvda uchrashadi.
//
// 07-TOPSHIRIQDA CHIZMA — son o'qi −4 dan 5 gacha (skelet §2). U sanaladigan
// narsani ko'rsatadi, chegara qaysi tomonga kirishini esa aytmaydi.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D26_01 from './D26_01.jsx';
import D26_02 from './D26_02.jsx';
import D26_03 from './D26_03.jsx';
import D26_04 from './D26_04.jsx';
import D26_05 from './D26_05.jsx';
import D26_06 from './D26_06.jsx';
import D26_07 from './D26_07.jsx';
import D26_08 from './D26_08.jsx';
import D26_09 from './D26_09.jsx';
import D26_10 from './D26_10.jsx';

const HEAD = {
  uz: 'Dars 26 amaliyoti — 10 topshiriq (tengsizliklar sistemasi)',
  ru: 'Практика урока 26 — 10 заданий (системы неравенств)',
  en: 'Lesson 26 practice — 10 tasks (systems of inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Yechimlar', ru: 'Решения', en: 'Solutions' }, C: D26_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D26_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D26_03 },
  { id: '04', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D26_04 },
  { id: '05', label: { uz: 'Yechim', ru: 'Решение', en: 'Solution' }, C: D26_05 },
  { id: '06', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D26_06 },
  { id: '07', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D26_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D26_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D26_09 },
  { id: '10', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D26_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars26Practice({ lang = 'uz' }) {
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
