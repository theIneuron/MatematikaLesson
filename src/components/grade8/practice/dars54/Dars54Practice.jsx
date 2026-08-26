// Dars54 amaliyoti — 10 topshiriq. Mavzu: VEKTORNI SONGA KO'PAYTIRISH.
//
// Metodist tasdig'i 2026-08-25: 51-55 darslar 41-50 bilan bir xil qoida
// bo'yicha. Skelet: DARS51_55_AMALIYOT_SKELET.md §6, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 54-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 collinear_marked    06 E TypeValue  🟡 midline
//   02 C TrueFalse  🟢 scalar_claims       07 G CodeLock   🟡 code_moduli
//   03 B Zones      🟢 same_or_opposite    08 H ClozeBank  🔴 rule_words
//   04 A Choice     🟡 which_length        09 D PairSlots  🔴 identity_to_result
//   05 I SwapOrder  🟡 midpoint_steps      10 J MatchPairs 🔴 k_to_arrow
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars54.jsx`): |k·a| = |k|·|a|, k musbatda
// yo'nalish saqlanadi, manfiyda teskarilanadi (02, 03, 04, 07, 08, 10);
// a va k·a har doim kollinear, hamda uch tenglik (01, 09);
// OC = ½(OA+OB) va o'rta chiziq (05, 06).
// Adashishlar: З114 — 02, 03, 04, 07, 08, 10; З115 — 05, 06;
// З16 — razborlar modulni son bilan tekshiradi.
//
// 02-TOPSHIRIQDA JAVOB «YO'Q, YO'Q» (skelet §0a.1): ikkala da'vo ham
// З114 ning ikki tomoni — biri yo'nalish, biri modul haqida.
//
// BESH TOPSHIRIQDA CHIZMA (01, 03, 05, 06, 10): TIPLAR_AMALIYOT_8SINF.md §7
// geometriya darslarida chizmaga 5-7 pozitsiya talab qiladi. 10-topshiriqda har kadrda a
// siyoh rangida turadi va natija urg'u rangida: manfiy koeffitsiyent
// strelkani teskari burishi shu yerda ko'z bilan ko'rinadi (skelet §0a.2).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D54_01 from './D54_01.jsx';
import D54_02 from './D54_02.jsx';
import D54_03 from './D54_03.jsx';
import D54_04 from './D54_04.jsx';
import D54_05 from './D54_05.jsx';
import D54_06 from './D54_06.jsx';
import D54_07 from './D54_07.jsx';
import D54_08 from './D54_08.jsx';
import D54_09 from './D54_09.jsx';
import D54_10 from './D54_10.jsx';

const HEAD = {
  uz: "Dars 54 amaliyoti — 10 topshiriq (vektorni songa ko'paytirish)",
  ru: 'Практика урока 54 — 10 заданий (умножение вектора на число)',
  en: 'Lesson 54 practice — 10 tasks (multiplying a vector by a number)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Kollinear', ru: 'Коллинеарные', en: 'Collinear' }, C: D54_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D54_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D54_03 },
  { id: '04', label: { uz: 'Modul', ru: 'Модуль', en: 'Modulus' }, C: D54_04 },
  { id: '05', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D54_05 },
  { id: '06', label: { uz: "O'rta chiziq", ru: 'Средняя линия', en: 'Midline' }, C: D54_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D54_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D54_08 },
  { id: '09', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D54_09 },
  { id: '10', label: { uz: 'Chizmalar', ru: 'Рисунки', en: 'Drawings' }, C: D54_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars54Practice({ lang = 'uz' }) {
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
