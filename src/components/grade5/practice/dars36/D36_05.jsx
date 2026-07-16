// Dars36 · Amaliyot 05 — Balandlik qaysi? · 🟡 · tag: tri_height_pick
// Uchburchakda balandlikni (asosga perpendikulyar) tanlash. Markaziy xato: qiya yon tomonni tanlash.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: blue
const HUE = { d: '#e24e12', l: '#fff4ee', m: '#ffd6bd', deep: '#b83d0e', fill: '#fb7233' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: HUE.d, background: HUE.l, border: '1px solid ' + HUE.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
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

const D05_CORRECT = 'h';
const D05_T = {
  uz: {
    eyebrow: 'Balandlik qaysi?', setup: "Uchburchakda uchta chiziq bor: bittasi asosga to'g'ri burchak ostida tushgan, ikkitasi — qiya yon tomonlar.",
    ask: 'Qaysi chiziq — balandlik? Bosing:',
    correct: "To'g'ri. Balandlik — asosga to'g'ri burchak (90°) ostida tushgan perpendikulyar chiziq.",
    wrong: "Balandlik asos bilan qanday burchak hosil qiladi — to'g'ri burchakmi yoki qiya? Har bir chiziqni asosga nisbatan tekshiring.",
    rule: "Balandlik asosga perpendikulyar (90°).",
  },
  ru: {
    eyebrow: 'Где высота?', setup: 'В треугольнике три линии: одна опущена к основанию под прямым углом, две — наклонные боковые стороны.',
    ask: 'Какая линия — высота? Нажми:',
    correct: 'Верно. Высота — перпендикуляр, опущенный к основанию под прямым углом (90°).',
    wrong: 'Какой угол высота образует с основанием — прямой или наклонный? Проверь каждую линию относительно основания.',
    rule: 'Высота перпендикулярна основанию (90°).',
  },
};

// geometriya
const T = [130, 34], P = [46, 156], Q = [214, 156], F = [130, 156];
const SEG = [
  { id: 'l', x1: P[0], y1: P[1], x2: T[0], y2: T[1] },
  { id: 'h', x1: F[0], y1: F[1], x2: T[0], y2: T[1] },
  { id: 'r', x1: Q[0], y1: Q[1], x2: T[0], y2: T[1] },
];

export default function D36_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.id != null) { setPick(initialAnswer.studentAnswer.id); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D05_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: SEG.map((s) => ({ id: s.id, label: s.id })), studentAnswer: { id: pick }, correctAnswer: { id: D05_CORRECT }, correct, meta: { tag: 'tri_height_pick', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const segColor = (id) => {
    if (checked) { if (id === pick) return fb?.correct ? '#1a7f43' : '#c0392b'; return '#cbd5e1'; }
    if (id === pick) return HUE.d;
    return '#94a3b8';
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d36-hit { cursor: pointer; }
        @media (prefers-reduced-motion: reduce) { .d36-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px', padding: '10px', borderRadius: 14, background: HUE.l, border: '1.5px solid ' + HUE.m }}>
        <svg width="260" height="196" viewBox="0 0 260 196" style={{ maxWidth: '100%' }}>
          <polygon points={`${P[0]},${P[1]} ${Q[0]},${Q[1]} ${T[0]},${T[1]}`} fill="#fff" stroke={HUE.m} strokeWidth="1.5" />
          <line x1={P[0]} y1={P[1]} x2={Q[0]} y2={Q[1]} stroke="#1f2430" strokeWidth="3" />
          <path d={`M ${F[0] - 12} ${F[1]} L ${F[0] - 12} ${F[1] - 12} L ${F[0]} ${F[1] - 12}`} fill="none" stroke="#1f2430" strokeWidth="1.5" />
          {SEG.map((s) => (
            <g key={s.id} className="d36-hit" onClick={() => !(isReview || checked) && setPick(s.id)}>
              <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="transparent" strokeWidth="22" strokeLinecap="round" />
              <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={segColor(s.id)} strokeWidth={s.id === pick ? 5 : 3} strokeLinecap="round" />
            </g>
          ))}
          <text x={F[0]} y={F[1] + 22} textAnchor="middle" fontSize="13" fontWeight="800" fill="#374151" style={{ fontFamily: 'JetBrains Mono, monospace' }}>asos</text>
        </svg>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
