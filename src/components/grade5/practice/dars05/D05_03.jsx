// Dars05 · Amaliyot 03 — Tekshirish · 🟡 · tag: div_check
// Qaysi bo'linish to'g'ri. To'g'ri javobdan keyin teskari amal: 27 × 35 = 945.
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D03_ROWS = [
  { txt: '804 : 67 = 13', a: 13, b: 67, real: 871, ok: false },
  { txt: '945 : 35 = 27', a: 27, b: 35, real: 945, ok: true },
  { txt: '512 : 16 = 34', a: 34, b: 16, real: 544, ok: false },
  { txt: '672 : 56 = 11', a: 11, b: 56, real: 616, ok: false },
];
const D03_DATA = { correct: 1 };
const D03_T = {
  uz: {
    eyebrow: 'Tekshirish', setup: "Bo'linmani ko'paytirish bilan tekshirish mumkin: bo'linma × bo'luvchi = bo'linuvchi.",
    ask: "Qaysi bo'linish to'g'ri bajarilgan?",
    correct: "To'g'ri. 27 × 35 = 945 — tekshiruv mos keldi.",
    wrong: "Maslahat: har bir javobni tekshiring — bo'linmani bo'luvchiga ko'paytiring. Bo'linuvchi chiqadimi?",
  },
  ru: {
    eyebrow: 'Проверка', setup: 'Частное можно проверить умножением: частное × делитель = делимое.',
    ask: 'Какое деление выполнено верно?',
    correct: 'Верно. 27 × 35 = 945 — проверка сошлась.',
    wrong: 'Подсказка: проверьте каждый ответ — умножьте частное на делитель. Получится делимое?',
  },
};
export default function D05_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D03_DATA.correct;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 400);
    onSubmit?.({ questionText: t.ask, options: D03_ROWS.map((r, i) => ({ id: String(i), label: r.txt })), studentAnswer: { idx: picked }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'div_check', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rowStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === D03_DATA.correct; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, ...S.mono, minHeight: 48 };
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d5-pop { animation: d5pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d5pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d5-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      {D03_ROWS.map((r, i) => (
        <button key={i} type="button" style={rowStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>
          <span>{r.txt}</span>
          {reveal && r.ok && <span className="d5-pop" style={{ fontSize: 13, fontWeight: 800, color: '#1a7f43', background: '#dcfce7', padding: '3px 8px', borderRadius: 8 }}>{r.a} × {r.b} = {r.real} ✓</span>}
          {reveal && !r.ok && <span className="d5-pop" style={{ fontSize: 13, fontWeight: 800, color: '#c0392b', background: '#fdecec', padding: '3px 8px', borderRadius: 8 }}>{r.a} × {r.b} = {r.real}</span>}
        </button>
      ))}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
