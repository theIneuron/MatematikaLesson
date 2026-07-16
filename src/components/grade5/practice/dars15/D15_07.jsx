// Dars15 · Amaliyot 07 — Xatoni top · 🔴 · tag: find_wrong
// 4 ta teng-kasr yozuvidan biri xato: 1/2 = 1/6 (faqat maxraj o'zgargan).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d15-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

/* =================== 07 · Xatoni top · 🔴 · find_wrong (variant, misconception) =================== */
// 4 ta teng-kasr yozuvidan biri xato: 1/2 = 1/6 (faqat maxraj o'zgargan).

const D07_ROWS = [
  { txt: '1/2 = 3/6', ok: true },
  { txt: '2/3 = 4/6', ok: true },
  { txt: '1/2 = 1/6', ok: false }, // XATO — faqat maxraj
  { txt: '3/4 = 6/8', ok: true },
];
const D07_CORRECT = 2;
const D07_T = {
  uz: {
    eyebrow: 'Xatoni toping', setup: "Teng kasrlarning to'rtta yozuvi bor: uchtasi to'g'ri, bittasi — yo'q.",
    ask: "Qaysi yozuv NOTO'G'RI?",
    correct: "To'g'ri. 1/2 = 1/6 xato: faqat maxraj o'zgargan (2→6), surat esa o'zgarmagan. To'g'risi 1/2 = 3/6.",
    wrong: "Maslahat: har yozuvda surat va maxraj bir xil songa ko'paytirilganmi tekshiring. Faqat maxraj o'zgarsa — xato.",
    rule: "Faqat maxrajni o'zgartirish — xato. Surat ham birga o'zgarishi shart.",
  },
  ru: {
    eyebrow: 'Найдите ошибку', setup: 'Есть четыре записи равных дробей: три верны, одна — нет.',
    ask: 'Какая запись НЕВЕРНА?',
    correct: 'Верно. 1/2 = 1/6 неверно: изменился только знаменатель (2→6), а числитель нет. Правильно 1/2 = 3/6.',
    wrong: 'Подсказка: проверь, умножены ли числитель и знаменатель на одно число. Если менялся только знаменатель — ошибка.',
    rule: 'Менять только знаменатель — ошибка. Числитель должен меняться вместе.',
  },
};
export default function D15_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D07_ROWS.map((r, i) => ({ id: String(i), label: r.txt })), studentAnswer: { idx: picked }, correctAnswer: { idx: 2 }, correct, meta: { tag: 'find_wrong', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d15-pop { animation: d15pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d15pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d15-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {D07_ROWS.map((r, i) => {
          const on = picked === i;
          let bd = '#e2e8f0', bg = '#fff', col = '#334155';
          if (on) { bd = '#ffb488'; bg = '#fff5ef'; col = '#b83d0e'; }
          if (checked && on) { const ok = i === D07_CORRECT; bd = ok ? '#86efac' : '#fca5a5'; bg = ok ? '#f0fdf4' : '#fef2f2'; col = ok ? '#15803d' : '#b91c1c'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ ...S.mono, fontSize: 20, fontWeight: 800, padding: '14px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', textAlign: 'center', minHeight: 52 }}>{r.txt}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
