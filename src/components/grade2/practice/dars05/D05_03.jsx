// Dars 5 · Amaliyot 03 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d05-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

const Cassette = ({ s = 26, dim = false }) => (
  <svg width={s} height={s * 66 / 48} viewBox="0 0 48 66" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', opacity: dim ? 0.4 : 1, transition: 'opacity .2s' }}>
    <defs><linearGradient id="d5cass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4E5E82" /><stop offset="52%" stopColor="#8C9EC4" /><stop offset="100%" stopColor="#4E5E82" /></linearGradient></defs>
    <rect x="1" y="4" width="46" height="61" rx="7" fill="url(#d5cass)" stroke="#33415F" strokeWidth="1.4" />
    <rect x="17" y="6.6" width="14" height="5.2" rx="2.6" fill="#0C121F" /><circle cx="24" cy="9.2" r="2" fill={dim ? '#3A4A66' : '#6EF29B'} />
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
  <div className="d05-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d05-pop { animation: d05pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d05pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d05-star { opacity: .35; animation: d05tw 3.2s ease-in-out infinite; }
        @keyframes d05tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D03_N = 6;
const D03_T = {
  uz: {
    eyebrow: 'O‘nlab sanang', setup: 'Olti kasseta-dasta, har biri 10 lik.',
    ask: 'Har dastani bosib, o‘nlab sanang. Hammasini sanang.',
    correct: "To'g'ri! 10, 20, 30, 40, 50, 60. Olti dasta — 60.",
    wrong: "Maslahat: har dasta 10 ta. Birlab emas, o'nlab sanang: 10, 20, 30 …",
    rule: "Dastalarni o'nlab sanaymiz: 6 dasta = 60.",
  },
  ru: {
    eyebrow: 'Считай десятками', setup: 'Шесть кассет-пачек, каждая по 10.',
    ask: 'Нажимай каждую пачку и считай десятками. Сосчитай все.',
    correct: 'Верно! 10, 20, 30, 40, 50, 60. Шесть пачек — 60.',
    wrong: 'Подсказка: в каждой пачке 10. Считай не по одному, а десятками: 10, 20, 30 …',
    rule: 'Пачки считаем десятками: 6 пачек = 60.',
  },
};
function D05_03Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [counted, setCounted] = useState([]);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.counted) { setCounted(sa.counted); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const total = counted.length * 10;
  const all = counted.length === D03_N;
  useEffect(() => { onReady?.(all && !checked); }, [all, checked, onReady]);
  const tap = (i) => { if (isReview || checked || counted.includes(i)) return; setCounted((c) => [...c, i]); };
  const check = useCallback(() => {
    const correct = total === 60;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { counted, total }, correctAnswer: { value: 60 }, correct, meta: { tag: 'tapcount', level: '🟢' } });
  }, [total, counted, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const totCol = checked ? (fb?.correct ? C.ok : C.no) : C.ten;
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Array.from({ length: D03_N }).map((_, i) => {
            const done = counted.includes(i);
            const order = counted.indexOf(i);
            return (
              <button key={i} type="button" disabled={isReview || checked || done} onClick={() => tap(i)} style={{ position: 'relative', background: 'transparent', border: 'none', padding: 0, cursor: (isReview || checked || done) ? 'default' : 'pointer' }}>
                <Cassette s={40} dim={!done} />
                {done && <span style={{ position: 'absolute', top: -6, right: -4, background: C.ok, color: '#fff', ...S.mono, fontSize: 11, fontWeight: 800, borderRadius: 8, padding: '1px 5px' }}>{(order + 1) * 10}</span>}
              </button>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 10, ...S.mono, fontSize: 32, fontWeight: 800, color: totCol }}>{total}</div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D05_03(props) {
  return (<><style>{FX_CSS}</style><D05_03Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D05_03.audio = {
  uz: { intro: "Olti kasseta-dasta, har biri 10 lik. Har dastani bosib, o'nlab sanang. Hammasini sanang.", on_correct: "To'g'ri! 10, 20, 30, 40, 50, 60. Olti dasta, 60.", on_wrong: "Maslahat. Har dasta 10 ta. Birlab emas, o'nlab sanang. 10, 20, 30 va hokazo" },
  ru: { intro: "Шесть кассет-пачек, каждая по 10. Нажимай каждую пачку и считай десятками. Сосчитай все.", on_correct: "Верно! 10, 20, 30, 40, 50, 60. Шесть пачек, 60.", on_wrong: "Подсказка. В каждой пачке 10. Считай не по одному, а десятками. 10, 20, 30 и так далее" },
};
