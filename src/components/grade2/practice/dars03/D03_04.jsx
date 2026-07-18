// Dars 3 · Amaliyot 04 — mustaqil topshiriq fayli (grade1/grade5 uslubi).
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

const FX_CSS = `.d03-pop { animation: d03pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        .d03-star { opacity: .35; animation: d03tw 3.2s ease-in-out infinite; }
        @keyframes d03tw { 0%, 100% { opacity: .18; transform: scale(1); } 50% { opacity: .95; transform: scale(1.6); } }
        .d03-drop { animation: d03drop .3s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d03drop { 0% { opacity: 0; transform: translateY(-8px) scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`;

const D04_TARGET = 38;
const D04_T = {
  uz: {
    eyebrow: 'Yoqilg‘i shkalasi', setup: 'Vertikal shkala 0 dan 100 gacha. Surgichni suring.',
    ask: 'Yoqilg‘i darajasini 38 ga surib qo‘ying.',
    correct: "To'g'ri. 38 = 3 o'nlik va 8 birlik. 30 dan 8 ta yuqori.",
    wrong: "Maslahat: 38 — 30 va 40 orasida, 30 dan 8 ta yuqorida. Aniq 38 ga surib qo'ying.",
    rule: "38 = 30 + 8. O'nliklar 30, birliklar 8.",
  },
  ru: {
    eyebrow: 'Шкала топлива', setup: 'Вертикальная шкала 0–100. Тяни ползунок.',
    ask: 'Установи уровень топлива на 38.',
    correct: 'Верно. 38 = 3 десятка и 8 единиц. На 8 выше 30.',
    wrong: 'Подсказка: 38 — между 30 и 40, на 8 выше 30. Поставь ровно на 38.',
    rule: '38 = 30 + 8. Десятки 30, единицы 8.',
  },
};
function D03_04Impl(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState(0);
  const [touched, setTouched] = useState(false);
  const [drag, setDrag] = useState(false);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const trackRef = useRef(null);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(sa.value); setTouched(true); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(touched && !checked); }, [touched, checked, onReady]);
  const locked = isReview || checked;
  const fromClientY = (clientY) => {
    const r = trackRef.current.getBoundingClientRect();
    let frac = 1 - (clientY - r.top) / r.height;
    frac = Math.max(0, Math.min(1, frac));
    setVal(Math.round(frac * 100)); setTouched(true);
  };
  const check = useCallback(() => {
    const correct = val === D04_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: val }, correctAnswer: { value: D04_TARGET }, correct, meta: { tag: 'gauge', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const fillCol = checked ? (fb?.correct ? C.ok : C.no) : C.one;
  const nudge = (d) => { if (locked) return; setVal((v) => Math.max(0, Math.min(100, v + d))); setTouched(true); };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <Stage>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', height: 220, width: 54, touchAction: 'none' }}
            ref={trackRef}
            onPointerDown={(e) => { if (locked) return; setDrag(true); fromClientY(e.clientY); e.currentTarget.setPointerCapture?.(e.pointerId); }}
            onPointerMove={(e) => { if (drag && !locked) fromClientY(e.clientY); }}
            onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: C.stile, border: '2px solid ' + C.stageBd, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: val + '%', background: 'linear-gradient(' + fillCol + ',' + fillCol + ')', opacity: .55 }} />
            </div>
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((m) => (
              <div key={m} style={{ position: 'absolute', right: -30, bottom: 'calc(' + m + '% - 7px)', fontSize: 9, color: C.sink2, ...S.mono }}>{m === 100 || m === 0 || m === 40 || m === 30 ? m : '·'}</div>
            ))}
            <div style={{ position: 'absolute', left: -4, right: -4, bottom: 'calc(' + val + '% - 4px)', height: 8, borderRadius: 4, background: fillCol, boxShadow: '0 0 0 3px rgba(255,255,255,.15)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ ...S.mono, fontSize: 44, fontWeight: 800, color: fillCol }}>{val}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" disabled={locked} onClick={() => nudge(-1)} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: C.stageBd, color: '#fff', fontSize: 20, fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>−</button>
              <button type="button" disabled={locked} onClick={() => nudge(1)} style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: C.one, color: '#08111f', fontSize: 20, fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>+</button>
            </div>
          </div>
        </div>
      </Stage>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}

export default function D03_04(props) {
  return (<><style>{FX_CSS}</style><D03_04Impl {...props} /></>);
}
