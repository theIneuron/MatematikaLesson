// Dars08 · Amaliyot 07 — Ming · 🔴 · Sardor · tag: cube_ten
// 10³. To'g'ri javobdan keyin 10 → 100 → 1000 nollar qo'shiladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d8-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = '#fff', bd = '#d6dae3', col = '#374151';
  if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}
// daraja ko'rsatkichini yuqori indeks qilib chizish
const Pow = ({ base, exp, size = 30, color = '#1f2430' }) => (
  <span style={{ ...S.mono, fontWeight: 800, color }}>
    <span style={{ fontSize: size }}>{base}</span><sup style={{ fontSize: size * 0.6 }}>{exp}</sup>
  </span>
);

const D07_DATA = { correct: 1 };
const D07_T = {
  uz: {
    eyebrow: 'Ming', setup: "Sardor 10 ni uch marta ko'paytirmoqchi.",
    ask: '10³ nechaga teng?',
    opts: ['100', '1000', '30', '300'],
    correct: "To'g'ri. 10³ = 10 × 10 × 10 = 1000. Ko'rsatkich nechta bo'lsa, shuncha nol.",
    wrong: "Maslahat: 10 ni uch marta o'zaro ko'paytiring. Har qadamda qancha hosil bo'ladi?",
    rule: "10 ning darajasida nollar soni = ko'rsatkichga teng. 10³ — uch nol.",
  },
  ru: {
    eyebrow: 'Тысяча', setup: 'Сардор хочет умножить 10 три раза.',
    ask: 'Чему равно 10³?',
    opts: ['100', '1000', '30', '300'],
    correct: 'Верно. 10³ = 10 × 10 × 10 = 1000. Сколько показатель — столько нулей.',
    wrong: 'Подсказка: умножьте 10 на себя три раза. Что получается на каждом шаге?',
    rule: 'В степени 10 число нулей = показателю. 10³ — три нуля.',
  },
};
export default function D08_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0); // 0 → 10 · 1 → 100 · 2 → 1000
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStep(2); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [[1, 600], [2, 1400]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setStep(v), ms)));
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 1, label: '1000' }, correct, meta: { tag: 'cube_ten', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const nums = ['10', '100', '1000'];
  const labels = ['10¹', '10²', '10³'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d8-pop { animation: d8pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d8pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d8-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ textAlign: 'center', margin: '10px 0 8px' }}><Pow base="10" exp="3" size={40} /></div>
      {/* nollar qo'shilishi to'g'ri javobdan keyin */}
      <div style={{ maxHeight: step > 0 ? 60 : 0, opacity: step > 0 ? 1 : 0, overflow: 'hidden', transition: 'max-height .5s ease, opacity .45s ease' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
          {[0, 1, 2].map((k) => (
            <React.Fragment key={k}>
              {k > 0 && <span style={{ color: '#cbd5e1', ...S.mono, fontSize: 18 }}>→</span>}
              <span className={step >= k ? 'd8-pop' : undefined} style={{ ...S.mono, fontSize: 21, fontWeight: 800, color: step >= k ? (k === 2 ? '#1a7f43' : '#2563eb') : '#e5e7eb', opacity: step >= k ? 1 : 0.3, padding: '5px 10px', borderRadius: 10, background: step >= k ? (k === 2 ? '#e8f7ee' : '#eff6ff') : 'transparent' }}>{nums[k]}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 1, checked, isReview, { half: true, center: true, mono: true, fs: 19 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
