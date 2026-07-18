// Dars 8 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const Chip = ({ children, on, tone, onClick, disabled, w = 66 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 22, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

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

const D05_CHIPS = [24, 42, 35, 94], D05_CORRECT = 0;
const D05_T = {
  uz: {
    eyebrow: 'Yashirin ayriluvchi', setup: 'Stolbik: 59 − ⬜ = 35. Ayriluvchi yashiringan.',
    ask: 'Yashirin ayriluvchini toping: 59 − ⬜ = 35.',
    correct: "To'g'ri. 59 − 24 = 35 (birlik 9 − 4 = 5, o‘nlik 5 − 2 = 3).",
    wrong: "Maslahat: kamayuvchidan ayirmani ayiring. 59 − 35 = ? Har ustunni alohida hisoblang.",
    rule: "Ayriluvchi = kamayuvchi − ayirma. 59 − 35 = 24.",
  },
  ru: {
    eyebrow: 'Скрытое вычитаемое', setup: 'Столбик: 59 − ⬜ = 35. Вычитаемое скрыто.',
    ask: 'Найди скрытое вычитаемое: 59 − ⬜ = 35.',
    correct: 'Верно. 59 − 24 = 35 (единицы 9 − 4 = 5, десятки 5 − 2 = 3).',
    wrong: 'Подсказка: из уменьшаемого вычти разность. 59 − 35 = ? Считай по столбцам.',
    rule: 'Вычитаемое = уменьшаемое − разность. 59 − 35 = 24.',
  },
};
function D08_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D05_CHIPS.map((n, i) => ({ id: String(i), label: String(n) })), studentAnswer: { idx: picked, label: String(D05_CHIPS[picked]) }, correctAnswer: { idx: 0, label: '24' }, correct, meta: { tag: 'missingsub', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bt = checked ? (fb?.correct ? 'ok' : 'no') : (picked != null ? 'sel' : null);
  const mT = picked != null ? String(D05_CHIPS[picked]).padStart(2, '0')[0] : '?';
  const mO = picked != null ? String(D05_CHIPS[picked]).padStart(2, '0')[1] : '?';
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Colon>
            <ColHeader />
            <Row sign="" tenNode={<DC ch="5" c={C.ten} />} oneNode={<DC ch="9" c={C.one} />} />
            <Row sign="−" tenNode={<BoxCell ch={mT} tone={bt} />} oneNode={<BoxCell ch={mO} tone={bt} />} />
            <HR />
            <Row sign="" tenNode={<DC ch="3" c={C.ten} />} oneNode={<DC ch="5" c={C.one} />} />
          </Colon>
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 20 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D05_CHIPS.map((n, i) => { const on = picked === i; let tone = null; if (checked && on) tone = i === D05_CORRECT ? 'ok' : 'no'; return <Chip key={i} on={on && !checked} tone={tone} disabled={isReview || checked} onClick={() => setPicked(i)} w={64}>{n}</Chip>; })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D08_05(props) {
  return (<><style>{FX_CSS}</style><D08_05Impl {...props} /></>);
}
