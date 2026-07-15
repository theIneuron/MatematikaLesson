// Dars08 · Amaliyot 06 — Daraja o'qish · 🟡 · Nilufar · tag: read_power
// 3⁵. Bola qaysi qism asos, qaysi ko'rsatkich ekanini belgilaydi (toggle).
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

const D06_BASE = 3, D06_EXP = 5;
const D06_T = {
  uz: {
    eyebrow: "Daraja o'qish", setup: "3⁵ ifodasini diqqat bilan ko'ring.",
    ask: '3⁵ ifodasida har bir sonni belgilang:',
    qBase: 'Qaysi son ASOS?', qExp: "Qaysi son KO'RSATKICH?",
    correct: "To'g'ri. 3 — asos (takrorlanuvchi son), 5 — ko'rsatkich (necha marta ko'paytiriladi).",
    wrong: "Maslahat: asos — takrorlanuvchi son, ko'rsatkich — u necha marta ko'paytirilishini bildiradi. Yozuvda qaysi son katta, qaysi biri yuqorida kichik turibdi?",
    rule: "Asos — takrorlanuvchi son. Ko'rsatkich — u necha marta ko'paytirilishini bildiradi.",
  },
  ru: {
    eyebrow: 'Чтение степени', setup: 'Внимательно посмотрите на 3⁵.',
    ask: 'Отметьте каждое число в 3⁵:',
    qBase: 'Какое число ОСНОВАНИЕ?', qExp: 'Какое число ПОКАЗАТЕЛЬ?',
    correct: 'Верно. 3 — основание (повторяющееся число), 5 — показатель (сколько раз умножаем).',
    wrong: 'Подсказка: основание — повторяющееся число, показатель — сколько раз умножаем. Какое число крупное, а какое маленькое сверху?',
    rule: 'Основание — повторяющееся число. Показатель — сколько раз его умножают.',
  },
};
export default function D08_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [baseChoice, setBaseChoice] = useState(null); // '3' | '5'
  const [expChoice, setExpChoice] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.baseChoice != null) setBaseChoice(sa.baseChoice); if (sa.expChoice != null) setExpChoice(sa.expChoice); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = baseChoice != null && expChoice != null;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = baseChoice === '3' && expChoice === '5';
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { baseChoice, expChoice }, correctAnswer: { base: '3', exp: '5' }, correct, meta: { tag: 'read_power', level: '🟡' } });
  }, [baseChoice, expChoice, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const allCorrect = baseChoice === '3' && expChoice === '5';
  const chipStyle = (val, choice, correctVal) => {
    const on = choice === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1e40af'; }
    if (checked && on) { const ok = allCorrect; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, padding: '11px 6px', borderRadius: 11, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 19, fontWeight: 800, cursor: locked ? 'default' : 'pointer', minHeight: 46 };
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d8-pop { animation: d8pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d8pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d8-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* katta 3⁵ ko'rsatiladi */}
      <div style={{ textAlign: 'center', margin: '10px 0 16px' }}><Pow base="3" exp="5" size={54} color="#1f2430" /></div>
      <p style={{ ...S.ask, fontSize: 14.5, margin: '4px 0 7px' }}>{t.qBase}</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button type="button" style={chipStyle('3', baseChoice, '3')} disabled={locked} onClick={() => setBaseChoice('3')}>3</button>
        <button type="button" style={chipStyle('5', baseChoice, '3')} disabled={locked} onClick={() => setBaseChoice('5')}>5</button>
      </div>
      <p style={{ ...S.ask, fontSize: 14.5, margin: '4px 0 7px' }}>{t.qExp}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" style={chipStyle('3', expChoice, '5')} disabled={locked} onClick={() => setExpChoice('3')}>3</button>
        <button type="button" style={chipStyle('5', expChoice, '5')} disabled={locked} onClick={() => setExpChoice('5')}>5</button>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
