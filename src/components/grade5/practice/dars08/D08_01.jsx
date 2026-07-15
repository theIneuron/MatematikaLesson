// Dars08 · Amaliyot 01 — Kvadrat to'ri · 🟢 · Nilufar · tag: square_simple
// 5². 5×5 nuqta to'ri. Javob kiritish. To'g'ri javobdan keyin nuqtalar sanaladi.
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
  <div className="d8-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// daraja ko'rsatkichini yuqori indeks qilib chizish
const Pow = ({ base, exp, size = 30, color = '#1f2430' }) => (
  <span style={{ ...S.mono, fontWeight: 800, color }}>
    <span style={{ fontSize: size }}>{base}</span><sup style={{ fontSize: size * 0.6 }}>{exp}</sup>
  </span>
);

const D01_N = 5, D01_ANS = 25;
const D01_T = {
  uz: {
    eyebrow: 'Kvadrat', setup: "Nilufar nuqtalarni kvadrat to'r shaklida terdi: 5 qator, har qatorda 5 ta.",
    ask: "Bu 5² ga teng. 5² nechaga teng?", label: 'Javobni yozing:',
    correct: "To'g'ri. 5² = 5 × 5 = 25. To'rdagi barcha nuqtalar 25 ta.",
    wrong: "Maslahat: 5² — bu qo'shish (5+5) emas, ko'paytirish. Shu ikki amaldan qaysi biri kattaroq natija beradi?",
    rule: "Sonning kvadrati — uni o'ziga bir marta ko'paytirish: a² = a × a.",
  },
  ru: {
    eyebrow: 'Квадрат', setup: 'Нилуфар выложила точки квадратом: 5 рядов по 5 точек.',
    ask: 'Это равно 5². Чему равно 5²?', label: 'Запишите ответ:',
    correct: 'Верно. 5² = 5 × 5 = 25. Всего в сетке 25 точек.',
    wrong: 'Подсказка: 5² — это не сложение (5+5), а умножение. Какое из этих действий даёт больший результат?',
    rule: 'Квадрат числа — умножение его на себя: a² = a × a.',
  },
};
export default function D08_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [lit, setLit] = useState(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setLit(25); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D01_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) Array.from({ length: 25 }).forEach((_, k) => timers.current.push(setTimeout(() => setLit(k + 1), 300 + k * 55)));
    onSubmit?.({ questionText: '5²', options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D01_ANS }, correct, meta: { tag: 'square_simple', level: '🟢' } });
  }, [val, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d8-pop { animation: d8pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d8pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d8-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 22px)', gap: 8, padding: 14, borderRadius: 16, background: '#f8fafc', border: '1.5px solid #e5e7eb' }}>
          {Array.from({ length: 25 }).map((_, k) => (
            <span key={k} className={lit > k ? 'd8-pop' : undefined} style={{ width: 22, height: 22, borderRadius: 999, background: lit > k ? '#2563eb' : '#c7d2e8', transition: 'background .2s' }} />
          ))}
        </div>
      </div>
      {lit >= 25 && <div className="d8-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 18, fontWeight: 800, color: '#2563eb', marginBottom: 6 }}>5 × 5 = 25</div>}
      <div style={{ textAlign: 'center', margin: '6px 0 2px' }}><Pow base="5" exp="2" size={34} color="#1f2430" /></div>
      <p style={{ ...S.ask, fontSize: 15, color: '#6b7280', fontWeight: 700, textAlign: 'center', margin: '4px 0 8px' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
