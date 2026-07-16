// Dars04 · Amaliyot 07 — Qulay usul · 🔴 · Nilufar · tag: qulay_mul
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

/* =================== 07 · Qulay usul · 🔴 · qulay_mul =================== */

const D07_DATA = { correct: 3, tag: 'qulay_mul', level: '🔴' };
const D07_T = {
  uz: { eyebrow: 'Qulay usul', setup: "Ko'paytirishning guruhlash xossasi hisobni osonlashtiradi.", ask: '25 × 4 × 815 ni qulay usulda hisoblang.', opts: ['8 150', '20 375', '815 000', '81 500'], correct: "To'g'ri. Avval 25 × 4 = 100. Keyin 100 × 815 = 81 500.", wrong: "Maslahat: uch ko'paytuvchidan qaysi ikkitasi birga yumaloq (yuzli) son beradi? Guruhlashni o'shandan boshla." },
  ru: { eyebrow: 'Удобный способ', setup: 'Сочетательное свойство умножения облегчает счёт.', ask: '25 × 4 × 815 удобным способом.', opts: ['8 150', '20 375', '815 000', '81 500'], correct: 'Верно. Сначала 25 × 4 = 100. Затем 100 × 815 = 81 500.', wrong: 'Подсказка: какие два из трёх множителей дают вместе круглое (сотню) число? С них и начните группировку.' },
};
export default function D04_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStep(3); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 500], [2, 1400], [3, 2300]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setStep(v), ms)));
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 3, label: '81 500' }, correct, meta: { tag: D07_DATA.tag, level: D07_DATA.level } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  // boshida hamma karta bir xil (neytral); to'g'ri javobdan keyin 25 va 4 ajraladi
  const chip = (active, tone) => {
    const base = { ...S.mono, fontSize: 26, fontWeight: 800, padding: '6px 11px', borderRadius: 11, transition: 'all .5s ease' };
    if (!active) return { ...base, color: '#334155', background: '#f1f5f9', border: '2px solid #d6dae3' };
    const c = tone === 'v' ? '#7c3aed' : '#fe5b1a', bg = tone === 'v' ? '#f3e8ff' : '#ffe7d8';
    return { ...base, color: c, background: bg, border: '2px solid ' + c };
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '18px 0 6px', flexWrap: 'wrap' }}>
        <span style={chip(step >= 1, 'b')}>25</span>
        <span style={{ color: '#9aa1ad', fontWeight: 800 }}>×</span>
        <span style={chip(step >= 1, 'b')}>4</span>
        <span style={{ color: '#9aa1ad', fontWeight: 800 }}>×</span>
        <span style={chip(false, 'v')}>815</span>
      </div>
      <div style={{ textAlign: 'center', minHeight: 34, ...S.mono, fontSize: 20, fontWeight: 800 }}>
        {step >= 2 && <span className="d4-pop" style={{ color: '#fe5b1a' }}>25 × 4 = 100</span>}
      </div>
      <div style={{ textAlign: 'center', minHeight: 30, ...S.mono, fontSize: 22, fontWeight: 800, color: '#1a7f43' }}>
        {step >= 3 && <span className="d4-pop">100 × 815 = 81 500</span>}
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 3, checked, isReview, { half: true, center: true, mono: true })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
