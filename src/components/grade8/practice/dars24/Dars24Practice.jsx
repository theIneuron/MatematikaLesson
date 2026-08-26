// Dars24 amaliyoti — 10 topshiriq. Mavzu: SONLI TENGSIZLIKLARNING ASOSIY
// XOSSALARI.
//
// Metodist tasdig'i 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §6, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 24-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 sign_claims          06 I SwapOrder  🟡 divide_steps
//   02 A Choice     🟢 multiply_by_negative 07 B Zones      🟡 flip_or_not
//   03 E TypeValue  🟢 bound_after_flip     08 F MarkAll    🔴 correct_conclusion_marked
//   04 G CodeLock   🟡 code_smaller_side    09 J MatchPairs 🔴 operation_to_result
//   05 D PairSlots  🟡 multiplier_to_result 10 H ClozeBank  🔴 rule_words
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars24.jsx`): musbat songa ko'paytirilganda ishora
// o'zgarmaydi (01, 04, 07, 08, 09, 10); manfiy songa ko'paytirilganda
// qarama-qarshisiga o'zgaradi (01, 02, 03, 04, 05, 06, 07, 09, 10); qoida
// bo'lishga ham tegishli (06, 07, 09).
// Darsning matnidagi yana ikki teorema: o'tuvchanlik — 10; ikkala qismga
// bir xil son qo'shish — 08.
// Adashishlar: З52 — 01, 02, 03, 06, 08, 09; З53 — 07, 09, 10;
// З16 — 02, 06 razborlari va 08 dagi kontrprimer.
//
// 05-TOPSHIRIQDA NOLGA KO'PAYTIRISH BOR, VA BU QAROR (skelet §0a.4).
// Darsning teoremalarida nol yo'q; u shu yerda ataylab turadi, chunki
// «musbat yoki manfiy» ikkiligi «uchinchisi yo'q» degan yolg'on to'liqlikni
// yaratadi. Nolda tengsizlik TENGLIKKA aylanadi.
//
// 08-TOPSHIRIQNING ENG QIMMAT KARTASI — `a² > b²`: bu xossa emas, va
// razbor uni bitta kontrprimer bilan rad etadi (a = 1, b = −3).
//
// CHIZMA YO'Q: dars xossalar haqida, son o'qi esa 25-darsdan boshlanadi
// (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D24_01 from './D24_01.jsx';
import D24_02 from './D24_02.jsx';
import D24_03 from './D24_03.jsx';
import D24_04 from './D24_04.jsx';
import D24_05 from './D24_05.jsx';
import D24_06 from './D24_06.jsx';
import D24_07 from './D24_07.jsx';
import D24_08 from './D24_08.jsx';
import D24_09 from './D24_09.jsx';
import D24_10 from './D24_10.jsx';

const HEAD = {
  uz: 'Dars 24 amaliyoti — 10 topshiriq (tengsizliklarning xossalari)',
  ru: 'Практика урока 24 — 10 заданий (свойства неравенств)',
  en: 'Lesson 24 practice — 10 tasks (properties of inequalities)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D24_01 },
  { id: '02', label: { uz: 'Munosabat', ru: 'Отношение', en: 'Relation' }, C: D24_02 },
  { id: '03', label: { uz: 'Chegara', ru: 'Граница', en: 'Bound' }, C: D24_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D24_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D24_05 },
  { id: '06', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D24_06 },
  { id: '07', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D24_07 },
  { id: '08', label: { uz: 'Xulosalar', ru: 'Выводы', en: 'Conclusions' }, C: D24_08 },
  { id: '09', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D24_09 },
  { id: '10', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D24_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars24Practice({ lang = 'uz' }) {
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
