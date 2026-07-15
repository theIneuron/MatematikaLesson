// Dars29 · Amaliyot 10 — Tuzoqli tanlov · 🔴 · tag: div_trap
// 7 : 0,7 = ? → 10. ×10/×10: 70 : 7 = 10. Tuzoq: 4,9 (=7×0,7), 1 (chalkashlik). 0,7 < 1 → natija katta.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#a21caf', background: '#fdf4ff', border: '1px solid #f5d0fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d29-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D10_OPTS = ['4,9', '10', '1'];
const D10_CORRECT = 1; // 10
const D10_T = {
  uz: {
    eyebrow: "Qaysi to'g'ri", setup: "Temur 7 : 0,7 ni hisobladi.",
    ask: '7 : 0,7 = ?',
    correct: "To'g'ri. Ikkalasini ×10: 70 : 7 = 10.",
    wrong: "Bo'luvchi 0,7 kasr. Uni butun qilish uchun ikkala songa nimani ko'paytirasiz? 0,7 birdan kichik.",
    rule: ":0,7 dan katta natija — chunki 0,7 birdan kichik.",
  },
  ru: {
    eyebrow: 'Что верно', setup: 'Темур вычисляет 7 : 0,7.',
    ask: '7 : 0,7 = ?',
    correct: 'Верно. Оба на ×10: 70 : 7 = 10.',
    wrong: 'Делитель 0,7 дробный. На что умножить оба, чтобы он стал целым? 0,7 меньше единицы.',
    rule: 'Результат больше — потому что 0,7 меньше единицы.',
  },
};

export default function D29_10(props) {
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
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'div_trap', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d29-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: '#1f2430', textAlign: 'center', margin: '8px 0' }}>7 : 0,7 = ?</div>
      <p style={{ ...S.ask, fontSize: 16, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        {D10_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ minWidth: 84, height: 62, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 26, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
