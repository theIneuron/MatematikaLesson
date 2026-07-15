// Dars02 · Amaliyot 01 — Turli xonali sonlarni taqqoslash · 🟢 · Bekzod · tag: compare_digits
// To'g'ri javobdan keyin: ? → belgi; ortiqcha raqamlar kulrangga o'tadi;
// qolgan "77" va "8" ranglanadi — solishtirish shu yerda.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
const SIGNS = ['<', '=', '>'];

const D01_L = '77417', D01_R = '8432', D01_KEEP_L = 2, D01_KEEP_R = 1, D01_SIGN = 2; // '>'
const D01_T = {
  uz: {
    eyebrow: 'Taqqoslash',
    setup: 'Bekzod ikki sonni taqqoslamoqchi. Belgini tanlang:',
    correct: "To'g'ri. 77 417 — besh xonali, 8432 — to'rt xonali. Xonalari ko'p son katta.",
    wrong: "Maslahat: sonlarni o'qimang, xonalarini sanang. Qaysi birida raqam ko'p?",
  },
  ru: {
    eyebrow: 'Сравнение',
    setup: 'Бекзод сравнивает два числа. Выберите знак:',
    correct: 'Верно. 77 417 — пятизначное, 8432 — четырёхзначное. Больше цифр — больше число.',
    wrong: 'Подсказка: не читайте числа, сосчитайте разряды. В каком из них цифр больше?',
  },
};

function D01_Num({ text, keep, phase, tone }) {
  return (
    <span style={{ display: 'inline-flex', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 30, fontWeight: 700 }}>
      {text.split('').map((c, i) => {
        const isTail = i >= keep;
        const gray = phase >= 2 && isTail;
        const lit = phase >= 3 && !isTail;
        return (
          <span key={i} style={{
            padding: '2px 1px', borderRadius: 5,
            color: gray ? '#c3c9d3' : (lit ? tone.fg : '#1f2430'),
            background: lit ? tone.bg : 'transparent',
            transition: 'color .6s ease, background .6s ease',
          }}>{c}</span>
        );
      })}
    </span>
  );
}

export default function D02_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [phase, setPhase] = useState(0); // 1 belgi · 2 kulrang · 3 ranglash
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPhase(3); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === D01_SIGN;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => setPhase(1), 350));
      timers.current.push(setTimeout(() => setPhase(2), 1300));
      timers.current.push(setTimeout(() => setPhase(3), 2300));
    }
    onSubmit?.({
      questionText: '77417 ? 8432', options: SIGNS.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: SIGNS[picked] },
      correctAnswer: { idx: D01_SIGN, label: '>' },
      correct, meta: { tag: 'compare_digits', level: '🟢' },
    });
  }, [picked, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const btn = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#1f2430';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; }
    if (show) { const ok = i === D01_SIGN; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, minHeight: 60, fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' };
  };

  return (
    <div style={S.wrap}>
      <style>{`
        .d-pop { animation: dpop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes dpop { 0% { opacity: 0; transform: scale(.4) rotate(-10deg); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '22px 0 20px' }}>
        <D01_Num text={D01_L} keep={D01_KEEP_L} phase={phase} tone={{ fg: '#166534', bg: '#dcfce7' }} />
        <span key={phase >= 1 ? 's' : 'q'} className={phase >= 1 ? 'd-pop' : undefined}
          style={{ fontSize: 28, fontWeight: 800, color: phase >= 1 ? '#1a7f43' : '#9aa1ad', minWidth: 28, textAlign: 'center' }}>
          {phase >= 1 ? '>' : '?'}
        </span>
        <D01_Num text={D01_R} keep={D01_KEEP_R} phase={phase} tone={{ fg: '#991b1b', bg: '#fee2e2' }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {SIGNS.map((o, i) => <button key={i} type="button" style={btn(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
