// Dars26 · Amaliyot 09 — Son o'qida yetishmaganini belgila · 🔴 · tag: dec_missing_numline
// 3,6 + ? = 5. Yetishmagan = 5 − 3,6 = 1,4. Son o'qida (0..2, qadam 0,2) 1,4 ni belgilash.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const MONO = "'JetBrains Mono', ui-monospace, monospace";
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 10px', textAlign: 'center' },
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

// Son o'qi 0..2, qadam 0,2 → 11 ta katak. To'g'ri = 1,4 (indeks 7).
const D09_VALUES = Array.from({ length: 11 }, (_, i) => Math.round(i * 2) / 10);
const D09_CORRECT = 7; // 1,4
const fmt = (v) => Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', ',');
const D09_T = {
  uz: {
    eyebrow: "Son o'qida belgila", setup: "Akmalda 3,6 litr suv bor. Idishni 5 litrga to'ldirish uchun yana qancha kerak?",
    expr: '3,6 + ? = 5',
    ask: "Yetishmagan sonni son o'qida belgilang:",
    correct: "To'g'ri: 5 − 3,6 = 1,4 litr — o'q ustidagi 1,4.",
    wrong: "3,6 ga qo'shsa 5 chiqishi kerak. Yetishmaganini qaysi amal beradi — qo'shish yoki ayirish?",
    rule: "Yetishmaganini topish — ayirish: 5 − 3,6.",
  },
  ru: {
    eyebrow: 'Отметь на прямой', setup: 'У Акмаля 3,6 литра воды. Сколько ещё нужно, чтобы наполнить сосуд до 5 литров?',
    expr: '3,6 + ? = 5',
    ask: 'Отметь недостающее число на числовой прямой:',
    correct: 'Верно: 5 − 3,6 = 1,4 литра — точка 1,4 на прямой.',
    wrong: 'К 3,6 надо прибавить, чтобы вышло 5. Какое действие даёт недостающее — сложение или вычитание?',
    rule: 'Недостающее находим вычитанием: 5 − 3,6.',
  },
};

export default function D26_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D09_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.expr, options: [], studentAnswer: { idx: pick, value: pick != null ? fmt(D09_VALUES[pick]) : null }, correctAnswer: { idx: D09_CORRECT, value: '1,4' }, correct, meta: { tag: 'dec_missing_numline', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const lineCol = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  return (
    <div style={S.wrap}>
      <style>{`
        .d26-pop { animation: d26pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d26pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d26-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0 2px', padding: '12px', borderRadius: 14, background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
        <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800, color: '#1f2430' }}>3,6</span>
        <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800, color: '#94a3b8', margin: '0 8px' }}>+</span>
        <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800, color: pick != null ? '#2563eb' : '#94a3b8' }}>{pick != null ? fmt(D09_VALUES[pick]) : '?'}</span>
        <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800, color: '#94a3b8', margin: '0 8px' }}>=</span>
        <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800, color: '#1f2430' }}>5</span>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ position: 'relative', margin: '30px 6px 6px', height: 64 }}>
        <div style={{ position: 'absolute', left: 8, right: 8, top: 12, height: 3, background: '#cbd5e1', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: 8, right: 8, top: 0, display: 'flex', justifyContent: 'space-between' }}>
          {D09_VALUES.map((v, i) => {
            const on = pick === i;
            const major = Number.isInteger(v);
            const okMark = checked && on;
            const dotCol = okMark ? lineCol : (on ? '#2563eb' : '#94a3b8');
            return (
              <button key={i} type="button" disabled={locked} onClick={() => setPick(i)} style={{ position: 'relative', width: 26, height: 60, border: 'none', background: 'transparent', cursor: locked ? 'default' : 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {on && <span className="d26-pop" style={{ position: 'absolute', top: -24, fontFamily: MONO, fontSize: 13, fontWeight: 800, color: lineCol, whiteSpace: 'nowrap' }}>{fmt(v)}</span>}
                <span style={{ width: on ? 16 : (major ? 10 : 7), height: on ? 16 : (major ? 10 : 7), borderRadius: '50%', marginTop: on ? 4 : (major ? 7 : 9), background: on ? dotCol : '#fff', border: '2.5px solid ' + (on ? dotCol : (major ? '#64748b' : '#cbd5e1')) }} />
                <span style={{ marginTop: 8, fontFamily: MONO, fontSize: major ? 14 : 10.5, fontWeight: major ? 800 : 600, color: major ? '#1f2430' : '#94a3b8' }}>{fmt(v)}</span>
              </button>
            );
          })}
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
