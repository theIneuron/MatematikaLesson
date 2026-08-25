// Dars10 amaliyoti — 10 topshiriq. Mavzu: ARIFMETIK KVADRAT ILDIZ.
//
// Metodist qarori 2026-08-24: 7-11 darslarning har biri 1-DARSNING o'nta
// mexanikasidan foydalanadi, lekin har darsda ketma-ketlik boshqacha.
// Taqsimot: DARS07_11_AMALIYOT_SKELET.md §3.
//
// 10-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 defined_marked        06 H ClozeBank  🟡 rule_words
//   02 A Choice     🟢 square_of_negative    07 I SwapOrder  🟡 modulus_steps
//   03 C TrueFalse  🟢 two_answers_claims    08 J MatchPairs 🔴 record_to_domain
//   04 G CodeLock   🟡 code_modulus          09 E TypeValue  🔴 smallest_x
//   05 B Zones      🟡 exists_always_or_never 10 D PairSlots 🔴 record_pairs
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// CHIZMA: 07-topshiriqda son o'qi — yetti belgilangan, chapda «?» (t < 7).
// Ildiz USTKI CHIZIQ bilan (`frac.jsx` -> Root), ya'ni ildiz ostining
// chegarasi ko'rinib turadi: √(−p² − 1) va √(−p²) − 1 aralashib ketmaydi.
//
// Darsning tasdiqlari: kvadratdan ildiz MODULni beradi (02, 04, 07, 10);
// ildiz osti nomanfiy bo'lgan joyda mavjud (01, 05, 08, 09, 10); x² = a da
// ikki javob, ildiz belgisida bitta son (03, 06).
// Adashishlar: З29 — 02, 03, 06; З31 — 02, 04, 07, 10; З32 — 01, 05, 08, 09;
// З16 — 04 va 09 razborlari son qo'yishga yuboradi.
//
// Harflar: a (04), c (05), t (07), p (08), x (03, 09, 10).
// Sonli misollar takrorlanmaydi: 36, 0, 25, 16, 1, 7 · 81 · 49 · 5, 8 · 9, 25,
// 3 · 5 · 7 · 2, 10.
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D10_01 from './D10_01.jsx';
import D10_02 from './D10_02.jsx';
import D10_03 from './D10_03.jsx';
import D10_04 from './D10_04.jsx';
import D10_05 from './D10_05.jsx';
import D10_06 from './D10_06.jsx';
import D10_07 from './D10_07.jsx';
import D10_08 from './D10_08.jsx';
import D10_09 from './D10_09.jsx';
import D10_10 from './D10_10.jsx';

const HEAD = {
  uz: 'Dars 10 amaliyoti — 10 topshiriq (arifmetik kvadrat ildiz)',
  ru: 'Практика урока 10 — 10 заданий (арифметический квадратный корень)',
  en: 'Lesson 10 practice — 10 tasks (the arithmetic square root)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D10_01 },
  { id: '02', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D10_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D10_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D10_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D10_05 },
  { id: '06', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D10_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D10_07 },
  { id: '08', label: { uz: 'Moslashtirish', ru: 'Соответствие', en: 'Match' }, C: D10_08 },
  { id: '09', label: { uz: 'Eng kichik', ru: 'Наименьшее', en: 'Smallest' }, C: D10_09 },
  { id: '10', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D10_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars10Practice({ lang = 'uz' }) {
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
