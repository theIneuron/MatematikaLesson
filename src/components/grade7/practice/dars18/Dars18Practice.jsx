// Dars18 amaliyoti — 10 topshiriq. Mavzu: KO'PHAD VA TURLARI.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 18-dars raskladkasi: choice, chain, fix, build, slots, bracket, build, order, build, sort
//
// Darsning O'Z misollari ((2x)³, 2a³bc⁴, 11y, 2c − 3, ±2ab) ataylab takrorlanmadi: aks holda
// xotira tekshiriladi, ko'nikma emas.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D18_01 from './D18_01.jsx';
import D18_02 from './D18_02.jsx';
import D18_03 from './D18_03.jsx';
import D18_04 from './D18_04.jsx';
import D18_05 from './D18_05.jsx';
import D18_06 from './D18_06.jsx';
import D18_07 from './D18_07.jsx';
import D18_08 from './D18_08.jsx';
import D18_09 from './D18_09.jsx';
import D18_10 from './D18_10.jsx';

const HEAD = {
  uz: "Dars 18 amaliyoti — 10 topshiriq (ko'phad va turlari)",
  ru: 'Практика урока 18 — 10 заданий (многочлен и его виды)',
  en: 'Lesson 18 practice — 10 tasks (polynomials and their kinds)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · matematika
const ITEMS = [
  { id: '01', label: { uz: "Turi", ru: 'Вид', en: 'Kind' }, C: D18_01 },  // choice 🟢 5x² − 8x + 3
  { id: '02', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D18_02 },  // chain 🟢 6y² − 9y + 4y², keyin y = 1
  { id: '03', label: { uz: "Xato had", ru: 'Неверный член', en: 'Wrong term' }, C: D18_03 },  // fix 🟢 7c³ − 4c + 2c³ − 9
  { id: '04', label: { uz: "Standart", ru: 'Стандартный', en: 'Standard' }, C: D18_04 },  // build 🟡 2a³ + 2a² − 7 + 2a³
  { id: '05', label: { uz: "Tartib", ru: 'Порядок', en: 'Order' }, C: D18_05 },  // slots 🟡 −5 + 8t² − 3t
  { id: '06', label: { uz: "Qavs", ru: 'Скобка', en: 'Bracket' }, C: D18_06 },  // bracket 🟡 x³ − (4x − 7)
  { id: '07', label: { uz: "Manfiy", ru: 'Минус', en: 'Negative' }, C: D18_07 },  // build 🟡 3p³ − 5p³ + 5p
  { id: '08', label: { uz: "Darajasi", ru: 'По степеням', en: 'By degree' }, C: D18_08 },  // order 🔴 9 − 4k³ + 7k
  { id: '09', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D18_09 },  // build 🔴 2a²b − 5ab² + 4a²b + ab
  { id: '10', label: { uz: "Turi qanday", ru: 'Какой вид', en: 'Which kind' }, C: D18_10 },  // sort 🔴 tur ixchamlashdan keyin
];

export default function Dars18Practice({ lang = 'uz' }) {
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
