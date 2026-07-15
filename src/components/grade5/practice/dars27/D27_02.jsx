// Dars27 · Amaliyot 02 — 4,7 × 100 · 🟢 · tag: shift_x100
// ×100 — vergul 2 qadam o'ngga, yetmagan joyga nol: 4,7 → 47 → 470.
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
  .d27-comma { animation: d27hop .95s ease both; }
  @keyframes d27hop { from { left: var(--from); } to { left: var(--to); } }
  .d27-zero { animation: d27zero .95s ease both; }
  @keyframes d27zero { 0%,60% { opacity: 0; } 100% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .d27-pop,.d27-comma,.d27-zero { animation: none !important; } }
`;
function CommaHop({ digitsAll, startPos, endPos, newIdx = [], reveal, cellW = 38 }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end', height: 50, ...S.mono }}>
      {digitsAll.map((d, i) => {
        const isNew = newIdx.includes(i);
        const hidden = isNew && !reveal;
        return <span key={i} className={reveal && isNew ? 'd27-zero' : ''} style={{ width: cellW, textAlign: 'center', fontSize: 34, fontWeight: 800, color: isNew ? '#6d28d9' : '#1f2430', opacity: hidden ? 0 : 1, lineHeight: 1.2 }}>{d}</span>;
      })}
      <span className={reveal ? 'd27-comma' : ''} style={{ position: 'absolute', bottom: 0, left: (reveal ? endPos : startPos) * cellW - 4, fontSize: 34, fontWeight: 800, color: '#1f2430', lineHeight: 1.2, '--from': (startPos * cellW - 4) + 'px', '--to': (endPos * cellW - 4) + 'px' }}>,</span>
    </div>
  );
}

const D02_ANS = 470;
const D02_T = {
  uz: {
    eyebrow: "Ko'paytir", setup: "Madina 4,7 ni 100 ga ko'paytirmoqchi.",
    ask: "4,7 × 100 = ?  Katakni to'ldiring:",
    correct: "To'g'ri. ×100 — vergul 2 o'ngga: 4,7 → 47 → 470 (yetmagan joyga nol).",
    wrong: "×100 da vergul qaysi tomonga va necha xona siljiydi? Raqam yetmasa, bo'sh joyni nima to'ldiradi?",
    rule: "×100 — vergul 2 qadam o'ngga.",
  },
  ru: {
    eyebrow: 'Умножь', setup: 'Мадина хочет умножить 4,7 на 100.',
    ask: '4,7 × 100 = ?  Заполни клетку:',
    correct: 'Верно. ×100 — запятая на 2 вправо: 4,7 → 47 → 470 (недостающее место — ноль).',
    wrong: 'При ×100 в какую сторону и на сколько разрядов сдвигается запятая? Чем заполнить пустое место, если цифр не хватает?',
    rule: '×100 — запятая на 2 шага вправо.',
  },
};

export default function D27_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D02_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'shift_x100', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealHop = checked && fb?.correct;
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#6d28d9';
  return (
    <div style={S.wrap}>
      <style>{D27STYLE}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '8px 0 4px' }}>
        <CommaHop digitsAll={['4', '7', '0']} newIdx={[2]} startPos={1} endPos={3} reveal={revealHop} />
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#6d28d9' }}>× 100</span>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 5))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 130, height: 56, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
