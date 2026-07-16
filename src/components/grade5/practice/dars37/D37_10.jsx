// Dars37 · Amaliyot 10 — Qaysi birlik · 🔴 · tag: vol_unit_pick
// Hajm — uch o'lchamli, sm³ da o'lchanadi (yuza sm², uzunlik sm, litr — suyuqlik).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#a21caf', background: '#fdf4ff', border: '1px solid #f5d0fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d37-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Kichik quti piktogrammasi (fuchsia) — "qutining hajmi", birlik tanlashga turtki bermaydi
function BoxIcon() {
  const u = 46, dp = 0.46, x = 8, y = 8 + u + u * dp, dx = u * dp, dy = -u * dp;
  const bl = [x, y], br = [x + u, y], tr = [x + u, y - u], tl = [x, y - u];
  const trb = [x + u + dx, y - u + dy], tlb = [x + dx, y - u + dy], brb = [x + u + dx, y + dy];
  const P = (a) => a.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
  const LN = '#a21caf';
  return (
    <svg width={x + u + dx + 8} height={y + 8} viewBox={`0 0 ${x + u + dx + 8} ${y + 8}`} style={{ display: 'block' }}>
      <polygon points={P([tl, tlb, trb, tr])} fill="#fae8ff" stroke={LN} strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={P([br, brb, trb, tr])} fill="#f5d0fe" stroke={LN} strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points={P([bl, br, tr, tl])} fill="#f0abfc" stroke={LN} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

const D10_OPTS = ['sm²', 'sm', 'sm³', 'm²'];
const D10_CORRECT = 2; // sm³
const D10_T = {
  uz: {
    eyebrow: 'Qaysi birlik', setup: "Temur qutining HAJMini yozmoqchi. Qaysi birlik hajmga to'g'ri keladi?",
    ask: "Qutining hajmi qaysi birlikda o'lchanadi?",
    correct: "To'g'ri. Hajm — uch o'lchamli, shuning uchun sm³ da o'lchanadi.",
    wrong: "Hajm nechta o'lchamli? O'lchamlar soni birlik darajasini beradi. Qaysi birlik uch o'lchamga to'g'ri keladi?",
    rule: "Hajm birligi — sm³ (yoki m³).",
  },
  ru: {
    eyebrow: 'Какая единица', setup: 'Темур хочет записать ОБЪЁМ коробки. Какая единица подходит для объёма?',
    ask: 'В какой единице измеряется объём коробки?',
    correct: 'Верно. Объём — трёхмерный, поэтому измеряется в см³.',
    wrong: 'Сколько измерений у объёма? Число измерений задаёт степень единицы. Какая единица соответствует трём измерениям?',
    rule: 'Единица объёма — см³ (или м³).',
  },
};

export default function D37_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((o, i) => ({ id: String(i), label: o })), studentAnswer: { idx: pick, label: D10_OPTS[pick] }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'vol_unit_pick', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d37-pop { animation: d37pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d37pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d37-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 2px' }}>
        <BoxIcon />
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '8px 0' }}>
        {D10_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 24, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
