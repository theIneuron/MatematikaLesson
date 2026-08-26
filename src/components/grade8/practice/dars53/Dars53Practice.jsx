// Dars53 amaliyoti — 10 topshiriq. Mavzu: VEKTOR TUSHUNCHASI, QO'SHISH VA AYIRISH.
// Б7 blokining vektor qismi shu darsdan boshlanadi.
//
// Metodist tasdig'i 2026-08-25: 51-55 darslar 41-50 bilan bir xil qoida
// bo'yicha. Skelet: DARS51_55_AMALIYOT_SKELET.md §5, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 53-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 which_equal            06 D PairSlots  🟡 chain_to_vector
//   02 B Zones      🟢 equal_or_not           07 E TypeValue  🟡 sum_length
//   03 F MarkAll    🟢 triangle_rule_marked   08 C TrueFalse  🔴 vector_claims
//   04 J MatchPairs 🟡 expr_to_vector         09 G CodeLock   🔴 code_results
//   05 H ClozeBank  🟡 rule_words             10 I SwapOrder  🔴 difference_steps
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars53.jsx`): vektor yo'nalishga ega kesma, teng
// vektorlarning joylashuvi ahamiyatsiz (01, 02, 05, 08); uchburchak
// qoidasi va qarama-qarshi vektor (03, 04, 06, 07, 08, 09, 10);
// OA − OB = BA (04, 06, 09, 10).
// Adashishlar: З112 — 01, 02, 05, 08; З113 — 04, 06, 09, 10;
// З16 — razborlar natijani harflar bo'yicha qayta yozib tekshiradi.
//
// 08-TOPSHIRIQDA JAVOB «YO'Q, HA» (skelet §0a.1).
//
// BESH TOPSHIRIQDA CHIZMA (01, 02, 03, 07, 10). Vektor — YO'NALISHGA ega
// kesma, ya'ni strelkasiz u shunchaki kesma bo'lib qoladi va darsning
// butun mavzusi yo'qoladi. З112 («teng vektorlar bir nuqtadan chiqishi
// kerak») faqat chizmada rad etiladi: 02-topshiriqda to'rt teng strelka
// kadrning to'rt boshqa joyida turadi (skelet §0a.2).
//
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D53_01 from './D53_01.jsx';
import D53_02 from './D53_02.jsx';
import D53_03 from './D53_03.jsx';
import D53_04 from './D53_04.jsx';
import D53_05 from './D53_05.jsx';
import D53_06 from './D53_06.jsx';
import D53_07 from './D53_07.jsx';
import D53_08 from './D53_08.jsx';
import D53_09 from './D53_09.jsx';
import D53_10 from './D53_10.jsx';

const HEAD = {
  uz: "Dars 53 amaliyoti — 10 topshiriq (vektor, qo'shish va ayirish)",
  ru: 'Практика урока 53 — 10 заданий (вектор, сложение и вычитание)',
  en: 'Lesson 53 practice — 10 tasks (the vector, addition and subtraction)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Teng vektor', ru: 'Равный', en: 'Equal' }, C: D53_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D53_02 },
  { id: '03', label: { uz: 'Yozuvlar', ru: 'Записи', en: 'Records' }, C: D53_03 },
  { id: '04', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D53_04 },
  { id: '05', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D53_05 },
  { id: '06', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D53_06 },
  { id: '07', label: { uz: 'Uzunlik', ru: 'Длина', en: 'Length' }, C: D53_07 },
  { id: '08', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D53_08 },
  { id: '09', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D53_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D53_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars53Practice({ lang = 'uz' }) {
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
