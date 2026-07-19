// Dars 18 · Amaliyot 04 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const D04_ROWS = [{ expr: '3 × 8', twin: '8 × 3' }, { expr: '2 × 9', twin: '9 × 2' }, { expr: '4 × 5', twin: '5 × 4' }, { expr: '6 × 3', twin: '3 × 6' }];
const D04_CARDS = ['8 × 3', '5 × 4', '9 × 2', '3 × 6', '8 × 4', '5 × 3'];
const D04_T = {
  uz: {
    eyebrow: 'Teng juftlar', setup: "Har ko'paytmaning o'rin almashgan juftini toping.",
    ask: 'Kartani bosing, keyin mos ifodaning bo‘sh joyini bosing:',
    correct: "To'g'ri. 3×8=8×3, 2×9=9×2, 4×5=5×4, 6×3=3×6.",
    wrong: "Maslahat: o'sha ikki sonni o'rin almashtiring. 3×8 ning juftimi — 8×3.",
    rule: "Har ko'paytmaning teng juftida sonlar o'rin almashgan.",
  },
  ru: {
    eyebrow: 'Равные пары', setup: 'Найди для каждого произведения его переставленную пару.',
    ask: 'Нажми карточку, затем пустое место нужного выражения:',
    correct: 'Верно. 3×8=8×3, 2×9=9×2, 4×5=5×4, 6×3=3×6.',
    wrong: 'Подсказка: поменяй те же два числа местами. Пара к 3×8 — это 8×3.',
    rule: 'В равной паре у произведения числа поменяны местами.',
  },
};
function D18_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [slots, setSlots] = useState([null, null, null, null]);
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.slots) { setSlots(sa.slots); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = slots.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const usedSet = new Set(slots.filter(Boolean).map((x) => x.ci));
  const clickSlot = (i) => () => {
    if (locked) return;
    if (pick != null) { setSlots((s) => { const n = s.slice(); n[i] = { v: D04_CARDS[pick], ci: pick }; return n; }); setPick(null); }
    else if (slots[i] != null) { setSlots((s) => { const n = s.slice(); n[i] = null; return n; }); }
  };
  const check = useCallback(() => {
    const correct = slots.every((x, i) => x && x.v === D04_ROWS[i].twin);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { slots }, correctAnswer: { twins: D04_ROWS.map((r) => r.twin) }, correct, meta: { tag: 'commute_match', level: '🟡' } });
  }, [slots, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cols = ['#c2410c', '#017CA3', '#1F7A4D', '#B45309'];
  const bgs = [C.accSoft, '#E6F4FA', '#EAF7EF', '#FFF6E9'];
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 8px', margin: '8px 0 14px', justifyItems: 'center' }}>
        {D04_ROWS.map((r, i) => {
          const v = slots[i] ? slots[i].v : null;
          let bd = cols[i], bg = bgs[i], col = cols[i];
          if (checked && v != null) { const ok = v === r.twin; bd = ok ? C.ok : C.no; bg = ok ? C.okSoft : C.noSoft; col = ok ? C.ok : C.no; }
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center' }}>
              <div style={{ width: 56, textAlign: 'right', ...S.mono, fontSize: 18, fontWeight: 800, color: cols[i] }}>{r.expr}</div>
              <span style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: C.ink3 }}>=</span>
              <div onClick={clickSlot(i)} style={{ width: 66, height: 52, borderRadius: 12, border: '2px ' + (v != null ? 'solid' : 'dashed') + ' ' + bd, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer', ...S.mono, fontSize: 18, fontWeight: 800, color: col }}>{v != null ? v : ''}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D04_CARDS.map((n, idx) => {
          if (usedSet.has(idx)) return <span key={idx} style={{ width: 72, height: 50, borderRadius: 12, border: '2px dashed ' + C.line, background: '#fafafa' }} />;
          const on = pick === idx;
          return <button key={idx} type="button" disabled={locked} onClick={() => setPick(on ? null : idx)} style={{ width: 72, height: 50, borderRadius: 12, border: '2px solid ' + (on ? C.acc : C.line), background: on ? C.accSoft : C.paper, ...S.mono, fontSize: 18, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D18_04(props) {
  return (<><style>{FX_CSS}</style><D18_04Impl {...props} /></>);
}

/* v-audio (auto) — TTS-toza narratsiya (ovoz). UZ = draft, uz-metodist validatsiyasi kerak. */
D18_04.audio = {
  uz: { intro: "Har ko'paytmaning o'rin almashgan juftini toping. Kartani bosing, keyin mos ifodaning bo'sh joyini bosing.", on_correct: "To'g'ri. 3 ko'paytirish 8 teng 8 ko'paytirish 3, 2 ko'paytirish 9 teng 9 ko'paytirish 2, 4 ko'paytirish 5 teng 5 ko'paytirish 4, 6 ko'paytirish 3 teng 3 ko'paytirish 6.", on_wrong: "Maslahat. O'sha ikki sonni o'rin almashtiring. 3 ko'paytirish 8 ning juftimi, 8 ko'paytirish 3." },
  ru: { intro: "Найди для каждого произведения его переставленную пару. Нажми карточку, затем пустое место нужного выражения.", on_correct: "Верно. 3 умножить на 8 равно 8 умножить на 3, 2 умножить на 9 равно 9 умножить на 2, 4 умножить на 5 равно 5 умножить на 4, 6 умножить на 3 равно 3 умножить на 6.", on_wrong: "Подсказка. Поменяй те же два числа местами. Пара к 3 умножить на 8, это 8 умножить на 3." },
};
