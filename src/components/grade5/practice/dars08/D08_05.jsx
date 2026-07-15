// Dars08 · Amaliyot 05 — Xatoni top · 🟡 · Aziza · tag: find_wrong_power
// To'rt daraja tenglik, bittasida xato (6²=12). To'g'ri javobdan keyin xato ochiladi.
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

const D05_ROWS = [
  { txt: '5² = 25', a: 5, e: 2, real: 25, ok: true },
  { txt: '6² = 12', a: 6, e: 2, real: 36, ok: false },
  { txt: '2³ = 8', a: 2, e: 3, real: 8, ok: true },
  { txt: '10² = 100', a: 10, e: 2, real: 100, ok: true },
];
const D05_DATA = { correct: 1 };
const D05_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Aziza to'rt daraja hisobladi. Bittasida xato bor.",
    ask: 'Qaysi qatorda XATO bor?',
    correct: "To'g'ri. 6² = 6 × 6 = 36, 12 emas. 12 — bu 6+6, daraja emas.",
    wrong: "Maslahat: har qatorni alohida tekshiring. Daraja — ko'paytirish, qo'shish emas. Biror qatorda ko'paytirish o'rniga qo'shib yuborilmaganmi?",
    rule: "Daraja — ko'paytirish, qo'shish emas: a² = a × a, a + a emas.",
  },
  ru: {
    eyebrow: 'Найдите ошибку', setup: 'Азиза посчитала четыре степени. В одной ошибка.',
    ask: 'В какой строке ОШИБКА?',
    correct: 'Верно. 6² = 6 × 6 = 36, а не 12. 12 — это 6+6, не степень.',
    wrong: 'Подсказка: проверьте каждую строку отдельно. Степень — умножение, не сложение. Не сложили ли где-то вместо умножения?',
    rule: 'Степень — умножение, не сложение: a² = a × a, а не a + a.',
  },
};
export default function D08_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D05_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 400);
    onSubmit?.({ questionText: t.ask, options: D05_ROWS.map((r, i) => ({ id: String(i), label: r.txt })), studentAnswer: { idx: picked }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'find_wrong_power', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rowStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === D05_DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 17, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, ...S.mono, minHeight: 48 };
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d8-pop { animation: d8pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d8pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d8-shake { animation: d8shake .5s ease-in-out 2; }
        @keyframes d8shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        @media (prefers-reduced-motion: reduce) { .d8-pop, .d8-shake { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      {D05_ROWS.map((r, i) => (
        <button key={i} type="button" className={reveal && !r.ok ? "d8-shake" : undefined} style={rowStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>
          <span>{r.txt}</span>
          {reveal && !r.ok && <span className="d8-pop" style={{ fontSize: 12.5, fontWeight: 800, color: '#c0392b', background: '#fdecec', padding: '3px 8px', borderRadius: 8 }}>{r.a} × {r.a} = {r.real}</span>}
          {reveal && r.ok && <span className="d8-pop" style={{ fontSize: 15, color: '#1a7f43' }}>✓</span>}
        </button>
      ))}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
