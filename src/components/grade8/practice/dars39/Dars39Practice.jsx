// Dars39 amaliyoti — 10 topshiriq. Mavzu: TRAPETSIYA VA UNING XOSSALARI.
//
// Metodist tasdig'i 2026-08-25: 31-40 darslar 21-30 bilan bir xil qoida
// bo'yicha. Skelet: DARS31_40_AMALIYOT_SKELET.md §11, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 39-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 which_definition      06 B Zones      🟡 trapezoid_or_not
//   02 E TypeValue  🟢 fourth_angle          07 H ClozeBank  🟡 rule_words
//   03 C TrueFalse  🟢 trapezoid_claims      08 D PairSlots  🔴 angle_to_neighbour
//   04 F MarkAll    🟡 trapezoid_marked      09 J MatchPairs 🔴 three_angles_to_fourth
//   05 I SwapOrder  🟡 isosceles_steps       10 G CodeLock   🔴 code_trapezoid_angles
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars39.jsx`): ta'rif — bir juft parallel, ikkinchi
// juft parallel emas (01, 03, 04, 06, 07); bir burchak to'g'ri bo'lsa
// o'sha yon tomondagi qo'shnisi ham to'g'ri (08, 09, 10); teng yonli
// trapetsiyaning asosidagi burchaklari teng (05, 07, 09, 10).
// Adashishlar: З81 — 01, 03, 04, 06, 07; З82 — 08, 09, 10;
// З16 — razborlar to'rt burchakni 360 gacha qo'shib tekshiradi.
//
// 03-TOPSHIRIQDA IKKALA JAVOB HAM «YO'Q» (skelet §0a.3), va sabablari
// boshqa: birinchisi turni oilaga yoyadi, ikkinchisi esa ta'rifning o'zini
// buzadi — asoslari teng trapetsiya umuman mavjud emas.
//
// 04-TOPSHIRIQDA CHIZMA: olti figura, uchtasi trapetsiya — oddiy, to'g'ri
// burchakli va teng yonli. Uchalasi ham bitta ta'rifga bo'ysunadi, lekin
// boshqacha ko'rinadi, va shu sababli ular birga turadi (skelet §0a.2).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D39_01 from './D39_01.jsx';
import D39_02 from './D39_02.jsx';
import D39_03 from './D39_03.jsx';
import D39_04 from './D39_04.jsx';
import D39_05 from './D39_05.jsx';
import D39_06 from './D39_06.jsx';
import D39_07 from './D39_07.jsx';
import D39_08 from './D39_08.jsx';
import D39_09 from './D39_09.jsx';
import D39_10 from './D39_10.jsx';

const HEAD = {
  uz: 'Dars 39 amaliyoti — 10 topshiriq (trapetsiya)',
  ru: 'Практика урока 39 — 10 заданий (трапеция)',
  en: 'Lesson 39 practice — 10 tasks (the trapezoid)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ta'rif", ru: 'Определение', en: 'Definition' }, C: D39_01 },
  { id: '02', label: { uz: 'Burchak', ru: 'Угол', en: 'Angle' }, C: D39_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D39_03 },
  { id: '04', label: { uz: 'Figuralar', ru: 'Фигуры', en: 'Figures' }, C: D39_04 },
  { id: '05', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D39_05 },
  { id: '06', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D39_06 },
  { id: '07', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D39_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D39_08 },
  { id: '09', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D39_09 },
  { id: '10', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D39_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars39Practice({ lang = 'uz' }) {
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
