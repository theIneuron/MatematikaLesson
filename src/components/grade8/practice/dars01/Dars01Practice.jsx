// Dars01 amaliyoti — 10 topshiriq, 10 XIL MEXANIKA. Mavzu: RATSIONAL
// IFODALAR VA KASRLAR, ya'ni kasr qaysi qiymatda ma'noga ega emas.
//
// METODIST QARORI 2026-08-22 (ikkinchi): 1-dars amaliyoti QAYTA yaratildi.
// Ilgari bu yerda 7-sinf amaliyotining aynan nusxasi (sonli ifodalar)
// turgan edi — u olib tashlandi, chunki 8-sinfning 1-darsi boshqa narsani
// o'rgatadi. O'nta topshiriqning tipini metodist bir-bir ko'rsatdi.
// Dizayn va ranglar O'ZGARMADI: fon #fff7ed, urg'u #fe5b1a, kit.jsx palitrasi.
//
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md
// Mexanikalar: `practice/kit.jsx` (umumiy qatlam, nusxa YO'Q). Beshtasi shu
// dars uchun qo'shildi: TrueFalse, PairSlots, CodeLock, ClozeBank, SwapOrder.
// Amaliyotda ovoz yo'q.
//
// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · teg
//   01 Choice     🟢 which_claim        06 MarkAll     🟡 always_defined
//   02 Zones      🟢 same_value_groups  07 CodeLock    🟡 code_bans
//   03 TrueFalse  🟢 true_or_false      08 ClozeBank   🔴 rule_words
//   04 PairSlots  🟡 pair_ban           09 SwapOrder   🔴 order_steps
//   05 TypeValue  🟡 largest_ban        10 MatchPairs  🔴 info_to_frac
// Qiyinlik o'qi: 🟢🟢🟢 🟡🟡🟡🟡 🔴🔴🔴 (TIPLAR §7). Yonma-yon bir xil tip yo'q.
//
// IKKI CHETLANISH, ochiq yozilgan (kontent fayli §0a):
//   1) 01 — tayyor to'rt variantdan tanlash: TIPLAR §5.11 bu tipni pul'dan
//      chiqargan. Metodist topshirigi bilan qaytarildi, savol MANTIQIY.
//   2) §6 dagi majburiy janr tarkibi (odz, audit, build, boundary) bu darsda
//      bajarilmaydi: tiplarni metodist aniq ko'rsatdi. Boshqa darslarda §6
//      o'z kuchida qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D01_01 from './D01_01.jsx';
import D01_02 from './D01_02.jsx';
import D01_03 from './D01_03.jsx';
import D01_04 from './D01_04.jsx';
import D01_05 from './D01_05.jsx';
import D01_06 from './D01_06.jsx';
import D01_07 from './D01_07.jsx';
import D01_08 from './D01_08.jsx';
import D01_09 from './D01_09.jsx';
import D01_10 from './D01_10.jsx';

const HEAD = {
  uz: "Dars 1 amaliyoti — 10 topshiriq (ratsional ifodalar va kasrlar)",
  ru: 'Практика урока 1 — 10 заданий (рациональные выражения и дроби)',
  en: 'Lesson 1 practice — 10 tasks (rational expressions and fractions)',
};

const ITEMS = [
  { id: '01', label: { uz: 'Fikr', ru: 'Утверждение', en: 'Claim' }, C: D01_01 },
  { id: '02', label: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' }, C: D01_02 },
  { id: '03', label: { uz: "Ha yoki yo'q", ru: 'Да или нет', en: 'Yes or no' }, C: D01_03 },
  { id: '04', label: { uz: 'Pazl', ru: 'Пазл', en: 'Puzzle' }, C: D01_04 },
  { id: '05', label: { uz: 'Eng katta', ru: 'Наибольшее', en: 'Largest' }, C: D01_05 },
  { id: '06', label: { uz: 'Belgilash', ru: 'Отметить', en: 'Mark' }, C: D01_06 },
  { id: '07', label: { uz: 'Kod', ru: 'Код', en: 'Code' }, C: D01_07 },
  { id: '08', label: { uz: "So'zlar", ru: 'Слова', en: 'Words' }, C: D01_08 },
  { id: '09', label: { uz: 'Tartib', ru: 'Порядок', en: 'Order' }, C: D01_09 },
  { id: '10', label: { uz: 'Moslashtirish', ru: 'Соответствие', en: 'Match' }, C: D01_10 },
];

// Til PLATFORMADAN keladi: LessonPage `lang` propini beradi (uz|ru|en).
// O'z almashtirgichimiz YO'Q -- sayt qobig'ida allaqachon UZ/RU/EN turadi.
export default function Dars01Practice({ lang = 'uz' }) {
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
