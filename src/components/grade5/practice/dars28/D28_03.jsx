// Dars28 · Amaliyot 03 — O'nta 0,1 · 🟢 · tag: mul_tenth_ten
// 0,1 × 10 = 1. Ha/Yo'q → Ha. Doira 10 ta o'ndan ulushga bo'lingan → to'lgan = butun 1.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#7c3aed', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 16, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d28-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Pirog: 10 ta o'ndan ulush. filled ta bo'lak purple bilan to'ladi.
function Pie({ filled, animate }) {
  const cx = 62, cy = 62, r = 54;
  const pt = (deg) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  return (
    <svg width="124" height="124" viewBox="0 0 124 124">
      <circle cx={cx} cy={cy} r={r} fill="#faf5ff" stroke="#c4b5fd" strokeWidth="1.5" />
      {Array.from({ length: 10 }).map((_, i) => {
        const [x0, y0] = pt(i * 36), [x1, y1] = pt((i + 1) * 36);
        const on = i < filled;
        return <path key={i} className={on && animate ? 'd28-seg' : undefined} style={on && animate ? { animationDelay: (i * 0.07) + 's' } : undefined} d={`M${cx} ${cy} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`} fill={on ? '#a78bfa' : 'transparent'} stroke="#c4b5fd" strokeWidth="1.2" />;
      })}
    </svg>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: "To'g'rimi?", setup: "Kamol aytdi: «0,1 ni 10 marta olsa, butun 1 hosil bo'ladi». Doira 10 ta teng ulushga bo'lingan, har biri — bitta o'ndan.",
    ask: "0,1 × 10 = 1. To'g'rimi?", yes: "Ha, to'g'ri", no: "Yo'q, noto'g'ri",
    correct: "To'g'ri. O'nta o'ndan (0,1) — bu butun doira, ya'ni 1. 0,1 × 10 = 1.",
    wrong: "Bitta butun doirada nechta 0,1 ulush bor? Shu sondagi ulushni yig'ing.",
    rule: "0,1 × 10 = 1. O'nta o'ndan = bitta butun.",
  },
  ru: {
    eyebrow: 'Верно ли?', setup: 'Камол сказал: «Если взять 0,1 десять раз, получится целая 1». Круг разделён на 10 равных долей, каждая — одна десятая.',
    ask: '0,1 × 10 = 1. Верно?', yes: 'Да, верно', no: 'Нет, неверно',
    correct: 'Верно. Десять десятых (0,1) — это весь круг, то есть 1. 0,1 × 10 = 1.',
    wrong: 'Сколько долей по 0,1 в одном целом круге? Собери столько долей.',
    rule: '0,1 × 10 = 1. Десять десятых = одно целое.',
  },
};

export default function D28_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.pick != null) { setPick(initialAnswer.studentAnswer.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'mul_tenth_ten', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const btn = (v, label) => {
    const on = pick === v;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#7c3aed'; bg = '#faf5ff'; col = '#1f2430'; }
    if (checked && on) { const ok = v === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(v)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d28-seg { transform-box: fill-box; transform-origin: center; animation: d28seg .45s ease both; }
        @keyframes d28seg { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .d28-pop, .d28-seg { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '10px 0' }}>
        <Pie filled={revealed ? 10 : 3} animate={revealed} />
        <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#7c3aed' }}>{revealed ? '0,1 × 10 = 1' : '0,1 × 10 = ?'}</span>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
