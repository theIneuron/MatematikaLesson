// Dars20 · Amaliyot 05 — Tafovutni top · 🔴 · tag: sub_gap
// 2/3 − 1/2. Oltidanga keltiramiz: 2/3 = 4/6, 1/2 = 3/6. Tafovut = 4/6 dan ortiqcha qism = 1/6.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// sixths bar: shaded bo'yalgan; gap (tafovut) katagi alohida rangda (reveal da porlaydi)
function GapBar({ shaded, gap = [], glow = false, w = 246, h = 34, color = '#93c5fd' }) {
  const n = 6, cw = w / n, gp = new Set(gap);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={'b' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill="#eef2f7" stroke="#cbd5e1" strokeWidth="1" />
      ))}
      {Array.from({ length: shaded }).map((_, i) => {
        const isGap = gp.has(i);
        return <rect key={'s' + i} x={i * cw + 1} y="1" width={cw - 2} height={h - 2} rx="3" fill={isGap ? '#fcd34d' : color} stroke={isGap ? '#f59e0b' : '#60a5fa'} strokeWidth={isGap ? 1.5 : 1}
          style={isGap && glow ? { animation: 'd20glow 1s ease .2s' } : undefined} />;
      })}
    </svg>
  );
}

const D05_ANS = 1; // 1/6
const D05_T = {
  uz: {
    eyebrow: 'Tafovut', setup: "Malika ikki lentani solishtirdi: biri 2/3 metr, ikkinchisi 1/2 metr. Ustki lenta pastkisidan qanchaga uzun?",
    ask: 'Tafovutni toping: 2/3 − 1/2 = ?/6', label: 'Suratni yozing:',
    correct: "To'g'ri. 4/6 − 3/6 = 1/6. Sariq katak — ikki lentaning tafovuti, bu aynan 1/6.",
    wrong: "Maslahat: ikki lentani solishtirish uchun ularni qanday o'lchovga keltirish kerak? Tafovut nima bilan o'lchanadi?",
    rule: "Ayirma — umumiy maxrajdagi suratlarning farqi: 4/6 − 3/6 = 1/6.",
  },
  ru: {
    eyebrow: 'Разница', setup: 'Малика сравнила две ленты: одна 2/3 метра, другая 1/2 метра. Насколько верхняя лента длиннее нижней?',
    ask: 'Найди разницу: 2/3 − 1/2 = ?/6', label: 'Впиши числитель:',
    correct: 'Верно. 4/6 − 3/6 = 1/6. Жёлтая клетка — разница двух лент, это ровно 1/6.',
    wrong: 'Подсказка: в какой мерке нужно сравнить две ленты? Чем измеряется разница между ними?',
    rule: 'Разность — разница числителей при общем знаменателе: 4/6 − 3/6 = 1/6.',
  },
};

export default function D20_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [glow, setGlow] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) { setGlow(true); timer.current = setTimeout(() => setGlow(false), 1200); }
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'sub_gap', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  const showGap = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @keyframes d20glow { 0%,100% { filter: none; } 50% { filter: drop-shadow(0 0 5px #fcd34d); } }
        @media (prefers-reduced-motion: reduce) { .d20-pop { animation: none !important; } svg rect[style] { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '10px 0 6px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 52, ...S.mono, fontWeight: 800, color: '#2563eb', fontSize: 14 }}>2/3</span><GapBar shaded={4} gap={showGap ? [3] : []} glow={glow} color="#93c5fd" /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 52, ...S.mono, fontWeight: 800, color: '#16a34a', fontSize: 14 }}>1/2</span><GapBar shaded={3} color="#86efac" /></div>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{renderFr(t.ask)}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{renderFr(t.label)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span style={{ ...S.mono, fontSize: 16, fontWeight: 700, color: '#64748b' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 56, height: 44, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 11, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
          <div style={{ width: 60, height: 3, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#64748b' }}>6</div>
        </div>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
