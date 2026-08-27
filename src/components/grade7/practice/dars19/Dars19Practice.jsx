// Dars19 amaliyoti — 10 topshiriq. Mavzu: KO'PHADLARNI QO'SHISH VA AYIRISH.
// Topshiriq fayllarida FAQAT ma'lumot; mexanikalar `practice/kit.jsx` da,
// qobiq `practice/PracticeHost.jsx` da (CLAUDE.md §5).
//
// MEXANIKALAR RASKLADKADAN: node scripts/grade7-practice-layout.mjs --json
// Raskladka nomlari mavjud mexanikalarga solishtirildi (metodist qarori
// 2026-08-21): build/order/bracket -> BuildLine, slots/chain -> SlotsBank,
// fix -> TapTerms, sort -> Zones, choice -> Choice (faqat isinish uchun).
// 19-dars raskladkasi: order, choice, chain, sort, fix, chain, bracket, build, slots, build
//
// Darsning O'Z misollari (10x + 8, 11x² + 3xy − 4y², 14a² − 8ab − b², 16a³ − a² − 7, 16x ± 17y) ataylab takrorlanmadi: aks holda
// xotira tekshiriladi, ko'nikma emas.
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../PracticeHost.jsx';
import D19_01 from './D19_01.jsx';
import D19_02 from './D19_02.jsx';
import D19_03 from './D19_03.jsx';
import D19_04 from './D19_04.jsx';
import D19_05 from './D19_05.jsx';
import D19_06 from './D19_06.jsx';
import D19_07 from './D19_07.jsx';
import D19_08 from './D19_08.jsx';
import D19_09 from './D19_09.jsx';
import D19_10 from './D19_10.jsx';

const HEAD = {
  uz: "Dars 19 amaliyoti — 10 topshiriq (ko'phadlarni qo'shish va ayirish)",
  ru: 'Практика урока 19 — 10 заданий (сложение и вычитание многочленов)',
  en: 'Lesson 19 practice — 10 tasks (adding and subtracting polynomials)',
};

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mexanika · qiyinlik · matematika
const ITEMS = [
  { id: '01', label: { uz: "Yig'indi", ru: 'Сумма', en: 'Sum' }, C: D19_01 },  // order 🟢 (5x + 3) + (2x − 8)
  { id: '02', label: { uz: "Ishoralar", ru: 'Знаки', en: 'Signs' }, C: D19_02 },  // choice 🟢 (4a + 9) − (a − 6)
  { id: '03', label: { uz: "Ikki qadam", ru: 'Два шага', en: 'Two steps' }, C: D19_03 },  // chain 🟢 (6y − 5) − (2y + 7)
  { id: '04', label: { uz: "Uch ayirma", ru: 'Три разности', en: 'Three differences' }, C: D19_04 },  // sort 🟡 bitta ishora farqi
  { id: '05', label: { uz: "Xato javob", ru: 'Неверный ответ', en: 'Wrong answer' }, C: D19_05 },  // fix 🟡 (7m − 4) − (3m − 9)
  { id: '06', label: { uz: "Uch qavs", ru: 'Три скобки', en: 'Three brackets' }, C: D19_06 },  // chain 🟡 (3x² + x) + (x² − 4x) − (2x² − x)
  { id: '07', label: { uz: "Qavsga olish", ru: 'В скобку', en: 'Into a bracket' }, C: D19_07 },  // bracket 🟡 9a − (4a + 2b)
  { id: '08', label: { uz: "Bir had qoldi", ru: 'Остался один', en: 'One term left' }, C: D19_08 },  // build 🔴 (4c² − 5c + 2) − (4c² + 5c − 9)
  { id: '09', label: { uz: "Ikki harf", ru: 'Две буквы', en: 'Two letters' }, C: D19_09 },  // slots 🔴 (7x² − 3xy + y²) + (−2x² + 8xy)
  { id: '10', label: { uz: "Uch ishora", ru: 'Три знака', en: 'Three signs' }, C: D19_10 },  // build 🔴 (a³ − 2a² + 6) − (−a³ + 2a² − 6)
];

export default function Dars19Practice({ lang = 'uz' }) {
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
        /* TELEFONDA SARLAVHA JOY YEMASIN (metodist QA si, 2026-08-22): o'nta
           tugma besh qatorga yoyilib, topshiriq ekrandan pastga tushib ketardi.
           Tor ekranda tugmalar BITTA qatorda, yon tomonga suriladi. */
        @media (max-width:639.98px){
          .pq-fixroot{width:390px;}
          .pq-head{padding:46px 10px 7px !important;}
          .pq-title{font-size:12.5px !important;margin-bottom:2px;}
          .pq-chips{flex-wrap:nowrap !important;overflow-x:auto;scrollbar-width:none;}
          .pq-chips::-webkit-scrollbar{display:none;}
        }
      `}</style>
      <div className="pq-head" style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong className="pq-title" style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>{HEAD[lang] || HEAD.uz}</strong>
        <div className="pq-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', width: '100%' }}>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {i + 1} · {item.label[lang] || item.label.uz}
          </button>
        ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id + '-' + lang} Question={q.C} lang={lang} showLanguageSwitch={false} title={null} />
      </div>
    </div>
  );
}
