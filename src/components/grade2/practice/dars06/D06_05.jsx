// Dars 6 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d06-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
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
  <div className="d06-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// --- son o'qi asosi ---
const TICKS = (max) => { const a = []; for (let v = 0; v <= max; v += 10) a.push(v); return a; };

const LineBase = ({ max = 100, children, h = 74 }) => (
  <div style={{ position: 'relative', height: h, margin: '14px 14px 8px' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.5, height: 5, borderRadius: 3, background: 'linear-gradient(90deg,#8ba0c8,#9fe7ff)' }} />
    {children}
  </div>
);

// bosiladigan ticklar (bitta tanlov)
const ClickTicks = ({ max, labels, picked, correctVal, checked, disabled, onPick, h = 74 }) => TICKS(max).map((v) => {
  const on = picked === v;
  let bd = '#93a6cc', bg = '#44577f', col = C.sink2;
  if (on && !checked) { bd = C.acc; bg = C.acc; col = '#08111f'; }
  if (checked && on) { const okv = v === correctVal; bd = okv ? C.ok : C.no; bg = okv ? C.ok : C.no; col = '#fff'; }
  return (
    <button key={v} type="button" disabled={disabled} onClick={() => onPick(v)} style={{ position: 'absolute', left: (v / max * 100) + '%', top: h * 0.5 - 15, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 'none', background: 'transparent', cursor: disabled ? 'default' : 'pointer' }}>
      <span style={{ width: on ? 20 : 13, height: on ? 20 : 13, borderRadius: '50%', border: '2px solid ' + bd, background: bg, transition: 'all .12s' }} />
      <span style={{ ...S.mono, fontSize: labels.includes(v) ? 16 : 10, fontWeight: 800, color: labels.includes(v) ? C.ten : C.sink2 }}>{labels.includes(v) ? v : ''}</span>
    </button>
  );
});

const FX_CSS = `.d06-pop { animation: d06pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d06pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d06-star { opacity: .35; animation: d06tw 3.2s ease-in-out infinite; }
        @keyframes d06tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d06-float { animation: d06float 3s ease-in-out infinite; }
        @keyframes d06float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D05_CORRECT = 40;
const D05_T = {
  uz: {
    eyebrow: 'O‘rtasini toping', setup: 'Trassada 20 va 60 belgilangan.',
    ask: '20 va 60 ning aynan o‘rtasidagi belgini bosing.',
    correct: "To'g'ri. 20 va 60 o‘rtasi — 40 (ikki tomondan 20 birlik).",
    wrong: "Maslahat: o‘rta ikki tomondan teng uzoqlikda. 20 dan 20, 60 dan 20.",
    rule: "O‘rta nuqta ikki chetdan teng masofada: 20 va 60 orasi 40.",
  },
  ru: {
    eyebrow: 'Найди середину', setup: 'На трассе отмечены 20 и 60.',
    ask: 'Нажми отметку ровно посередине между 20 и 60.',
    correct: 'Верно. Середина 20 и 60 — это 40 (по 20 с каждой стороны).',
    wrong: 'Подсказка: середина одинаково далеко с обеих сторон. По 20 от 20 и от 60.',
    rule: 'Середина одинаково удалена от краёв: между 20 и 60 это 40.',
  },
};
function D06_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.value != null) { setPicked(initialAnswer.studentAnswer.value); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: picked }, correctAnswer: { value: D05_CORRECT }, correct, meta: { tag: 'midpoint', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <LineBase max={100} h={82}>
          {/* 20 va 60 chegaralar */}
          {[20, 60].map((v) => <div key={v} style={{ position: 'absolute', left: (v) + '%', top: 82 * 0.5 - 16, transform: 'translateX(-50%)', textAlign: 'center' }}><div style={{ width: 4, height: 16, background: C.ten, margin: '0 auto', borderRadius: 2 }} /><div style={{ ...S.mono, fontSize: 12, fontWeight: 800, color: C.ten }}>{v}</div></div>)}
          <ClickTicks max={100} labels={[]} picked={picked} correctVal={D05_CORRECT} checked={checked} disabled={isReview || checked} onPick={setPicked} h={82} />
        </LineBase>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D06_05(props) {
  return (<><style>{FX_CSS}</style><D06_05Impl {...props} /></>);
}
