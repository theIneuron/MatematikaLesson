// Dars21 · Amaliyot 08 — Qaysi orada · 🟢 · tag: between_wholes
// 8/5 = 1 butun va 3 beshdan (1⅗) → 1 va 2 orasida. Sonlar nuri beshdanlarga bo'lingan.
// O'quvchi mos ORALIQNI (butunlar orasidagi bandni) bosadi.
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

const D08_ANS = 1; // 0-1 → 0, 1-2 → 1, 2-3 → 2 ; 8/5 → band 1
const D08_T = {
  uz: {
    eyebrow: 'Qaysi orada', setup: "Sonlar nurida sariq nuqta 8/5 sonini belgilaydi. Nur beshdan bo'laklarga bo'lingan.",
    ask: '8/5 qaysi ikki butun son orasida joylashgan? Mos oraliqni bosing:',
    correct: "To'g'ri. 8/5 = 1 butun va 3 beshdan (1 va 3/5), demak u 1 va 2 orasida.",
    wrong: "5/5 bitta butunga teng. Sariq nuqta qaysi ikki butun belgisi orasida turibdi?",
    rule: "8/5 = 1 va 3/5 — 1 va 2 orasida (1 dan katta, 2 dan kichik).",
  },
  ru: {
    eyebrow: 'Между чем', setup: 'На числовом луче жёлтая точка отмечает число 8/5. Луч поделён на пятые части.',
    ask: 'Между какими двумя целыми находится 8/5? Нажми нужный промежуток:',
    correct: 'Верно. 8/5 = 1 целое и 3 пятых (1 и 3/5), значит она между 1 и 2.',
    wrong: '5/5 равно одному целому. Между какими двумя целыми отметками стоит жёлтая точка?',
    rule: '8/5 = 1 и 3/5 — между 1 и 2 (больше 1, меньше 2).',
  },
};

export default function D21_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [band, setBand] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s?.band != null) { setBand(s.band); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(band != null && !checked); }, [band, checked, onReady]);
  const check = useCallback(() => {
    const correct = band === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: '0', label: '0-1' }, { id: '1', label: '1-2' }, { id: '2', label: '2-3' }], studentAnswer: { band }, correctAnswer: { band: D08_ANS }, correct, meta: { tag: 'between_wholes', level: '🟢' } });
  }, [band, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const W = 340, mL = 24, mR = 316, base = 54, step = (mR - mL) / 15;
  const xAt = (i) => mL + i * step;
  const locked = isReview || checked;
  const bands = [0, 1, 2]; // [0..5],[5..10],[10..15]
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
        <svg width={W} height="88" viewBox={`0 0 ${W} 88`}>
          {bands.map((b) => {
            const x0 = xAt(b * 5), x1 = xAt((b + 1) * 5);
            const on = band === b, ok = checked && on ? b === D08_ANS : null;
            const fill = ok === true ? '#dcfce7' : ok === false ? '#fee2e2' : on ? '#dbeafe' : 'transparent';
            const stroke = ok === true ? '#1a7f43' : ok === false ? '#c0392b' : on ? '#2563eb' : 'transparent';
            return <rect key={b} x={x0} y={base - 22} width={x1 - x0} height={44} rx="8" fill={fill} stroke={stroke} strokeWidth="2" style={{ cursor: locked ? 'default' : 'pointer' }} onClick={() => !locked && setBand(b)} />;
          })}
          <line x1={mL} y1={base} x2={mR} y2={base} stroke="#94a3b8" strokeWidth="2" />
          {Array.from({ length: 16 }).map((_, i) => { const whole = i % 5 === 0; return (<g key={i} style={{ pointerEvents: 'none' }}><line x1={xAt(i)} y1={base - (whole ? 10 : 5)} x2={xAt(i)} y2={base + (whole ? 10 : 5)} stroke="#94a3b8" strokeWidth={whole ? 2.5 : 1.5} />{whole && <text x={xAt(i)} y={base + 26} fontSize="13" fontWeight="800" textAnchor="middle" fill="#64748b" fontFamily="'JetBrains Mono', monospace">{i / 5}</text>}</g>); })}
          <g style={{ pointerEvents: 'none' }}>
            <circle cx={xAt(8)} cy={base} r="7" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <text x={xAt(8)} y={base - 14} fontSize="11" textAnchor="middle" fontWeight="800" fill="#b45309" fontFamily="'JetBrains Mono', monospace">8/5</text>
          </g>
        </svg>
      </div>
      <p style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>{band != null ? `${band} - ${band + 1}` : (lang === 'uz' ? 'oraliqni bosing' : 'нажми промежуток')}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
