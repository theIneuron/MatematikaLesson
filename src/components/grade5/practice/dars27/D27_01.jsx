// Dars27 · Amaliyot 01 — 2,5 × 10 · 🟢 · tag: shift_x10
// Markaziy xato: ×10 = o'ngga nol qo'shish (2,50). To'g'ri: VERGUL bitta o'ngga → 25.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#6d28d9', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d27-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const D27STYLE = `
  .d27-pop { animation: d27pop .6s cubic-bezier(.34,1.4,.64,1) both; }
  @keyframes d27pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
  .d27-comma { animation: d27hop .9s ease both; }
  @keyframes d27hop { from { left: var(--from); } to { left: var(--to); } }
  .d27-zero { animation: d27zero .9s ease both; }
  @keyframes d27zero { 0%,55% { opacity: 0; } 100% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .d27-pop,.d27-comma,.d27-zero { animation: none !important; } }
`;
// Vergul-siljish vizuali. digitsAll — natija ko'rinishidagi raqamlar; startPos/endPos — vergul indeksi.
function CommaHop({ digitsAll, startPos, endPos, newIdx = [], reveal, cellW = 38 }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end', height: 50, ...S.mono }}>
      {digitsAll.map((d, i) => {
        const isNew = newIdx.includes(i);
        const hidden = isNew && !reveal;
        return <span key={i} className={reveal && isNew ? 'd27-zero' : ''} style={{ width: cellW, textAlign: 'center', fontSize: 34, fontWeight: 800, color: isNew ? '#6d28d9' : '#1f2430', opacity: hidden ? 0 : 1, lineHeight: 1.2 }}>{d}</span>;
      })}
      <span className={reveal ? 'd27-comma' : ''} style={{ position: 'absolute', bottom: 0, left: (reveal ? endPos : startPos) * cellW - 4, fontSize: 34, fontWeight: 800, color: '#1f2430', lineHeight: 1.2, '--from': (startPos * cellW - 4) + 'px', '--to': (endPos * cellW - 4) + 'px' }}>,</span>
    </div>
  );
}

const D01_OPTS = ['25', '2,50', '250', '0,25'];
const D01_CORRECT = 0; // 25
const D01_T = {
  uz: {
    eyebrow: "Ko'paytir", setup: "Alisher 2,5 ni 10 ga ko'paytiryapti.",
    ask: "2,5 × 10 = ?  To'g'ri javobni tanlang:",
    correct: "To'g'ri. ×10 da vergul bitta o'ngga siljiydi: 2,5 → 25.",
    wrong: "×10 — bu o'ngga nol qo'shish emas. Vergul bitta xona o'ngga siljiydi.",
    rule: "×10 — vergul 1 qadam o'ngga.",
  },
  ru: {
    eyebrow: 'Умножь', setup: 'Алишер умножает 2,5 на 10.',
    ask: '2,5 × 10 = ?  Выбери верный ответ:',
    correct: 'Верно. При ×10 запятая сдвигается на один вправо: 2,5 → 25.',
    wrong: '×10 — это не приписать ноль справа. Запятая сдвигается на один разряд вправо.',
    rule: '×10 — запятая на 1 шаг вправо.',
  },
};

export default function D27_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D01_OPTS.map((o, i) => ({ id: String(i), label: o })), studentAnswer: { idx: pick }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'shift_x10', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealHop = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{D27STYLE}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '8px 0 4px' }}>
        <CommaHop digitsAll={['2', '5']} startPos={1} endPos={2} reveal={revealHop} />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#6d28d9' }}>× 10</span>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {D01_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = '#6d28d9'; bg = '#f3edfe'; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ height: 58, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 24, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
