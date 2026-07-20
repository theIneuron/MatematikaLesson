// Dars 16 · Amaliyot 06 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  // sahna (animatsiya) — to'q koinot
  stage: 'radial-gradient(ellipse at 60% 26%, #22335c 0%, #101c38 66%, #0b1428 100%)',
  stageBd: '#2A3A5A', sink: '#EAF0F8', sink2: '#AEBAD0', stile: '#16223c',
  green: '#6EF29B', gold: '#FFC23C', sig: '#5BD6F2',
};

const STARS = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '12px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {STARS.map((s, i) => <span key={i} className="d16-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
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
  <div className="d16-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d16-star { opacity: .35; animation: d16tw 3.2s ease-in-out infinite; }
        @keyframes d16tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d16-sprout { animation: d16sprout .5s cubic-bezier(.34,1.56,.64,1) both, d16sway 3.6s ease-in-out infinite; }
        @keyframes d16sprout { 0% { opacity: 0; transform: rotate(45deg) scale(.2); } 100% { opacity: 1; transform: rotate(45deg) scale(1); } }
        @keyframes d16sway { 0%, 100% { transform: rotate(45deg) translateY(0); } 50% { transform: rotate(45deg) translateY(-1.5px); } }
        .d16-float { animation: d16float 3s ease-in-out infinite; }
        @keyframes d16float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d16-cell { animation: d16cell .4s ease both; }
        @keyframes d16cell { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: none; } }
        .d16-pulse { animation: d16pulse 1.5s ease-in-out infinite; }
        @keyframes d16pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D06_STEP = 7, D06_TARGET = 28, D06_TIMES = 4;
const D06_T = {
  uz: {
    eyebrow: 'Ko‘paytmani qur', setup: "Har lotokda 7 ta ko'chat. Lotoklarni birma-bir qo'shing — 28 ta ko'chat kerak.",
    ask: '«+7» tugmasini bosib, 28 ga yeting. Nechta lotok kerak?',
    add: '+7', undo: 'Qaytar',
    correct: "To'g'ri. 7 ni 4 marta oldingiz: 7, 14, 21, 28 — bu 7 × 4 = 28.",
    wrong: "Maslahat: har bosishda 7 qo'shiladi. 7, 14, 21, 28 — qaysida 28 bo'ladi?",
    rule: "7 × 4 — to'rtta lotok, har birida 7 ta: 7+7+7+7 = 28.",
  },
  ru: {
    eyebrow: 'Собери произведение', setup: 'В каждом лотке по 7 саженцев. Добавляй лотки по одному — нужно 28.',
    ask: 'Нажимай «+7», дойди до 28. Сколько лотков нужно?',
    add: '+7', undo: 'Назад',
    correct: 'Верно. Ты взял 7 четыре раза: 7, 14, 21, 28 — это 7 × 4 = 28.',
    wrong: 'Подсказка: каждое нажатие добавляет 7. 7, 14, 21, 28 — где будет 28?',
    rule: '7 × 4 — четыре лотка, в каждом по 7: 7+7+7+7 = 28.',
  },
};
function D16_06Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [count, setCount] = useState(1);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.count != null) { setCount(sa.count); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const value = D06_STEP * count;
  useEffect(() => { onReady?.(!checked); }, [checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = value === D06_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { count, value }, correctAnswer: { count: D06_TIMES, value: D06_TARGET }, correct, meta: { tag: 'build_mul7', level: '🟡' } });
  }, [count, value, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <Stage>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', minHeight: 54 }}>
          {Array.from({ length: count }).map((_, k) => (
            <div key={k} className="d16-pop" style={{ padding: 6, borderRadius: 10, background: 'rgba(110,242,155,.10)', border: '2px solid ' + C.green }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>{Array.from({ length: 7 }).map((_, i) => <span key={i} className="d16-sprout" style={{ width: 10, height: 10, borderRadius: '50% 50% 50% 0', background: C.green, transform: 'rotate(45deg)', animationDelay: (i * 0.04) + 's' }} />)}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, ...S.mono, fontSize: 18, fontWeight: 800, color: C.sink }}>
          {Array.from({ length: count }).map(() => '7').join(' + ')}
          {checked && fb?.correct && <span style={{ color: C.green }}> = {value}</span>}
        </div>
      </Stage>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button type="button" disabled={locked} onClick={() => setCount((c) => Math.min(c + 1, 8))} style={{ padding: '13px 24px', borderRadius: 13, border: '2px solid ' + C.acc, background: C.acc, color: C.paper, ...S.mono, fontSize: 18, fontWeight: 800, cursor: locked ? 'default' : 'pointer', minHeight: 52 }}>{t.add}</button>
        <button type="button" disabled={locked || count <= 1} onClick={() => setCount((c) => Math.max(1, c - 1))} style={{ padding: '13px 18px', borderRadius: 13, border: '2px solid ' + C.line, background: C.paper, color: count <= 1 ? '#cbd5e1' : '#374151', fontSize: 14, fontWeight: 800, cursor: (locked || count <= 1) ? 'default' : 'pointer', minHeight: 52 }}>{t.undo}</button>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D16_06(props) {
  return (<><style>{FX_CSS}</style><D16_06Impl {...props} /></>);
}
