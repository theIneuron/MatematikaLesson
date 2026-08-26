// Dars52 amaliyoti — 10 topshiriq. Mavzu: ICHKI VA TASHQI CHIZILGAN AYLANALAR.
// Б7 blokining aylana qismi shu dars bilan tugaydi, keyin vektorlar boshlanadi.
//
// Metodist tasdig'i 2026-08-25: 51-55 darslar 41-50 bilan bir xil qoida
// bo'yicha. Skelet: DARS51_55_AMALIYOT_SKELET.md §4, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 52-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 inscribed_angles_marked  06 J MatchPairs 🟡 quad_to_opposite_angle
//   02 B Zones      🟢 circumscribed_sides      07 G CodeLock   🟡 code_three
//   03 C TrueFalse  🟢 circle_claims            08 H ClozeBank  🔴 rule_words
//   04 E TypeValue  🟡 radius_from_hypotenuse   09 D PairSlots  🔴 fourth_side
//   05 A Choice     🟡 which_centre             10 I SwapOrder  🔴 inscribed_circle_steps
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars52.jsx`): ichki aylananing markazi
// BISSEKTRISALAR kesishgan nuqta (03, 05, 08, 10); tashqi aylananiki
// O'RTA PERPENDIKULYARLAR, to'g'ri burchaklida gipotenuzaning o'rtasi va
// R = gipotenuza : 2 (03, 04, 07, 08); ichki chizilgan to'rtburchakning
// qarama-qarshi burchaklari 180° ni to'ldiradi, tashqi chizilganning
// qarama-qarshi tomonlari YIG'INDILARI teng (01, 02, 06, 07, 08, 09).
// Adashishlar: З110 — 05, 08, 10; З111 — 02, 07, 08, 09;
// З16 — razborlar yig'indini qayta hisoblaydi.
//
// 03-TOPSHIRIQDA JAVOB «HA, HA» (skelet §0a.1): ikkala da'vo ham rost, va
// aynan «har qanday» degan so'z shubha uyg'otadi.
//
// OLTI TOPSHIRIQDA CHIZMA (01, 03, 04, 05, 09, 10). 02-topshiriqda chizma
// bor edi, lekin telefonda unga joy qolmadi va o'chirildi: o'sha figura
// 09-topshiriqda to'liq o'lchamda turadi. Metodist topshirig'i
// 2026-08-25: «chizma talab qilinadigan darslarda misollarga chizma
// qo'shaver». Bu darsda chizma ikki ishni qiladi: «ichki» va «tashqi»
// degan ikki iborani ajratadi (aylana ICHKARIDAMI yoki uchlar aylanadami),
// va 05 bilan 10 da bissektrisalarni punktir bilan ko'rsatadi.
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D52_01 from './D52_01.jsx';
import D52_02 from './D52_02.jsx';
import D52_03 from './D52_03.jsx';
import D52_04 from './D52_04.jsx';
import D52_05 from './D52_05.jsx';
import D52_06 from './D52_06.jsx';
import D52_07 from './D52_07.jsx';
import D52_08 from './D52_08.jsx';
import D52_09 from './D52_09.jsx';
import D52_10 from './D52_10.jsx';

const HEAD = {
  uz: 'Dars 52 amaliyoti — 10 topshiriq (ichki va tashqi chizilgan aylanalar)',
  ru: 'Практика урока 52 — 10 заданий (вписанная и описанная окружности)',
  en: 'Lesson 52 practice — 10 tasks (the inscribed and circumscribed circles)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Burchaklar', ru: 'Углы', en: 'Angles' }, C: D52_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D52_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D52_03 },
  { id: '04', label: { uz: 'Radius', ru: 'Радиус', en: 'Radius' }, C: D52_04 },
  { id: '05', label: { uz: 'Markaz', ru: 'Центр', en: 'Centre' }, C: D52_05 },
  { id: '06', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D52_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D52_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D52_08 },
  { id: '09', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D52_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D52_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars52Practice({ lang = 'uz' }) {
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
