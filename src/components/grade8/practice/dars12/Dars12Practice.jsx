// Dars12 amaliyoti — 10 topshiriq. Mavzu: KO'PAYTMADAN KVADRAT ILDIZ.
//
// Metodist qarori 2026-08-24: 12-14 darslarning har biri 1-DARSNING o'nta
// mexanikasidan foydalanadi, lekin har darsda ketma-ketlik boshqacha.
// Taqsimot: DARS12_14_AMALIYOT_SKELET.md §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 12-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 C TrueFalse  🟢 product_or_sum        06 J MatchPairs 🟡 value_to_record
//   02 E TypeValue  🟢 product_value         07 I SwapOrder  🟡 compute_steps
//   03 B Zones      🟢 splits_or_not         08 F MarkAll    🔴 true_equality_marked
//   04 H ClozeBank  🟡 rule_words            09 A Choice     🔴 which_condition
//   05 D PairSlots  🟡 split_pairs           10 G CodeLock   🔴 code_products
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars12.jsx`): ko'paytmadan ildiz ildizlar
// ko'paytmasiga teng, ikkala ko'paytuvchi nomanfiy bo'lganda (01, 02, 03, 04,
// 05, 07, 09, 10); yig'indi uchun bunday xossa yo'q (01, 04, 08); xossa katta
// sonni qulay ko'paytuvchilarga ajratib hisoblash imkonini beradi (02, 06,
// 07, 10).
// Adashishlar: З4 — 01, 08; З32 — 03, 08, 09; З16 — hamma razbor javobni
// SON bilan rad etadi, tekshirish shakli esa javobni kvadratga oshirish.
//
// CHIZMA YO'Q: bu dars yozuv haqida, va son o'qi bu yerda mexanizmni
// ko'rsatmasdan faqat bezardi (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D12_01 from './D12_01.jsx';
import D12_02 from './D12_02.jsx';
import D12_03 from './D12_03.jsx';
import D12_04 from './D12_04.jsx';
import D12_05 from './D12_05.jsx';
import D12_06 from './D12_06.jsx';
import D12_07 from './D12_07.jsx';
import D12_08 from './D12_08.jsx';
import D12_09 from './D12_09.jsx';
import D12_10 from './D12_10.jsx';

const HEAD = {
  uz: "Dars 12 amaliyoti — 10 topshiriq (ko'paytmadan kvadrat ildiz)",
  ru: 'Практика урока 12 — 10 заданий (квадратный корень из произведения)',
  en: 'Lesson 12 practice — 10 tasks (the square root of a product)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Teng yoki teng emas', ru: 'Равны или нет', en: 'Equal or not' }, C: D12_01 },
  { id: '02', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D12_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D12_03 },
  { id: '04', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D12_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D12_05 },
  { id: '06', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D12_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D12_07 },
  { id: '08', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D12_08 },
  { id: '09', label: { uz: 'Shart', ru: 'Условие', en: 'Condition' }, C: D12_09 },
  { id: '10', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D12_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars12Practice({ lang = 'uz' }) {
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
