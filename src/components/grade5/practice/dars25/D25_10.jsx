// Dars25 · Amaliyot 10 — Qaysi to'g'ri · 🔴 · tag: round_choice
// 2,97 ni o'ndan birgacha yaxlitla — O'TKAZMALI: yuzdan 7 ≥ 5 → o'ndan 9 → 10, butun oshadi. 2,97 ≈ 3,0.
// Tuzoqlar: 2,9 (pastga), 3 (butungacha), 2,97 (yaxlitmagan).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D10_OPTS = ['2,9', '3,0', '3', '2,97'];
const D10_CORRECT = 1; // 3,0
const D10_T = {
  uz: {
    eyebrow: "Qaysi to'g'ri", setup: "Alisher 2,97 ni o'ndan birgacha yaxlitlamoqchi. Yaxlitlanadigan xona — o'ndan (9).",
    ask: "o'ndan birgacha: 2,97 ≈ ?",
    correct: "To'g'ri. Keyingi xona 7 ≥ 5, o'ndan 9 → 10 o'tkazma beradi, butun oshadi. Demak 2,97 ≈ 3,0.",
    wrong: "o'ndan 9 va u bittaga oshsa nima bo'ladi? Butun xonaga qanday ta'sir qiladi?",
    rule: "o'tkazmali yaxlitlash: o'ndan 9 oshsa 10 bo'lib butunga o'tadi. 2,97 ≈ 3,0.",
  },
  ru: {
    eyebrow: 'Что верно', setup: 'Алишер хочет округлить 2,97 до десятых. Округляемый разряд — десятые (9).',
    ask: 'До десятых: 2,97 ≈ ?',
    correct: 'Верно. Следующий разряд 7 ≥ 5, десятые 9 → 10 дают перенос, целое растёт. Значит 2,97 ≈ 3,0.',
    wrong: 'Десятые 9, и если они увеличиваются на один — что произойдёт? Как это влияет на целое?',
    rule: 'Округление с переносом: десятые 9 растут до 10 и переходят в целое. 2,97 ≈ 3,0.',
  },
};

export default function D25_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'round_choice', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, margin: '8px 0' }}>
        <span style={{ ...S.mono, fontSize: 38, fontWeight: 800, color: '#1f2430' }}>2,</span>
        <span style={{ ...S.mono, fontSize: 38, fontWeight: 800, color: '#7c3aed', borderBottom: '3px solid #c4b5fd' }}>9</span>
        <span style={{ ...S.mono, fontSize: 38, fontWeight: 800, color: '#f59e0b', background: '#fef3c7', borderRadius: 6, padding: '0 3px' }}>7</span>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {D10_OPTS.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: '1 1 40%', minWidth: 110, height: 62, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 26, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
