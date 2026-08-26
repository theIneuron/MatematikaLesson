// Dars55 amaliyoti — 10 topshiriq. Mavzu: VEKTOR KOORDINATALARI, SKALYAR KO'PAYTMA.
//
// KURSNING OXIRGI AMALIYOTI. Shu dars bilan 8-sinf matematikasining 55
// darsi ham, 550 amaliyot topshirig'i ham to'liq bo'ladi.
//
// Metodist tasdig'i 2026-08-25: 51-55 darslar 41-50 bilan bir xil qoida
// bo'yicha. Skelet: DARS51_55_AMALIYOT_SKELET.md §7, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 55-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 coord_claims      06 J MatchPairs 🟡 vector_to_length
//   02 F MarkAll    🟢 coords_marked     07 H ClozeBank  🟡 rule_words
//   03 A Choice     🟢 which_coords      08 I SwapOrder  🔴 dot_steps
//   04 G CodeLock   🟡 code_dot          09 E TypeValue  🔴 dot_value
//   05 D PairSlots  🟡 op_to_coords      10 B Zones      🔴 number_or_vector
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// AMALIYOT FAQAT 55-DARSNING TASDIQLARINI TEKSHIRADI (metodist qarori
// 2026-08-25, skelet §0a.5): rejada darsning yonida «итоговое повторение
// курса» yozilgan bo'lsa ham, amaliyot darsdan chetga chiqmaydi.
//
// Darsning tasdiqlari (`Dars55.jsx`): AB koordinatalari oxiridan boshini
// ayirish (02, 03, 07); amallar mos koordinatalar ustida (05, 06);
// skalyar ko'paytma SON, |a| = ildiz(x²+y²) (01, 04, 06, 07, 08, 09, 10).
// Adashishlar: З116 — 02, 03, 07; З117 — 01, 07, 08, 10;
// З16 — razborlar koordinatalarni qo'shib qaytadan tekshiradi.
//
// 01-TOPSHIRIQDA JAVOB «HA, HA» (skelet §0a.1): ikkinchi da'vo qimmat,
// chunki javob SON bo'lgani uni xato qilib ko'rsatadi.
//
// 10-TOPSHIRIQ KURSNING OXIRGISI, va bu ataylab: butun yil davomida
// o'quvchi vektorni figura deb o'rgandi, oxirgi ekranda esa vektor amali
// SON berishi mumkinligini ajratadi.
//
// BESH TOPSHIRIQDA CHIZMA (02, 03, 05, 09, 10), hammasida KOORDINATA TO'RI:
// koordinatalar sanalib tekshiriladi, ishoralar esa yo'nalishdan ko'rinadi.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D55_01 from './D55_01.jsx';
import D55_02 from './D55_02.jsx';
import D55_03 from './D55_03.jsx';
import D55_04 from './D55_04.jsx';
import D55_05 from './D55_05.jsx';
import D55_06 from './D55_06.jsx';
import D55_07 from './D55_07.jsx';
import D55_08 from './D55_08.jsx';
import D55_09 from './D55_09.jsx';
import D55_10 from './D55_10.jsx';

const HEAD = {
  uz: "Dars 55 amaliyoti — 10 topshiriq (vektor koordinatalari, skalyar ko'paytma)",
  ru: 'Практика урока 55 — 10 заданий (координаты вектора, скалярное произведение)',
  en: 'Lesson 55 practice — 10 tasks (vector coordinates, the dot product)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D55_01 },
  { id: '02', label: { uz: 'Yozuvlar', ru: 'Записи', en: 'Records' }, C: D55_02 },
  { id: '03', label: { uz: 'Koordinatalar', ru: 'Координаты', en: 'Coordinates' }, C: D55_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D55_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D55_05 },
  { id: '06', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D55_06 },
  { id: '07', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D55_07 },
  { id: '08', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D55_08 },
  { id: '09', label: { uz: 'Skalyar', ru: 'Скалярное', en: 'Dot product' }, C: D55_09 },
  { id: '10', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D55_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars55Practice({ lang = 'uz' }) {
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
