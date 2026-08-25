// Dars08 amaliyoti — 10 topshiriq. Mavzu: ARIFMETIK ILDIZ VA RATSIONAL
// KO'RSATKICHLI DARAJA.
//
// Metodist qarori 2026-08-24: 7-11 darslarning har biri 1-DARSNING o'nta
// mexanikasidan foydalanadi, lekin har darsda ketma-ketlik boshqacha.
// Taqsimot: DARS07_11_AMALIYOT_SKELET.md §3.
//
// 8-dars taqsimoti (kod / mexanika / qiyinlik / teg):
//   01 A Choice     🟢 one_number         06 J MatchPairs 🟡 power_to_value
//   02 F MarkAll    🟢 power_root_marked  07 B Zones      🟡 modulus_or_not
//   03 E TypeValue  🟢 power_value        08 H ClozeBank  🔴 rule_words
//   04 D PairSlots  🟡 power_to_root      09 I SwapOrder  🔴 power_steps
//   05 C TrueFalse  🟡 root_claims        10 G CodeLock   🔴 code_powers
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴. Yonma-yon bir xil mexanika yo'q.
//
// UMUMIY QATLAMDA IKKI YANGILIK (metodist qarori 2026-08-24):
//   1) ILDIZ USTKI CHIZIQ bilan — `frac.jsx` -> `Root`, token `{ r: … }`;
//      daraja ko'rsatkichi bilan `{ r: '5²', deg: '3' }`.
//   2) KASR KO'RSATKICHLI DARAJA — `frac.jsx` -> `Pow`, token
//      `{ b: '64', e: { n: '2', d: '3' } }`. Ko'rsatkich ikki qavatli kasr.
// Uchinchisi shu darsda kerak bo'ldi: `PairSlots` da karta `side` ni ochiq
// aytadi (04-topshiriq), chunki u yerda ikki tomon ham matematika.
// CHIZMA: 05-topshiriqda son o'qi — minus yetti va yetti noldan bir xil
// masofada, modul shu masofa (`practice/fig.jsx`).
//
// Darsning tasdiqlari: arifmetik ildiz NOMANFIY son (01, 05, 08); kasr
// ko'rsatkich ildiz bilan bir xil (02, 03, 04, 06, 09, 10); juft darajali
// ildiz ostidagi kvadratdan MODUL chiqadi (05, 07, 08).
// Adashishlar: З4 — 05; З5 — 05, 07; З29 — 01, 08; З16 — hamma razborda
// javob teskari amal bilan tekshiriladi.
//
// Harflar: a (07 da), qolganlari sonli misollar. Asoslar takrorlanmaydi:
// 36, 9, 49, 8, 25, 16, 125, 64, 5, 81, 256, 27, 32.
// Dizayn tegilmadi: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
// Amaliyotda ovoz yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D08_01 from './D08_01.jsx';
import D08_02 from './D08_02.jsx';
import D08_03 from './D08_03.jsx';
import D08_04 from './D08_04.jsx';
import D08_05 from './D08_05.jsx';
import D08_06 from './D08_06.jsx';
import D08_07 from './D08_07.jsx';
import D08_08 from './D08_08.jsx';
import D08_09 from './D08_09.jsx';
import D08_10 from './D08_10.jsx';

const HEAD = {
  uz: "Dars 8 amaliyoti — 10 topshiriq (arifmetik ildiz va kasr ko'rsatkich)",
  ru: 'Практика урока 8 — 10 заданий (арифметический корень и дробный показатель)',
  en: 'Lesson 8 practice — 10 tasks (the arithmetic root and fractional exponents)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Nechta son', ru: 'Сколько чисел', en: 'How many' }, C: D08_01 },
  { id: '02', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D08_02 },
  { id: '03', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D08_03 },
  { id: '04', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D08_04 },
  { id: '05', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D08_05 },
  { id: '06', label: { uz: 'Moslashtirish', ru: 'Соответствие', en: 'Match' }, C: D08_06 },
  { id: '07', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D08_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D08_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D08_09 },
  { id: '10', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D08_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
export default function Dars08Practice({ lang = 'uz' }) {
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
