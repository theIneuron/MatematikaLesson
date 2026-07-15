// Dars28 · Amaliyot 10 — Kasr × kasr · 🔴 · tag: mul_frac_frac
// 0,4 × 0,5 = 0,2. Yuza to'ri: birlik kvadratda 0,4 keng × 0,5 baland → yuza 0,20 = 0,2. MCQ.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#a21caf', background: '#fdf4ff', border: '1px solid #f5d0fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
// Yuza to'ri: birlik kvadrat 10×10, 0,4 keng × 0,5 baland blok sekin bo'yaladi
function UnitSquare({ show }) {
  const G = 160;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: G, height: G, border: '2px solid #94a3b8', borderRadius: 4, backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: (G / 10) + 'px ' + (G / 10) + 'px' }}>
        {show && <div className="d28-fill" style={{ position: 'absolute', left: 0, top: 0, width: '40%', height: '50%', background: 'rgba(240,171,252,.7)', borderRight: '2px solid #a21caf', borderBottom: '2px solid #a21caf' }} />}
      </div>
      <div style={{ display: 'flex', gap: 18, ...S.mono, fontSize: 12.5, fontWeight: 800, color: '#a21caf' }}><span>↔ 0,4</span><span>↕ 0,5</span></div>
    </div>
  );
}

const D10_OPTS = ['2', '0,2', '0,9', '0,02'];
const D10_CORRECT = 1;
const D10_T = {
  uz: {
    eyebrow: 'Kasr × kasr', setup: "Temur 0,4 × 0,5 ni hisoblamoqchi. Bu — birlik kvadratdan 0,4 keng va 0,5 balandlikdagi yuza.",
    ask: '0,4 × 0,5 = ?',
    correct: "To'g'ri. 4 × 5 = 20, 2 kasr xona → 0,20 = 0,2. Bu — kvadratning bo'yalgan yuzasi.",
    wrong: "Ikkala ko'paytuvchida jami nechta kasr xona bor? Natijadagi kasr xona soni shunga bog'liq.",
    rule: "×0,5 — yarmini olish. 0,4 ning yarmi = 0,2.",
  },
  ru: {
    eyebrow: 'Дробь × дробь', setup: 'Темур хочет посчитать 0,4 × 0,5. Это площадь: из единичного квадрата 0,4 в ширину и 0,5 в высоту.',
    ask: '0,4 × 0,5 = ?',
    correct: 'Верно. 4 × 5 = 20, 2 дробных разряда → 0,20 = 0,2. Это закрашенная площадь квадрата.',
    wrong: 'Сколько всего дробных разрядов в обоих множителях? От этого зависит их число в ответе.',
    rule: '×0,5 — взять половину. Половина 0,4 = 0,2.',
  },
};

export default function D28_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'mul_frac_frac', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d28-fill { transform-origin: left top; animation: d28grow .8s ease both; }
        @keyframes d28grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .d28-pop, .d28-fill { animation: none !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}><UnitSquare show={checked && fb?.correct} /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '8px 0' }}>
        {D10_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = '#a21caf'; bg = '#fdf4ff'; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 26, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
