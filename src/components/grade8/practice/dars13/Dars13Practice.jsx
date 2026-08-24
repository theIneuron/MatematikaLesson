// Dars13 amaliyoti — 10 topshiriq. Mavzu: ILDIZLI IFODALARNI O'ZGARTIRISH.
//
// Metodist qarori 2026-08-24: 12-14 darslarning har biri 1-DARSNING o'nta
// mexanikasidan foydalanadi, lekin har darsda ketma-ketlik boshqacha.
// Taqsimot: DARS12_14_AMALIYOT_SKELET.md §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 13-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 take_out                 06 H ClozeBank  🟡 rule_words
//   02 B Zones      🟢 same_radicand            07 G CodeLock   🟡 code_coefficients
//   03 F MarkAll    🟢 correct_transform_marked 08 D PairSlots  🔴 out_in_pairs
//   04 C TrueFalse  🟡 add_and_sign             09 E TypeValue  🔴 bring_in
//   05 J MatchPairs 🟡 sum_to_result            10 I SwapOrder  🔴 take_out_steps
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars13.jsx`): ildiz ostidan to'liq kvadrat bo'lgan
// ko'paytuvchini chiqarish mumkin (01, 03, 06, 07, 08, 09, 10); ildizli hadlar
// ildiz ostilari BIR XIL bo'lganda qo'shiladi (02, 04, 05, 06); har qanday
// o'zgartirishni javobni kvadratga oshirib tekshirish mumkin (01, 06, 10).
// Adashishlar: З34 — 02, 03, 05; З4 — 02 va 05 razborlari; З32 — 04 va 09
// razbori; З16 — razborlar javobni KVADRATGA OSHIRIB tekshiradi, ya'ni
// tekshirishning shakli bu darsda mavzuning o'zi.
//
// 🟢 va 🟡 orasidagi chegara: 02 da ildiz ostilari ochiq turadi (tanib olish),
// 05 da esa hech birida bir xil emas — avval chiqarish kerak.
// CHIZMA YO'Q: dars yozuv haqida, chizma faqat bezardi (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D13_01 from './D13_01.jsx';
import D13_02 from './D13_02.jsx';
import D13_03 from './D13_03.jsx';
import D13_04 from './D13_04.jsx';
import D13_05 from './D13_05.jsx';
import D13_06 from './D13_06.jsx';
import D13_07 from './D13_07.jsx';
import D13_08 from './D13_08.jsx';
import D13_09 from './D13_09.jsx';
import D13_10 from './D13_10.jsx';

const HEAD = {
  uz: "Dars 13 amaliyoti — 10 topshiriq (ildizli ifodalarni o'zgartirish)",
  ru: 'Практика урока 13 — 10 заданий (преобразование выражений с корнями)',
  en: 'Lesson 13 practice — 10 tasks (transforming expressions with roots)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Qisqaroq', ru: 'Короче', en: 'Shorter' }, C: D13_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D13_02 },
  { id: '03', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D13_03 },
  { id: '04', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D13_04 },
  { id: '05', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D13_05 },
  { id: '06', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D13_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D13_07 },
  { id: '08', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D13_08 },
  { id: '09', label: { uz: 'Kiritish', ru: 'Внесение', en: 'Bringing in' }, C: D13_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D13_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars13Practice({ lang = 'uz' }) {
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
