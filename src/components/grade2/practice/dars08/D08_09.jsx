// Dars 8 · Amaliyot 09 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
// jsx-question kontrakti: onReady / registerCheck / onSubmit. O'z "Tekshirish" tugmasi yo'q — PracticeHost beradi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================== SHARED ============================== */
const C = {
  acc: '#FF4F28', accSoft: '#FFE8E1', ok: '#1F7A4D', okSoft: '#E3F0E8', no: '#c0392b', noSoft: '#fdecec',
  ink: '#0E0E10', ink2: '#5A5A60', ink3: '#A7A6A2', card: '#F6F4EF', line: '#E4DECF', paper: '#fff',
  // MARS sahna (to'q qizg'ish)
  stage: 'radial-gradient(ellipse at 58% 24%, #7a4231 0%, #431f15 60%, #260f09 100%)',
  stageBd: '#6b3e2e', sink: '#F5E7DE', sink2: '#CBA595', stile: '#331a10', boxBd: '#E0B39D',
  ten: '#FFC23C', tenSoft: '#FFD873', one: '#5BD6F2', oneDk: '#019ACB', mars: '#E4703A',
};

const DUST = [[8, 18, 0], [22, 9, 1.1], [37, 26, .5], [52, 12, 1.7], [68, 20, .8], [81, 10, 2.1], [91, 30, 1.3], [14, 40, 1.9], [46, 44, .6], [63, 38, 1.4], [77, 46, 2.3], [30, 54, 1], [88, 52, .4], [6, 62, 1.6]];

