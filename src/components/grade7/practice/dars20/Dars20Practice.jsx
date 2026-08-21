// Dars20 amaliyoti — 10 topshiriq. Mavzu: KO'PHADNI BIR HADGA KO'PAYTIRISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 20-dars raskladkasi: choice, fix, order, build, bracket, build, slots, sort, build, chain
//
// Darsning O'Z misollari (3a(2a + 5), 2x(3x − 5 + y), 2(2x − 5), 28a⁵b + 5a⁴b, 18a⁵b¹³, 14ab) ataylab takrorlanmadi: aks holda
// xotira tekshiriladi, ko'nikma emas.
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
  uz: "Dars 20 amaliyoti — 10 topshiriq (ko'phadni bir hadga ko'paytirish)",
  ru: 'Практика урока 20 — 10 заданий (умножение многочлена на одночлен)',
  en: 'Lesson 20 practice — 10 tasks (multiplying a polynomial by a monomial)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · matematika
const ITEMS = [
  { id: '01', label: { uz: "Har had", ru: 'Каждый член', en: 'Every term' }, C: D20_01 },  // choice 🟢 5x(3x − 4)
  { id: '02', label: { uz: "Xato javob", ru: 'Неверный ответ', en: 'Wrong answer' }, C: D20_02 },  // fix 🟢 4a(2a + 7) = 8a² + 7
  { id: '03', label: { uz: "Ikki ko'paytma", ru: 'Два произведения', en: 'Two products' }, C: D20_03 },  // order 🟢 6y(y − 3)
  { id: '04', label: { uz: "Uch had", ru: 'Три члена', en: 'Three terms' }, C: D20_04 },  // build 🟡 3m(2m² − 5m + 4)
  { id: '05', label: { uz: "Teskari", ru: 'Обратно', en: 'Backwards' }, C: D20_05 },  // bracket 🟡 14b² − 21b
  { id: '06', label: { uz: "Minusli", ru: 'С минусом', en: 'With a minus' }, C: D20_06 },  // build 🟡 −4c(3c − 8)
  { id: '07', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D20_07 },  // slots 🟡 5xy(2x − 3y)
  { id: '08', label: { uz: "Uch javob", ru: 'Три ответа', en: 'Three answers' }, C: D20_08 },  // sort 🔴 ishora farqi
  { id: '09', label: { uz: "Ikki qavs", ru: 'Две скобки', en: 'Two brackets' }, C: D20_09 },  // build 🔴 3x(2x + 5) − 2x(x − 4)
  { id: '10', label: { uz: "Zanjir", ru: 'Цепочка', en: 'Chain' }, C: D20_10 },  // chain 🔴 4p(3p² − 2p) + 5p(p² + p)
];

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
          <640px da layout 390px etalon + zoom bilan real ekranga masshtablanadi.
          Fon AMALIYOT_GLOBAL_STANDART.md 1-bandi bo'yicha #fff7ed. */}
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
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
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
