// Dars10 · Amaliyot 07 — Yaqin butun · 🔴 · nearest_integer (o'q + variant)
// 5/6 qaysi butunga yaqin? 1. To'g'ri javobdan keyin masofalar ko'rsatiladi.
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
const RuleChip = ({ text }) => (
  <div className="d10-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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
  if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}
// son o'qi: lo..hi butun, har birlik den ulushga bo'lingan. marker — {val, den, color, label}
const NumLine = ({ lo, hi, den, markers = [], showFrac = true, height = 84 }) => {
  const total = hi - lo; const W = 100 / (total * den);
  const ticks = [];
  for (let u = 0; u <= total * den; u++) { const val = lo + u / den; const isInt = u % den === 0; ticks.push({ u, val, isInt }); }
  return (
    <div style={{ position: 'relative', height, margin: '10px 8px 4px' }}>
      <div style={{ position: 'absolute', left: '2%', right: '2%', top: height * 0.5, height: 3, background: '#bae6fd', borderRadius: 2 }} />
      {ticks.map((tk) => (
        <div key={tk.u} style={{ position: 'absolute', left: `calc(2% + ${tk.u * W * 0.96}%)`, top: height * 0.5 - (tk.isInt ? 9 : 6), transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ width: tk.isInt ? 3 : 2, height: tk.isInt ? 18 : 12, background: tk.isInt ? '#64748b' : '#cbd5e1', margin: '0 auto', borderRadius: 2 }} />
          {tk.isInt && <div style={{ marginTop: 4, fontSize: 12, fontWeight: 800, color: '#64748b', ...S.mono }}>{tk.val}</div>}
        </div>
      ))}
      {markers.map((m, i) => {
        const uPos = (m.val - lo) * den;
        return (
          <div key={i} style={{ position: 'absolute', left: `calc(2% + ${uPos * W * 0.96}%)`, top: 0, transform: 'translateX(-50%)', textAlign: 'center', transition: 'left .6s cubic-bezier(.34,1.56,.64,1)' }}>
            {m.label && <div style={{ fontSize: 11, fontWeight: 800, color: m.color || '#fe5b1a', marginBottom: 2, ...S.mono, whiteSpace: 'nowrap' }}>{m.label}</div>}
            <div style={{ width: 16, height: 16, borderRadius: 999, background: m.color || '#fe5b1a', margin: '0 auto', border: '3px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
          </div>
        );
      })}
    </div>
  );
};

const D07_CORRECT = 0; // 1
const D07_T = {
  uz: {
    eyebrow: 'Yaqin butun', setup: "Nilufar 5/6 nuqtasini son o'qida ko'rdi.",
    ask: '5/6 qaysi butun songa yaqinroq?',
    opts: ['1', '0', "Teng masofada", "Aniqlab bo'lmaydi"],
    correct: "To'g'ri. 5/6 — 1 gacha atigi 1/6 qoldi, 0 dan esa 5/6 uzoq. 1 ga yaqinroq.",
    wrong: "Maslahat: 5/6 dan 1 gacha necha ulush? 0 dan 5/6 gacha-chi? Qaysi masofa kichik?",
    rule: "Kasr 1/2 dan katta bo'lsa, katta butunga yaqinroq bo'ladi.",
  },
  ru: {
    eyebrow: 'Ближайшее целое', setup: 'Нилуфар увидела точку 5/6 на оси.',
    ask: 'К какому целому ближе 5/6?',
    opts: ['1', '0', 'На равном расстоянии', 'Нельзя определить'],
    correct: 'Верно. От 5/6 до 1 осталась 1/6, а от 0 — целых 5/6. Ближе к 1.',
    wrong: 'Подсказка: сколько долей от 5/6 до 1? А от 0 до 5/6? Какое расстояние меньше?',
    rule: 'Если дробь больше 1/2, она ближе к большему целому.',
  },
};
export default function D10_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setShow(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setShow(true), 350);
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 0, label: '1' }, correct, meta: { tag: 'nearest_integer', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d10-pop { animation: d10pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d10pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d10-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <NumLine lo={0} hi={1} den={6} markers={[{ val: 5 / 6, color: '#0ea5e9', label: '5/6' }]} />
      {/* masofa izohi to'g'ri javobdan keyin */}
      <div style={{ maxHeight: show ? 40 : 0, opacity: show ? 1 : 0, overflow: 'hidden', transition: 'all .5s ease' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 6 }}>
          <span className="d10-pop" style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#94a3b8', background: '#f1f5f9', padding: '5px 10px', borderRadius: 9 }}>0 gacha: 5/6</span>
          <span className="d10-pop" style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#1a7f43', background: '#e8f7ee', padding: '5px 10px', borderRadius: 9 }}>1 gacha: 1/6 ✓</span>
        </div>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 0, checked, isReview, { half: true, center: true, fs: 16 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
