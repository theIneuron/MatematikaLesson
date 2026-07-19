// Dars 17 · Amaliyot 01 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  sig: '#5BD6F2', sig2: '#7FE3F7', gold: '#FFC23C',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d17-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const Dish = ({ s = 15, delay = 0 }) => (
  <span className="d17-ping" style={{ width: s, height: s, borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%, #cdf3ff, #5BD6F2 58%, #2196c4)', display: 'inline-block', boxShadow: '0 0 6px rgba(91,214,242,.55)', animationDelay: delay + 's' }} />
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
  <div className="d17-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#E6F6FC', border: '1.5px solid #B6E6F5', color: '#0A6E93' }}>
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

function DishGrid({ n, cols = 4, base = 0 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + Math.min(n, cols) + ', 1fr)', gap: 5, justifyItems: 'center' }}>
      {Array.from({ length: n }).map((_, i) => <Dish key={i} delay={(base + i) * 0.05} />)}
    </div>
  );
}

const FX_CSS = `.d17-pop { animation: d17pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d17pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d17-star { opacity: .35; animation: d17tw 3.2s ease-in-out infinite; }
        @keyframes d17tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d17-ping { animation: d17ping .5s cubic-bezier(.34,1.56,.64,1) both, d17glow 2.6s ease-in-out infinite; }
        @keyframes d17ping { 0% { opacity: 0; transform: scale(.2); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes d17glow { 0%, 100% { box-shadow: 0 0 4px rgba(91,214,242,.4); } 50% { box-shadow: 0 0 10px rgba(91,214,242,.95); } }
        .d17-float { animation: d17float 3s ease-in-out infinite; }
        @keyframes d17float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d17-cell { animation: d17cell .4s ease both; }
        @keyframes d17cell { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: none; } }
        .d17-pulse { animation: d17pulse 1.5s ease-in-out infinite; }
        @keyframes d17pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Teng bloklar', setup: "Aloqa modulida 3 ta blok, har birida 8 ta antenna.",
    ask: 'Bloklarni birma-bir bosing, jami nechta antennaligini toping:',
    opts: ['24', '11', '16', '32'],
    correct: "To'g'ri. 8 tadan 3 marta: 8, 16, 24. Bu 8 × 3 = 24.",
    wrong: "Maslahat: har blokda 8 ta. Sanang: 8, 16, 24. 8+3=11 emas — bu qo'shish.",
    rule: "Teng bloklar yig'indisi — ko'paytirish: 8 + 8 + 8 = 8 × 3.",
  },
  ru: {
    eyebrow: 'Равные блоки', setup: 'В модуле связи 3 блока, в каждом по 8 антенн.',
    ask: 'Нажимай блоки по одному и найди, сколько всего антенн:',
    opts: ['24', '11', '16', '32'],
    correct: 'Верно. По 8 три раза: 8, 16, 24. Это 8 × 3 = 24.',
    wrong: 'Подсказка: в каждом блоке по 8. Считай: 8, 16, 24. 8+3=11 — это сложение.',
    rule: 'Сумма равных блоков — умножение: 8 + 8 + 8 = 8 × 3.',
  },
};
function D17_01Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [tapped, setTapped] = useState([false, false, false]);
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); setTapped([true, true, true]); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const tapCount = tapped.filter(Boolean).length;
  const tap = (g) => { if (isReview || checked) return; setTapped((s) => { const n = s.slice(); n[g] = true; return n; }); };
  const check = useCallback(() => {
    const correct = picked === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 0, label: '24' }, correct, meta: { tag: 'count_groups8', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[0, 1, 2].map((g) => (
            <div key={g} className={tapped[g] ? 'd17-pop' : undefined} onClick={() => tap(g)} style={{ padding: 8, borderRadius: 12, border: '2px solid ' + (tapped[g] ? C.sig : C.stageBd), background: tapped[g] ? 'rgba(91,214,242,.12)' : C.stile, cursor: (isReview || checked) ? 'default' : 'pointer', minWidth: 78 }}>
              <DishGrid n={8} cols={4} base={g * 8} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, ...S.mono, fontSize: 20, fontWeight: 800, color: C.sig2, minHeight: 26 }}>
          <span key={tapCount} className={tapCount ? 'd17-pop' : undefined} style={{ display: 'inline-block' }}>{Array.from({ length: tapCount }).map((_, i) => (i + 1) * 8).join(' → ')}</span>
        </div>
      </Stage>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, D01_CORRECT, checked, isReview, { half: true, center: true, mono: true, fs: 22 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D17_01(props) {
  return (<><style>{FX_CSS}</style><D17_01Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D17_01.audio = {
  uz: { intro: "Aloqa modulida 3 ta blok, har birida 8 ta antenna. Bloklarni birma-bir bosing, jami nechta antennaligini toping.", on_correct: "To'g'ri. 8 tadan 3 marta. 8, 16, 24. Bu 8 ko'paytirish 3 teng 24.", on_wrong: "Maslahat. Har blokda 8 ta. Sanang. 8, 16, 24. 8 qo'shish 3 teng 11 emas, bu qo'shish." },
  ru: { intro: "В модуле связи 3 блока, в каждом по 8 антенн. Нажимай блоки по одному и найди, сколько всего антенн.", on_correct: "Верно. По 8 три раза. 8, 16, 24. Это 8 умножить на 3 равно 24.", on_wrong: "Подсказка. В каждом блоке по 8. Считай. 8, 16, 24. 8 плюс 3 равно 11, это сложение." },
};
