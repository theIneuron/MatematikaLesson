// Dars30 · Amaliyot 05 — Kasrni foizga · 🟡 · tag: pct_frac_to_pct
// 1/4 = ? % → 25. Vizual: ustun (4 bo'lak, 1 bo'yalgan = 1/4) upfront; 25/100 mapping reveal.
// Eyebrow pill: blue. jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#e24e12', l: '#fff4ee', m: '#ffd6bd', fill: '#ff8a52' };
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.l, border: '1.5px solid ' + C.m, color: C.d }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 15, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 2px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 1.6, background: color }} />
    <span style={{ fontSize: size, padding: '1px 2px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
// Ustun: parts bo'lak, pastdan shaded tasi bo'yalgan
function VBar({ parts = 4, shaded = 1, color = C.fill, animate = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 66, border: '2px solid #cbd5e1', borderRadius: 12, overflow: 'hidden', background: '#f8fafc' }}>
      {Array.from({ length: parts }).map((_, i) => {
        const fromBottom = parts - 1 - i;
        const on = fromBottom < shaded;
        return <div key={i} className={on && animate ? 'd30-pop' : ''} style={{ height: 36, background: on ? color : '#fff', borderTop: i ? '1.5px solid #d6dae3' : 'none', animationDelay: (fromBottom * 0.12).toFixed(2) + 's' }} />;
      })}
    </div>
  );
}

const D05_ANS = 25;
const D05_T = {
  uz: {
    eyebrow: 'Kasrni foizga', setup: "Kamol ustunning 1/4 qismini bo'yadi.",
    ask: '1/4 = ? %', label: 'foiz:',
    correct: "To'g'ri. 1/4 = 25/100 = 25%.",
    wrong: "Foiz — yuzdan olingan ulush. 1/4 butunning yuzdan qanday ulushiga to'g'ri keladi?",
    rule: "Kasrni 100 ulushga keltiring: 1/4 = 25/100.",
  },
  ru: {
    eyebrow: 'Дробь в процент', setup: 'Камол закрасил 1/4 часть столбика.',
    ask: '1/4 = ? %', label: 'процентов:',
    correct: 'Верно. 1/4 = 25/100 = 25%.',
    wrong: 'Процент — доля от ста. Какой доле от ста соответствует 1/4?',
    rule: 'Приведи дробь к 100 долям: 1/4 = 25/100.',
  },
};

export default function D30_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d{1,3}$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'pct_frac_to_pct', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : C.d;
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d30-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '10px 0 6px' }}>
        <VBar parts={4} shaded={1} animate={!isReview} />
        <Frac num="1" den="4" size={30} color={C.d} />
      </div>
      {revealed && (
        <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '6px 0 2px', ...S.mono, fontSize: 15, fontWeight: 800, color: C.d }}>
          <Frac num="1" den="4" size={16} color={C.d} /><span>=</span><Frac num="25" den="100" size={16} color={C.d} /><span>= 25%</span>
        </div>
      )}
      <p style={{ ...S.ask, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 3))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 74, height: 48, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: C.d }}>%</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
