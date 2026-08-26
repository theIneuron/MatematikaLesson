// Dars16 amaliyoti — 10 topshiriq. Mavzu: CHALA KVADRAT TENGLAMALAR.
//
// Metodist qarori 2026-08-24: 15-20 darslar 12-14 bilan bir xil qoida bo'yicha.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4, taqsimot §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 16-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 roots_of_incomplete   06 I SwapOrder  🟡 factor_steps
//   02 E TypeValue  🟢 positive_root 🖼       07 D PairSlots  🟡 count_of_roots
//   03 F MarkAll    🟢 incomplete_marked     08 B Zones      🔴 two_roots_or_none
//   04 G CodeLock   🟡 code_largest_roots    09 C TrueFalse  🔴 incomplete_claims
//   05 H ClozeBank  🟡 rule_words            10 J MatchPairs 🔴 equation_to_roots
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars16.jsx`): b yoki c dan biri nol bo'lsa tenglama
// chala (03, 05, 07, 10); `ax² + c = 0` da ildiz borligi ISHORAGA bog'liq (02,
// 07, 08, 09, 10); `ax² + bx = 0` har doim ikki ildizli va biri nol (01, 04,
// 05, 06, 09, 10).
// Adashishlar: З40 — 02, 07, 09; З41 — 05, 07, 08, 10; З42 — 01, 04, 05, 06,
// 09; З43 — 03. З16 — razborlar ildizni tenglamaga qo'yib tekshiradi.
//
// DARSNING ENG QIMMAT XATOSI HAR JOYDA: ikki tomonni x ga bo'lish x = 0
// ildizini yo'qotadi (З42). U to'rt topshiriqda va bitta qoidada tekshiriladi.
//
// CHIZMA 02 DA (skelet §2): son o'qida nolga simmetrik ikki `?` — `t²` bir
// songa teng bo'lganda ildiz ikkita, savol esa bittasini so'raydi.
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D16_01 from './D16_01.jsx';
import D16_02 from './D16_02.jsx';
import D16_03 from './D16_03.jsx';
import D16_04 from './D16_04.jsx';
import D16_05 from './D16_05.jsx';
import D16_06 from './D16_06.jsx';
import D16_07 from './D16_07.jsx';
import D16_08 from './D16_08.jsx';
import D16_09 from './D16_09.jsx';
import D16_10 from './D16_10.jsx';

const HEAD = {
  uz: 'Dars 16 amaliyoti — 10 topshiriq (chala kvadrat tenglamalar)',
  ru: 'Практика урока 16 — 10 заданий (неполные квадратные уравнения)',
  en: 'Lesson 16 practice — 10 tasks (incomplete quadratic equations)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Ildizlar', ru: 'Корни', en: 'Roots' }, C: D16_01 },
  { id: '02', label: { uz: 'Musbat ildiz', ru: 'Положительный', en: 'Positive root' }, C: D16_02 },
  { id: '03', label: { uz: 'Chala', ru: 'Неполные', en: 'Incomplete' }, C: D16_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D16_04 },
  { id: '05', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D16_05 },
  { id: '06', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D16_06 },
  { id: '07', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D16_07 },
  { id: '08', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D16_08 },
  { id: '09', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D16_09 },
  { id: '10', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D16_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars16Practice({ lang = 'uz' }) {
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
