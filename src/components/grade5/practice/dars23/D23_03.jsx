// Dars23 · Amaliyot 03 — Zaym bilan ayirish · 🔴 · tag: sub_mixed_borrow
// 5 2/9 − 2 7/9. 2/9 < 7/9 → zaym: 5 2/9 = 4 11/9. 11/9−7/9=4/9, 4−2=2 → 2 4/9.
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
  <div className="d23-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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
const Mixed = ({ w, n, d, size = 20, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 6, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} />
  </span>
);

const D03 = { w: 2, n: 4 }; // 2 4/9
const D03_T = {
  uz: {
    eyebrow: 'Lenta', setup: "Dilnoza uzunligi 5 2/9 metr bo'lgan lentadan 2 7/9 metrini kesib oldi. Necha metr lenta qoldi?",
    ask: '5 2/9 − 2 7/9 = ?',
    btn: "1 butunni almashtirib ko'rish", l1: 'Butun:', l2: 'Kasr:',
    correct: "To'g'ri. 5 2/9 = 4 11/9. Kasrlar: 11/9 − 7/9 = 4/9, butunlar: 4 − 2 = 2. Demak qoldi 2 4/9 metr.",
    wrong: "Kasr qismidan ayirish mumkinmi? Avval shunga e'tibor bering, so'ng qayta hisoblang.",
    rule: "Kasr qismidan ayirib bo'lmasa, bir butunni maxraj (9/9) ko'rinishida kasrga qo'shib, so'ng ayiramiz.",
  },
  ru: {
    eyebrow: 'Лента', setup: 'Дилноза отрезала от ленты длиной 5 2/9 метра кусок в 2 7/9 метра. Сколько метров ленты осталось?',
    ask: '5 2/9 − 2 7/9 = ?',
    btn: 'Показать замену 1 целого', l1: 'Целое:', l2: 'Дробь:',
    correct: 'Верно. 5 2/9 = 4 11/9. Дроби: 11/9 − 7/9 = 4/9, целые: 4 − 2 = 2. Значит осталось 2 4/9 метра.',
    wrong: 'Можно ли вычесть из дробной части? Сначала обрати внимание на это, потом пересчитай.',
    rule: 'Если из дробной части не вычесть, преврати 1 целое в знаменатель (9/9), прибавь к дроби и вычитай.',
  },
};

export default function D23_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [broken, setBroken] = useState(false);
  const [w, setW] = useState('');
  const [n, setN] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.w != null) setW(String(s.w)); if (s.n != null) setN(String(s.n)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(w) && /^\d+$/.test(n);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(w, 10) === D03.w && parseInt(n, 10) === D03.n;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { w: parseInt(w, 10), n: parseInt(n, 10) }, correctAnswer: D03, correct, meta: { tag: 'sub_mixed_borrow', level: '🔴' } });
  }, [w, n, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const bdOf = (v, ok) => checked ? (parseInt(v, 10) === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const box = (val, set, ok) => (<input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={locked} inputMode="numeric" placeholder="?" style={{ width: 46, height: 40, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />);
  return (
    <div style={S.wrap}>
      <style>{`
        .d23-pop { animation: d23pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d23pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d23-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0' }}>
        {broken
          ? <span className="d23-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Mixed w={4} n={11} d={9} size={22} color="#7c3aed" /><span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>−</span><Mixed w={2} n={7} d={9} size={22} color="#2563eb" /></span>
          : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Mixed w={5} n={2} d={9} size={22} color="#7c3aed" /><span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>−</span><Mixed w={2} n={7} d={9} size={22} color="#2563eb" /></span>}
      </div>
      {!broken && <div style={{ textAlign: 'center', margin: '4px 0' }}><button type="button" disabled={locked} onClick={() => setBroken(true)} style={{ padding: '8px 14px', borderRadius: 13, border: '1.5px dashed #c4b5fd', background: '#faf5ff', color: '#7c3aed', fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 13, fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>{t.btn}</button></div>}
      {broken && <div style={{ textAlign: 'center', fontSize: 12.5, color: '#7c3aed', fontWeight: 700, marginBottom: 4 }}>5 2/9 = 4 11/9 ✓</div>}
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l1}</div>{box(w, setW, D03.w)}</div>
        <div style={{ textAlign: 'center' }}><div style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 700, marginBottom: 5 }}>{t.l2}</div><div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>{box(n, setN, D03.n)}<div style={{ width: 42, height: 2.5, background: '#1f2430' }} /><div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#64748b' }}>9</div></div></div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
