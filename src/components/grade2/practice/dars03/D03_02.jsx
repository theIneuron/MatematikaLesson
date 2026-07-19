// Dars 3 · Amaliyot 02 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d03-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  <div className="d03-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// razryad chip (kod/plitka)
const Chip = ({ children, on, tone, onClick, disabled, w = 62 }) => {
  let bd = C.line, bg = C.paper, col = C.ink;
  if (on) { bd = C.acc; bg = C.accSoft; }
  if (tone === 'ok') { bd = C.ok; bg = C.okSoft; col = C.ok; }
  if (tone === 'no') { bd = C.no; bg = C.noSoft; col = C.no; }
  return <button type="button" disabled={disabled} onClick={onClick} style={{ minWidth: w, height: 52, borderRadius: 12, border: '2px solid ' + bd, background: bg, ...S.mono, fontSize: 21, fontWeight: 800, color: col, cursor: disabled ? 'default' : 'pointer', padding: '0 12px', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{children}</button>;
};

const FX_CSS = `.d03-pop { animation: d03pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d03-star { opacity: .35; animation: d03tw 3.2s ease-in-out infinite; }
        @keyframes d03tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d03-drop { animation: d03drop .3s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03drop { 0% { opacity: 0; transform: translateY(-8px) scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D02_BANK = [70, 2, 27, 7, 20];
const D02_T = {
  uz: {
    eyebrow: 'Ikki katak', setup: 'Kodni razryad qo‘shiluvchilariga yoyamiz.',
    ask: '72 = ⬜ + ⬜. Ikki katakni plitkalardan to‘ldiring.',
    correct: "To'g'ri. 72 = 70 + 2. 70 — o'nliklar, 2 — birliklar.",
    wrong: "Maslahat: 72 ning o'nligi 70, birligi 2. 70 + 2 = 72.",
    rule: "Razryad yoyish: 72 = 70 + 2 (o'nliklar + birliklar).",
  },
  ru: {
    eyebrow: 'Две клетки', setup: 'Раскладываем код на разрядные слагаемые.',
    ask: '72 = ⬜ + ⬜. Заполни клетки плитками.',
    correct: 'Верно. 72 = 70 + 2. 70 — десятки, 2 — единицы.',
    wrong: 'Подсказка: десятки 72 — это 70, единицы — 2. 70 + 2 = 72.',
    rule: 'Разложение: 72 = 70 + 2 (десятки + единицы).',
  },
};
function D03_02Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null]);
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter((x) => x != null).map((x) => x.bi));
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D02_BANK[pick], bi: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const vals = slots.map((x) => x && x.v).sort((a, b) => a - b);
    const correct = vals[0] === 2 && vals[1] === 70;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { vals: [70, 2] }, correct, meta: { tag: 'twoblank', level: '🟢' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const slot = (i) => {
    const v = slots[i] ? slots[i].v : null;
    let bd = v != null ? C.acc : C.sink2, bg = C.stile, col = C.sink;
    if (checked) { const ok = fb?.correct; bd = ok ? C.ok : C.no; col = ok ? '#8ff0bd' : '#ffb4a8'; }
    return <span onClick={clickSlot(i)} style={{ minWidth: 66, height: 60, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 28, fontWeight: 800, color: col, cursor: locked ? 'default' : 'pointer', padding: '0 8px' }}>{v != null ? v : '⬜'}</span>;
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, ...S.mono, fontSize: 30, fontWeight: 800, color: C.sink, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 44, color: C.ten }}>72</span><span style={{ color: C.sink2 }}>=</span>
          {slot(0)}<span style={{ color: C.sink2 }}>+</span>{slot(1)}
        </div>
      </Stage>
      <p style={{ ...S.ask, fontSize: 21 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D02_BANK.map((n, i) => usedSet.has(i)
          ? <span key={i} style={{ minWidth: 62, height: 52, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />
          : <Chip key={i} on={pick === i} disabled={locked} onClick={() => setPick(pick === i ? null : i)}>{n}</Chip>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_02(props) {
  return (<><style>{FX_CSS}</style><D03_02Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D03_02.audio = {
  uz: { intro: "Kodni razryad qo'shiluvchilariga yoyamiz. 72 teng qancha qo'shish qancha. Ikki katakni plitkalardan to'ldiring.", on_correct: "To'g'ri. 72 teng 70 qo'shish 2. 70, o'nliklar, 2, birliklar.", on_wrong: "Maslahat. 72 ning o'nligi 70, birligi 2. 70 qo'shish 2 teng 72." },
  ru: { intro: "Раскладываем код на разрядные слагаемые. 72 равно сколько плюс сколько. Заполни клетки плитками.", on_correct: "Верно. 72 равно 70 плюс 2. 70, десятки, 2, единицы.", on_wrong: "Подсказка. Десятки 72, это 70, единицы, 2. 70 плюс 2 равно 72." },
};
