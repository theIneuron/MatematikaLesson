// Dars15 amaliyoti — 10 topshiriq. Mavzu: KVADRAT TENGLAMA VA UNING ELEMENTLARI.
//
// Metodist qarori 2026-08-24: 15-20 darslar 12-14 bilan bir xil qoida bo'yicha
// yaratiladi — 1-DARSNING o'nta mexanikasi, har darsda boshqa ketma-ketlik.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3, taqsimot §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 15-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 is_quadratic_claims   06 D PairSlots  🟡 abc_pairs
//   02 F MarkAll    🟢 no_constant_marked    07 H ClozeBank  🟡 rule_words
//   03 B Zones      🟢 sign_of_b             08 E TypeValue  🔴 find_c
//   04 J MatchPairs 🟡 abc_to_equation       09 A Choice     🔴 which_quadratic_root
//   05 I SwapOrder  🟡 standard_form_steps   10 G CodeLock   🔴 code_abc
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars15.jsx`): `ax² + bx + c = 0`, a nolga teng emas
// (01, 07, 09); a bosh koeffitsiyent, b ikkinchi, c ozod had (02, 03, 04, 05,
// 06, 07, 10); ildiz — tenglamani to'g'ri qiladigan son (08, 09).
// Adashishlar: З38 — 01, 07, 09; З39 — 03, 04, 05, 06, 10; З16 — razborlar
// ildizni tenglamaga QO'YIB tekshiradi.
//
// SO'ZNING IKKI MA'NOSI. Bu darsda «ildiz» tenglamaning ildizini bildiradi,
// 8-13 darslarda esa kvadrat ildizni bildirgan edi. Amaliyotda ikki ma'no
// uchrashmaydi: bu yerda ildiz belgisi faqat 02 da, bosh koeffitsiyent
// irratsional bo'lishi mumkinligini ko'rsatish uchun turadi.
//
// CHIZMA YO'Q: dars yozuv haqida (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D15_01 from './D15_01.jsx';
import D15_02 from './D15_02.jsx';
import D15_03 from './D15_03.jsx';
import D15_04 from './D15_04.jsx';
import D15_05 from './D15_05.jsx';
import D15_06 from './D15_06.jsx';
import D15_07 from './D15_07.jsx';
import D15_08 from './D15_08.jsx';
import D15_09 from './D15_09.jsx';
import D15_10 from './D15_10.jsx';

const HEAD = {
  uz: 'Dars 15 amaliyoti — 10 topshiriq (kvadrat tenglama va uning elementlari)',
  ru: 'Практика урока 15 — 10 заданий (квадратное уравнение и его элементы)',
  en: 'Lesson 15 practice — 10 tasks (the quadratic equation and its elements)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Kvadratmi', ru: 'Квадратное ли', en: 'Is it quadratic' }, C: D15_01 },
  { id: '02', label: { uz: 'Ozod had', ru: 'Свободный член', en: 'Constant term' }, C: D15_02 },
  { id: '03', label: { uz: 'Ishora', ru: 'Знак', en: 'Sign' }, C: D15_03 },
  { id: '04', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D15_04 },
  { id: '05', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D15_05 },
  { id: '06', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D15_06 },
  { id: '07', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D15_07 },
  { id: '08', label: { uz: 'c ni topish', ru: 'Найти c', en: 'Find c' }, C: D15_08 },
  { id: '09', label: { uz: 'Qaysi tenglama', ru: 'Какое уравнение', en: 'Which equation' }, C: D15_09 },
  { id: '10', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D15_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars15Practice({ lang = 'uz' }) {
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
