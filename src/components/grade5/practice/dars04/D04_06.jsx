// Dars04 · Amaliyot 06 — Ombor · 🟡 · Bekzod · tag: word_product
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

/* =================== 06 · Ombor · 🟡 · word_product =================== */

const D06_DATA = { correct: 1, tag: 'word_product', level: '🟡' };
const D06_T = {
  uz: { eyebrow: 'Ombor', setup: 'Bir qutida 24 ta sharbat bor. Omborda 15 ta shunday quti bor.', ask: 'Jami nechta sharbat bor?', opts: ['300', '360', '39', '345'], correct: "To'g'ri. 24 × 15 = 360 ta sharbat.", wrong: "Maslahat: bir qutida 24 ta, bir xil qutilar esa 15 ta. Teng guruhlarning jamisini qaysi amal topadi?", perBox: 'ta sharbat', boxes: '× 15 ta' },
  ru: { eyebrow: 'Склад', setup: 'В одной коробке 24 сока. На складе 15 таких коробок.', ask: 'Сколько всего соков?', opts: ['300', '360', '39', '345'], correct: 'Верно. 24 × 15 = 360 соков.', wrong: 'Подсказка: в одной коробке 24, а одинаковых коробок 15. Каким действием находят сумму равных групп?', perBox: 'соков', boxes: '× 15 шт' },
};
export default function D04_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fill, setFill] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setFill(15); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D06_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) Array.from({ length: 15 }).forEach((_, k) => timers.current.push(setTimeout(() => setFill(k + 1), 300 + k * 120)));
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 1, label: '360' }, correct, meta: { tag: D06_DATA.tag, level: D06_DATA.level } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d4-pop { animation: d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d4-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '8px 0' }}>
        <div style={{ flex: '1 1 130px', padding: '10px 12px', borderRadius: 13, background: '#fff0e8', border: '2px solid #bfd4fb', textAlign: 'center' }}>
          <div style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#b83d0e' }}>24</div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#ff8a52' }}>{t.perBox}</div>
        </div>
        <div style={{ flex: '1 1 130px', padding: '10px 12px', borderRadius: 13, background: '#fff0e8', border: '2px solid #bfd4fb', textAlign: 'center' }}>
          <div style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#b83d0e' }}>{t.boxes}</div>
        </div>
      </div>
      <div style={{ maxHeight: fill > 0 ? 44 : 0, opacity: fill > 0 ? 1 : 0, overflow: 'hidden', transition: 'max-height .5s ease, opacity .4s ease' }}>
        {fill >= 15 && <div className="d4-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 22, fontWeight: 800, color: '#c2410c', padding: '6px 0' }}>24 × 15 = 360</div>}
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 1, checked, isReview, { half: true, center: true, mono: true })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
