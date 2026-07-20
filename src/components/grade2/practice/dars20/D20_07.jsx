// Dars 20 · Amaliyot 07 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d20-pop { animation: d20pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d20-star { opacity: .35; animation: d20tw 3.2s ease-in-out infinite; }
        @keyframes d20tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d20-drop { animation: d20drop .5s cubic-bezier(.34,1.56,.64,1) both, d20shine 3.4s ease-in-out infinite; }
        @keyframes d20drop { 0% { opacity: 0; transform: rotate(45deg) translateY(-6px) scale(.4); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d20shine { 0%, 100% { box-shadow: 0 0 5px rgba(255,194,60,.45); } 50% { box-shadow: 0 0 11px rgba(255,214,115,.95); } }
        .d20-float { animation: d20float 3s ease-in-out infinite; }
        @keyframes d20float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d20-pulse { animation: d20pulse 1.5s ease-in-out infinite; }
        @keyframes d20pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D07_ROWS = [
  { txt: '3 × 4 = 12', ok: true },
  { txt: '12 ÷ 4 = 3', ok: true },
  { txt: '12 ÷ 5', ok: false },
  { txt: '12 ÷ 3 = 4', ok: true },
];
const D07_CORRECT = 2;
const D07_T = {
  uz: {
    eyebrow: 'Begonani top', setup: "Bu 3, 4, 12 oilasi. Bittasi oilaga tegishli emas.",
    ask: 'Qaysi a‘zo ORTIQCHA (oilaga begona)?',
    correct: "To'g'ri. 12 ÷ 5 bu oiladan emas — 5 soni oilada yo'q.",
    wrong: "Maslahat: oila faqat 3, 4, 12 dan. 12 ÷ 5 da 5 qayerdan keldi?",
    rule: "Oila uch sondan: 3, 4, 12. Boshqa son kirsa — begona.",
  },
  ru: {
    eyebrow: 'Найди лишнего', setup: 'Это семья 3, 4, 12. Один не из этой семьи.',
    ask: 'Какой член ЛИШНИЙ (чужой в семье)?',
    correct: 'Верно. 12 ÷ 5 не из этой семьи — числа 5 в семье нет.',
    wrong: 'Подсказка: семья только из 3, 4, 12. Откуда 5 в 12 ÷ 5?',
    rule: 'Семья из трёх чисел: 3, 4, 12. Другое число — чужой.',
  },
};
function D20_07Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
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
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setReveal(true), 400);
    onSubmit?.({ questionText: t.ask, options: D07_ROWS.map((r, i) => ({ id: String(i), label: r.txt })), studentAnswer: { idx: picked }, correctAnswer: { idx: 2 }, correct, meta: { tag: 'family_intruder', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const rowStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = C.paper, bd = C.line, col = '#374151';
    if (on) { bg = C.accSoft; bd = C.acc; col = C.ink; }
    if (show) { const ok = i === D07_CORRECT; bg = ok ? C.okSoft : C.noSoft; bd = ok ? C.ok : C.no; col = ok ? C.ok : C.no; }
    return { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', padding: '15px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 18, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, ...S.mono, minHeight: 58 };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      {D07_ROWS.map((r, i) => (
        <button key={i} type="button" style={rowStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>
          <span>{r.txt}</span>
          {reveal && !r.ok && <span className="d20-pop" style={{ fontSize: 13, fontWeight: 800, color: C.no, background: C.noSoft, padding: '4px 9px', borderRadius: 8 }}>begona</span>}
          {reveal && r.ok && <span className="d20-pop" style={{ fontSize: 16, color: C.ok }}>✓</span>}
        </button>
      ))}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D20_07(props) {
  return (<><style>{FX_CSS}</style><D20_07Impl {...props} /></>);
}
