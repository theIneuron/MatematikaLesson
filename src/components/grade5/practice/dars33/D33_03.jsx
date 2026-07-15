// Dars33 · Amaliyot 03 — To'g'ri burchakmi · 🟢 · tag: geo_right_angle
// To'g'ri burchak (90°) kvadrat belgisi bilan. "90 gradusmi?" → Ha.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const CY = '#0891b2';
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: CY, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 16, fontWeight: 700, margin: '14px 0 12px' },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d33-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

// To'g'ri burchak: uch bo'lakli SVG, ochiladigan nur sekin ochiladi, kvadrat belgi bilan.
function RightAngle() {
  // vertex (28, 122), gorizontal nur o'ngga, tik nur yuqoriga (90°)
  const vx = 28, vy = 122;
  return (
    <svg width="176" height="150" viewBox="0 0 176 150" style={{ display: 'block' }}>
      <line x1={vx} y1={vy} x2={vx + 130} y2={vy} stroke={CY} strokeWidth="4" strokeLinecap="round" />
      <g className="d33-open" style={{ '--d33-a': '90deg', transformOrigin: `${vx}px ${vy}px` }}>
        <line x1={vx} y1={vy} x2={vx} y2={vy - 110} stroke={CY} strokeWidth="4" strokeLinecap="round" />
      </g>
      <path d={`M ${vx + 22} ${vy} L ${vx + 22} ${vy - 22} L ${vx} ${vy - 22}`} fill="none" stroke="#0e7490" strokeWidth="2.5" />
      <circle cx={vx} cy={vy} r="5.5" fill={CY} />
    </svg>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: "Ha yoki yo'q", setup: "Zaynab bir burchak chizdi va uning ichiga kichik kvadrat belgi qo'ydi.",
    ask: "Bu to'g'ri burchak — 90 gradusmi?", yes: 'Ha, 90°', no: "Yo'q",
    correct: "To'g'ri. To'g'ri burchak — 90 gradus, u burchakdagi kvadrat belgi bilan ko'rsatiladi.",
    wrong: "Burchak ichidagi kichik kvadrat belgiga qarang — u qanday burchakni bildirishini eslang.",
    rule: "To'g'ri burchak = 90°.",
  },
  ru: {
    eyebrow: 'Да или нет', setup: 'Зайнаб начертила угол и поставила внутри маленький квадратик.',
    ask: 'Это прямой угол — 90 градусов?', yes: 'Да, 90°', no: 'Нет',
    correct: 'Верно. Прямой угол — 90 градусов, он обозначается квадратиком в вершине.',
    wrong: 'Посмотри на маленький квадратик в вершине — вспомни, какой угол он обозначает.',
    rule: 'Прямой угол = 90°.',
  },
};

export default function D33_03(props) {
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
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'geo_right_angle', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = CY; bg = '#ecfeff'; col = '#0e7490'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d33-pop { animation: d33pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d33pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d33-open { animation: d33open .9s ease both; }
        @keyframes d33open { from { transform: rotate(var(--d33-a)); } to { transform: rotate(0deg); } }
        @media (prefers-reduced-motion: reduce) { .d33-pop, .d33-open { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 10px' }}><RightAngle /></div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
