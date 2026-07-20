// Dars 11 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)',
  stageBd: '#6b3e2e', sink: '#F5E7DE', sink2: '#CBA595', stile: '#331a10', boxBd: '#E0B39D',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB', mars: '#E4703A',
};

const DUST = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '14px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DUST.map((s, i) => <span key={i} className="d11-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#f0c3ac', animationDelay: s[2] + 's' }} />)}
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
  <div className="d11-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d11-star { opacity: .4; animation: d11tw 3.4s ease-in-out infinite; }
        @keyframes d11tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

// 64 = 60 + 4 (o'nlar + birlar yig'indisi). To'g'ri qatorni topish.
const D05_OPTS = ['60 + 4', '6 + 4', '40 + 6', '60 + 40'];
const D05_CORRECT = 0;
const D05_T = {
  uz: { eyebrow: 'Yoyilgan shakl', setup: '64 = 6 o‘nlik va 4 birlik. 6 o‘nlik — bu 60.', ask: '64 sonini o‘nlar va birlar yig‘indisi ko‘rinishida qaysi qator to‘g‘ri ifodalaydi?', correct: "To'g'ri. 64 = 60 + 4 (6 o‘nlik = 60, 4 birlik = 4).", wrong: "Maslahat: 6 — o‘nlik raqami, u nechani bildiradi? 4 — birlik. Ikkalasini qo‘shing.", rule: "64 = 60 + 4. O‘nlik raqamning qiymati o‘nlab: 6 → 60." },
  ru: { eyebrow: 'Разрядная сумма', setup: '64 = 6 десятков и 4 единицы. 6 десятков — это 60.', ask: 'Какая строка верно выражает 64 как сумму десятков и единиц?', correct: 'Верно. 64 = 60 + 4 (6 десятков = 60, 4 единицы = 4).', wrong: 'Подсказка: 6 — цифра десятков, сколько это? 4 — единицы. Сложи их.', rule: '64 = 60 + 4. Цифра десятков стоит десятками: 6 → 60.' },
};
function D11_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const order = React.useMemo(() => { const a = D05_OPTS.map((_, i) => i); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); const tmp = a[k]; a[k] = a[j]; a[j] = tmp; } return a; }, []);
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null); const [fb, setFb] = useState(null); const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D05_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: D05_OPTS[picked] }, correctAnswer: { idx: 0, label: '60 + 4' }, correct, meta: { tag: 'expandform', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 40px', justifyContent: 'center', gap: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: C.ten }}>O‘N</span><span style={{ fontSize: 10, fontWeight: 800, color: C.one }}>BIR</span>
            <span style={{ ...S.mono, fontSize: 52, fontWeight: 800, color: C.ten }}>6</span><span style={{ ...S.mono, fontSize: 52, fontWeight: 800, color: C.one }}>4</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: C.sink2 }}>64 = <span style={{ color: C.ten }}>6 o‘nlik</span> + <span style={{ color: C.one }}>4 birlik</span></div>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {order.map((i) => {
          const on = picked === i, show = checked && on;
          let bd = C.line, bg = C.paper, col = C.ink;
          if (on && !checked) { bd = C.acc; bg = C.accSoft; }
          if (show) { const okv = i === D05_CORRECT; bd = okv ? C.ok : C.no; bg = okv ? C.okSoft : C.noSoft; col = okv ? C.ok : C.no; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ minWidth: 108, height: 58, borderRadius: 13, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 24, fontWeight: 800, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', boxShadow: (on && !checked) ? '0 0 0 4px #FFE0D6' : 'none' }}>{D05_OPTS[i]}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D11_05(props) {
  return (<><style>{FX_CSS}</style><D11_05Impl {...props} /></>);
}
