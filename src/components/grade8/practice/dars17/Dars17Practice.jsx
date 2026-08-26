// Dars17 amaliyoti — 10 topshiriq. Mavzu: KVADRAT TENGLAMA ILDIZLARI FORMULASI.
//
// Metodist qarori 2026-08-24: 15-20 darslar 12-14 bilan bir xil qoida bo'yicha.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5, taqsimot §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 17-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 minus_b_marked        06 C TrueFalse  🟡 formula_claims
//   02 A Choice     🟢 roots_by_formula      07 I SwapOrder  🟡 square_steps
//   03 E TypeValue  🟢 find_D                08 J MatchPairs 🔴 equation_to_roots
//   04 B Zones      🟡 perfect_square_zones  09 D PairSlots  🔴 D_pairs
//   05 G CodeLock   🟡 code_D                10 H ClozeBank  🔴 rule_words
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars17.jsx`): to'la kvadratni ajratish usuli (04, 07);
// ildizlar formulasi (02, 06, 07, 08, 10); `b² − 4ac` diskriminant deyiladi
// (03, 05, 06, 09, 10).
// Adashishlar: З44 — 01, 02, 06, 08, 10; З40 — 07, 10; З38 — 10 (maxraj ikki a,
// va a nolga teng bo'lolmaydi); З16 — razborlar ildizni tenglamaga qo'yadi
// yoki D ni qayta hisoblaydi.
//
// UCH JOYDA UCH XIL ISHORA MASALASI: 01 da minus b ning ishorasi, 03 va 09 da
// c ning ishorasi diskriminantga qanday ta'sir qilishi, 06 va 08 da esa
// ikkalasi birga. b ning ishorasi D ga ta'sir qilmaydi (kvadratga oshadi),
// c ning ishorasi esa qiladi — bu farq 09 da ochiq ko'rsatilgan.
//
// CHIZMA YO'Q: dars hisob haqida (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D17_01 from './D17_01.jsx';
import D17_02 from './D17_02.jsx';
import D17_03 from './D17_03.jsx';
import D17_04 from './D17_04.jsx';
import D17_05 from './D17_05.jsx';
import D17_06 from './D17_06.jsx';
import D17_07 from './D17_07.jsx';
import D17_08 from './D17_08.jsx';
import D17_09 from './D17_09.jsx';
import D17_10 from './D17_10.jsx';

const HEAD = {
  uz: 'Dars 17 amaliyoti — 10 topshiriq (kvadrat tenglama ildizlari formulasi)',
  ru: 'Практика урока 17 — 10 заданий (формула корней квадратного уравнения)',
  en: 'Lesson 17 practice — 10 tasks (the formula for the roots)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Minus b', ru: 'Минус b', en: 'Minus b' }, C: D17_01 },
  { id: '02', label: { uz: 'Ildizlar', ru: 'Корни', en: 'Roots' }, C: D17_02 },
  { id: '03', label: { uz: 'Diskriminant', ru: 'Дискриминант', en: 'Discriminant' }, C: D17_03 },
  { id: '04', label: { uz: "To'la kvadrat", ru: 'Полный квадрат', en: 'Perfect square' }, C: D17_04 },
  { id: '05', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D17_05 },
  { id: '06', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D17_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D17_07 },
  { id: '08', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D17_08 },
  { id: '09', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D17_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D17_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars17Practice({ lang = 'uz' }) {
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