const Stage = ({ children, style }) => (
  <div style={{ position: 'relative', overflow: 'hidden', background: C.stage, border: '1px solid ' + C.stageBd, borderRadius: 16, padding: '14px 10px', margin: '10px 0', ...style }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {DUST.map((s, i) => <span key={i} className="d08-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#f0c3ac', animationDelay: s[2] + 's' }} />)}
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
  <div className="d08-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// stolbik yordamchilari
const DC = ({ ch, c, dim }) => <div style={{ width: 44, height: 50, ...S.mono, fontSize: 32, fontWeight: 800, color: c, opacity: dim ? 0.45 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch}</div>;

const boxTone = (tone) => {
  if (tone === 'sel') return { bd: C.acc, bg: 'rgba(255,79,40,.2)', col: '#fff' };
  if (tone === 'ok') return { bd: C.ok, bg: 'rgba(31,122,77,.3)', col: '#9df0bd' };
  if (tone === 'no') return { bd: C.no, bg: 'rgba(192,57,43,.32)', col: '#ffb4a8' };
  return { bd: C.boxBd, bg: C.stile, col: C.sink };
};

const BoxCell = ({ ch, tone, onClick, disabled }) => {
  const s = boxTone(tone);
  const st = { width: 44, height: 50, borderRadius: 10, border: '2.5px solid ' + s.bd, background: s.bg, ...S.mono, fontSize: 32, fontWeight: 800, color: s.col, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: onClick && !disabled ? 'pointer' : 'default' };
  return onClick ? <button type="button" disabled={disabled} onClick={onClick} style={st}>{ch}</button> : <div style={st}>{ch}</div>;
};

const ColHeader = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '30px 44px 44px', marginBottom: 4 }}>
    <span /><div style={{ fontSize: 10, fontWeight: 800, color: C.ten, textAlign: 'center', letterSpacing: '.04em' }}>O‘N</div><div style={{ fontSize: 10, fontWeight: 800, color: C.one, textAlign: 'center', letterSpacing: '.04em' }}>BIR</div>
  </div>
);

const Colon = ({ children }) => (
  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', border: '1px solid ' + C.stageBd, borderRadius: 12, padding: '10px 16px' }}>{children}</div>
);

const Row = ({ sign, tenNode, oneNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '30px 44px 44px', alignItems: 'center' }}>
    <span style={{ ...S.mono, fontSize: 28, fontWeight: 800, color: C.sink2, textAlign: 'center' }}>{sign || ''}</span>
    {tenNode}{oneNode}
  </div>
);

const HR = () => <div style={{ height: 3, background: C.sink2, borderRadius: 2, margin: '5px 0', marginLeft: 30 }} />;

const FX_CSS = `.d08-pop { animation: d08pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d08pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d08-star { opacity: .4; animation: d08tw 3.4s ease-in-out infinite; }
        @keyframes d08tw { 0%, 100% { opacity: .2; transform: scale(1); } 50% { opacity: .95; transform: scale(1.5); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

// 5⬜ − 24 = 33 -> ⬜ = 7. Variantlar IFODA (4+3=7).
const D09_OPTS = ['4 + 3', '2 + 2', '5 + 1', '3 + 6'];
const D09_VALS = [7, 4, 6, 9];
const D09_CORRECT = 0;
const D09_T = {
  uz: {
    eyebrow: 'Yetishmagan raqam', setup: 'Stolbik: 5⬜ − 24 = 33. Birlik raqami yashiringan.',
    ask: 'Yashirin birlik raqamini toping. Variantlar — ifoda ko‘rinishida.',
    correct: "To'g'ri. Birliklar: 7 − 4 = 3, demak yashirin raqam 7. (4 + 3 = 7)",
    wrong: "Maslahat: birliklar ustuniga qarang — ⬜ − 4 = 3. Qaysi ifoda mos qiymat beradi?",
    rule: "Birliklar: 7 − 4 = 3. Ifoda 4 + 3 = 7 to‘g‘ri keladi.",
  },
  ru: {
    eyebrow: 'Недостающая цифра', setup: 'Столбик: 5⬜ − 24 = 33. Цифра единиц скрыта.',
    ask: 'Найди скрытую цифру единиц. Варианты — в виде выражений.',
    correct: 'Верно. Единицы: 7 − 4 = 3, значит скрытая цифра 7. (4 + 3 = 7)',
    wrong: 'Подсказка: смотри на столбец единиц — ⬜ − 4 = 3. Какое выражение даёт нужное значение?',
    rule: 'Единицы: 7 − 4 = 3. Выражение 4 + 3 = 7 подходит.',
  },
};
function D08_09Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked != null && D09_VALS[picked] === 7;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D09_OPTS.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, value: picked != null ? D09_VALS[picked] : null }, correctAnswer: { digit: 7, label: '4 + 3' }, correct, meta: { tag: 'exprdigit', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const boxTn = checked ? (fb?.correct ? 'ok' : 'no') : (picked != null ? 'sel' : null);
  const boxVal = picked != null ? D09_VALS[picked] : '?';
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Colon>
            <ColHeader />
            <Row sign="" tenNode={<DC ch="5" c={C.ten} />} oneNode={<BoxCell ch={boxVal} tone={boxTn} />} />
            <Row sign="−" tenNode={<DC ch="2" c={C.ten} />} oneNode={<DC ch="4" c={C.one} />} />
            <HR />
            <Row sign="" tenNode={<DC ch="3" c={C.ten} />} oneNode={<DC ch="3" c={C.one} />} />
          </Colon>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 19 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D09_OPTS.map((o, i) => {
          const on = picked === i, show = checked && on;
          let bd = C.line, bg = C.paper, col = C.ink;
          if (on && !checked) { bd = C.acc; bg = C.accSoft; }
          if (show) { const okv = i === D09_CORRECT; bd = okv ? C.ok : C.no; bg = okv ? C.okSoft : C.noSoft; col = okv ? C.ok : C.no; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ minWidth: 78, height: 56, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 22, fontWeight: 800, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', padding: '0 12px', boxShadow: (on && !checked) ? '0 0 0 4px #FFE0D6' : 'none' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D08_09(props) {
  return (<><style>{FX_CSS}</style><D08_09Impl {...props} /></>);
}
