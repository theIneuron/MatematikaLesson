// Dars46 amaliyoti — 10 topshiriq. Mavzu: TOMONLARIGA KO'RA BALANDLIK,
// GERON FORMULASI. Б7 blokining uchinchi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §8,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 46-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 semi_perimeter_marked 06 E TypeValue  🟡 height_from_area
//   02 A Choice     🟢 when_heron            07 I SwapOrder  🟡 heron_steps
//   03 B Zones      🟢 same_p_groups         08 H ClozeBank  🔴 rule_words
//   04 D PairSlots  🟡 p_minus_side          09 G CodeLock   🔴 code_heron
//   05 J MatchPairs 🟡 sides_to_area         10 C TrueFalse  🔴 heron_claims
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars46.jsx`): T1 — p = (a+b+c) : 2 (01, 03, 04, 07,
// 08, 09, 10); T2 — katta tomonga kichik balandlik mos keladi (06, 08, 09,
// 10); T3 — Geron formulasi uchala tomon ma'lum bo'lganda (02, 05, 07, 09).
// Adashishlar: З97 — 01, 02, 03, 07, 08, 09, 10; З98 — 08, 10;
// З16 — 05, 06, 09 butunlay hisobga tayanadi.
//
// 10-TOPSHIRIQDA JAVOB «YO'Q, YO'Q» (skelet §0a.1). Bu yerda ikkala yolg'on
// da'vo IKKI xil adashish (З97 va З98) — darsning ikki qoq xatosi bir ekranda
// yonma-yon turadi, va razbor har birini alohida son bilan rad etadi.
//
// FORMULANI KELTIRIB CHIQARISH SO'RALMAYDI: darslikning 102-betdagi eslatmasi
// bo'yicha u iqtidorli o'quvchilar uchun, hamma esa formula bo'yicha
// HISOBLASHNI bilishi shart. Shuning uchun 07-topshiriq isbotni emas,
// hisobning tartibini tekshiradi.
//
// 05 va 06 BIR UCHBURCHAKDA davom etadi (10, 17, 21): avval Geron formulasi
// bilan yuza, keyin yuzadan balandlik. 09 da uchta savol ham bir uchburchak
// haqida va ikkinchisi uchinchisining natijasini talab qiladi.
//
// 02 ning variantlari va 08 ning kartalari SO'Z BILAN (`Choice` va
// `ClozeBank` `L()` oladi). Qolgan mexanikalarning kartalari tarjima
// qilinmaydi (skelet §0a.4).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D46_01 from './D46_01.jsx';
import D46_02 from './D46_02.jsx';
import D46_03 from './D46_03.jsx';
import D46_04 from './D46_04.jsx';
import D46_05 from './D46_05.jsx';
import D46_06 from './D46_06.jsx';
import D46_07 from './D46_07.jsx';
import D46_08 from './D46_08.jsx';
import D46_09 from './D46_09.jsx';
import D46_10 from './D46_10.jsx';

const HEAD = {
  uz: 'Dars 46 amaliyoti — 10 topshiriq (Geron formulasi)',
  ru: 'Практика урока 46 — 10 заданий (формула Герона)',
  en: 'Lesson 46 practice — 10 tasks (Heron formula)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D46_01 },
  { id: '02', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D46_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D46_03 },
  { id: '04', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D46_04 },
  { id: '05', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D46_05 },
  { id: '06', label: { uz: 'Balandlik', ru: 'Высота', en: 'Height' }, C: D46_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D46_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D46_08 },
  { id: '09', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D46_09 },
  { id: '10', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D46_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars46Practice({ lang = 'uz' }) {
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
