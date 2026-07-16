// Dars22 · Amaliyot 08 — Qaysi aralash son · 🟢 · tag: to_mixed_choice
// 16/5 = 3⅕ (16:5 = 3, qoldiq 1). Tuzoqlar: 3⅖, 2⅕, 4⅕.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d22-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
const Mixed = ({ w, n, d, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
    <span style={{ ...S.mono, fontWeight: 800, fontSize: size + 6, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} />
  </span>
);

const D08_OPTS = [[3, 2, 5], [3, 1, 5], [2, 1, 5], [4, 1, 5]];
const D08_CORRECT = 1; // 3⅕
const D08_T = {
  uz: {
    eyebrow: 'Qaysi teng', setup: "Bekzod 16/5 ni aralash son ko'rinishida yozmoqchi.",
    ask: '16/5 qaysi aralash songa teng?',
    correct: "To'g'ri. 16 : 5 = 3, qoldiq 1. Ya'ni 3 butun va 1/5: 16/5 = 3⅕.",
    wrong: "Maslahat: 16 ta beshdan bo'lakda nechta to'liq butun (beshtalik guruh) bor va nechta ortadi?",
    rule: "Noto'g'ri → aralash: suratni maxrajga bo'ling. 16:5 = 3, qoldiq 1 → 3⅕.",
  },
  ru: {
    eyebrow: 'Что равно', setup: 'Бекзод хочет записать 16/5 смешанным числом.',
    ask: 'Какому смешанному числу равно 16/5?',
    correct: 'Верно. 16 : 5 = 3, остаток 1. То есть 3 целых и 1/5: 16/5 = 3⅕.',
    wrong: 'Подсказка: сколько целых (групп по 5) в 16 пятых и сколько останется?',
    rule: 'Неправильная → смешанное: раздели числитель на знаменатель. 16:5 = 3, остаток 1 → 3⅕.',
  },
};

export default function D22_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D08_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D08_OPTS.map((o, i) => ({ id: String(i), label: o.join(' ') })), studentAnswer: { idx: picked }, correctAnswer: { idx: D08_CORRECT }, correct, meta: { tag: 'to_mixed_choice', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d22-pop { animation: d22pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d22pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d22-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}><Frac num="16" den="5" size={38} color="#fe5b1a" /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {D08_OPTS.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D08_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: '1 1 40%', minWidth: 110, height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer' }}><Mixed w={o[0]} n={o[1]} d={o[2]} size={20} color={col} /></button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
