// Dars07 amaliyoti — 10 topshiriq. Mavzu: y = k/x FUNKSIYASI VA GRAFIGI.
//
// Metodist qarori 2026-08-24: 7-11 darslarning har biri 1-DARSNING o'nta
// mexanikasidan foydalanadi, lekin har darsda ketma-ketlik boshqacha.
// Taqsimot: DARS07_11_AMALIYOT_SKELET.md §3.
//
// 7-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 inverse_marked     06 A Choice     🟡 which_graph
//   02 C TrueFalse  🟢 zero_and_product   07 H ClozeBank  🟡 rule_words
//   03 B Zones      🟢 which_quadrants    08 G CodeLock   🔴 table_code
//   04 E TypeValue  🟡 find_k             09 D PairSlots  🔴 same_x_pairs
//   05 J MatchPairs 🟡 point_to_formula   10 I SwapOrder  🔴 graph_steps
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// CHIZMALAR (metodist qarori 2026-08-24, skelet §4a): 03 da guruh sarlavhasi
// chizma, 05 da o'ng ustun chizma (nuqta, egri chiziq YO'Q), 06 da to'rt
// variant to'rt chizma, 10 da oxirgi ikki qadam chizma bilan. Render —
// `practice/fig.jsx`, chizma YOZUVNING tokeni, yangi mexanika emas.
//
// Darsning tasdiqlari: x·y = k o'zgarmaydi (02, 04, 05, 09); grafik giperbola
// va tarmoq joyini k ning ishorasi belgilaydi (03, 06, 07, 10); nolda qiymat
// yo'q, grafik o'qlarga tegmaydi (02, 06, 07, 10).
// Adashishlar: З2 — 02, 06, 10; З27 — 01, 02, 06; З28 — 03, 04, 05, 06, 08,
// 09; З16 — hamma razbor son qo'yishga yuboradi.
//
// Harf o'sha — x va y, mavzuning o'zi shunday. Takrorlanmaydigan narsa k:
// 12, 8, 6, −24, ±12, ±20, 36, 24, 18 (skelet §10 p. 1).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D07_01 from './D07_01.jsx';
import D07_02 from './D07_02.jsx';
import D07_03 from './D07_03.jsx';
import D07_04 from './D07_04.jsx';
import D07_05 from './D07_05.jsx';
import D07_06 from './D07_06.jsx';
import D07_07 from './D07_07.jsx';
import D07_08 from './D07_08.jsx';
import D07_09 from './D07_09.jsx';
import D07_10 from './D07_10.jsx';

const HEAD = {
  uz: 'Dars 7 amaliyoti — 10 topshiriq (y = k/x va uning grafigi)',
  ru: 'Практика урока 7 — 10 заданий (y = k/x и её график)',
  en: 'Lesson 7 practice — 10 tasks (y = k/x and its graph)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D07_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D07_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D07_03 },
  { id: '04', label: { uz: 'Koeffitsient', ru: 'Коэффициент', en: 'Coefficient' }, C: D07_04 },
  { id: '05', label: { uz: 'Nuqta', ru: 'Точка', en: 'Point' }, C: D07_05 },
  { id: '06', label: { uz: 'Qaysi chizma', ru: 'Какой чертёж', en: 'Which plot' }, C: D07_06 },
  { id: '07', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D07_07 },
  { id: '08', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D07_08 },
  { id: '09', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D07_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D07_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars07Practice({ lang = 'uz' }) {
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
