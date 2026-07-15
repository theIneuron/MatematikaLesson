// Dars29 · Amaliyot 07 — Butun bo'lishga aylantir · 🔴 · tag: div_equiv
// 1,5 : 0,3 ni butun bo'lishga keltiring: ikkala songa ×10 → 15 : 3 = 5. Uch input (15, 3, 5).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#4338ca', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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

const D07_A = 15, D07_B = 3, D07_R = 5;
const D07_T = {
  uz: {
    eyebrow: "Butun bo'lishga aylantir", setup: "Kamola 1,5 : 0,3 ni oson hisoblamoqchi.",
    ask: "Buni butun sonli bo'lishga aylantiring — kataklarni to'ldiring:",
    l1: '×10 →', l2: 'natija',
    correct: "To'g'ri. Ikkalasini ×10: 15 : 3 = 5.",
    wrong: "Bo'luvchini butun qilsangiz bo'lish osonlashadi. Ikkala songa ham qaysi songa ko'paytirasiz?",
    rule: "Bo'luvchini butun qilib, bo'linuvchini ham ×10.",
  },
  ru: {
    eyebrow: 'Сделай деление целым', setup: 'Камола хочет легко вычислить 1,5 : 0,3.',
    ask: 'Преврати в деление на целое — заполни клетки:',
    l1: '×10 →', l2: 'результат',
    correct: 'Верно. Оба на ×10: 15 : 3 = 5.',
    wrong: 'Если сделать делитель целым, делить проще. На какое число умножить оба?',
    rule: 'Сделай делитель целым и делимое тоже ×10.',
  },
};

export default function D29_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [r, setR] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.a != null) setA(String(sa.a)); if (sa.b != null) setB(String(sa.b)); if (sa.r != null) setR(String(sa.r)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a.trim()) && /^\d+$/.test(b.trim()) && /^\d+$/.test(r.trim());
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D07_A && parseInt(b, 10) === D07_B && parseInt(r, 10) === D07_R;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), b: parseInt(b, 10), r: parseInt(r, 10) }, correctAnswer: { a: D07_A, b: D07_B, r: D07_R }, correct, meta: { tag: 'div_equiv', level: '🔴' } });
  }, [a, b, r, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = (v, ans) => checked ? (parseInt(v, 10) === ans ? '#1a7f43' : '#c0392b') : (v.trim() ? '#2563eb' : '#cbd5e1');
  const box = (v, set, ans) => (
    <input value={v} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 56, height: 48, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd(v, ans), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
  );
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d29-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '8px 0 4px' }}>
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>1,5 : 0,3</span>
        {revealed && <span className="d29-pop" style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#d97706' }}>{t.l1}</span>}
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center', margin: '10px 0' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {box(a, setA, D07_A)}
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>:</span>
        {box(b, setB, D07_B)}
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>=</span>
        {box(r, setR, D07_R)}
      </div>
      <p style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 700, textAlign: 'center', margin: '6px 0 0' }}>{t.l2}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
