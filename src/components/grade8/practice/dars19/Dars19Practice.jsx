// Dars19 amaliyoti — 10 topshiriq. Mavzu: VIYET TEOREMASI.
//
// Metodist qarori 2026-08-24: 15-20 darslar 12-14 bilan bir xil qoida bo'yicha.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7, taqsimot §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 19-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 reduced_marked    06 I SwapOrder  🟡 vieta_steps
//   02 E TypeValue  🟢 sum_of_roots      07 D PairSlots  🟡 pq_pairs
//   03 C TrueFalse  🟢 vieta_claims      08 A Choice     🔴 find_second_root
//   04 H ClozeBank  🟡 rule_words        09 B Zones      🔴 same_or_different_sign
//   05 G CodeLock   🟡 code_small_roots  10 J MatchPairs 🔴 roots_to_equation
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars19.jsx`): `x² + px + q = 0` keltirilgan tenglama
// (01, 04); `x₁ + x₂ = −p`, `x₁ · x₂ = q` (02, 03, 04, 05, 06, 07, 08, 09,
// 10); munosabatlar teng ildizlarda ham to'g'ri (05, 09).
// Adashishlar: З45 — 02, 03, 04, 07, 08, 10; З46 — 06, 08, 10; З16 —
// razborlar ildizlarni tenglamaga qo'yib tekshiradi.
//
// IKKI QOIDA IKKI XIL ISHLAYDI, va butun dars shu farqda: YIG'INDI ishorani
// almashtiradi (minus p), KO'PAYTMA esa yo'q (q ning o'zi). 03 da ular bitta
// tenglamada yonma-yon turadi, 07 da ko'paytma yordam bermaydi, 09 da esa
// aksincha — faqat ko'paytma hal qiladi.
//
// CHIZMA YO'Q: dars hisob va tanlash haqida (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D19_01 from './D19_01.jsx';
import D19_02 from './D19_02.jsx';
import D19_03 from './D19_03.jsx';
import D19_04 from './D19_04.jsx';
import D19_05 from './D19_05.jsx';
import D19_06 from './D19_06.jsx';
import D19_07 from './D19_07.jsx';
import D19_08 from './D19_08.jsx';
import D19_09 from './D19_09.jsx';
import D19_10 from './D19_10.jsx';

const HEAD = {
  uz: 'Dars 19 amaliyoti — 10 topshiriq (Viyet teoremasi)',
  ru: 'Практика урока 19 — 10 заданий (теорема Виета)',
  en: "Lesson 19 practice — 10 tasks (Vieta's theorem)",
};

const ITEMS = [
  { id: '01', label: { uz: 'Keltirilgan', ru: 'Приведённое', en: 'Reduced' }, C: D19_01 },
  { id: '02', label: { uz: "Yig'indi", ru: 'Сумма', en: 'Sum' }, C: D19_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D19_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D19_04 },
  { id: '05', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D19_05 },
  { id: '06', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D19_06 },
  { id: '07', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D19_07 },
  { id: '08', label: { uz: 'Ikkinchi ildiz', ru: 'Второй корень', en: 'Second root' }, C: D19_08 },
  { id: '09', label: { uz: 'Ishoralar', ru: 'Знаки', en: 'Signs' }, C: D19_09 },
  { id: '10', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D19_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars19Practice({ lang = 'uz' }) {
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
