// Dars28 · Amaliyot 01 — Katta yoki kichik · 🟢 · tag: mul_size
// 0,5 × 6 oltidan katta bo'ladimi? Yo'q — 0,5 yarmi, 6 ning yarmi = 3 < 6.
// Vizual: taqqoslash ustunlari (6 vs 3) — faqat to'g'ri javobdan keyin. jsx-question kontrakti. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#b45309', background: '#fff7ed', border: '1px solid #fed7aa', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d28-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Taqqoslash ustunlari: 6 (to'liq) va 3 (0,5×6) — 3 ning 6 dan kaltaligini ko'rsatadi
function CompareBars({ lang }) {
  const row = (label, frac, big) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#9a3412', width: 66, textAlign: 'right' }}>{label}</span>
      <div style={{ position: 'relative', width: 220, maxWidth: '52vw', height: 26, borderRadius: 7, background: '#fff7ed', border: '1.5px solid #fed7aa', overflow: 'hidden' }}>
        <div className="d28-fill" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (frac * 100) + '%', background: big ? '#fdba74' : '#f97316', animationDelay: big ? '0s' : '.35s' }} />
      </div>
    </div>
  );
  return (
    <div className="d28-pop" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', margin: '4px auto 4px', padding: '14px 16px', borderRadius: 14, background: '#fffbf5', border: '1.5px solid #fed7aa', width: 'fit-content' }}>
      {row('6', 1, true)}
      {row('0,5 × 6', 0.5, false)}
      <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: '#b45309' }}>0,5 × 6 = 3  ({lang === 'uz' ? '6 dan kichik' : 'меньше 6'})</span>
    </div>
  );
}

const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Katta yoki kichik', setup: "Madina aytdi: «0,5 × 6 — bu oltidan katta».",
    ask: '0,5 × 6 natijasi 6 dan qanday?',
    opts: ['Kichik (6 dan kichik)', 'Katta (6 dan katta)', 'Teng (6 ga teng)'],
    correct: "To'g'ri. 0,5 — bu yarmi. 6 ning yarmi = 3, u 6 dan KICHIK.",
    wrong: "0,5 — bu yarmi. Sonning yarmini olganda u kattalashadimi yoki kichrayadimi?",
    rule: "1 dan kichikka ko'paytirsangiz — natija kichrayadi.",
  },
  ru: {
    eyebrow: 'Больше или меньше', setup: 'Мадина сказала: «0,5 × 6 — это больше шести».',
    ask: 'Результат 0,5 × 6 по сравнению с 6 какой?',
    opts: ['Меньше (меньше 6)', 'Больше (больше 6)', 'Равно (равно 6)'],
    correct: 'Верно. 0,5 — это половина. Половина 6 = 3, это МЕНЬШЕ 6.',
    wrong: '0,5 — это половина. Если взять половину числа, оно станет больше или меньше?',
    rule: 'Если умножаешь на число меньше 1 — результат уменьшается.',
  },
};

export default function D28_01(props) {
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
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'mul_size', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d28-fill { transform-origin: left center; animation: d28grow .7s ease both; }
        @keyframes d28grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .d28-pop, .d28-fill { animation: none !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}><CompareBars lang={lang} /></div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' }}>
        {t.opts.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#ea580c'; bg = '#fff7ed'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
