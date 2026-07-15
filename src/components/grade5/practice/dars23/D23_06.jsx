// Dars23 · Amaliyot 06 — Son o'qida sakrash · 🟡 · tag: mixed_numberline
// 1 4/5 + 1 1/5 = 3. Belgi 1 4/5 (9/5) dan 1 1/5 (6 ta beshdan) oldinga → 15/5 = 3 butun.
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
  <div className="d23-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
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
const Mixed = ({ w, n, d, size = 18, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><span style={{ ...S.mono, fontWeight: 800, fontSize: size + 5, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} /></span>
);

const D06_START = 9, D06_ANS = 15; // 9/5 → 15/5 (3 butun)
const D06_T = {
  uz: {
    eyebrow: "Son o'qida", setup: "O'q beshdan bo'laklarga bo'lingan. Toshbaqa 1 4/5 nuqtada turibdi va 1 1/5 masofaga oldinga sakraydi. U qayerga tushadi?",
    ask: 'Toshbaqa qayerga tushadi? Nuqtani bosing:',
    correct: "To'g'ri. 1 4/5 + 1 1/5 = 3. Beshdanlarda: 9/5 + 6/5 = 15/5 = 3 butun.",
    wrong: "1 4/5 nechta beshdan ekanini sanang, so'ng shuncha oldinga suriling.",
    rule: "Aralash sonni qo'shish son o'qida oldinga sakrashdir; kasrlar to'lib butun hosil qilishi mumkin.",
  },
  ru: {
    eyebrow: 'На оси', setup: 'Ось поделена на пятые. Черепаха стоит в точке 1 4/5 и прыгает вперёд на 1 1/5. Куда она попадёт?',
    ask: 'Куда попадёт черепаха? Нажми точку:',
    correct: 'Верно. 1 4/5 + 1 1/5 = 3. В пятых: 9/5 + 6/5 = 15/5 = 3 целых.',
    wrong: 'Сосчитай, сколько пятых в 1 4/5, и продвинься вперёд на столько же.',
    rule: 'Сложение смешанных на оси — прыжок вперёд; дроби могут наполниться до целого.',
  },
};

export default function D23_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [pos, setPos] = useState(D06_START);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel != null) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setPos(D06_ANS); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel != null && !checked); }, [sel, checked, onReady]);
  const check = useCallback(() => {
    const correct = sel === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setPos(D06_ANS), 450);
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sel }, correctAnswer: { value: D06_ANS }, correct, meta: { tag: 'mixed_numberline', level: '🟡' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 356, mL = 16, mR = 340, base = 60, step = (mR - mL) / 15;
  const xAt = (i) => mL + i * step;
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <style>{`
        .d23-pop { animation: d23pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d23pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d23-pop { animation: none !important; } svg circle[style] { transition: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <svg width={W} height="86" viewBox={`0 0 ${W} 86`}>
          <line x1={mL} y1={base} x2={mR} y2={base} stroke="#94a3b8" strokeWidth="2" />
          {Array.from({ length: 16 }).map((_, i) => { const whole = i % 5 === 0, on = sel === i, ok = checked && on ? i === D06_ANS : null; return (<g key={i}><line x1={xAt(i)} y1={base - (whole ? 10 : 5)} x2={xAt(i)} y2={base + (whole ? 10 : 5)} stroke="#94a3b8" strokeWidth={whole ? 2.5 : 1.5} />{whole && <text x={xAt(i)} y={base + 24} fontSize="12" fontWeight="800" textAnchor="middle" fill="#64748b" fontFamily="'JetBrains Mono', monospace">{i / 5}</text>}{!locked && <circle cx={xAt(i)} cy={base} r="10" fill="transparent" style={{ cursor: 'pointer' }} onClick={() => setSel(i)} />}{on && <circle cx={xAt(i)} cy={base} r="7" fill={ok === false ? '#c0392b' : ok === true ? '#1a7f43' : '#f59e0b'} stroke="#fff" strokeWidth="2" />}</g>); })}
          <line x1={xAt(D06_START)} y1={base - 15} x2={xAt(D06_START)} y2={base} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 2" />
          {checked && fb?.correct && pos === D06_ANS && <path d={`M ${xAt(D06_START)} ${base - 4} Q ${xAt(12)} ${base - 34} ${xAt(D06_ANS)} ${base - 4}`} fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="4 3" />}
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}><Mixed w={1} n={4} d={5} size={18} color="#2563eb" /><span style={{ ...S.mono, fontWeight: 800, color: '#94a3b8' }}>+</span><Mixed w={1} n={1} d={5} size={18} color="#2563eb" /></div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
