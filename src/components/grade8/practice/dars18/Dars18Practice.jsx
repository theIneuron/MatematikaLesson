// Dars18 amaliyoti — 10 topshiriq. Mavzu: DISKRIMINANT VA ILDIZLAR SONI.
//
// Metodist qarori 2026-08-24: 15-20 darslar 12-14 bilan bir xil qoida bo'yicha.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6, taqsimot §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 18-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 D_zero_claims      06 A Choice     🟡 how_many_roots
//   02 B Zones      🟢 by_D_sign          07 G CodeLock   🟡 code_D_values
//   03 E TypeValue  🟢 count_roots        08 I SwapOrder  🔴 count_steps
//   04 F MarkAll    🟡 two_roots_marked   09 D PairSlots  🔴 count_pairs
//   05 J MatchPairs 🟡 D_to_count         10 H ClozeBank  🔴 rule_words
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars18.jsx`): D > 0 — ikki TURLI ildiz (02, 04, 05,
// 09, 10); D = 0 — BITTA ildiz, yo'q emas (01, 03, 05, 06, 09, 10); D < 0 —
// haqiqiy ildiz yo'q (01, 02, 05, 08, 09, 10).
// Adashishlar: З9 — 01, 02, 03, 06, 10; З41 — 02, 05, 08, 09; З16 — 08 va
// razborlar (ildizni qo'yib yoki D ni qayta hisoblab tekshirish).
//
// DARSNING BUTUN OG'IRLIGI BITTA FARQDA: «D nolga teng» «ildiz yo'q» degani
// emas. Bu beshta topshiriqda va bitta qoidada tekshiriladi, va har joyda
// razbor ildizni QO'YIB ko'rsatadi — nolda ildiz bor.
//
// CHIZMA YO'Q: parabola `fig.jsx` da yo'q, va uni qo'shish umumiy qatlamga
// tegish degani (skelet §2). D ning uch holi son bilan tekshiriladi.
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D18_01 from './D18_01.jsx';
import D18_02 from './D18_02.jsx';
import D18_03 from './D18_03.jsx';
import D18_04 from './D18_04.jsx';
import D18_05 from './D18_05.jsx';
import D18_06 from './D18_06.jsx';
import D18_07 from './D18_07.jsx';
import D18_08 from './D18_08.jsx';
import D18_09 from './D18_09.jsx';
import D18_10 from './D18_10.jsx';

const HEAD = {
  uz: 'Dars 18 amaliyoti — 10 topshiriq (diskriminant va ildizlar soni)',
  ru: 'Практика урока 18 — 10 заданий (дискриминант и количество корней)',
  en: 'Lesson 18 practice — 10 tasks (the discriminant and the number of roots)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D18_01 },
  { id: '02', label: { uz: 'Ishora', ru: 'Знак', en: 'Sign' }, C: D18_02 },
  { id: '03', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D18_03 },
  { id: '04', label: { uz: 'Ikki ildiz', ru: 'Два корня', en: 'Two roots' }, C: D18_04 },
  { id: '05', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D18_05 },
  { id: '06', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D18_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D18_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D18_08 },
  { id: '09', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D18_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D18_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars18Practice({ lang = 'uz' }) {
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
