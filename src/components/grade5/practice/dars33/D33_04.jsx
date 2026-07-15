// Dars33 · Amaliyot 04 — Qaysi burchak katta · 🟡 · tag: geo_angle_compare
// A — keng ochilgan, tomonlari KALTA; B — tor ochilgan, tomonlari UZUN. Katta → A.
// Markaziy xato: uzun tomonli B ni tanlash. To'g'ri: kattalik ochilishga bog'liq.
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

// Umumiy burchak figurasi (ochiladigan nur sekin ochiladi)
function Angle({ deg, sideLen, color = CY }) {
  const W = 150, H = 132, vx = 30, vy = 112;
  const rad = deg * Math.PI / 180;
  const rx = vx + sideLen * Math.cos(rad), ry = vy - sideLen * Math.sin(rad);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <line x1={vx} y1={vy} x2={vx + sideLen} y2={vy} stroke={color} strokeWidth="4" strokeLinecap="round" />
      <g className="d33-open" style={{ '--d33-a': deg + 'deg', transformOrigin: `${vx}px ${vy}px` }}>
        <line x1={vx} y1={vy} x2={rx} y2={ry} stroke={color} strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx={vx} cy={vy} r="5.5" fill={color} />
    </svg>
  );
}

const D04_CORRECT = 0; // A — keng ochilgan
const D04_T = {
  uz: {
    eyebrow: 'Solishtiring', setup: "Bekzod ikki burchak chizdi. A burchakning tomonlari kalta, B burchakniki uzun.",
    ask: 'Qaysi burchak KATTA? Kattasini bosing:',
    correct: "To'g'ri. Burchak kattaligi ochilishga bog'liq, tomon uzunligiga emas. A kengroq ochilgan.",
    wrong: "Tomon uzunligiga qaramang — ochilishga qarang. Qaysi burchak kengroq ochilgan?",
    rule: "Burchak kattaligi = ochilish (tomon uzunligi emas).",
  },
  ru: {
    eyebrow: 'Сравните', setup: 'Бекзод начертил два угла. У угла A стороны короткие, у угла B — длинные.',
    ask: 'Какой угол БОЛЬШЕ? Нажмите на больший:',
    correct: 'Верно. Величина угла зависит от раствора, а не от длины сторон. A раскрыт шире.',
    wrong: 'Не смотри на длину сторон — смотри на раствор. Какой угол раскрыт шире?',
    rule: 'Величина угла = раствор (не длина сторон).',
  },
};

export default function D33_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'A', label: 'A' }, { id: 'B', label: 'B' }], studentAnswer: { idx: pick }, correctAnswer: { idx: D04_CORRECT }, correct, meta: { tag: 'geo_angle_compare', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cards = [{ label: 'A', deg: 118, sideLen: 46 }, { label: 'B', deg: 38, sideLen: 96 }];
  return (
    <div style={S.wrap}>
      <style>{`
        .d33-pop { animation: d33pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d33pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d33-open { animation: d33open .95s ease both; }
        @keyframes d33open { from { transform: rotate(var(--d33-a)); } to { transform: rotate(0deg); } }
        @media (prefers-reduced-motion: reduce) { .d33-pop, .d33-open { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '8px 0' }}>
        {cards.map((c, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#64748b';
          if (on) { bd = CY; bg = '#ecfeff'; col = '#0e7490'; }
          if (checked && on) { const ok = i === D04_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={c.label} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ width: 168, borderRadius: 16, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer', padding: '8px 6px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: col, fontFamily: 'inherit', alignSelf: 'flex-start', marginLeft: 8 }}>{c.label}</span>
              <Angle deg={c.deg} sideLen={c.sideLen} />
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
