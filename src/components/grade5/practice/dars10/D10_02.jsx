// Dars10 · Amaliyot 02 — Maxraj-ulush · 🟢 · denom_parts (variant + vizual)
// Birlik kesma nechaga bo'linadi? 3/5 → 5. Variant.
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
  <div className="d10-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = '#fff', bd = '#d6dae3', col = '#374151';
  if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}

const D02_DEN = 5, D02_CORRECT = 2;
const D02_T = {
  uz: {
    eyebrow: 'Maxraj-ulush', setup: "3/5 kasrini son o'qida belgilamoqchimiz.",
    ask: "Birlik kesmani (0 dan 1 gacha) necha teng qismga bo'lish kerak?",
    opts: ['3', '15', '5', '8'],
    correct: "To'g'ri. Maxraj 5 — birlik kesma 5 ta teng qismga bo'linadi.",
    wrong: "Maslahat: birlik kesma qismlari sonini kasrning qaysi qismi — surat yoki maxraj — belgilaydi?",
    rule: "Maxraj birlik kesma necha teng ulushga bo'linishini ko'rsatadi.",
  },
  ru: {
    eyebrow: 'Знаменатель-доли', setup: 'Хотим отметить дробь 3/5 на числовой оси.',
    ask: 'На сколько равных частей разделить единичный отрезок (от 0 до 1)?',
    opts: ['3', '15', '5', '8'],
    correct: 'Верно. Знаменатель 5 — единичный отрезок делится на 5 равных частей.',
    wrong: 'Подсказка: какая часть дроби — числитель или знаменатель — задаёт число частей отрезка?',
    rule: 'Знаменатель показывает, на сколько равных долей делится единичный отрезок.',
  },
};
export default function D10_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [split, setSplit] = useState(false);
  const [paint, setPaint] = useState(0); // nechta bo'lak bo'yaldi (chapdan o'ngga)
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) { setSplit(true); setPaint(3); } } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D02_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => setSplit(true), 400));
      [0, 1, 2].forEach((k) => timers.current.push(setTimeout(() => setPaint(k + 1), 1100 + k * 700)));
    }
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 2, label: '5' }, correct, meta: { tag: 'denom_parts', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d10-pop { animation: d10pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d10pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d10-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* birlik kesma: avval 5 ga bo'linadi, keyin 3 qismi chapdan o'ngga moviy bo'yaladi */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <div style={{ display: 'flex', width: 280, height: 44, border: '2.5px solid #38bdf8', borderRadius: 10, overflow: 'hidden' }}>
          {Array.from({ length: D02_DEN }).map((_, i) => {
            const filled = paint > i;
            return <div key={i} style={{ flex: 1, borderRight: i < D02_DEN - 1 ? '2px solid ' + (split ? '#38bdf8' : 'transparent') : 'none', background: filled ? '#38bdf8' : '#eff6ff', transition: 'border-color .5s ease, background .6s ease' }} />;
          })}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: 280, margin: '0 auto 6px', ...S.mono, fontSize: 13, fontWeight: 800, color: '#64748b' }}><span>0</span><span>1</span></div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 2, checked, isReview, { half: true, center: true, mono: true, fs: 20 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
