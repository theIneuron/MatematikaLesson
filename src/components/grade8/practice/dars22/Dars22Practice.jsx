// Dars22 amaliyoti — 10 topshiriq. Mavzu: KO'PAYTUVCHILARGA AJRATISH VA
// BIKVADRAT TENGLAMALAR.
//
// Metodist tasdig'i 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §4, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 22-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 factored_form       06 G CodeLock   🟡 code_root_counts
//   02 B Zones      🟢 t_possible          07 C TrueFalse  🟡 factor_claims
//   03 E TypeValue  🟢 count_roots         08 I SwapOrder  🔴 biquad_steps
//   04 D PairSlots  🟡 t_to_x_count        09 J MatchPairs 🔴 biquad_to_roots
//   05 F MarkAll    🟡 biquadratic_marked  10 H ClozeBank  🔴 rule_words
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars22.jsx`): uchhad a(x − x₁)(x − x₂) ko'rinishida
// yoziladi (01, 07, 10); bikvadrat tenglama x² = t belgilash bilan kvadratga
// keladi (03, 05, 06, 08, 09, 10); manfiy t dan haqiqiy x topilmaydi
// (02, 04, 06, 09, 10).
// Adashishlar: З38 — 07, 10; З40 — 03, 04, 08, 09; З46 — 01, 09;
// З48 — 02, 04, 06, 09, 10; З16 — razborlar ildizni tenglamaga qo'yadi.
//
// 02 VA 04 BIR MAVZUNI IKKI CHUQURLIKDA TEKSHIRADI: 02 da savol
// «x topiladimi», 04 da esa «nechta x» — ya'ni plyus-minus va nol holi
// faqat ikkinchisida ochiladi.
//
// 05 VA 09 DA 16-DARS QAYTADI: chala tenglama (`x⁴ − 16 = 0`, `x⁴ − 9x² = 0`)
// va yo'qolib ketadigan nol ildiz.
//
// CHIZMA YO'Q: dars yozuv va belgilash haqida (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D22_01 from './D22_01.jsx';
import D22_02 from './D22_02.jsx';
import D22_03 from './D22_03.jsx';
import D22_04 from './D22_04.jsx';
import D22_05 from './D22_05.jsx';
import D22_06 from './D22_06.jsx';
import D22_07 from './D22_07.jsx';
import D22_08 from './D22_08.jsx';
import D22_09 from './D22_09.jsx';
import D22_10 from './D22_10.jsx';

const HEAD = {
  uz: "Dars 22 amaliyoti — 10 topshiriq (ko'paytuvchilar va bikvadrat tenglamalar)",
  ru: 'Практика урока 22 — 10 заданий (множители и биквадратные уравнения)',
  en: 'Lesson 22 practice — 10 tasks (factoring and biquadratic equations)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ko'paytuvchilar", ru: 'Множители', en: 'Factors' }, C: D22_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D22_02 },
  { id: '03', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D22_03 },
  { id: '04', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D22_04 },
  { id: '05', label: { uz: 'Bikvadrat', ru: 'Биквадратные', en: 'Biquadratic' }, C: D22_05 },
  { id: '06', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D22_06 },
  { id: '07', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D22_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D22_08 },
  { id: '09', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D22_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D22_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars22Practice({ lang = 'uz' }) {
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
