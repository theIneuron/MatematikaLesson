// Dars26 · Amaliyot 07 — Yugurish masalasi · 🔴 · tag: dec_word_multi
// 2 + 0,5 + 0,75 = 3,25 km (jami); 0,75 − 0,5 = 0,25 km (farq). Ikki o'nli input.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d26-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const decNum = (s) => parseFloat(String(s).replace(',', '.').trim());
const decValid = (s) => /^\d+([.,]\d+)?$/.test(String(s).trim());

const D07 = { jami: 3.25, farq: 0.25 };
const D07_T = {
  uz: {
    eyebrow: 'Masala', setup: "Jahongir ertalab 2 km, tushda 0,5 km, kechqurun 0,75 km yugurdi.",
    q1: 'Jami qancha km yugurdi?', q2: "Kechqurun tushdan qancha km ko'p yugurdi?", unit: 'km',
    correct: "To'g'ri. 2 + 0,5 + 0,75 = 3,25 km. Kechqurun 0,75 − 0,5 = 0,25 km ko'proq.",
    wrong: "«Jami» va «farq» qaysi amallar bilan topiladi? Har birida qaysi masofalar ishtirok etadi?",
    rule: "Butunni 2,00 deb yoz — xonalar tekislanadi.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Джахонгир пробежал утром 2 км, днём 0,5 км, вечером 0,75 км.',
    q1: 'Сколько всего км он пробежал?', q2: 'На сколько км вечером больше, чем днём?', unit: 'км',
    correct: 'Верно. 2 + 0,5 + 0,75 = 3,25 км. Вечером 0,75 − 0,5 = 0,25 км больше.',
    wrong: 'Какими действиями находят «сумму» и «разность»? Какие расстояния участвуют в каждом?',
    rule: 'Пиши целое как 2,00 — разряды выровняются.',
  },
};

export default function D26_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.jami != null) setA(String(s.jami)); if (s.farq != null) setB(String(s.farq)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = decValid(a) && decValid(b);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = Math.abs(decNum(a) - D07.jami) < 1e-9 && Math.abs(decNum(b) - D07.farq) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.q1 + ' / ' + t.q2, options: [], studentAnswer: { jami: a.replace('.', ','), farq: b.replace('.', ',') }, correctAnswer: { jami: '3,25', farq: '0,25' }, correct, meta: { tag: 'dec_word_multi', level: '🔴' } });
  }, [a, b, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bdOf = (v, ok) => checked ? (Math.abs(decNum(v) - ok) < 1e-9 ? '#1a7f43' : '#c0392b') : '#2563eb';
  const field = (label, val, set, ok) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '12px 14px' }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d.,]/g, '').slice(0, 6))} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 96, height: 46, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bdOf(val, ok), color: '#1f2430', fontFamily: MONO, background: '#fff' }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: '#64748b' }}>{t.unit}</span>
      </div>
    </div>
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d26-pop { animation: d26pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d26pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d26-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '10px 0' }}>
        {field(t.q1, a, setA, D07.jami)}
        {field(t.q2, b, setB, D07.farq)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
