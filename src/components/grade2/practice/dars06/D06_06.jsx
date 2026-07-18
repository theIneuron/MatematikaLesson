// Dars 6 · Amaliyot 06 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

// belgilangan (o'qiladigan) ticklar
const StaticTicks = ({ max, labels, h = 74 }) => TICKS(max).map((v) => (
  <div key={v} style={{ position: 'absolute', left: (v / max * 100) + '%', top: h * 0.5 - 5, transform: 'translateX(-50%)' }}>
    <div style={{ width: labels.includes(v) ? 4 : 3, height: labels.includes(v) ? 12 : 8, background: labels.includes(v) ? C.ten : '#93a6cc', margin: '0 auto', borderRadius: 2 }} />
    {labels.includes(v) && <div style={{ ...S.mono, fontSize: 11, fontWeight: 800, color: C.ten, marginTop: 3, textAlign: 'center' }}>{v}</div>}
  </div>
));

const FX_CSS = `.d06-pop { animation: d06pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d06pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d06-star { opacity: .35; animation: d06tw 3.2s ease-in-out infinite; }
        @keyframes d06tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d06-float { animation: d06float 3s ease-in-out infinite; }
        @keyframes d06float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D06_OPTS = ['oldinga 40', 'orqaga 40', 'oldinga 4', 'oldinga 100'];
const D06_OPTS_RU = ['вперёд на 40', 'назад на 40', 'вперёд на 4', 'вперёд на 100'];
const D06_CORRECT = 0;
const D06_T = {
  uz: {
    eyebrow: 'Yo‘nalish', setup: 'Kema avval 30 da edi, endi 70 da.',
    ask: 'Kema qaysi tomonga va qancha harakatlandi?',
    correct: "To'g'ri. 30 dan 70 ga — oldinga 40 birlik (70 − 30 = 40).",
    wrong: "Maslahat: 70, 30 dan katta — demak oldinga. Qancha? 70 − 30.",
    rule: "Katta songa — oldinga; masofa = ayirma. 30 → 70: oldinga 40.",
  },
  ru: {
    eyebrow: 'Направление', setup: 'Корабль был на 30, теперь на 70.',
    ask: 'В какую сторону и на сколько сдвинулся корабль?',
    correct: 'Верно. С 30 на 70 — вперёд на 40 (70 − 30 = 40).',
    wrong: 'Подсказка: 70 больше 30 — значит вперёд. На сколько? 70 − 30.',
    rule: 'К большему — вперёд; расстояние = разность. 30 → 70: вперёд на 40.',
  },
};
function D06_06Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const opts = lang === 'uz' ? D06_OPTS : D06_OPTS_RU;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: opts[picked] }, correctAnswer: { idx: 0, label: opts[0] }, correct, meta: { tag: 'direction', level: '🟡' } });
  }, [picked, opts, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <LineBase max={100} h={80}>
          <StaticTicks max={100} labels={[0, 30, 70, 100]} h={80} />
          <div style={{ position: 'absolute', left: '30%', top: 4, transform: 'translateX(-50%)', fontSize: 22, opacity: 0.4 }}>🚀</div>
          <div className="d06-float" style={{ position: 'absolute', left: '70%', top: 2, transform: 'translateX(-50%)', fontSize: 26 }}>🚀</div>
          <div style={{ position: 'absolute', left: '30%', width: '40%', top: 30, height: 24, borderTop: '3px solid ' + C.acc, borderRadius: '40px 40px 0 0' }} />
          <div style={{ position: 'absolute', left: '69%', top: 22, color: C.acc, fontSize: 16, fontWeight: 900 }}>▶</div>
        </LineBase>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {opts.map((o, i) => { const on = picked === i, show = checked && on; let bd = C.line, bg = C.paper, col = C.ink; if (on && !checked) { bd = C.acc; bg = C.accSoft; } if (show) { const ok = i === D06_CORRECT; bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; } return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: '1 1 45%', minHeight: 58, borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 17, fontWeight: 800, fontFamily: 'inherit', cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>; })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D06_06(props) {
  return (<><style>{FX_CSS}</style><D06_06Impl {...props} /></>);
}
