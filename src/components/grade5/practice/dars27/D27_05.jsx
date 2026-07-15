// Dars27 · Amaliyot 05 — Xatoni top · 🟡 · tag: shift_error
// Nodira: 2,5 × 10 = 2,50 (o'ngga nol qo'shdi). Xato — nol qo'shishda; vergul siljishi kerak: 2,5 → 25.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#6d28d9', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d27-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const D27STYLE = `
  .d27-pop { animation: d27pop .6s cubic-bezier(.34,1.4,.64,1) both; }
  @keyframes d27pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .d27-pop { animation: none !important; } }
`;

const D05_CORRECT = 1; // 2-qadam — nol qo'shish
const D05_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Nodira 2,5 × 10 ni hisobladi va 2,50 deb yozdi. Uch qadamdan qaysi biri noto'g'ri?",
    ask: "Noto'g'ri qadamni bosing:",
    steps: ["2,5 sonini oldi", "o'ng tomonga nol qo'shdi: 2,5 → 2,50", "javob: 2,50"],
    correct: "To'g'ri. Xato — 2-qadamda: nol qo'shildi. Aslida vergul o'ngga siljishi kerak edi: 2,5 → 25.",
    wrong: "×10 da nol qo'shilmaydi — vergul o'ngga siljiydi. Qaysi qadamda nol qo'shilgan?",
    rule: "×10 da nol qo'shmang — vergulni o'ngga suring: 2,5 → 25.",
    fix: "To'g'risi:",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Нодира вычислила 2,5 × 10 и записала 2,50. Какой из трёх шагов неверный?',
    ask: 'Нажми неверный шаг:',
    steps: ['взяла число 2,5', 'приписала ноль справа: 2,5 → 2,50', 'ответ: 2,50'],
    correct: 'Верно. Ошибка на шаге 2: приписан ноль. На самом деле запятая должна сдвинуться вправо: 2,5 → 25.',
    wrong: '×10 — ноль не приписывается, запятая сдвигается вправо. На каком шаге приписан ноль?',
    rule: 'При ×10 не приписывай ноль — сдвинь запятую вправо: 2,5 → 25.',
    fix: 'Верно так:',
  },
};

export default function D27_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D05_CORRECT }, correct, meta: { tag: 'shift_error', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{D27STYLE}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px 0', padding: '10px', borderRadius: 12, background: '#fef7f7', border: '1.5px dashed #f6bcbc' }}>
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>2,5 × 10 =</span>
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#c0392b' }}>2,50</span>
      </div>
      {checked && fb?.correct && (
        <div className="d27-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '4px 0 8px' }}>
          <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: '#1a7f43' }}>{t.fix}</span>
          <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1a7f43' }}>2,5 × 10 = 25</span>
        </div>
      )}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((s, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#6d28d9'; bg = '#f3edfe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D05_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>
              <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: on ? (checked ? (i === D05_CORRECT ? '#1a7f43' : '#c0392b') : '#6d28d9') : '#eef2f7', color: on ? '#fff' : '#64748b', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Manrope', sans-serif" }}>{i + 1}</span>
              <span>{s}</span>
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
