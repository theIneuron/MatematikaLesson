// Dars51 amaliyoti — 10 topshiriq. Mavzu: AYLANAGA ICHKI CHIZILGAN BURCHAK.
// Б7 blokining aylana qismi shu dars bilan yakunlanadi.
//
// Metodist tasdig'i 2026-08-25: 51-55 darslar 41-50 bilan bir xil qoida
// bo'yicha. Skelet: DARS51_55_AMALIYOT_SKELET.md §3, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 51-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 half_of_arc          06 C TrueFalse  🟡 inscribed_claims
//   02 E TypeValue  🟢 arc_from_angle       07 I SwapOrder  🟡 inscribed_steps
//   03 F MarkAll    🟢 inscribed_marked     08 G CodeLock   🔴 code_angles
//   04 H ClozeBank  🟡 rule_words           09 J MatchPairs 🔴 arc_to_angle
//   05 B Zones      🟡 pair_right_or_not    10 D PairSlots  🔴 vertex_arc_to_angle
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars51.jsx`): ichki chizilgan burchakning uchi
// aylanada, tomonlari vatar, va u QARAMA-QARSHI yoyga tiraladi (01, 03,
// 04, 07); burchak yoyning yarmi (01, 02, 05, 08, 09, 10); bir yoyga
// tiralganlar teng, diametrga tiralgani to'g'ri (06, 08, 09).
// Adashishlar: З108 — 05, 07, 10; З109 — 01, 04, 05, 06, 08;
// З16 — razborlar javobni yoy bilan qayta tekshiradi.
//
// 06-TOPSHIRIQDA JAVOB «HA, YO'Q» (skelet §0a.1).
//
// BESH TOPSHIRIQDA CHIZMA (01, 03, 06, 07, 10), va bu tasodif emas:
// darsning butun mazmuni «uch qayerda turibdi» va «qaysi yoyga tiraladi»
// degan ikki savolda, ikkalasi ham ko'z bilan hal bo'ladi. 03-topshiriqda
// hamma chiziq SIYOH rangida (`plain`): rang javobni ochib qo'ymasligi
// kerak, ichki va markaziy burchakni faqat geometriya ajratsin.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D51_01 from './D51_01.jsx';
import D51_02 from './D51_02.jsx';
import D51_03 from './D51_03.jsx';
import D51_04 from './D51_04.jsx';
import D51_05 from './D51_05.jsx';
import D51_06 from './D51_06.jsx';
import D51_07 from './D51_07.jsx';
import D51_08 from './D51_08.jsx';
import D51_09 from './D51_09.jsx';
import D51_10 from './D51_10.jsx';

const HEAD = {
  uz: 'Dars 51 amaliyoti — 10 topshiriq (ichki chizilgan burchak)',
  ru: 'Практика урока 51 — 10 заданий (вписанный угол)',
  en: 'Lesson 51 practice — 10 tasks (the inscribed angle)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Yarmi', ru: 'Половина', en: 'A half' }, C: D51_01 },
  { id: '02', label: { uz: 'Yoy', ru: 'Дуга', en: 'Arc' }, C: D51_02 },
  { id: '03', label: { uz: 'Chizmalar', ru: 'Рисунки', en: 'Drawings' }, C: D51_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D51_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D51_05 },
  { id: '06', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D51_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D51_07 },
  { id: '08', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D51_08 },
  { id: '09', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D51_09 },
  { id: '10', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D51_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars51Practice({ lang = 'uz' }) {
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
