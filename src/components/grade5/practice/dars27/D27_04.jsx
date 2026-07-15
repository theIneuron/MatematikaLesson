// Dars27 · Amaliyot 04 — 34,2 : 10 · 🟡 · tag: shift_div10_build
// Konstruktor: :10 — vergulni bitta CHAPGA qo'yish. Raqamlar 3 4 2 o'zgarmaydi, faqat vergul joyi: 34,2 → 3,42.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#6d28d9', textTransform: 'uppercase' },
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
  <div className="d27-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const D27STYLE = `
  .d27-pop { animation: d27pop .6s cubic-bezier(.34,1.4,.64,1) both; }
  @keyframes d27pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .d27-pop { animation: none !important; } }
`;

// Vergul necha raqamdan keyin turadi: 1 → 3,42 (:10 to'g'ri); 2 → 34,2 (o'zgarmagan); 3 → 342.
const D04_DIGITS = ['3', '4', '2'];
const D04_ANS_IDX = 1;
const D04_T = {
  uz: {
    eyebrow: "Bo'l", setup: "Zaynab 34,2 ni 10 ga bo'ldi. Bo'lishdan keyin vergul qayerda turadi?",
    ask: "Vergulni to'g'ri joyga qo'ying:",
    correct: "To'g'ri. :10 — vergul bitta chapga siljiydi: 34,2 → 3,42.",
    wrong: ":10 da vergul o'ngga emas, chap tomonga siljiydi. Natija 34,2 dan kichik bo'lishi kerak.",
    rule: ":10 — vergul 1 qadam chapga.",
  },
  ru: {
    eyebrow: 'Раздели', setup: 'Зайнаб разделила 34,2 на 10. Где стоит запятая после деления?',
    ask: 'Поставь запятую в нужное место:',
    correct: 'Верно. :10 — запятая сдвигается на один влево: 34,2 → 3,42.',
    wrong: 'При :10 запятая сдвигается не вправо, а влево. Результат должен быть меньше 34,2.',
    rule: ':10 — запятая на 1 шаг влево.',
  },
};

export default function D27_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [pos, setPos] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.commaIdx != null) { setPos(sa.commaIdx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pos != null && !checked); }, [pos, checked, onReady]);
  const check = useCallback(() => {
    const correct = pos === D04_ANS_IDX;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { commaIdx: pos }, correctAnswer: { commaIdx: D04_ANS_IDX }, correct, meta: { tag: 'shift_div10_build', level: '🟡' } });
  }, [pos, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const locked = isReview || checked;
  const gap = (gi) => {
    const on = pos === gi;
    let col = '#cbd5e1', pop = false;
    if (on) { col = '#6d28d9'; if (checked) { const ok = gi === D04_ANS_IDX; col = ok ? '#1a7f43' : '#c0392b'; pop = ok; } }
    return (
      <button type="button" disabled={locked} onClick={() => setPos(gi)} style={{ width: 26, height: 62, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'transparent', border: 'none', cursor: locked ? 'default' : 'pointer', padding: 0 }}>
        <span className={pop ? 'd27-pop' : ''} style={{ ...S.mono, fontSize: 40, fontWeight: 900, lineHeight: 1, paddingBottom: 8, color: col, opacity: on ? 1 : 0.45 }}>,</span>
      </button>
    );
  };
  return (
    <div style={S.wrap}>
      <style>{D27STYLE}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, margin: '8px 0 4px' }}>
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#94a3b8' }}>34,2 : 10 =</span>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#6d28d9' }}>?</span>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '6px 0' }}>
        {D04_DIGITS.map((d, i) => (
          <React.Fragment key={i}>
            <div style={{ ...S.mono, width: 46, height: 62, borderRadius: 12, background: '#f5f3ff', border: '2px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: '#1f2430' }}>{d}</div>
            {gap(i + 1)}
          </React.Fragment>
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
