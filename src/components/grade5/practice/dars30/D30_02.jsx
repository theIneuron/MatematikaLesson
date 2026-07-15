// Dars30 · Amaliyot 02 — Necha foiz · 🟢 · tag: pct_read_grid
// Yuz katakda 30 katak bo'yalgan. Necha foiz bo'yalgan? → 30. (10×10 grid — o'qish topshirig'i)
// Eyebrow pill: rose. jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#be123c', l: '#fff1f2', m: '#fecdd3', fill: '#f43f5e' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.d, background: C.l, border: '1px solid ' + C.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.l, border: '1.5px solid ' + C.m, color: C.d }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function HundredGrid({ n = 0, color = C.fill, size = 216 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 2, width: size, maxWidth: '100%', padding: 6, background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
      {Array.from({ length: 100 }).map((_, i) => {
        const filled = i < n;
        return <div key={i} className={filled ? 'd30-cell d30-fill' : 'd30-cell'} style={{ aspectRatio: '1 / 1', borderRadius: 2, background: filled ? color : '#fff', border: '1px solid #e2e8f0', animationDelay: filled ? (i * 0.014).toFixed(3) + 's' : '0s' }} />;
      })}
    </div>
  );
}

const D02_ANS = 30;
const D02_T = {
  uz: {
    eyebrow: 'Necha foiz', setup: "Alisher yuz katakli kvadratda bir qism kataklarni bo'yadi.",
    ask: "Necha foiz bo'yalgan?", label: 'foiz:',
    correct: "To'g'ri. 30 katak 100 tadan — 30%.",
    wrong: "Bo'yalgan kataklarni yana bir bor sanang — yuz katakdan nechtasi rangli?",
    rule: "Necha katak bo'yalgan — shuncha foiz.",
  },
  ru: {
    eyebrow: 'Сколько процентов', setup: 'Алишер закрасил часть клеток в квадрате из ста клеток.',
    ask: 'Сколько процентов закрашено?', label: 'процентов:',
    correct: 'Верно. 30 клеток из 100 — 30%.',
    wrong: 'Пересчитай закрашенные клетки — сколько из ста цветных?',
    rule: 'Сколько клеток закрашено — столько и процентов.',
  },
};

export default function D30_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d{1,3}$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D02_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'pct_read_grid', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : C.d;
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d30-fill { animation: d30fill .55s ease both; }
        @keyframes d30fill { 0% { opacity: 0; transform: scale(.35); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d30-pop, .d30-fill { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}><HundredGrid n={30} /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 74, height: 48, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: C.d }}>%</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
