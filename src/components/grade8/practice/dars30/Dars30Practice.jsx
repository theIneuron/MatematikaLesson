// Dars30 amaliyoti — 10 topshiriq. Mavzu: TAQRIBIY HISOBLASHLAR VA
// XATOLIKLAR.
//
// Metodist tasdig'i 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §12, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 30-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 error_claims        06 G CodeLock   🟡 code_bounds
//   02 F MarkAll    🟢 in_range_marked     07 D PairSlots  🟡 record_to_lower
//   03 A Choice     🟢 round_direction     08 J MatchPairs 🔴 measure_to_relative
//   04 H ClozeBank  🟡 rule_words          09 I SwapOrder  🔴 compare_precision_steps
//   05 B Zones      🟡 absolute_or_relative 10 E TypeValue 🔴 relative_percent
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// 30-DARS YOLG'IZ QATOR: 21-30 uch uchlikka (21-23, 24-26, 27-29) va bitta
// darsga bo'lingan — o'nta dars uchtaga bo'linmaydi, guruh esa uchtadan
// katta bo'lolmaydi. Shu sababli 30-darsning tartibi qolgan hamma darsdan
// kamida SAKKIZ pozitsiyada farq qiladi (umumiy talab oltita edi).
//
// Darsning tasdiqlari (`Dars30.jsx`): |x − a| absolut xatolik (01, 04, 05);
// x = a ± h yozuvi qo'sh tengsizlik beradi (02, 06, 07); nisbiy xatolik
// aniqlikni taqqoslaydi (04, 05, 08, 09, 10).
// Adashishlar: З60 — 04, 05, 08, 09, 10; З61 — 03, 06;
// З16 — 10 va razborlar hisobni qayta bajaradi.
//
// 05-TOPSHIRIQ SKELETDAN OG'DI, VA SABABI FAYLDA YOZILGAN: skeletda
// kartalarda o'lchov birliklari turardi (`0,02 sm`, `1 kg`), `Zones` esa
// karta matnini tarjima qilmaydi. Kartalar YOZUV SHAKLI bilan ajratildi —
// nisbiy xatolikda bo'lish bor, absolut xatolikda yo'q.
//
// 08-TOPSHIRIQ DARSNING O'ZAGI: to'rt o'lchovda absolut xatolik BITTA,
// nisbiysi esa o'n foizdan yarim foizgacha — ya'ni aniqlik yigirma barobar
// farq qiladi.
//
// CHIZMA YO'Q: dars hisob va yozuv haqida (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D30_01 from './D30_01.jsx';
import D30_02 from './D30_02.jsx';
import D30_03 from './D30_03.jsx';
import D30_04 from './D30_04.jsx';
import D30_05 from './D30_05.jsx';
import D30_06 from './D30_06.jsx';
import D30_07 from './D30_07.jsx';
import D30_08 from './D30_08.jsx';
import D30_09 from './D30_09.jsx';
import D30_10 from './D30_10.jsx';

const HEAD = {
  uz: 'Dars 30 amaliyoti — 10 topshiriq (taqribiy hisoblashlar va xatoliklar)',
  ru: 'Практика урока 30 — 10 заданий (приближённые вычисления и погрешности)',
  en: 'Lesson 30 practice — 10 tasks (approximate calculations and errors)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D30_01 },
  { id: '02', label: { uz: 'Mumkin', ru: 'Возможно', en: 'Possible' }, C: D30_02 },
  { id: '03', label: { uz: 'Yaxlitlash', ru: 'Округление', en: 'Rounding' }, C: D30_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D30_04 },
  { id: '05', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D30_05 },
  { id: '06', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D30_06 },
  { id: '07', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D30_07 },
  { id: '08', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D30_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D30_09 },
  { id: '10', label: { uz: 'Nisbiy xatolik', ru: 'Относительная', en: 'Relative' }, C: D30_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars30Practice({ lang = 'uz' }) {
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
