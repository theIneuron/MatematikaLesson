// Dars37 amaliyoti — 10 topshiriq. Mavzu: PARALLELOGRAMM VA UNING
// XOSSALARI. Б6 blokining birinchi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §9, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 37-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 parallelogram_claims  06 E TypeValue  🟡 neighbour_side
//   02 F MarkAll    🟢 parallelogram_marked  07 G CodeLock   🟡 code_angles
//   03 B Zones      🟢 always_or_not         08 A Choice     🔴 which_definition
//   04 J MatchPairs 🟡 angle_to_neighbour    09 I SwapOrder  🔴 proof_steps
//   05 H ClozeBank  🟡 rule_words            10 D PairSlots  🔴 diagonal_to_half
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars37.jsx`): ta'rif — qarama-qarshi tomonlar
// parallel (02, 03, 05, 08); qarama-qarshi tomonlar va burchaklar teng
// (03, 04, 05, 06, 09); diagonallar teng ikkiga bo'linadi va qo'shni
// burchaklar 180 gacha to'ldiradi (01, 03, 05, 07, 10).
// Adashishlar: З75 — 02, 03, 05, 08; З76 — 03, 04, 05, 07;
// З77 — 01, 03, 08, 10; З78 — 09; З16 — razborlar burchaklar yig'indisini
// 360 gacha qo'shib tekshiradi.
//
// 01-TOPSHIRIQDA JAVOB «YO'Q, HA» (skelet §0a.3).
//
// 02-TOPSHIRIQDA BIRINCHI CHIZMA. `fig.jsx` ga `poly` turi metodist
// ruxsati bilan qo'shildi (skelet §0a.2): ta'rifni so'z bilan tekshirish
// uni yodlatadi, chizma bilan tekshirish esa ko'rsatadi. Chizmada hech
// qanday belgi yo'q — figura faqat SHAKLI bilan hukm qilinadi, aks holda
// javob oldindan aytilgan bo'lardi.
//
// 08-TOPSHIRIQNING VARIANTLARI SO'Z BILAN: `Choice` ning `label` i massiv
// bo'lmasa `tr()` dan o'tadi, ya'ni u uch tilda ham to'g'ri chiqadi. Qolgan
// mexanikalarning kartalari tarjima qilinmaydi (skelet §0a.5).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D37_01 from './D37_01.jsx';
import D37_02 from './D37_02.jsx';
import D37_03 from './D37_03.jsx';
import D37_04 from './D37_04.jsx';
import D37_05 from './D37_05.jsx';
import D37_06 from './D37_06.jsx';
import D37_07 from './D37_07.jsx';
import D37_08 from './D37_08.jsx';
import D37_09 from './D37_09.jsx';
import D37_10 from './D37_10.jsx';

const HEAD = {
  uz: 'Dars 37 amaliyoti — 10 topshiriq (parallelogramm)',
  ru: 'Практика урока 37 — 10 заданий (параллелограмм)',
  en: 'Lesson 37 practice — 10 tasks (the parallelogram)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D37_01 },
  { id: '02', label: { uz: 'Figuralar', ru: 'Фигуры', en: 'Figures' }, C: D37_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D37_03 },
  { id: '04', label: { uz: 'Burchaklar', ru: 'Углы', en: 'Angles' }, C: D37_04 },
  { id: '05', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D37_05 },
  { id: '06', label: { uz: 'Tomon', ru: 'Сторона', en: 'Side' }, C: D37_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D37_07 },
  { id: '08', label: { uz: "Ta'rif", ru: 'Определение', en: 'Definition' }, C: D37_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D37_09 },
  { id: '10', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D37_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars37Practice({ lang = 'uz' }) {
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
