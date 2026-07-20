// Dars 1 · Amaliyot 10 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>);

const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>);

const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 15.5, fontWeight: 800, letterSpacing: '.04em', color: C.acc, textTransform: 'uppercase' },
  setup: { fontSize: 20, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 21.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d01-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d01-pop { animation: d01pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d01pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d01-star { opacity: .35; animation: d01tw 3.2s ease-in-out infinite; }
        @keyframes d01tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d01-drop { animation: d01drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d01drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d01-float { animation: d01float 3s ease-in-out infinite; }
        @keyframes d01float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d01-pulse { animation: d01pulse 1.5s ease-in-out infinite; }
        @keyframes d01pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D10_ROWS = [
  { txt: '2 o‘nlik 3 birlik = 23', ok: true },
  { txt: '5 o‘nlik 1 birlik = 15', ok: false, fix: '= 51' },
  { txt: '3 o‘nlik 0 birlik = 30', ok: true },
  { txt: '1 o‘nlik 7 birlik = 17', ok: true },
];
const D10_CORRECT = 1;
const D10_T = {
  uz: {
    eyebrow: 'Xatoni toping', setup: "To'rt yozuv. Bittasida son noto'g'ri.",
    ask: 'Qaysi qatorda son NOTO‘G‘RI?',
    correct: "To'g'ri. 5 o'nlik 1 birlik = 51, 15 emas. O'nlik oldinda.",
    wrong: "Maslahat: har bir yozuvda chap raqam — o'nliklar, o'ng raqam — birliklar. Qaysi yozuvda son mos kelmaydi?",
    rule: "O'nlik birinchi raqam bo'ladi: 5 o'nlik 1 birlik = 51.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Четыре записи. В одной число неверное.',
    ask: 'В какой строке число НЕВЕРНОЕ?',
    correct: 'Верно. 5 десятков 1 единица = 51, а не 15. Десятки впереди.',
    wrong: 'Подсказка: в каждой записи левая цифра — десятки, правая — единицы. Где число не совпадает?',
    rule: 'Десятки — первая цифра: 5 десятков 1 единица = 51.',
  },
};
function D01_10Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const order = React.useMemo(() => { const a = D10_ROWS.map((_, i) => i); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; }, []);
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setReveal(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 400);
    onSubmit?.({ questionText: t.ask, options: D10_ROWS.map((r, i) => ({ id: String(i), label: r.txt })), studentAnswer: { idx: picked }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'pv_findwrong', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rowStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = C.paper, bd = C.line, col = '#374151';
    if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
    if (show) { const ok = i === D10_CORRECT; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
    return { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', padding: '15px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, minHeight: 56 };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      {order.map((i) => { const r = D10_ROWS[i]; return (
        <button key={i} type="button" style={rowStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>
          <span>{r.txt}</span>
          {reveal && !r.ok && <span className="d01-pop" style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: C.no, background: C.noSoft, padding: '4px 9px', borderRadius: 8 }}>{r.fix}</span>}
          {reveal && r.ok && <span className="d01-pop" style={{ fontSize: 16, color: C.ok }}>✓</span>}
        </button>
      ); })}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D01_10(props) {
  return (<><style>{FX_CSS}</style><D01_10Impl {...props} /></>);
}
