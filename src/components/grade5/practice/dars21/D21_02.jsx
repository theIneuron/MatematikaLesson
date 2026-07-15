// Dars21 · Amaliyot 02 — Saralash · 🟡 · tag: classify_sort
// 6 sonni uch savatga: to'g'ri (4/9,7/10), noto'g'ri (9/4,8/8 chegara), aralash (1⅗,2⅚).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d21-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
const Mixed = ({ w, n, d, size = 18, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, verticalAlign: 'middle' }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 5, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} />
  </span>
);

const D02_ITEMS = [
  { id: 'a', cat: 'p', frac: [4, 9] }, { id: 'b', cat: 'p', frac: [7, 10] },
  { id: 'c', cat: 'i', frac: [9, 4] }, { id: 'd', cat: 'i', frac: [8, 8] },
  { id: 'e', cat: 'm', mix: [1, 3, 5] }, { id: 'f', cat: 'm', mix: [2, 5, 6] },
];
const renderNum = (it, color) => it.mix ? <Mixed w={it.mix[0]} n={it.mix[1]} d={it.mix[2]} size={17} color={color} /> : <Frac num={it.frac[0]} den={it.frac[1]} size={18} color={color} />;
const D02_T = {
  uz: {
    eyebrow: 'Saralang', setup: "Zaynab oltita sonni uchta qutiga ajratmoqchi. Har bir son o'z qutisini kutmoqda.",
    ask: "Sonni tanlang, so'ng uni mos savatga joylashtiring:",
    baskets: { p: "To'g'ri kasr", i: "Noto'g'ri kasr", m: 'Aralash son' },
    correct: "To'g'ri. 4/9, 7/10 — to'g'ri; 9/4, 8/8 — noto'g'ri (surat maxrajga teng yoki katta); 1 va 3/5, 2 va 5/6 — aralash sonlar.",
    wrong: "Har bir sonda suratni maxraj bilan solishtiring. Butun qismi bor sonlarni alohida ajrating.",
    rule: "To'g'ri: surat<maxraj. Noto'g'ri: surat≥maxraj. Aralash: butun + kasr.",
  },
  ru: {
    eyebrow: 'Рассортируйте', setup: 'Зайнаб хочет разложить шесть чисел по трём корзинам. Каждое число ждёт свою корзину.',
    ask: 'Выберите число, затем положите его в правильную корзину:',
    baskets: { p: 'Правильная', i: 'Неправильная', m: 'Смешанное' },
    correct: 'Верно. 4/9, 7/10 — правильные; 9/4, 8/8 — неправильные (числитель равен знаменателю или больше); 1 и 3/5, 2 и 5/6 — смешанные.',
    wrong: 'В каждом числе сравни числитель со знаменателем. Числа с целой частью выдели отдельно.',
    rule: 'Правильная: числитель<знаменателя. Неправильная: числитель≥знаменателя. Смешанное: целое + дробь.',
  },
};

export default function D21_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(null);
  const [place, setPlace] = useState({}); // itemId -> cat
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.place) { setPlace(sa.place); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = Object.keys(place).length === D02_ITEMS.length;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const dropTo = (cat) => { if (locked || !sel) return; setPlace((m) => ({ ...m, [sel]: cat })); setSel(null); };
  const removeItem = (id) => { if (locked) return; setPlace((m) => { const n = { ...m }; delete n[id]; return n; }); };
  const check = useCallback(() => {
    const correct = D02_ITEMS.every((it) => place[it.id] === it.cat);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { place }, correctAnswer: Object.fromEntries(D02_ITEMS.map((it) => [it.id, it.cat])), correct, meta: { tag: 'classify_sort', level: '🟡' } });
  }, [place, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const unplaced = D02_ITEMS.filter((it) => place[it.id] == null);
  const cats = ['p', 'i', 'm'];
  const catColor = { p: '#2563eb', i: '#0f766e', m: '#7c3aed' };
  return (
    <div style={S.wrap}>
      <style>{`
        .d21-pop { animation: d21pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d21pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d21-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      {/* joylanmagan sonlar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', minHeight: 48, padding: '4px 0 10px' }}>
        {unplaced.map((it) => {
          const on = sel === it.id;
          return <button key={it.id} type="button" disabled={locked} onClick={() => setSel(on ? null : it.id)} style={{ minWidth: 54, height: 44, borderRadius: 11, border: '2px solid ' + (on ? '#2563eb' : '#cbd5e1'), background: on ? '#eff6ff' : '#fff', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #dbeafe' : 'none' }}>{renderNum(it, '#1f2430')}</button>;
        })}
        {unplaced.length === 0 && <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 700 }}>{lang === 'uz' ? 'Barchasi joylandi' : 'Все разложены'}</span>}
      </div>
      {/* savatlar */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {cats.map((cat) => {
          const items = D02_ITEMS.filter((it) => place[it.id] === cat);
          return (
            <div key={cat} onClick={() => dropTo(cat)} style={{ flex: '1 1 30%', minWidth: 104, minHeight: 96, borderRadius: 14, border: '2px dashed ' + (sel ? catColor[cat] : '#d6dae3'), background: sel ? '#f8fbff' : '#fbfcfe', padding: '8px 6px', cursor: sel && !locked ? 'pointer' : 'default' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: catColor[cat], textAlign: 'center', marginBottom: 6 }}>{t.baskets[cat]}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {items.map((it) => {
                  const ok = checked ? (fb?.correct === true) : null; // to'liq to'g'ri bo'lmasa — barcha joylangan katak qizil
                  const bc = ok === true ? '#1a7f43' : ok === false ? '#c0392b' : '#cbd5e1';
                  const bg = ok === true ? '#e8f7ee' : ok === false ? '#fdecec' : '#fff';
                  return <button key={it.id} type="button" disabled={locked} onClick={(e) => { e.stopPropagation(); removeItem(it.id); }} style={{ minWidth: 46, height: 40, borderRadius: 10, border: '2px solid ' + bc, background: bg, cursor: locked ? 'default' : 'pointer' }}>{renderNum(it, '#1f2430')}</button>;
                })}
              </div>
            </div>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
