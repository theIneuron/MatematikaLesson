// Dars36 · Amaliyot 03 — Yarmimi? · 🟢 · tag: tri_half
// To'rtburchak diagonal bilan ikkiga bo'linadi. Uchburchak — to'rtburchakning yarmi (Ha). Bo'yalgan bo'linish reveal.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: purple
const HUE = { d: '#7c3aed', l: '#faf5ff', m: '#e9d5ff', deep: '#6b21a8', fill: '#a855f7' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: HUE.d, background: HUE.l, border: '1px solid ' + HUE.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 16, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d36-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Javobdan OLDIN: to'rtburchak + diagonal (bo'yalmagan — javobni oshkor qilmaydi).
function RectPlain({ base = 6, height = 4 }) {
  const scale = Math.min(190 / base, 118 / height);
  const w = base * scale, h = height * scale;
  const pad = 22, x0 = pad, y0 = pad, W = w + pad * 2, H = h + pad * 2;
  const A = [x0, y0 + h], C = [x0 + w, y0];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={x0} y={y0} width={w} height={h} rx="3" fill="#f6f4fb" stroke="#c4b5fd" strokeWidth="1.6" />
      <line x1={A[0]} y1={A[1]} x2={C[0]} y2={C[1]} stroke={HUE.deep} strokeWidth="2.5" />
    </svg>
  );
}
// Javobdan KEYIN: ikkita teng uchburchakka bo'linadi (reveal).
function RectSplit({ base = 6, height = 4 }) {
  const scale = Math.min(190 / base, 118 / height);
  const w = base * scale, h = height * scale;
  const pad = 22, x0 = pad, y0 = pad, W = w + pad * 2, H = h + pad * 2;
  const A = [x0, y0 + h], B = [x0 + w, y0 + h], C = [x0 + w, y0], D = [x0, y0];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', maxWidth: '100%' }}>
      <polygon points={`${A[0]},${A[1]} ${D[0]},${D[1]} ${C[0]},${C[1]}`} fill="#e5e7eb" fillOpacity="0.7" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon className="d36-tri" points={`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`} fill={HUE.fill} fillOpacity="0.55" stroke={HUE.d} strokeWidth="2" strokeLinejoin="round" />
      <line className="d36-diag" x1={A[0]} y1={A[1]} x2={C[0]} y2={C[1]} stroke={HUE.deep} strokeWidth="2.5" />
    </svg>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: 'Yarmimi?', setup: "Nodira to'rtburchakni diagonal bo'yicha kesdi va bitta uchburchakni oldi.",
    ask: "Uchburchak — to'rtburchakning yarmimi?", yes: 'Ha', no: "Yo'q",
    correct: "To'g'ri. Diagonal to'rtburchakni ikkita teng uchburchakka bo'ladi.",
    wrong: "Diagonalga qarang: u to'rtburchakni nechta teng bo'lakka ajratadi? Bir uchburchak — shulardan biri.",
    rule: "Uchburchak = to'rtburchakning yarmi.",
  },
  ru: {
    eyebrow: 'Половина?', setup: 'Нодира разрезала прямоугольник по диагонали и взяла один треугольник.',
    ask: 'Треугольник — это половина прямоугольника?', yes: 'Да', no: 'Нет',
    correct: 'Верно. Диагональ делит прямоугольник на два равных треугольника.',
    wrong: 'Посмотри на диагональ: на сколько равных частей она делит прямоугольник? Один треугольник — одна из них.',
    rule: 'Треугольник = половина прямоугольника.',
  },
};

export default function D36_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.pick != null) { setPick(initialAnswer.studentAnswer.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'tri_half', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = HUE.d; bg = HUE.l; col = '#1f2430'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d36-diag { stroke-dasharray: 320; stroke-dashoffset: 320; animation: d36draw .8s ease .1s forwards; }
        @keyframes d36draw { to { stroke-dashoffset: 0; } }
        .d36-tri { opacity: 0; animation: d36fill .8s ease .5s forwards; }
        @keyframes d36fill { to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .d36-pop,.d36-diag,.d36-tri { animation: none !important; } .d36-diag { stroke-dashoffset: 0; } .d36-tri { opacity: 1; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}>
        {revealed ? <RectSplit /> : <RectPlain />}
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
