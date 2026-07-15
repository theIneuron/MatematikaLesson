// Dars04 · Amaliyot 04 — Yashirin ko'paytuvchi · 🟡 · Nilufar · tag: missing_factor
// 125 × ☐ = 10 × 10 × 10. Bola bo'sh katakka yo'qolgan ko'paytuvchini yozadi.
// To'g'ri javobdan keyin o'ng tomon 1000 ga aylanadi, tenglik yashil bo'ladi.
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

/* =================== 04 · Yashirin ko'paytuvchi · 🟡 · missing_factor =================== */

const D04_ANS = 8;
const D04_T = {
  uz: {
    eyebrow: "Yo'qolgan son",
    setup: "Nilufar tenglikni yozdi, lekin bitta son yo'qoldi. O'ng tomon 10 × 10 × 10 = 1000.",
    ask: "Bo'sh katakka qaysi son kelishi kerak?",
    label: "Yo'qolgan sonni yozing:",
    correct: "To'g'ri. 125 × 8 = 1000. Sakkizta 125 — aynan bir ming.",
    wrong: "Maslahat: 125 ni qaysi songa ko'paytirsak 1000 chiqadi? O'ng tomon allaqachon 1000 ekanini eslang.",
  },
  ru: {
    eyebrow: 'Пропущенное число',
    setup: 'Нилуфар записала равенство, но одно число потерялось. Справа 10 × 10 × 10 = 1000.',
    ask: 'Какое число должно стоять в пустой клетке?',
    label: 'Впишите пропущенное число:',
    correct: 'Верно. 125 × 8 = 1000. Восемь раз по 125 — ровно тысяча.',
    wrong: 'Подсказка: на какое число нужно умножить 125, чтобы получить 1000? Справа уже стоит 1000.',
  },
};

export default function D04_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [glow, setGlow] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setGlow(4); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D04_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [0, 1, 2, 3].forEach((k) => timers.current.push(setTimeout(() => setGlow(k + 1), 500 + k * 350)));
    onSubmit?.({ questionText: '125 × ? = 1000', options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D04_ANS }, correct, meta: { tag: 'missing_factor', level: '🟡' } });
  }, [val, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  const chars = ['1', '0', '0', '0'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d4-pop { animation: d4pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d4pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d4-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '18px 0 14px', ...S.mono, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: '#1f2430' }}>125</span>
        <span style={{ fontSize: 26, fontWeight: 800, color: '#6b7280' }}>×</span>
        {/* bo'sh katak */}
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="☐"
          style={{ width: 52, height: 54, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 11, border: '2px solid ' + (checked ? bd : '#93c5fd'), color: '#1e40af', fontFamily: "'JetBrains Mono', monospace", background: checked ? '#fff' : '#eff6ff' }} />
        <span style={{ fontSize: 26, fontWeight: 800, color: '#6b7280' }}>=</span>
        {/* o'ng tomon: 10×10×10, to'g'ri javobdan keyin 1000 bo'ladi */}
        {glow === 0
          ? <span style={{ fontSize: 22, fontWeight: 800, color: '#7c3aed' }}>10 × 10 × 10</span>
          : <span style={{ display: 'inline-flex', gap: 2 }}>{chars.map((c, i) => { const on = glow > i; return <span key={i} className={on ? 'd4-pop' : undefined} style={{ fontSize: 32, fontWeight: 800, color: i === 0 ? '#c2410c' : '#f59e0b', textShadow: i > 0 ? '0 0 12px rgba(245,158,11,.55)' : 'none', opacity: on ? 1 : 0 }}>{c}</span>; })}</span>}
      </div>

      <p style={{ ...S.ask, fontSize: 15, color: '#6b7280', fontWeight: 700 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
