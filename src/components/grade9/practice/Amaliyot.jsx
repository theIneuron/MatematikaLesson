// ============================================================================
// 9-SINF AMALIYOTINING O'RAMI — SINFGA BITTA.
//
// NEGA. 8-sinfda bu o'ram har darsning `DarsNNPractice.jsx` faylida qaytadan
// yozilgan: 55 nusxa, va chip qatoridagi bitta tuzatish 55 joyda qilinardi.
// 9-sinfda 52 dars bo'ladi, shuning uchun o'ram BIR MARTA yoziladi, dars
// fayli esa faqat ma'lumot beradi: sarlavha va o'nta topshiriq (CLAUDE.md §5).
//
// Ichida: sarlavha, topshiriq chiplari, `PracticeHost` (umumiy qatlamdan
// import, nusxa emas) va mobil zoom. Til PLATFORMADAN keladi — o'z
// almashtirgichimiz yo'q, sayt qobig'ida allaqachon UZ/RU/EN turadi.
//
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PracticeHost, { usePracticeZoom } from '../../grade8/practice/PracticeHost.jsx';

export function makePractice({ HEAD, ITEMS }) {
  return function Practice({ lang = 'uz' }) {
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
        {/* MOBIL_DESKTOP_MOSLASH.md naqshi: fixed root — body-skroll yo'q,
            tugma joyida; <640px da layout 390px etalon + zoom bilan real
            ekranga masshtablanadi. */}
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
  };
}
