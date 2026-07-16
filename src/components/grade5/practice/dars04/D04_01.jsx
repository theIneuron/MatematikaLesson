// Dars04 · Amaliyot 01 — Savatlar · 🟢 · Madina · tag: sum_to_product
// Bir xil sonda olmali savatlar. Jami olmalarni qaysi ko'paytma ifodalaydi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = '#fff', bd = '#d6dae3', col = '#374151';
  if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}

/* =================== 01 · Savatlar · 🟢 · sum_to_product =================== */

const D01_DATA = { correct: 1, tag: 'sum_to_product', level: '🟢' };
const D01_T = {
  uz: { eyebrow: "Ko'paytirish", setup: "Madina savatlarni ko'rdi. Har bir savatda bir xil sonda olma bor.", ask: "Jami olmalar sonini qaysi ko'paytma to'g'ri ifodalaydi?", opts: ['4 × 4', '4 × 5', '5 × 5', '4 + 5'], correct: "To'g'ri. Beshta savat, har birida 4 ta — bu 4 × 5 = 20.", wrong: "Maslahat: nechta savat bor va har birida nechtadan? Ko'paytmada ikkalasi ham bo'lishi kerak." },
  ru: { eyebrow: 'Умножение', setup: 'Мадина увидела корзинки. В каждой поровну яблок.', ask: 'Какое произведение верно выражает общее число яблок?', opts: ['4 × 4', '4 × 5', '5 × 5', '4 + 5'], correct: 'Верно. Пять корзинок, в каждой по 4 — это 4 × 5 = 20.', wrong: 'Подсказка: сколько корзинок и сколько в каждой? В произведении оба числа.' },
};
export default function D04_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [lit, setLit] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setLit(5); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D01_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [0, 1, 2, 3, 4].forEach((k) => timers.current.push(setTimeout(() => setLit(k + 1), 400 + k * 350)));
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 1, label: '4 × 5' }, correct, meta: { tag: D01_DATA.tag, level: D01_DATA.level } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const Basket = ({ i }) => {
    const on = lit > i;
    return (
      <div style={{ padding: 8, borderRadius: 14, border: '2px solid ' + (on ? '#c2410c' : '#e5e7eb'), background: on ? '#fff7ed' : '#fafafa', transition: 'all .4s ease', transform: on ? 'translateY(-3px)' : 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {Array.from({ length: 4 }).map((_, k) => <span key={k} style={{ width: 15, height: 15, borderRadius: 999, background: '#dc2626', boxShadow: 'inset -2px -2px 0 rgba(0,0,0,.12)' }} />)}
        </div>
        {on && <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#c2410c', marginTop: 4 }}>4</div>}
      </div>
    );
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d4-pop { animation: d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d4-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', margin: '14px 0 8px' }}>
        {Array.from({ length: 5 }).map((_, i) => <Basket key={i} i={i} />)}
      </div>
      {lit >= 5 && <div className="d4-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 20, fontWeight: 800, color: '#c2410c', margin: '4px 0 6px' }}>4 × 5 = 20</div>}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 1, checked, isReview, { half: true, center: true, mono: true })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
