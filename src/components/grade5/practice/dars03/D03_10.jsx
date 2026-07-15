// Yig'indidan ayirish. To'g'ri javobdan keyin: 1956 va -956 bir-biriga tortiladi,
// 1000 ga aylanadi, 6642 bilan qo'shilib 7642 chiqadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
};
const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D10_T = {
  uz: {
    eyebrow: 'Qulay usul',
    setup: "Bu ifodani qulay usul bilan tez hisoblash mumkin.",
    ask: '(6 642 + 1 956) − 956 ni qulay usulda hisoblang.',
    opts: ['6 642', '7 642', '8 642', '7 542'],
    correct: "To'g'ri. Yig'indidan sonni ayirish uchun uni bitta qo'shiluvchidan ayirsa kifoya: 1956 − 956 = 1000, keyin 6642 + 1000 = 7642.",
    wrong: "Maslahat: 956 ni qaysi qo'shiluvchidan ayirsa qulay bo'ladi? 1956 ga qarang.",
  },
  ru: {
    eyebrow: 'Удобный способ',
    setup: 'Это выражение можно посчитать быстрым удобным способом.',
    ask: '(6 642 + 1 956) − 956 удобным способом.',
    opts: ['6 642', '7 642', '8 642', '7 542'],
    correct: 'Верно. Чтобы вычесть число из суммы, достаточно вычесть его из одного слагаемого: 1956 − 956 = 1000, затем 6642 + 1000 = 7642.',
    wrong: 'Подсказка: из какого слагаемого удобно вычесть 956? Посмотрите на 1956.',
  },
};

export default function D03_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0); // 1 956 ajraladi · 2 1000 · 3 6642+1000
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) { setPicked(sa.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStep(3); } }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 1;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) { [[1, 450], [2, 1400], [3, 2400]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setStep(v), ms))); }
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'qulay_sub', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === 1; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '13px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: "'JetBrains Mono', monospace", minHeight: 48 };
  };

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800 };

  return (
    <div style={S.wrap}>
      <style>{`
        .d3-pop { animation: d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d3-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ minHeight: 96, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, margin: '10px 0 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...mono }}>
          <span style={{ color: '#64748b' }}>6642</span>
          <span style={{ color: '#9aa1ad' }}>+</span>
          <span style={{ color: step >= 1 ? '#7c3aed' : '#1f2430', padding: '2px 6px', borderRadius: 8, background: step >= 1 && step < 2 ? '#f3e8ff' : 'transparent', transition: 'all .4s' }}>1956</span>
          <span style={{ color: step >= 1 ? '#7c3aed' : '#9aa1ad' }}>−</span>
          <span style={{ color: step >= 1 ? '#7c3aed' : '#1f2430' }}>956</span>
        </div>
        {step >= 2 && (
          <div className="d3-pop" style={{ textAlign: 'center', ...mono }}>
            <span style={{ color: '#64748b' }}>6642 + </span>
            <span style={{ color: '#7c3aed', padding: '2px 8px', borderRadius: 8, background: '#f3e8ff' }}>1000</span>
          </div>
        )}
        {step >= 3 && (
          <div className="d3-pop" style={{ textAlign: 'center', ...mono, color: '#1a7f43' }}>= 7642</div>
        )}
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
