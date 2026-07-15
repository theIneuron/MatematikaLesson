// Dars21 · Amaliyot 03 — Sonlar nurida · 🔴 · tag: place_improper
// 9/5 sonlar nurida (0..2, beshdanlarga bo'lingan) — 9-beshdan, 1 va 2 orasida (1⅘).
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
  <div className="d21-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

const D03_ANS = 9; // 9/5, beshdanlarda 9-belgi
const D03_T = {
  uz: {
    eyebrow: 'Sonlar nurida', setup: "Nodira sonlar nurida ishlayapti. Nur 0 dan 2 gacha cho'zilgan, har bir butun beshta teng bo'lakka bo'lingan.",
    ask: '9/5 sonlar nurida qayerga tushadi? Katakchani bosing:',
    correct: "To'g'ri. 9/5 — bu 9 ta beshdan, ya'ni 1 butun va yana 4 beshdan (1 va 4/5). U 1 va 2 orasida.",
    wrong: "5/5 bitta butunga teng. 9/5 bir butundan katta — u nurda 1 dan qaysi tomonda joylashadi?",
    rule: "9/5 = 9 ta beshdan = 1 butun va 4 beshdan (1 va 4/5) — 1 va 2 orasida.",
  },
  ru: {
    eyebrow: 'На луче', setup: 'Нодира работает с числовым лучом. Луч тянется от 0 до 2, каждое целое поделено на пять равных частей.',
    ask: 'Куда попадёт 9/5 на луче? Нажми деление:',
    correct: 'Верно. 9/5 — это 9 пятых, то есть 1 целое и ещё 4 пятых (1 и 4/5). Она между 1 и 2.',
    wrong: '5/5 равно одному целому. 9/5 больше одного целого — по какую сторону от 1 она на луче?',
    rule: '9/5 = 9 пятых = 1 целое и 4 пятых (1 и 4/5) — между 1 и 2.',
  },
};

export default function D21_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sel != null) { setSel(sa.sel); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sel != null && !checked); }, [sel, checked, onReady]);
  const check = useCallback(() => {
    const correct = sel === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sel }, correctAnswer: { value: D03_ANS }, correct, meta: { tag: 'place_improper', level: '🔴' } });
  }, [sel, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 340, mL = 24, mR = 316, base = 60, step = (mR - mL) / 10;
  const xAt = (i) => mL + i * step;
  const locked = isReview || checked;
  return (
    <div style={S.wrap}>
      <style>{`
        .d21-pop { animation: d21pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d21pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d21-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <svg width={W} height="86" viewBox={`0 0 ${W} 86`}>
          <line x1={mL} y1={base} x2={mR} y2={base} stroke="#94a3b8" strokeWidth="2" />
          {Array.from({ length: 11 }).map((_, i) => {
            const whole = i % 5 === 0;
            const on = sel === i, ok = checked && on ? i === D03_ANS : null;
            return (
              <g key={i}>
                <line x1={xAt(i)} y1={base - (whole ? 10 : 6)} x2={xAt(i)} y2={base + (whole ? 10 : 6)} stroke="#94a3b8" strokeWidth={whole ? 2.5 : 1.8} />
                {whole && <text x={xAt(i)} y={base + 26} fontSize="13" fontWeight="800" textAnchor="middle" fill="#64748b" fontFamily="'JetBrains Mono', monospace">{i / 5}</text>}
                {!locked && <circle cx={xAt(i)} cy={base} r="11" fill="transparent" style={{ cursor: 'pointer' }} onClick={() => setSel(i)} />}
                {on && <circle cx={xAt(i)} cy={base} r="8" fill={ok === false ? '#c0392b' : ok === true ? '#1a7f43' : '#f59e0b'} stroke="#fff" strokeWidth="2" className="d21-pop" />}
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{lang === 'uz' ? 'Qayerga:' : 'Куда:'}</span><Frac num="9" den="5" size={24} color="#2563eb" />
      </div>
      <p style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>{sel != null ? `${sel}/5` : (lang === 'uz' ? 'nurdagi nuqtani bosing' : 'нажми точку на луче')}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
