// Dars01 amaliyoti — 10 topshiriq (osondan qiyinga). Mavzu: SONLI IFODALAR.
// Bu 1-darsning HAQIQIY amaliyoti (metodist qarori 2026-08-20): ilgari
// shu yerda boshqa to'plam turgan edi, u olib tashlandi.
// Tuzilma, uslub va jsx-question kontrakti 5-sinf amaliyotidan olingan,
// matematikasi esa 7-sinfning. 5-sinfning O'ZIGA tegilmagan.
// Syujet YO'Q: 7-sinfda sahna yozuvning o'zi (metodist qarori 2026-08-19).
// Har topshiriq mustaqil jsx-question fayli; bu yerda PracticeHost bilan prokliklab ko'riladi.
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

// Metodik xarita (o'quvchiga ko'rsatilmaydi): mavzu · qiyinlik · teg
// Barcha topshiriqlar darslik §1 (sonli ifodalar, amallar tartibi) mavzusida.
// Sonlar 7-sinf darajasida: manfiy sonlar, o'nli va oddiy kasrlar, uch-to'rt xonali sonlar.
// 03, 04, 08 -- harfli ifodalar (metodist topshirigi 2026-08-20, ikkinchi tur).
// Qiyinlik: 2 oson (01,02) · 4 o'rta (03–06) · 4 qiyin (07–10). Aldov (trap) variantlar bilan.
const ITEMS = [
  { id: '01', label: "1 · Tartib", C: D01_01 }, // uchta o'qishdan to'g'risini tanlash 🟢 read_order
  { id: '02', label: "2 · Birinchi amal", C: D01_02 },// birinchi bajariladigan amalni tanlash 🟢 first_step
  { id: '03', label: "3 · Yig'indi", C: D01_03 },// harfli ifodalarni qo'shish 🟡 add_expressions
  { id: '04', label: "4 · Ochish", C: D01_04 }, // qavs ochilganda ishora 🟡 open_bracket_signs
  { id: '05', label: "5 · Qiymat", C: D01_05 }, // qiymatni hisoblab yozish 🟡 write_value
  { id: '06', label: "6 · Tuzatish", C: D01_06 },// xato qatorni topib tuzatish 🟡 fix_line
  { id: '07', label: "7 · Zanjir", C: D01_07 }, // oraliq qiymatlar zanjiri 🔴 value_chain
  { id: '08', label: "8 · Harflar", C: D01_08 },// harf o'rniga son, qiymati 12 🔴 substitute_value
  { id: '09', label: "9 · Yig'ish", C: D01_09 },// kartalardan yozuv yig'ish 🔴 build_value
  { id: '10', label: "10 · Ishora", C: D01_10 },// qiymat ishorasi bo'yicha zonalarga 🔴 sort_by_sign
];

export default function Dars01Practice() {
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
        .pq-fixroot{position:fixed;inset:0;overflow:hidden;background:#fff;display:flex;flex-direction:column;zoom:var(--pqz,1);}
        @media (max-width:639.98px){.pq-fixroot{width:390px;}}
      `}</style>
      <div style={{
        flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center',
        padding: '56px 12px 10px', borderBottom: '1px solid #eef0f4',
      }}>
        <strong style={{ fontSize: 14, color: '#1f2430', width: '100%' }}>Dars 1 amaliyoti — 10 topshiriq (sonli ifodalar)</strong>
        {ITEMS.map((item, i) => (
          <button key={item.id} type="button" style={chip(i === idx)} onClick={() => setIdx(i)}>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <PracticeHost key={q.id} Question={q.C} />
      </div>
    </div>
  );
}
