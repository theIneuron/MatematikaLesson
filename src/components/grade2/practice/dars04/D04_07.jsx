// Dars 4 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d04-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const Battery = ({ s = 20 }) => (
  <svg width={s * 0.66} height={s} viewBox="0 0 22 34" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <defs>
      <linearGradient id="d4batt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0E6E96" /><stop offset="50%" stopColor="#8FE0F4" /><stop offset="100%" stopColor="#0A5876" /></linearGradient>
      <linearGradient id="d4bd" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#B23A26" /><stop offset="100%" stopColor="#C7401F" /></linearGradient>
    </defs>
    <rect x="8" y="0.6" width="6" height="3.4" rx="1.4" fill="#8FA0AE" /><rect x="1.4" y="4" width="19.2" height="29.4" rx="4.2" fill="url(#d4batt)" stroke="#093F55" strokeWidth="1" />
    <rect x="1.4" y="12.5" width="19.2" height="8" fill="url(#d4bd)" opacity="0.95" />
  </svg>
);

const Cassette = ({ s = 26 }) => (
  <svg width={s} height={s * 66 / 48} viewBox="0 0 48 66" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <defs><linearGradient id="d4cass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4E5E82" /><stop offset="52%" stopColor="#8C9EC4" /><stop offset="100%" stopColor="#4E5E82" /></linearGradient></defs>
    <rect x="1" y="4" width="46" height="61" rx="7" fill="url(#d4cass)" stroke="#33415F" strokeWidth="1.4" />
    <rect x="17" y="6.6" width="14" height="5.2" rx="2.6" fill="#0C121F" /><circle cx="24" cy="9.2" r="2" fill="#6EF29B" />
    {Array.from({ length: 10 }).map((_, i) => { const col = i % 2; const row = Math.floor(i / 2); return <rect key={i} x={7.5 + col * 19.5} y={17 + row * 9.4} width="13" height="5.4" rx="1.8" fill="#2FA0CC" stroke="#093F55" strokeWidth="0.4" />; })}
  </svg>
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 23.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d04-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d04-pop { animation: d04pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d04pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d04-star { opacity: .35; animation: d04tw 3.2s ease-in-out infinite; }
        @keyframes d04tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d04-float { animation: d04float 3.4s ease-in-out infinite; }
        @keyframes d04float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D07_L = 45, D07_R = 38, D07_CORRECT = 0; // left heavier
const D07_T = {
  uz: {
    eyebrow: 'Tarozi', setup: 'Tarozi pallalarida ikki kodning quvvat yuki.',
    ask: 'Qaysi kodda quvvat KO‘P? Og‘irroq (pastga engashgan) pallani bosing.',
    correct: "To'g'ri. 45 og'irroq: 4 o'nlik > 3 o'nlik.",
    wrong: "Maslahat: avval o'nlikka qarang. Qaysi kodda o'nlik ko'p — o'sha og'irroq.",
    rule: "Ko'proq o'nlik — og'irroq (katta) son. 45 > 38.",
  },
  ru: {
    eyebrow: 'Весы', setup: 'На чашах весов заряд двух кодов.',
    ask: 'У какого кода заряда БОЛЬШЕ? Нажми на тяжёлую (опущенную) чашу.',
    correct: 'Верно. 45 тяжелее: 4 десятка > 3 десятка.',
    wrong: 'Подсказка: сначала десятки. У какого кода десятков больше — тот и тяжелее.',
    rule: 'Больше десятков — тяжелее (больше) число. 45 > 38.',
  },
};
function D04_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: '0', label: '45' }, { id: '1', label: '38' }], studentAnswer: { idx: picked }, correctAnswer: { idx: 0, label: '45' }, correct, meta: { tag: 'balance', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const pan = (i, num, tens, ones, lower) => {
    const on = picked === i, show = checked && on;
    let bd = C.stageBd, bg = C.stile, col = C.sink;
    if (on) { bd = C.acc; bg = 'rgba(255,79,40,.16)'; }
    if (show) { const ok = i === D07_CORRECT; bd = ok ? C.ok : C.no; bg = ok ? 'rgba(31,122,77,.22)' : 'rgba(192,57,43,.22)'; col = ok ? '#8ff0bd' : '#ffb4a8'; }
    return (
      <button type="button" disabled={isReview || checked} onClick={() => setPicked(i)}
        style={{ position: 'absolute', top: lower ? 78 : 30, [i === 0 ? 'left' : 'right']: 8, width: 150, borderRadius: 14, border: '2.5px solid ' + bd, background: bg, padding: '8px 6px', cursor: (isReview || checked) ? 'default' : 'pointer', transition: 'top .4s' }}>
        <div style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: on || show ? col : (i === 0 ? C.ten : C.one) }}>{num}</div>
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', marginTop: 2 }}>
          {Array.from({ length: tens }).map((_, k) => <Cassette key={'c' + k} s={13} />)}
          {Array.from({ length: ones }).map((_, k) => <Battery key={'b' + k} s={11} />)}
        </div>
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ position: 'relative', height: 190 }}>
          {/* beam */}
          <div style={{ position: 'absolute', left: '50%', top: 20, width: 220, height: 6, background: '#8494AE', borderRadius: 3, transform: 'translateX(-50%) rotate(-9deg)', transformOrigin: 'center' }} />
          {/* fulcrum */}
          <div style={{ position: 'absolute', left: '50%', top: 22, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '96px solid #33415F' }} />
          {pan(0, D07_L, 4, 5, true)}
          {pan(1, D07_R, 3, 8, false)}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D04_07(props) {
  return (<><style>{FX_CSS}</style><D04_07Impl {...props} /></>);
}
