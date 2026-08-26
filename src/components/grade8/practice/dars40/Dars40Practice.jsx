// Dars40 amaliyoti — 10 topshiriq. Mavzu: PARALLELOGRAMMNING YUZI.
// Б6 blokining yuza qismi shu darsdan boshlanadi.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §12, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 40-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 which_is_height       06 D PairSlots  🟡 base_to_height
//   02 C TrueFalse  🟢 area_claims           07 J MatchPairs 🟡 given_to_unknown
//   03 E TypeValue  🟢 area_value            08 G CodeLock   🔴 code_heights
//   04 B Zones      🟡 enough_or_not         09 H ClozeBank  🔴 rule_words
//   05 I SwapOrder  🟡 area_steps            10 F MarkAll    🔴 same_area_marked
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars40.jsx`): istalgan tomon asos bo'la oladi,
// balandlik esa qarama-qarshi tomongacha bo'lgan masofa (01, 05, 09, 10);
// S = a · h (02-09); boshqa asosda balandlik boshqacha, yuza esa
// o'zgarmaydi (06, 08, 09, 10).
// Adashishlar: З83 — 01, 02, 04, 05, 07, 09, 10; З84 — 05, 06, 08, 09;
// З16 — razborlar yuzani teskari amal bilan qayta tekshiradi.
//
// 02-TOPSHIRIQDA JAVOB «HA, YO'Q» (skelet §0a.3).
//
// 40-DARS TAQSIMOTDA YOLG'IZ QATOR (skelet §0a.4): uning tartibi qolgan
// o'ttiz to'qqiz darsdan kamida SAKKIZ pozitsiyada farq qiladi. Qator
// avval tanlangan, 31-39 esa undan uzoqda bo'lish sharti bilan izlangan.
//
// 01 VA 10-TOPSHIRIQDA CHIZMA, va ikkalasi ham chizmasiz ishlamaydi:
// birinchisida balandlikni yon tomondan ajratish kerak, oxirgisida esa
// bir xil asos va balandlikdagi uch figurani qiyalikdan qat'i nazar tanish
// kerak. Ta'rifni so'z bilan tekshirish uni yodlatardi (skelet §0a.2).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D40_01 from './D40_01.jsx';
import D40_02 from './D40_02.jsx';
import D40_03 from './D40_03.jsx';
import D40_04 from './D40_04.jsx';
import D40_05 from './D40_05.jsx';
import D40_06 from './D40_06.jsx';
import D40_07 from './D40_07.jsx';
import D40_08 from './D40_08.jsx';
import D40_09 from './D40_09.jsx';
import D40_10 from './D40_10.jsx';

const HEAD = {
  uz: 'Dars 40 amaliyoti — 10 topshiriq (parallelogrammning yuzi)',
  ru: 'Практика урока 40 — 10 заданий (площадь параллелограмма)',
  en: 'Lesson 40 practice — 10 tasks (the area of a parallelogram)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Balandlik', ru: 'Высота', en: 'Height' }, C: D40_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D40_02 },
  { id: '03', label: { uz: 'Yuza', ru: 'Площадь', en: 'Area' }, C: D40_03 },
  { id: '04', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D40_04 },
  { id: '05', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D40_05 },
  { id: '06', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D40_06 },
  { id: '07', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D40_07 },
  { id: '08', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D40_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D40_09 },
  { id: '10', label: { uz: 'Chizmalar', ru: 'Рисунки', en: 'Drawings' }, C: D40_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars40Practice({ lang = 'uz' }) {
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
