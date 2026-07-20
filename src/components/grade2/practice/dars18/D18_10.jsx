// Dars 18 · Amaliyot 10 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const D10_ITEMS = [{ e: '2 × 6', bin: 1 }, { e: '6 × 2', bin: 1 }, { e: '3 × 5', bin: 2 }, { e: '5 × 3', bin: 2 }, { e: '4 × 2', bin: 0 }, { e: '2 × 4', bin: 0 }];
const D10_BINS = ['8', '12', '15'];
const D10_T = {
  uz: {
    eyebrow: 'Guruhla', setup: "6 ta ifodani teng natijali savatga joylang.",
    ask: 'Ifodani bosing, keyin natijasi bilan savatni bosing:',
    correct: "To'g'ri. 4×2=2×4=8 · 2×6=6×2=12 · 3×5=5×3=15. Har juft teng!",
    wrong: "Maslahat: har ifodani hisoblang. 2×6 va 6×2 — ikkalasi 12.",
    rule: "O'rin almashgan juftlar bir savatda: natija bir xil.",
  },
  ru: {
    eyebrow: 'Сгруппируй', setup: 'Помести 6 выражений в корзину с равным результатом.',
    ask: 'Нажми выражение, затем корзину с его результатом:',
    correct: 'Верно. 4×2=2×4=8 · 2×6=6×2=12 · 3×5=5×3=15. Каждая пара равна!',
    wrong: 'Подсказка: посчитай каждое. 2×6 и 6×2 — оба 12.',
    rule: 'Переставленные пары в одной корзине: результат одинаков.',
  },
};
function D18_10Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [place, setPlace] = useState([null, null, null, null, null, null]);
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.place) { setPlace(sa.place); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = place.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const drop = (bin) => { if (locked || pick == null) return; setPlace((p) => { const n = p.slice(); n[pick] = bin; return n; }); setPick(null); };
  const check = useCallback(() => {
    const correct = place.every((v, i) => v === D10_ITEMS[i].bin);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { place }, correctAnswer: { bins: D10_ITEMS.map((x) => x.bin) }, correct, meta: { tag: 'group_equal', level: '🔴' } });
  }, [place, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const tints = [C.acc, '#B45309', C.ok];
  const softs = [C.accSoft, '#FFF6E9', C.okSoft];
  const bin = (b) => {
    const items = D10_ITEMS.map((it, i) => ({ it, i })).filter((x) => place[x.i] === b);
    return (
      <div onClick={() => drop(b)} style={{ flex: 1, minHeight: 92, borderRadius: 12, border: '2px dashed ' + tints[b], background: softs[b], padding: 8, cursor: locked ? 'default' : 'pointer' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: tints[b], marginBottom: 6, textAlign: 'center', ...S.mono }}>= {D10_BINS[b]}</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {items.map(({ it, i }) => {
            const ok = it.bin === b;
            const bd = checked ? (ok ? C.ok : C.no) : '#cbd5e1';
            const cl = checked ? (ok ? C.ok : C.no) : C.ink;
            return <span key={i} style={{ padding: '6px 8px', borderRadius: 8, border: '2px solid ' + bd, background: C.paper, ...S.mono, fontSize: 15, fontWeight: 800, color: cl }}>{it.e}</span>;
          })}
        </div>
      </div>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', minHeight: 48, margin: '4px 0 12px' }}>
        {D10_ITEMS.map((it, i) => {
          if (place[i] != null) return null;
          const on = pick === i;
          return <button key={i} type="button" disabled={locked} onClick={() => setPick(on ? null : i)} style={{ padding: '10px 12px', borderRadius: 10, border: '2px solid ' + (on ? C.acc : C.line), background: on ? C.accSoft : C.paper, ...S.mono, fontSize: 17, fontWeight: 800, color: C.ink, cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none', minHeight: 46 }}>{it.e}</button>;
        })}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>{bin(0)}{bin(1)}{bin(2)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D18_10(props) {
  return (<><style>{FX_CSS}</style><D18_10Impl {...props} /></>);
}
