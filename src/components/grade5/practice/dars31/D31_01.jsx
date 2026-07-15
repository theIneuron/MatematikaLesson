// Dars31 · Amaliyot 01 — 200 ning 10% i · 🟢 · tag: of_ten
// "200 ning 10% i qancha?" → 20. Vizual: 10-katak lenta (bar emas). Rang: orange pill.
// Chizma javobni oshkor qilmaydi (10 bo'sh katak); to'g'ri javobdan keyin 1 katak to'ladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { dark: '#b45309', light: '#fff7ed', mid: '#fed7aa', fill: '#f59e0b', faint: '#fffbeb', soft: '#fde68a', muted: '#a56a3a' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.light, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d31-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function useCountUp(target, run, dur = 800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) { setN(0); return; }
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(target); return; }
    let raf, start = null;
    const step = (ts) => { if (start == null) start = ts; const p = Math.min(1, (ts - start) / dur); setN(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return n;
}
// 10 katakli lenta: 200 ta olma 10 bo'lakka. To'g'ri javobdan keyin 1 katak yonadi.
function Lenta10({ run }) {
  const w = 300, h = 46, x0 = 2, cw = (w - 4) / 10;
  const shown = useCountUp(20, run, 800);
  return (
    <div style={{ margin: '12px auto 4px', maxWidth: w }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...S.mono, fontSize: 12.5, fontWeight: 700, color: C.muted, marginBottom: 3 }}>
        <span>0</span><span>200 ta</span>
      </div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', maxWidth: '100%' }}>
        <rect x="1" y="1" width={w - 2} height={h - 2} rx="6" fill={C.faint} stroke={C.soft} strokeWidth="1.5" />
        {run && <rect className="d31-pop" x={x0} y="2" width={cw} height={h - 4} rx="5" fill={C.fill} />}
        {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={x0 + cw * (i + 1)} y1="2" x2={x0 + cw * (i + 1)} y2={h - 2} stroke={C.mid} strokeWidth="1.4" />)}
        {run && <text x={x0 + cw / 2} y={h / 2 + 5} textAnchor="middle" style={{ ...S.mono, fontSize: 13, fontWeight: 800 }} fill="#fff">20</text>}
      </svg>
      {run && <div className="d31-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 20, fontWeight: 800, color: C.dark, marginTop: 6 }}>{shown}</div>}
    </div>
  );
}

const D01_OPTS = [{ v: '20' }, { v: '2' }, { v: '100' }, { v: '210' }];
const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Foizni top', setup: "Do'konda 200 ta olma bor. Ulardan 10% ini sotdilar.",
    ask: '200 ning 10% i qancha?',
    correct: "To'g'ri. 200 : 100 = 2, 2 × 10 = 20.",
    wrong: "Butun 100% ga to'g'ri keladi. Sonning 1% i qancha — undan kerakli foizga qanday o'tasiz?",
    rule: "N% dan A = (A : 100) × N.",
  },
  ru: {
    eyebrow: 'Найди процент', setup: 'В магазине 200 яблок. Из них продали 10%.',
    ask: 'Сколько составляет 10% от 200?',
    correct: 'Верно. 200 : 100 = 2, 2 × 10 = 20.',
    wrong: 'Целое — это 100%. Сколько 1% от числа — и как от него перейти к нужному проценту?',
    rule: 'N% от A = (A : 100) × N.',
  },
};

export default function D31_01(props) {
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
    onSubmit?.({ questionText: t.ask, options: D01_OPTS.map((o, i) => ({ id: String(i), label: o.v })), studentAnswer: { idx: pick }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'of_ten', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d31-pop { animation: d31pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d31pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d31-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Lenta10 run={checked && fb?.correct} />
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '8px 0' }}>
        {D01_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = C.mid, bg = '#fff';
          if (on) { bd = C.fill; bg = C.light; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ padding: '14px 10px', borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer', ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>{o.v}</button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
