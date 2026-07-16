// To'g'ri hisoblangan ayirmani topish. To'g'ri javobdan keyin tekshirish
// ko'rsatiladi: 1559 + 599 "yig'iladi" va 2158 ga tenglashadi (yashil).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
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

const D05_OPTS = [
  { txt: '2601 − 765 = 1936', ok: false },
  { txt: '10 032 − 2255 = 7877', ok: false },
  { txt: '2158 − 599 = 1559', ok: true },
  { txt: '2201 − 345 = 1756', ok: false },
];
const D05_CORRECT = 2;
const D05_T = {
  uz: {
    eyebrow: 'Tekshirish',
    setup: "Quyidagi ayirishlardan biri to'g'ri hisoblangan.",
    ask: "Qaysi ayirma to'g'ri hisoblangan?",
    correct: "To'g'ri. 1559 + 599 = 2158 — tekshiruv mos keldi. Ayirma + ayiriluvchi = kamayuvchi.",
    wrong: "Maslahat: har bir javobni tekshiring — ayirmaga ayiriluvchini qo'shing. Natija kamayuvchiga tengmi?",
  },
  ru: {
    eyebrow: 'Проверка',
    setup: 'Одна из разностей ниже вычислена верно.',
    ask: 'Какая разность вычислена верно?',
    correct: 'Верно. 1559 + 599 = 2158 — проверка сошлась. Разность + вычитаемое = уменьшаемое.',
    wrong: 'Подсказка: проверьте каждый ответ — прибавьте к разности вычитаемое. Получится ли уменьшаемое?',
  },
};

export default function D03_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0); // 1 + ko'rinadi · 2 = natija · 3 tenglik yashil
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) { setPicked(sa.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStep(3); } }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === D05_CORRECT;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) { [[1, 400], [2, 1200], [3, 2100]].forEach(([v, ms]) => timers.current.push(setTimeout(() => setStep(v), ms))); }
    onSubmit?.({ questionText: t.ask, options: D05_OPTS.map((o, i) => ({ id: String(i), label: o.txt })), studentAnswer: { idx: picked }, correctAnswer: { idx: D05_CORRECT }, correct, meta: { tag: 'sub_check', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === D05_CORRECT; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: "'JetBrains Mono', monospace", minHeight: 48 };
  };

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 800 };

  return (
    <div style={S.wrap}>
      <style>{`
        .d3-pop { animation: d3pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d3pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d3-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ maxHeight: step >= 1 ? 70 : 0, opacity: step >= 1 ? 1 : 0, overflow: 'hidden', transition: 'max-height .6s ease, opacity .5s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', ...mono }}>
          <span style={{ color: '#166534' }}>1559</span>
          <span className={step >= 1 ? 'd3-pop' : undefined} style={{ color: '#6b7280', opacity: step >= 1 ? 1 : 0 }}>+</span>
          <span style={{ color: '#64748b' }}>599</span>
          <span className={step >= 2 ? 'd3-pop' : undefined} style={{ color: step >= 3 ? '#1a7f43' : '#6b7280', opacity: step >= 2 ? 1 : 0 }}>=</span>
          <span className={step >= 2 ? 'd3-pop' : undefined} style={{ padding: '2px 8px', borderRadius: 8, color: step >= 3 ? '#1a7f43' : '#1f2430', background: step >= 3 ? '#dcfce7' : 'transparent', opacity: step >= 2 ? 1 : 0, transition: 'color .5s, background .5s' }}>2158</span>
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      {D05_OPTS.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o.txt}</button>)}
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
