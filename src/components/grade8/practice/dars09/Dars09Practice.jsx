// Dars09 amaliyoti — 10 topshiriq. Mavzu: KVADRAT ILDIZ TUSHUNCHASI.
// B2 blokining birinchi amaliyoti.
//
// Metodist qarori 2026-08-24: 7-11 darslarning har biri 1-DARSNING o'nta
// mexanikasidan foydalanadi, lekin har darsda ketma-ketlik boshqacha.
// Taqsimot: DARS07_11_AMALIYOT_SKELET.md §3.
//
// 9-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 root_exists_claims  06 I SwapOrder  🟡 refine_steps
//   02 B Zones      🟢 whole_or_not        07 E TypeValue  🟡 count_whole
//   03 F MarkAll    🟢 has_value           08 D PairSlots  🔴 root_to_bounds
//   04 H ClozeBank  🟡 rule_words          09 G CodeLock   🔴 code_roots
//   05 A Choice     🟡 between_which       10 J MatchPairs 🔴 fact_to_record
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// CHIZMA: 06-topshiriqda son o'qi — besh va olti orasida «?» turadi
// (`practice/fig.jsx`). Ildiz USTKI CHIZIQ bilan (`frac.jsx` -> Root).
//
// Darsning tasdiqlari: ildiz — kvadrati ildiz ostiga teng NOMANFIY son (01,
// 04, 10); har qanday nomanfiy sondan ildiz bor, lekin butun emas (02, 03,
// 04, 07, 10); butun chiqmasa ikki butun son orasida turadi (05, 06, 08, 09).
// Adashishlar: З29 — 01, 04; З30 — 01, 03, 07; З4 — 08 razborida;
// З16 — 06, 08, 09 razborlari kvadratga oshirib tekshirishga yuboradi.
//
// Sonli misollar takrorlanmaydi: 13, 49 · 36, 81, 121, 144, 10, 30, 50, 200 ·
// 0, 7, 169 · 54 · 31 · 50 gacha sanoq · 20, 40, 90 · 9, 64, 225 · 196, 27.
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D09_01 from './D09_01.jsx';
import D09_02 from './D09_02.jsx';
import D09_03 from './D09_03.jsx';
import D09_04 from './D09_04.jsx';
import D09_05 from './D09_05.jsx';
import D09_06 from './D09_06.jsx';
import D09_07 from './D09_07.jsx';
import D09_08 from './D09_08.jsx';
import D09_09 from './D09_09.jsx';
import D09_10 from './D09_10.jsx';

const HEAD = {
  uz: 'Dars 9 amaliyoti — 10 topshiriq (kvadrat ildiz tushunchasi)',
  ru: 'Практика урока 9 — 10 заданий (понятие квадратного корня)',
  en: 'Lesson 9 practice — 10 tasks (the concept of a square root)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D09_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D09_02 },
  { id: '03', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D09_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D09_04 },
  { id: '05', label: { uz: 'Chegaralar', ru: 'Границы', en: 'Bounds' }, C: D09_05 },
  { id: '06', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D09_06 },
  { id: '07', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D09_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D09_08 },
  { id: '09', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D09_09 },
  { id: '10', label: { uz: 'Moslashtirish', ru: 'Соответствие', en: 'Match' }, C: D09_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars09Practice({ lang = 'uz' }) {
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
