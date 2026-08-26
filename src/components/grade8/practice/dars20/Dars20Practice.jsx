// Dars20 amaliyoti — 10 topshiriq. Mavzu: KASR-RATSIONAL TENGLAMALAR.
//
// Metodist qarori 2026-08-24: 15-20 darslar 12-14 bilan bir xil qoida bo'yicha.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8, taqsimot §1, tekshiruvi
// `node scripts/grade8-practice-seq.mjs check`.
//
// 20-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 which_forbidden     06 E TypeValue  🟡 solve_frac
//   02 C TrueFalse  🟢 extraneous_claims   07 I SwapOrder  🟡 solve_steps
//   03 F MarkAll    🟢 allowed_marked      08 H ClozeBank  🔴 rule_words
//   04 G CodeLock   🟡 code_forbidden      09 J MatchPairs 🔴 equation_to_answer
//   05 D PairSlots  🟡 frac_to_ban         10 B Zones      🔴 banned_at_two
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// Darsning tasdiqlari (`Dars20.jsx`): yechishdan oldin ruhsat etilgan
// qiymatlar topiladi (01, 03, 04, 05, 07, 08, 10); ko'paytirilgan tenglama
// KO'PROQ ildizga ega bo'lishi mumkin (07, 08, 09); sohadan chetdagi ildiz
// begona deyiladi (02, 07, 08, 09).
// Adashishlar: З2 — 07, 08, 10; З3 — 02, 07, 09; З16 — 06 va razborlar
// javobni asl tenglamaga qo'yadi.
//
// TERMIN: `ODZ` YOZILMAYDI. `ETALON_8SINF.md` §9.1 uni taqiqlaydi, o'zbekcha
// shakli — `ruhsat etilgan qiymatlar`. Nazariy `Dars20.jsx` da `ODZ` turadi,
// va bu farq skeletning §0a.1 da ochiq yozilgan: metodist qarori kutiladi.
//
// 03 VA 10 BIR MAVZUNI IKKI CHUQURLIKDA TEKSHIRADI: 03 da maxrajlar ochiq
// turadi (tanib olish), 10 da esa taqiqni ko'rish uchun ko'paytuvchilarga
// AJRATISH kerak. Shuning uchun biri 🟢, ikkinchisi 🔴.
//
// CHIZMA YO'Q: dars yozuv va shart haqida (skelet §2).
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D20_01 from './D20_01.jsx';
import D20_02 from './D20_02.jsx';
import D20_03 from './D20_03.jsx';
import D20_04 from './D20_04.jsx';
import D20_05 from './D20_05.jsx';
import D20_06 from './D20_06.jsx';
import D20_07 from './D20_07.jsx';
import D20_08 from './D20_08.jsx';
import D20_09 from './D20_09.jsx';
import D20_10 from './D20_10.jsx';

const HEAD = {
  uz: 'Dars 20 amaliyoti — 10 topshiriq (kasr-ratsional tenglamalar)',
  ru: 'Практика урока 20 — 10 заданий (дробно-рациональные уравнения)',
  en: 'Lesson 20 practice — 10 tasks (fractional rational equations)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Taqiq', ru: 'Запрет', en: 'Ban' }, C: D20_01 },
  { id: '02', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D20_02 },
  { id: '03', label: { uz: 'Ruxsat', ru: 'Разрешено', en: 'Allowed' }, C: D20_03 },
  { id: '04', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D20_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D20_05 },
  { id: '06', label: { uz: 'Yechish', ru: 'Решение', en: 'Solve' }, C: D20_06 },
  { id: '07', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D20_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D20_08 },
  { id: '09', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D20_09 },
  { id: '10', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D20_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars20Practice({ lang = 'uz' }) {
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
