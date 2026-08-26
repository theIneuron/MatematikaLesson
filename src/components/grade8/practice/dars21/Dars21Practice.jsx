// Dars21 amaliyoti — 10 topshiriq. Mavzu: KVADRAT TENGLAMALAR YORDAMIDA
// MASALALAR YECHISH.
//
// Metodist qarori 2026-08-25: 21-30 darslar 15-20 bilan bir xil qoida
// bo'yicha. Skelet: DARS21_30_AMALIYOT_SKELET.md §3, taqsimot §1,
// tekshiruvi `node scripts/grade8-practice-seq.mjs check`.
//
// 21-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 F MarkAll    🟢 same_condition_marked  06 C TrueFalse  🟡 problem_claims
//   02 E TypeValue  🟢 rect_side              07 I SwapOrder  🟡 word_solve_steps
//   03 B Zones      🟢 accept_or_reject       08 J MatchPairs 🔴 problem_to_equation
//   04 G CodeLock   🟡 code_real_answers      09 H ClozeBank  🔴 rule_words
//   05 D PairSlots  🟡 equation_to_side       10 A Choice     🔴 time_units
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars21.jsx`): noma'lum harf bilan belgilanadi va
// qolganlari shu harf orqali yoziladi (01, 05, 07, 08, 09); shartdan tenglama
// tuziladi va yechiladi (01, 02, 05, 07, 08, 09, 10); shartga zid ildiz
// javobga kiritilmaydi (02, 03, 04, 06, 07, 09).
// Adashishlar: З47 — 03, 04, 06, 09; З45 — 10; З3 — 03 razbori; З16 —
// razborlar javobni MASALANING O'ZIGA qo'yib tekshiradi.
//
// TERMIN: `ODZ` YOZILMAYDI. `ETALON_8SINF.md` §9.1 uni taqiqlaydi, o'zbekcha
// shakli — `ruhsat etilgan qiymatlar`. Nazariy `Dars21.jsx` da `ODZ` turadi,
// va bu farq skeletning §0a.1 da ochiq yozilgan.
//
// 02 VA 04 BIR ISHNI IKKI CHUQURLIKDA TEKSHIRADI: 02 da bitta tenglama
// yechiladi va bitta ildiz rad etiladi, 04 da esa yechish umuman yo'q —
// faqat TANLASH, va u uch marta ketma-ket takrorlanadi.
//
// CHIZMA YO'Q: dars yozuv va ma'no haqida (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D21_01 from './D21_01.jsx';
import D21_02 from './D21_02.jsx';
import D21_03 from './D21_03.jsx';
import D21_04 from './D21_04.jsx';
import D21_05 from './D21_05.jsx';
import D21_06 from './D21_06.jsx';
import D21_07 from './D21_07.jsx';
import D21_08 from './D21_08.jsx';
import D21_09 from './D21_09.jsx';
import D21_10 from './D21_10.jsx';

const HEAD = {
  uz: 'Dars 21 amaliyoti — 10 topshiriq (kvadrat tenglamalar bilan masalalar)',
  ru: 'Практика урока 21 — 10 заданий (задачи с квадратными уравнениями)',
  en: 'Lesson 21 practice — 10 tasks (word problems with quadratic equations)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Bir shart', ru: 'Одно условие', en: 'One condition' }, C: D21_01 },
  { id: '02', label: { uz: 'Eni', ru: 'Ширина', en: 'Width' }, C: D21_02 },
  { id: '03', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D21_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D21_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D21_05 },
  { id: '06', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D21_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D21_07 },
  { id: '08', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D21_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D21_09 },
  { id: '10', label: { uz: 'Tenglama', ru: 'Уравнение', en: 'The equation' }, C: D21_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars21Practice({ lang = 'uz' }) {
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
