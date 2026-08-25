// Dars11 amaliyoti — 10 topshiriq. Mavzu: ARIFMETIK KVADRAT ILDIZNING
// XOSSALARI.
//
// Metodist qarori 2026-08-24: 7-11 darslarning har biri 1-DARSNING o'nta
// mexanikasidan foydalanadi, lekin har darsda ketma-ketlik boshqacha.
// Taqsimot: DARS07_11_AMALIYOT_SKELET.md §3. Bu blokning oxirgi amaliyoti.
//
// 11-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 compare_claims       06 D PairSlots  🟡 value_pairs
//   02 E TypeValue  🟢 square_undo          07 G CodeLock   🔴 code_integer_part
//   03 A Choice     🟢 which_bigger         08 I SwapOrder  🔴 compare_steps
//   04 J MatchPairs 🟡 record_to_condition  09 B Zones      🔴 always_or_sometimes
//   05 F MarkAll    🟡 always_true_marked   10 H ClozeBank  🔴 rule_words
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// CHIZMA: 08-topshiriqda son o'qi — faqat besh belgilangan, ildizning joyi
// esa yo'q (u javob). Ildiz USTKI CHIZIQ bilan (`frac.jsx` -> Root): shu
// darsda aynan chiziq √(g²) ni (√g)² dan ajratib turadi.
//
// Darsning tasdiqlari: kvadratga oshirish ildizni yechadi, lekin ildiz osti
// nomanfiy bo'lganda (02, 04, 05, 09, 10); √(a²) har qanday a da, (√a)² esa
// faqat a ≥ 0 da (04, 05, 06, 09, 10); ildiz osti katta bo'lsa ildiz ham
// katta (01, 03, 07, 08, 10).
// Adashishlar: З31 — 05, 06, 09; З32 — 04, 10; З33 — 01, 03, 07, 08;
// З16 — 07 va 08 razborlari kvadratga oshirib tekshirishga yuboradi.
//
// Harflar: d (04), f (05), g (09). Sonli misollar takrorlanmaydi: 17, 30 ·
// 13 · 26 · 2 · 9, 16 · 6, 8, 11, 9 · 8, 27, 50 · 36.
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D11_01 from './D11_01.jsx';
import D11_02 from './D11_02.jsx';
import D11_03 from './D11_03.jsx';
import D11_04 from './D11_04.jsx';
import D11_05 from './D11_05.jsx';
import D11_06 from './D11_06.jsx';
import D11_07 from './D11_07.jsx';
import D11_08 from './D11_08.jsx';
import D11_09 from './D11_09.jsx';
import D11_10 from './D11_10.jsx';

const HEAD = {
  uz: 'Dars 11 amaliyoti — 10 topshiriq (ildizning xossalari)',
  ru: 'Практика урока 11 — 10 заданий (свойства квадратного корня)',
  en: 'Lesson 11 practice — 10 tasks (properties of the square root)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D11_01 },
  { id: '02', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D11_02 },
  { id: '03', label: { uz: 'Qaysi katta', ru: 'Что больше', en: 'Which is bigger' }, C: D11_03 },
  { id: '04', label: { uz: 'Moslashtirish', ru: 'Соответствие', en: 'Match' }, C: D11_04 },
  { id: '05', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D11_05 },
  { id: '06', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D11_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D11_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D11_08 },
  { id: '09', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D11_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D11_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars11Practice({ lang = 'uz' }) {
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
