// Dars43 amaliyoti — 10 topshiriq. Mavzu: FALYES TEOREMASI, UCHBURCHAK VA
// TRAPETSIYANING O'RTA CHIZIG'I. Б6 blokining so'nggi amaliyoti.
//
// Metodist tasdig'i 2026-08-25: 41-50 darslar 1-darsning o'nta mexanikasida,
// har darsda boshqa ketma-ketlikda. Skelet: DARS41_50_AMALIYOT_SKELET.md §5,
// taqsimot §1, tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 43-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 midline_marked       06 D PairSlots  🟡 midline_back
//   02 A Choice     🟢 thales_condition     07 E TypeValue  🟡 second_base
//   03 C TrueFalse  🟢 midline_claims       08 B Zones      🔴 midline_groups
//   04 H ClozeBank  🟡 rule_words           09 G CodeLock   🔴 code_midlines
//   05 I SwapOrder  🟡 split_steps          10 J MatchPairs 🔴 mixed_midlines
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars43.jsx`): T1 — Falyes teoremasi (02, 05, 09);
// T2 — uchburchakning o'rta chizig'i uchinchi tomonga parallel va uning yarmi
// (01, 03, 04, 06, 08, 09, 10); T3 — trapetsiyaning o'rta chizig'i asoslar
// yig'indisining yarmi (06, 07, 08, 09, 10).
// Adashishlar: З89 — 02, 05; З90 — 03, 04, 07, 08, 09;
// З16 — razborlar javobni son bilan tekshiradi.
//
// 03-TOPSHIRIQDA JAVOB «YO'Q, YO'Q» (skelet §0a.1): ikkala da'vo ham yolg'on
// va ular З90 ning ikki tomonini ko'rsatadi — yarim yo'q, va yarim noto'g'ri
// tomonda.
//
// 01-TOPSHIRIQDA CHIZMA: olti uchburchak, har birida bitta kesma
// (`fig.jsx` -> `poly`, `segs`). Shtrix qo'yilmadi — sabab faylning ichida
// yozilgan: `ticks` tomonning tengligini bildiradi, o'rta nuqtani emas.
// Shuning uchun rad etilgan kesmalarning uchlari CHORAK nuqtalarda.
//
// 02 ning variantlari, 04 ning kartalari va 10 ning chap ustuni SO'Z BILAN
// (`Choice`, `ClozeBank`, `MatchPairs` ning `items[].label` i `L()` oladi).
// Qolgan mexanikalarning kartalari tarjima qilinmaydi (skelet §0a.4).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D43_01 from './D43_01.jsx';
import D43_02 from './D43_02.jsx';
import D43_03 from './D43_03.jsx';
import D43_04 from './D43_04.jsx';
import D43_05 from './D43_05.jsx';
import D43_06 from './D43_06.jsx';
import D43_07 from './D43_07.jsx';
import D43_08 from './D43_08.jsx';
import D43_09 from './D43_09.jsx';
import D43_10 from './D43_10.jsx';

const HEAD = {
  uz: "Dars 43 amaliyoti — 10 topshiriq (Falyes teoremasi, o'rta chiziq)",
  ru: 'Практика урока 43 — 10 заданий (теорема Фалеса, средняя линия)',
  en: 'Lesson 43 practice — 10 tasks (the Thales theorem, the midline)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Figuralar', ru: 'Фигуры', en: 'Figures' }, C: D43_01 },
  { id: '02', label: { uz: 'Test', ru: 'Тест', en: 'Test' }, C: D43_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D43_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D43_04 },
  { id: '05', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D43_05 },
  { id: '06', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D43_06 },
  { id: '07', label: { uz: 'Asos', ru: 'Основание', en: 'Base' }, C: D43_07 },
  { id: '08', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D43_08 },
  { id: '09', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D43_09 },
  { id: '10', label: { uz: 'Juftlash', ru: 'Сопоставление', en: 'Matching' }, C: D43_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars43Practice({ lang = 'uz' }) {
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
