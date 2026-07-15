// Dars30 · Amaliyot 10 — O'nlini foizga · 🔴 · tag: pct_dec_to_pct
// 0,7 = ? % → 70. Vizual: son o'qi (0..1) da 0,7 belgilangan; 70/100 mapping reveal.
// Eyebrow pill: fuchsia. jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#a21caf', l: '#fdf4ff', m: '#f5d0fe', fill: '#e879f9' };
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
// Son o'qi 0..1, mark nuqtada belgi (10 bo'linma)
function NumLine({ mark = 0.7, color = C.fill, animate = false }) {
  const W = 300, y = 44, x0 = 20, x1 = W - 20;
  const px = (v) => x0 + v * (x1 - x0);
  const mx = px(mark);
  return (
    <svg width={W} height={70} viewBox={`0 0 ${W} 70`} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="#94a3b8" strokeWidth="2" />
      {Array.from({ length: 11 }).map((_, i) => {
        const v = i / 10, X = px(v), big = i === 0 || i === 5 || i === 10;
        return (
          <g key={i}>
            <line x1={X} y1={y - (big ? 8 : 5)} x2={X} y2={y + (big ? 8 : 5)} stroke="#94a3b8" strokeWidth={big ? 2 : 1.4} />
            {big && <text x={X} y={y + 22} textAnchor="middle" style={{ ...S.mono, fontSize: 11, fontWeight: 700, fill: '#64748b' }}>{v === 0 ? '0' : v === 0.5 ? '0,5' : '1'}</text>}
          </g>
        );
      })}
      <g className={animate ? 'd30-pop' : ''} style={{ transformOrigin: mx + 'px ' + (y - 14) + 'px' }}>
        <line x1={mx} y1={y - 16} x2={mx} y2={y + 8} stroke={color} strokeWidth="3" />
        <circle cx={mx} cy={y - 16} r="6" fill={color} />
        <text x={mx} y={y - 24} textAnchor="middle" style={{ ...S.mono, fontSize: 13, fontWeight: 800, fill: C.d }}>0,7</text>
      </g>
    </svg>
  );
}

const D10_ANS = 70;
const D10_T = {
  uz: {
    eyebrow: "O'nlini foizga", setup: "Nodira son o'qida 0,7 nuqtani belgiladi.",
    ask: '0,7 = ? %', label: 'foiz:',
    correct: "To'g'ri. 0,7 = 70/100 = 70%.",
    wrong: "0,7 — bu necha yuzdan? Foiz ham yuzdan ulush — ikkisini bog'lang.",
    rule: "O'nlini foizga: ×100 (0,7 → 70%).",
  },
  ru: {
    eyebrow: 'Десятичную в процент', setup: 'Нодира отметила точку 0,7 на числовой прямой.',
    ask: '0,7 = ? %', label: 'процентов:',
    correct: 'Верно. 0,7 = 70/100 = 70%.',
    wrong: '0,7 — это сколько сотых? Процент — тоже доля от ста. Свяжи одно с другим.',
    rule: 'Десятичную в процент: ×100 (0,7 → 70%).',
  },
};

export default function D30_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d{1,3}$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D10_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'pct_dec_to_pct', level: '🔴' } });
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
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}><NumLine mark={0.7} animate={!isReview} /></div>
      {revealed && (
        <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '2px 0', ...S.mono, fontSize: 15, fontWeight: 800, color: C.d }}>
          <span>0,7 =</span><Frac num="70" den="100" size={16} color={C.d} /><span>= 70%</span>
        </div>
      )}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
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
