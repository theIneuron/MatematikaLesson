// Dars 2 · Amaliyot 09 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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
      {STARS.map((s, i) => <span key={i} className="d02-star" style={{ position: 'absolute', left: s[0] + '%', top: s[1] + '%', width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: '50%', background: '#dbe7ff', animationDelay: s[2] + 's' }} />)}
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
  ask: { fontSize: 21.5, fontWeight: 700, margin: '14px 0 12px', color: C.ink },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};

const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 18, lineHeight: 1.45, fontWeight: 600, background: ok ? C.okSoft : C.noSoft, color: ok ? C.ok : C.no }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);

const RuleChip = ({ text }) => (
  <div className="d02-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 15, fontWeight: 700, background: '#FFF6E9', border: '1.5px solid #FFDFA6', color: '#B45309' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);

function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const FX_CSS = `.d02-pop { animation: d02pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-star { opacity: .35; animation: d02tw 3.2s ease-in-out infinite; }
        @keyframes d02tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d02-drop { animation: d02drop .45s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d02drop { 0% { opacity: 0; transform: translateY(-8px) scale(.5); } 100% { opacity: 1; transform: none; } }
        .d02-float { animation: d02float 3s ease-in-out infinite; }
        @keyframes d02float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .d02-pulse { animation: d02pulse 1.5s ease-in-out infinite; }
        @keyframes d02pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D09_ITEMS = [{ v: 42, bin: 0 }, { v: 47, bin: 0 }, { v: 51, bin: 1 }, { v: 58, bin: 1 }];
const D09_T = {
  uz: {
    eyebrow: 'Tryumlar', setup: 'Kodlar aralashib ketdi. Ikki tryum: «40-lar» va «50-lar».',
    ask: 'Har kodni o‘nligiga qarab to‘g‘ri tryumga joylang.',
    bin0: '40-lar', bin1: '50-lar',
    correct: "To'g'ri. 42, 47 — o'nligi 4 (40-lar). 51, 58 — o'nligi 5 (50-lar).",
    wrong: "Maslahat: o'nlik — birinchi raqam. 42 da o'nlik 4, 51 da o'nlik 5.",
    rule: "Kodning o'nligi — birinchi raqam. 42 → 40-lar, 51 → 50-lar.",
  },
  ru: {
    eyebrow: 'Отсеки', setup: 'Коды перемешались. Два отсека: «40-е» и «50-е».',
    ask: 'Помести каждый код по десятку в нужный отсек.',
    bin0: '40-е', bin1: '50-е',
    correct: 'Верно. 42, 47 — десяток 4 (40-е). 51, 58 — десяток 5 (50-е).',
    wrong: 'Подсказка: десяток — первая цифра. В 42 десяток 4, в 51 десяток 5.',
    rule: 'Десяток кода — первая цифра. 42 → 40-е, 51 → 50-е.',
  },
};
function D02_09Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [place, setPlace] = useState(D09_ITEMS.map(() => null));
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.place) { setPlace(sa.place); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = place.every((v) => v != null);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const drop = (bin) => { if (locked || pick == null) return; setPlace((p) => { const n = p.slice(); n[pick] = bin; return n; }); setPick(null); };
  const check = useCallback(() => {
    const correct = place.every((v, i) => v === D09_ITEMS[i].bin);
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { place }, correctAnswer: { bins: D09_ITEMS.map((x) => x.bin) }, correct, meta: { tag: 'sort_decade', level: '🔴' } });
  }, [place, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const chip = (v, key, extra) => (
    <span key={key} style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.ink, background: C.paper, border: '2px solid ' + C.line, borderRadius: 12, padding: '8px 14px', ...extra }}>{v}</span>
  );
  const bin = (b) => {
    const items = D09_ITEMS.map((it, i) => ({ it, i })).filter((x) => place[x.i] === b);
    const tint = b === 0 ? C.ten : C.one;
    return (
      <div onClick={() => drop(b)} style={{ flex: 1, minHeight: 96, borderRadius: 14, border: '2px dashed ' + tint, background: C.stile, padding: 10, cursor: locked ? 'default' : 'pointer' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: tint, marginBottom: 8, textAlign: 'center' }}>{b === 0 ? t.bin0 : t.bin1}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {items.map(({ it, i }) => {
            const good = it.bin === b;
            return chip(it.v, i, { boxShadow: checked ? ('0 0 0 2px ' + (good ? C.ok : C.no)) : 'none' });
          })}
        </div>
      </div>
    );
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <Stage style={{ margin: '8px 0' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', minHeight: 44, alignItems: 'center' }}>
          {D09_ITEMS.map((it, i) => {
            if (place[i] != null) return null;
            const on = pick === i;
            return <button key={i} type="button" disabled={locked} onClick={() => setPick(on ? null : i)} style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: C.ink, background: on ? C.accSoft : C.paper, border: '2px solid ' + (on ? C.acc : C.line), borderRadius: 12, padding: '8px 14px', cursor: locked ? 'default' : 'pointer', boxShadow: on ? '0 0 0 4px #FFE0D6' : 'none' }}>{it.v}</button>;
          })}
        </div>
      </Stage>
      <div style={{ display: 'flex', gap: 10 }}>{bin(0)}{bin(1)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D02_09(props) {
  return (<><style>{FX_CSS}</style><D02_09Impl {...props} /></>);
}
