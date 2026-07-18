// Dars 5 · Amaliyot 05 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const Chip = ({ children, on, tone, onClick, disabled, w = 62 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 54, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 22, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

const FX_CSS = `.d05-pop { animation: d05pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d05pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d05-star { opacity: .35; animation: d05tw 3.2s ease-in-out infinite; }
        @keyframes d05tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D05_OPTS = [40, 60, 49, 51], D05_OKL = 40, D05_OKR = 60;
const D05_T = {
  uz: {
    eyebrow: 'Qo‘shni o‘nlik', setup: 'Markazda 50. Chapda oldingi, o‘ngda keyingi o‘nlik.',
    ask: 'Variantni bosing, keyin katakni. Oldingi va keyingi o‘nlikni qo‘ying.',
    prev: 'oldingi', next: 'keyingi',
    correct: "To'g'ri. …40, 50, 60… Oldingi o'nlik 40, keyingi 60.",
    wrong: "Maslahat: o'nlab sanang. 50 dan 10 orqada — oldingi; 10 oldinda — keyingi.",
    rule: "Qo'shni o'nliklar: 50 dan oldingi 40, keyingi 60.",
  },
  ru: {
    eyebrow: 'Соседний десяток', setup: 'В центре 50. Слева предыдущий, справа следующий десяток.',
    ask: 'Нажми вариант, затем клетку. Поставь предыдущий и следующий десяток.',
    prev: 'предыдущий', next: 'следующий',
    correct: 'Верно. …40, 50, 60… Предыдущий десяток 40, следующий 60.',
    wrong: 'Подсказка: считай десятками. На 10 назад — предыдущий; на 10 вперёд — следующий.',
    rule: 'Соседние десятки: перед 50 — 40, после — 60.',
  },
};
function D05_05Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null]); // [prev, next] -> opt index
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter((x) => x != null));
  const clickSlot = (k) => { if (locked) return; if (pick != null) { setSlots((s) => { const n = s.map((v) => v === pick ? null : v); n[k] = pick; return n; }); setPick(null); } else if (slots[k] != null) { setSlots((s) => { const n = s.slice(); n[k] = null; return n; }); } };
  const check = useCallback(() => {
    const lv = slots[0] == null ? null : D05_OPTS[slots[0]];
    const rv = slots[1] == null ? null : D05_OPTS[slots[1]];
    const correct = lv === D05_OKL && rv === D05_OKR;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { prev: lv, next: rv }, correctAnswer: { prev: 40, next: 60 }, correct, meta: { tag: 'neighbor', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const slot = (k, okVal, label) => {
    const bi = slots[k]; const v = bi == null ? null : D05_OPTS[bi];
    let bd = v != null ? C.acc : C.sink2, col = C.sink;
    if (checked) { const ok = v === okVal; bd = ok ? C.ok : C.no; col = ok ? '#8ff0bd' : '#ffb4a8'; }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.sink2, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
        <div onClick={() => clickSlot(k)} style={{ width: 66, height: 62, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: C.stile, display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 26, fontWeight: 800, color: col, cursor: locked ? 'default' : 'pointer' }}>{v != null ? v : '?'}</div>
      </div>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-end' }}>
          {slot(0, D05_OKL, t.prev)}
          <div style={{ ...S.mono, fontSize: 42, fontWeight: 800, color: C.ten, paddingBottom: 12 }}>50</div>
          {slot(1, D05_OKR, t.next)}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 18 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D05_OPTS.map((n, i) => usedSet.has(i)
          ? <span key={i} style={{ minWidth: 60, height: 54, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />
          : <Chip key={i} on={pick === i} disabled={locked} onClick={() => setPick(pick === i ? null : i)} w={60}>{n}</Chip>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D05_05(props) {
  return (<><style>{FX_CSS}</style><D05_05Impl {...props} /></>);
}
