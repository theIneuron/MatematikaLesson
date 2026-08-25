// Dars14 amaliyoti — 10 topshiriq. Mavzu: IRRATSIONAL SONLAR.
//
// Metodist qarori 2026-08-24: 12-14 darslarning har biri 1-DARSNING o'nta
// mexanikasidan foydalanadi, lekin har darsda ketma-ketlik boshqacha.
// Taqsimot: DARS12_14_AMALIYOT_SKELET.md §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 14-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 rational_marked        06 B Zones      🟡 rational_or_irrational
//   02 A Choice     🟢 which_irrational       07 D PairSlots  🟡 exact_and_near 🖼
//   03 C TrueFalse  🟢 record_claims          08 E TypeValue  🔴 count_finite
//   04 G CodeLock   🟡 code_rational_roots    09 I SwapOrder  🔴 proof_steps
//   05 H ClozeBank  🟡 rule_words             10 J MatchPairs 🔴 fact_to_number
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars14.jsx`): kasr ko'rinishida yozilgan son ratsional
// (01, 05, 06, 08, 10); onli yozuvi tugaydi yoki takrorlanadi (03, 05, 06, 08,
// 10); yozuvi tugamaydigan va takrorlanmaydigan son irratsional (02, 04, 06,
// 07, 09).
// Adashishlar: З35 — 01, 03, 05, 06; З36 — 01, 02, 04, 06, 10; З37 — 06 va 07;
// З34 — 03. З16 — razborlar javobni kvadratga oshirib tekshiradi.
//
// CHIZMA BITTA JOYDA — 07 (skelet §2): son o'qida ikkidan ildizning joyi `?`
// bilan turadi. Sabab: darsning mavzusi yozuvi tugamaydigan son, va so'z
// bilan aytilganda bu «yo'q narsa» bo'lib ko'rinadi; o'qda esa nuqta BOR va
// yaqinlashish uning QO'SHNISI ekani ko'rinadi. Render — `practice/fig.jsx`
// ning `axis` speci, chizma `given` qatorida.
//
// `√2` darsda uch marta uchraydi — 01 da karta, 07 da yaqinlashish juftligi,
// 09 da isbotning obyekti. Bu ataylab: mavzuning O'ZI shu sonni belgilagan
// (skelet §5, 7-darsdagi k bilan bir xil holat).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D14_01 from './D14_01.jsx';
import D14_02 from './D14_02.jsx';
import D14_03 from './D14_03.jsx';
import D14_04 from './D14_04.jsx';
import D14_05 from './D14_05.jsx';
import D14_06 from './D14_06.jsx';
import D14_07 from './D14_07.jsx';
import D14_08 from './D14_08.jsx';
import D14_09 from './D14_09.jsx';
import D14_10 from './D14_10.jsx';

const HEAD = {
  uz: 'Dars 14 amaliyoti — 10 topshiriq (irratsional sonlar)',
  ru: 'Практика урока 14 — 10 заданий (иррациональные числа)',
  en: 'Lesson 14 practice — 10 tasks (irrational numbers)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D14_01 },
  { id: '02', label: { uz: 'Qaysi son', ru: 'Какое число', en: 'Which number' }, C: D14_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D14_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D14_04 },
  { id: '05', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D14_05 },
  { id: '06', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D14_06 },
  { id: '07', label: { uz: 'Aniq va yaqin', ru: 'Точное и близкое', en: 'Exact and near' }, C: D14_07 },
  { id: '08', label: { uz: 'Nechta', ru: 'Сколько', en: 'How many' }, C: D14_08 },
  { id: '09', label: { uz: 'Isbot', ru: 'Доказательство', en: 'Proof' }, C: D14_09 },
  { id: '10', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D14_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars14Practice({ lang = 'uz' }) {
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
