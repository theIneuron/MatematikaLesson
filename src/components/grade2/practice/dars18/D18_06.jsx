// Dars 18 · Amaliyot 06 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  box: '#F0B978', gold: '#FFC23C',
};

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
  <div className="d18-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d18-pop { animation: d18pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d18pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d18-star { opacity: .35; animation: d18tw 3.2s ease-in-out infinite; }
        @keyframes d18tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d18-drop { animation: d18drop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d18drop { 0% { opacity: 0; transform: translateY(-8px) scale(.4); } 100% { opacity: 1; transform: none; } }
        .d18-turn { animation: d18turn .5s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d18turn { 0% { opacity: .3; transform: rotate(-14deg) scale(.85); } 100% { opacity: 1; transform: none; } }
        .d18-float { animation: d18float 3s ease-in-out infinite; }
        @keyframes d18float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d18-pulse { animation: d18pulse 1.5s ease-in-out infinite; }
        @keyframes d18pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D06_ROWS = [
  { txt: '5 × 4 = 20 · 4 × 5 = 20', ok: true },
  { txt: '3 × 6 = 18 · 6 × 3 = 20', ok: false, fix: '6 × 3 = 18' },
  { txt: '2 × 7 = 14 · 7 × 2 = 14', ok: true },
];
const D06_CORRECT = 1;
const D06_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "O'rin almashishda juftlar teng bo'lishi kerak. Bittasida xato bor.",
    ask: 'Qaysi qatorda o‘rin almashish NOTO‘G‘RI?',
    correct: "To'g'ri. 6 × 3 = 18, 20 emas. 3 × 6 va 6 × 3 — ikkalasi 18.",
    wrong: "Maslahat: har juftni tekshiring. 3 × 6 va 6 × 3 teng bo'lishi kerak.",
    rule: "a × b = b × a — juftlar doim teng. Teng bo'lmasa, xato bor.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'При перестановке пары должны быть равны. В одной ошибка.',
    ask: 'В какой строке перестановка НЕВЕРНА?',
    correct: 'Верно. 6 × 3 = 18, а не 20. 3 × 6 и 6 × 3 — оба 18.',
    wrong: 'Подсказка: проверь каждую пару. 3 × 6 и 6 × 3 должны быть равны.',
    rule: 'a × b = b × a — пары всегда равны. Если не равны, есть ошибка.',
  },
};
function D18_06Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
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
    const correct = picked === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 400);
    onSubmit?.({ questionText: t.ask, options: D06_ROWS.map((r, i) => ({ id: String(i), label: r.txt })), studentAnswer: { idx: picked }, correctAnswer: { idx: 1 }, correct, meta: { tag: 'find_wrong_commute', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rowStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = C.paper, bd = C.line, col = '#374151';
    if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
    if (show) { const ok = i === D06_CORRECT; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
    return { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', padding: '15px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, ...S.mono, minHeight: 58 };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      {D06_ROWS.map((r, i) => (
        <button key={i} type="button" style={rowStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>
          <span>{r.txt}</span>
          {reveal && !r.ok && <span className="d18-pop" style={{ fontSize: 12.5, fontWeight: 800, color: C.no, background: C.noSoft, padding: '4px 9px', borderRadius: 8 }}>{r.fix}</span>}
          {reveal && r.ok && <span className="d18-pop" style={{ fontSize: 16, color: C.ok }}>✓</span>}
        </button>
      ))}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D18_06(props) {
  return (<><style>{FX_CSS}</style><D18_06Impl {...props} /></>);
}
