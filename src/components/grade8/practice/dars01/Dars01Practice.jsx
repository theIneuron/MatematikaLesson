// Dars01 amaliyoti — 10 topshiriq. Mavzu: RATSIONAL IFODALAR VA KASRLAR.
// Kontrakt: src/books/grade8/TIPLAR_AMALIYOT_8SINF.md
//
// Tiplar ("birinchi to'lqin", metodist qarori 2026-08-21; +Fix, Zones,
// Cancel 2026-08-22): Abcd, YesNo, Input, Counter, Fix, Audit, Zones,
// Cancel. Har topshiriq fayli faqat MA'LUMOT, mexanikalar
// `practice/kit.jsx` da.
//
// UCHTA ALMASHTIRISH (metodist qarori 2026-08-22):
//   SlotsBank ISHLATILMAYDI: sinfning O'Z `slots`/`fill` asbobi bilan bir
//   xil shakl -- "kartani bosib uyani to'ldirish". 4-topshiriq Fix'ga
//   o'tkazildi: xato belgi yozuv ICHIDA topiladi.
//   8-topshiriq endi Build EMAS, Zones: o'quvchi TO'G'RI va NOTO'G'RI
//   qiymatlarni O'ZI ikki korzinaga (ruhsat etilgan / taqiqlangan) ajratadi.
//   6-topshiriq endi Why EMAS, Cancel: "tayyor gaplardan tanlash qiziq
//   emas" (metodist so'zi) -- o'quvchi mos ko'paytuvchini QO'L bilan
//   surat va maxrajda bosib chizib tashlaydi, keyin shartni yozadi.
//
// QOBIQ, USLUB VA XATTI-HARAKAT — 7-sinf amaliyotidan o'zgartirilmagan
// nusxa: PracticeHost, chip qatori, rang palitrasi (S/C), «Tekshirish»
// tugmasi bir marta bosiladi.
//
// QOPLASH (amaliyot 1-darsning HAMMA tasdig'i va HAMMA adashishini yopadi):
//   Tasdiq 1 (songa bo'linsa butun, harfga bo'linsa kasr)  -> 01
//   Tasdiq 2 (shartni maxraj beradi, nollari mumkin emas)  -> 04, 07, 08, 09
//   Tasdiq 3 (suratdagi nol / maxrajdagi nol)              -> 02, 05, 09
//   Z2  shart topilmadi yoki yo'qoldi                      -> 06, 07, 09
//   Z16 javob son bilan tekshirilmadi                      -> 05, 09
//   Z18 suratdagi va maxrajdagi nol aralashtirildi          -> 02
//   Z19 songa bo'lish harfga bo'lish deb olindi             -> 01
//
// NAZARIYADAN FARQLANADI (metodist qarori 2026-08-21, ikki muammo): dastlab
// 4-, 6-, 8-, 9-topshiriqlarda nazariya darsining O'Z misollari va O'Z savol
// FORMASI ishlatilgan edi — o'quvchi ularni IKKI marta ko'rar edi.
//   1. SONLAR: (x·x-4)/(x-2), x/(x-6), x(x-3) -> endi 49/7, 8, 9.
//   2. FORMA: 4-topshiriq nazariyaning aynan o'zi qiladigan uch qadamli
//      savolni takrorlardi (birinchi ko'paytuvchi -> ikkinchi -> birlashtirish,
//      screen (x+1)/((x-2)(x+5))). Endi 4-topshiriq BOSHQA holat: ikki
//      ko'paytuvchi BIR XIL, ya'ni bosqichma-bosqich emas — bitta hal
//      qiluvchi qadam va boshqa adashish (ikki emas, bitta taqiq).
//
// TIPLAR TARTIBI: yonma-yon bir xil tip turmaydi, isinish (Abcd/YesNo)
// faqat 1-2 pozitsiyada. QIYINLIK: 3 oson (01-03) · 4 o'rta (04-07) ·
// 3 qiyin (08-10).
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
  { id: '01', label: { uz: 'Butun yoki kasr', ru: 'Целое или дробное', en: 'Integral or fractional' }, C: D01_01 },
  { id: '02', label: { uz: 'Surat va maxraj', ru: 'Числитель и знаменатель', en: 'Numerator and denominator' }, C: D01_02 },
  { id: '03', label: { uz: 'Qiymat', ru: 'Значение', en: 'Value' }, C: D01_03 },
  { id: '04', label: { uz: 'Bir xil ko\'paytuvchi', ru: 'Одинаковый множитель', en: 'Identical factor' }, C: D01_04 },
  { id: '05', label: { uz: 'Ikki yozuv', ru: 'Две записи', en: 'Two records' }, C: D01_05 },
  { id: '06', label: { uz: 'Qisqartirish', ru: 'Сокращение', en: 'Reduction' }, C: D01_06 },
  { id: '07', label: { uz: 'Ikki kasr', ru: 'Две дроби', en: 'Two fractions' }, C: D01_07 },
  { id: '08', label: { uz: 'Ruhsat etilganmi', ru: 'Разрешено или нет', en: 'Allowed or not' }, C: D01_08 },
  { id: '09', label: { uz: 'Tayyor yechim', ru: 'Готовое решение', en: 'A ready solution' }, C: D01_09 },
  { id: '10', label: { uz: 'Taqiq bormi', ru: 'Есть ли запрет', en: 'Is there a restriction' }, C: D01_10 },
];

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
      <style>{`
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
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
