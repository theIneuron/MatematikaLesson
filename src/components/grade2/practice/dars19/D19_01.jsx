// Dars 19 · Amaliyot 01 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  gold: '#FFC23C', goldSoft: '#FFD873', ring: '#3A4A63',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d19-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const Crystal = ({ s = 18, cls = 'd19-drop', delay = 0 }) => (
  <span className={cls} style={{ width: s, height: s, background: 'linear-gradient(160deg,#FFE79E,#FFB524)', display: 'inline-block', transform: 'rotate(45deg)', borderRadius: 3, boxShadow: '0 0 7px rgba(255,194,60,.55)', animationDelay: delay + 's' }} />
);

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d19-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = C.paper, bd = C.line, col = '#374151';
  if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
  if (show) { const ok = i === correctIdx; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '14px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 66,
  };
}

// bosib teng ulash: total kristal → k idish (round-robin), to'q sahnada
function ShareBoard({ total, baskets, placed, setPlaced, locked }) {
  const counts = Array.from({ length: baskets }).map((_, b) => { let c = 0; for (let k = 0; k < placed; k++) if (k % baskets === b) c++; return c; });
  const pile = total - placed;
  return (
    <div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', minHeight: 34, marginBottom: 10 }}>
        {Array.from({ length: pile }).map((_, i) => (
          <button key={i} type="button" disabled={locked} onClick={() => setPlaced((p) => Math.min(total, p + 1))} style={{ border: 'none', background: 'transparent', cursor: locked ? 'default' : 'pointer', padding: 2 }}><Crystal delay={i * 0.03} /></button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {counts.map((c, b) => (
          <div key={b} style={{ minWidth: 62, minHeight: 62, borderRadius: '12px 12px 16px 16px', border: '2px solid ' + C.ring, background: 'rgba(255,194,60,.06)', padding: 6, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end', justifyContent: 'center' }}>
            {Array.from({ length: c }).map((_, i) => <Crystal key={i} s={14} cls="d19-pop" />)}
          </div>
        ))}
      </div>
    </div>
  );
}

const FX_CSS = `.d19-pop { animation: d19pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d19pop { 0% { opacity: 0; transform: rotate(45deg) scale(.3); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        .d19-star { opacity: .35; animation: d19tw 3.2s ease-in-out infinite; }
        @keyframes d19tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d19-drop { animation: d19drop .5s cubic-bezier(.34,1.56,.64,1) both, d19shine 3.4s ease-in-out infinite; }
        @keyframes d19drop { 0% { opacity: 0; transform: rotate(45deg) translateY(-6px) scale(.4); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d19shine { 0%, 100% { box-shadow: 0 0 5px rgba(255,194,60,.45); } 50% { box-shadow: 0 0 11px rgba(255,214,115,.95); } }
        .d19-float { animation: d19float 3s ease-in-out infinite; }
        @keyframes d19float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d19-pulse { animation: d19pulse 1.5s ease-in-out infinite; }
        @keyframes d19pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D01_TOTAL = 12, D01_BASK = 3, D01_CORRECT = 1;
const D01_T = {
  uz: {
    eyebrow: 'Teng ulash', setup: "Anvar 12 ta kristal topdi. Ularni 3 do'stga teng ulash kerak.",
    ask: 'Kristallarni birma-bir bosib ulang. Har do‘stga nechtadan tegadi?',
    opts: ['3', '4', '6', '9'],
    correct: "To'g'ri. 12 ni 3 ga teng ulasak, har biriga 4 tadan: 12 ÷ 3 = 4.",
    wrong: "Maslahat: hammaga teng ulang. 12 ÷ 3 = 4. 12 − 3 = 9 emas — bu ayirish.",
    rule: "Bo'lish — teng ulash. 12 ni 3 ga: har biriga 4 tadan.",
  },
  ru: {
    eyebrow: 'Поровну', setup: 'Анвар нашёл 12 кристаллов. Их надо поделить между 3 друзьями поровну.',
    ask: 'Раздай кристаллы, нажимая по одному. Сколько достанется каждому?',
    opts: ['3', '4', '6', '9'],
    correct: 'Верно. 12 на 3 поровну — по 4 каждому: 12 ÷ 3 = 4.',
    wrong: 'Подсказка: раздай всем поровну. 12 ÷ 3 = 4. 12 − 3 = 9 — это вычитание.',
    rule: 'Деление — это раздать поровну. 12 на 3 — по 4 каждому.',
  },
};
function D19_01Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const order = React.useMemo(() => { const a = t.opts.map((_, i) => i); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; }, []);
  const isReview = mode === 'review';
  const [placed, setPlaced] = useState(0);
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); setPlaced(D01_TOTAL); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(placed === D01_TOTAL && picked != null && !checked); }, [placed, picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 1, label: '4' }, correct, meta: { tag: 'share_tap', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage><ShareBoard total={D01_TOTAL} baskets={D01_BASK} placed={placed} setPlaced={setPlaced} locked={isReview || checked} /></Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {order.map((i) => <button key={i} type="button" style={optStyle(picked, i, D01_CORRECT, checked, isReview, { half: true, center: true, mono: true, fs: 22 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{t.opts[i]}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D19_01(props) {
  return (<><style>{FX_CSS}</style><D19_01Impl {...props} /></>);
}
