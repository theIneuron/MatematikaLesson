// Dars38 amaliyoti — 10 topshiriq. Mavzu: TO'G'RI TO'RTBURCHAK, ROMB VA
// KVADRAT.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §10, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 38-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 rhombus_marked        06 G CodeLock   🟡 code_diagonals
//   02 B Zones      🟢 rectangle_or_rhombus  07 I SwapOrder  🟡 square_proof_steps
//   03 E TypeValue  🟢 rhombus_side          08 C TrueFalse  🔴 figure_claims
//   04 H ClozeBank  🟡 rule_words            09 A Choice     🔴 which_conclusion
//   05 D PairSlots  🟡 rhombus_angles        10 J MatchPairs 🔴 condition_to_figure
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars38.jsx`): to'g'ri to'rtburchak — hamma
// burchagi to'g'ri, diagonallari teng (01, 02, 04, 06, 07, 09, 10); romb —
// tomonlari teng, diagonallari perpendikulyar va burchaklarni teng ikkiga
// bo'ladi (01-05, 07, 08, 10); kvadrat ikkovining xossalariga ega
// (01, 06, 07, 08, 10).
// Adashishlar: З79 — 04, 06, 07, 09, 10; З80 — 02, 04, 09, 10;
// З16 — razborlar burchak va tomon qiymatlarini qo'yib tekshiradi.
//
// 08-TOPSHIRIQDA IKKALA JAVOB HAM «HA» (skelet §0a.3): birinchisi T3,
// ikkinchisi T2 ning TESKARI teoremasi. Odatda ikkinchisi rad etiladi,
// chunki u qoidani teskari tomondan o'qiydi.
//
// 01 VA 10-TOPSHIRIQDA CHIZMA. 10 da diagonallar CHIZILGAN, ya'ni shart
// ko'rinib turadi va o'quvchi yodlangan nomni emas, figuraning o'zini
// o'qiydi (skelet §0a.2).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D38_01 from './D38_01.jsx';
import D38_02 from './D38_02.jsx';
import D38_03 from './D38_03.jsx';
import D38_04 from './D38_04.jsx';
import D38_05 from './D38_05.jsx';
import D38_06 from './D38_06.jsx';
import D38_07 from './D38_07.jsx';
import D38_08 from './D38_08.jsx';
import D38_09 from './D38_09.jsx';
import D38_10 from './D38_10.jsx';

const HEAD = {
  uz: "Dars 38 amaliyoti — 10 topshiriq (to'g'ri to'rtburchak, romb, kvadrat)",
  ru: 'Практика урока 38 — 10 заданий (прямоугольник, ромб, квадрат)',
  en: 'Lesson 38 practice — 10 tasks (rectangle, rhombus, square)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Figuralar', ru: 'Фигуры', en: 'Figures' }, C: D38_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D38_02 },
  { id: '03', label: { uz: 'Tomon', ru: 'Сторона', en: 'Side' }, C: D38_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D38_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D38_05 },
  { id: '06', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D38_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D38_07 },
  { id: '08', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D38_08 },
  { id: '09', label: { uz: 'Xulosa', ru: 'Вывод', en: 'Conclusion' }, C: D38_09 },
  { id: '10', label: { uz: 'Chizmalar', ru: 'Рисунки', en: 'Drawings' }, C: D38_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars38Practice({ lang = 'uz' }) {
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
