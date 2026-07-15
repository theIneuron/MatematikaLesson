// Dars09 · Amaliyot 06 — Bo'yalmagan qism · 🟡 · unshaded_fraction (to'r + variant)
// Shakl 8 ulush, 3 bo'yalgan. Bo'YALMAGAN qism qaysi kasr? (5/8) — tuzoq.
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
  <div className="d9-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D06_DEN = 8, D06_SH = 3, D06_CORRECT = 0; // bo'yalmagan 5/8
const D06_T = {
  uz: {
    eyebrow: "Bo'yalmagan", setup: "Quti teng bo'laklarga bo'lingan, ba'zilari bo'yalgan.",
    ask: "BO'YALMAGAN qism qaysi kasr bilan ifodalanadi?",
    opts: ['5/8', '3/8', '8/5', '5/3'],
    correct: "To'g'ri. 8 dan 3 tasi bo'yalgan, demak 5 tasi bo'yalmagan — 5/8.",
    wrong: "Maslahat: bo'yalmagan bo'laklarni sanang. Jami nechta ulush, bo'yalgani nechta? Qolgani — surat, jami — maxraj.",
    rule: "Bo'yalmagan qism = jami ulush − bo'yalgan. Maxraj o'zgarmaydi.",
  },
  ru: {
    eyebrow: 'Незакрашенная', setup: 'Коробка разделена на равные части, некоторые закрашены.',
    ask: 'Какой дробью выражена НЕЗАКРАШЕННАЯ часть?',
    opts: ['5/8', '3/8', '8/5', '5/3'],
    correct: 'Верно. Из 8 закрашено 3, значит не закрашено 5 — это 5/8.',
    wrong: 'Подсказка: сосчитай незакрашенные доли. Сколько всего долей, сколько закрашено? Остальные — числитель, всего — знаменатель.',
    rule: 'Незакрашенная часть = все доли − закрашенные. Знаменатель не меняется.',
  },
};
export default function D09_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 0, label: '5/8' }, correct, meta: { tag: 'unshaded_fraction', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d9-pop { animation: d9pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d9pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d9-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* 4×2 to'r, 3 bo'yalgan (to'q sariq), 5 bo'yalmagan */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 44px)', gap: 4 }}>
          {Array.from({ length: D06_DEN }).map((_, i) => <span key={i} style={{ width: 44, height: 44, borderRadius: 8, background: i < D06_SH ? '#f97316' : '#fff7ed', border: '2px solid ' + (i < D06_SH ? '#c2410c' : '#fed7aa') }} />)}
        </div>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 0, checked, isReview, { half: true, center: true, mono: true, fs: 20 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
