// Dars02 amaliyoti — 10 topshiriq, 10 XIL MEXANIKA. Mavzu: KASRNING ASOSIY XOSSASI.
//
// Metodist qarori 2026-08-22: 1-dars amaliyotiga tegilmadi (u 7-sinf nusxasi
// bo'lib qoladi), 2-dars esa shu yerdan boshlab O'Z mexanikalarida quriladi.
// Dizayn va ranglar 7-sinfnikidek: fon #fff7ed, urg'u #fe5b1a.
// Savol TIPLARI esa boshqa: `TIPLAR_AMALIYOT_8SINF.md` §5 ro'yxatidan.
//
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md
// Mexanikalar: `practice/kit.jsx` (umumiy qatlam, nusxa YO'Q).
// Amaliyotda ovoz yo'q.
//
// METODIST QARORI 2026-08-24: 2-6 darslar 1-DARSNING o'nta mexanikasida
// quriladi, har darsda BOSHQA ketma-ketlikda. Skelet va jadval:
// `src/books/grade8/DARS02_06_AMALIYOT_SKELET.md` §2.
//
// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik
//   01 TrueFalse   🟢     05 PairSlots   🟡     09 ClozeBank  🔴
//   02 Choice      🟢     06 MarkAll     🟡     10 SwapOrder  🔴
//   03 Zones       🟢     07 CodeLock    🟡
//   04 TypeValue   🟡     08 MatchPairs  🔴
// Raskladka qoidalari (TIPLAR §7): qiyinlik o'qi 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴,
// 1-pozitsiyada bitta bosish bilan boshqariladigan tip (`TrueFalse`),
// yonma-yon bir xil tip yo'q — o'nta tip, o'nta topshiriq.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D02_01 from './D02_01.jsx';
import D02_02 from './D02_02.jsx';
import D02_03 from './D02_03.jsx';
import D02_04 from './D02_04.jsx';
import D02_05 from './D02_05.jsx';
import D02_06 from './D02_06.jsx';
import D02_07 from './D02_07.jsx';
import D02_08 from './D02_08.jsx';
import D02_09 from './D02_09.jsx';
import D02_10 from './D02_10.jsx';

const HEAD = {
  uz: "Dars 2 amaliyoti — 10 topshiriq (kasrning asosiy xossasi)",
  ru: 'Практика урока 2 — 10 заданий (основное свойство дроби)',
  en: 'Lesson 2 practice — 10 tasks (the basic property of a fraction)',
};

const ITEMS = [
  { id: '01', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D02_01 },
  { id: '02', label: { uz: 'Zanjir', ru: 'Цепочка', en: 'Chain' }, C: D02_02 },
  { id: '03', label: { uz: 'Xossa', ru: 'Свойство', en: 'Property' }, C: D02_03 },
  { id: '04', label: { uz: 'Yangi taqiq', ru: 'Новый запрет', en: 'New ban' }, C: D02_04 },
  { id: '05', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D02_05 },
  { id: '06', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D02_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D02_07 },
  { id: '08', label: { uz: 'Juftlash', ru: 'Пары', en: 'Pairs' }, C: D02_08 },
  { id: '09', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D02_09 },
  { id: '10', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D02_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz YO'Q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
export default function Dars02Practice({ lang = 'uz' }) {
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
