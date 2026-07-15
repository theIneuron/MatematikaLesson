// Dars30 · Amaliyot 01 — Yarmi qaysi kasr · 🟢 · tag: pct_to_frac
// Doira (pirog) yarmi bo'yalgan — 50%. 50% qaysi kasrga teng? → 1/2.
// Vizual: doira ulush (grid EMAS). Eyebrow pill: orange.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#b45309', l: '#fff7ed', m: '#fed7aa', fill: '#f59e0b' };
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
// Doira (pirog) — pct% qismi bo'yalgan
function Pie({ pct = 50, color = C.fill, animate = false }) {
  const r = 58, cx = 64, cy = 64;
  const rad = (a) => (a - 90) * Math.PI / 180;
  const ang = pct / 100 * 360;
  const large = ang > 180 ? 1 : 0;
  const x = cx + r * Math.cos(rad(ang)), y = cy + r * Math.sin(rad(ang));
  const d = `M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 ${large} 1 ${x.toFixed(2)},${y.toFixed(2)} Z`;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" style={{ display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
      {pct >= 100 ? <circle cx={cx} cy={cy} r={r} fill={color} /> : <path className={animate ? 'd30-pop' : ''} d={d} fill={color} />}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.d} strokeWidth="2" />
    </svg>
  );
}

const D01_OPTS = [{ id: 'a', num: '1', den: '2' }, { id: 'b', num: '1', den: '4' }, { id: 'c', num: '1', den: '5' }];
const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Foiz va kasr', setup: "Madina doiraning 50% qismini bo'yadi.",
    ask: '50% qaysi kasrga teng?',
    correct: "To'g'ri. 50% = 50/100 = 1/2 — butunning yarmi.",
    wrong: "Bo'yalgan qism butunning qanchasi? Butunni teng bo'laklarga bo'lib o'ylab ko'ring.",
    rule: "50% = 1/2.",
  },
  ru: {
    eyebrow: 'Процент и дробь', setup: 'Мадина закрасила 50% круга.',
    ask: 'Какой дроби равно 50%?',
    correct: 'Верно. 50% = 50/100 = 1/2 — половина целого.',
    wrong: 'Какую часть целого составляет закрашенное? Раздели целое на равные части и подумай.',
    rule: '50% = 1/2.',
  },
};

export default function D30_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D01_OPTS.map((o) => ({ id: o.id, label: o.num + '/' + o.den })), studentAnswer: { idx: pick }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'pct_to_frac', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d30-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}><Pie pct={50} animate={!isReview} /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '8px 0' }}>
        {D01_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = C.d; bg = C.l; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ width: 84, height: 76, borderRadius: 16, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Frac num={o.num} den={o.den} size={26} />
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
