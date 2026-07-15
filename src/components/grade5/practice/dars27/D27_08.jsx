// Dars27 · Amaliyot 08 — Masala · 🔴 · tag: shift_word
// Bir qop 12,5 kg, 100 ta qop → 12,5 × 100 = 1250 kg. Vergul 2 o'ngga.
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
function CommaHop({ digitsAll, startPos, endPos, newIdx = [], reveal, cellW = 36 }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end', height: 48, ...S.mono }}>
      {digitsAll.map((d, i) => {
        const isNew = newIdx.includes(i);
        const hidden = isNew && !reveal;
        return <span key={i} className={reveal && isNew ? 'd27-zero' : ''} style={{ width: cellW, textAlign: 'center', fontSize: 32, fontWeight: 800, color: isNew ? '#6d28d9' : '#1f2430', opacity: hidden ? 0 : 1, lineHeight: 1.2 }}>{d}</span>;
      })}
      <span className={reveal ? 'd27-comma' : ''} style={{ position: 'absolute', bottom: 0, left: (reveal ? endPos : startPos) * cellW - 4, fontSize: 32, fontWeight: 800, color: '#1f2430', lineHeight: 1.2, '--from': (startPos * cellW - 4) + 'px', '--to': (endPos * cellW - 4) + 'px' }}>,</span>
    </div>
  );
}

const D08_ANS = 1250;
const D08_T = {
  uz: {
    eyebrow: 'Masala', setup: "Bir qop shakar 12,5 kg keladi. Omborga 100 ta qop shakar keltirildi.",
    ask: '100 ta qop necha kg? (faqat son)', unit: 'kg',
    correct: "To'g'ri: 12,5 × 100 = 1250 kg. Vergul 2 qadam o'ngga.",
    wrong: "×100 vergulni necha xona o'ngga suradi? Yetmagan joyni nima bilan to'ldirasiz?",
    rule: "×100 — vergul 2 qadam o'ngga.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Один мешок сахара весит 12,5 кг. На склад привезли 100 мешков сахара.',
    ask: 'Сколько кг в 100 мешках? (только число)', unit: 'кг',
    correct: 'Верно: 12,5 × 100 = 1250 кг. Запятая на 2 шага вправо.',
    wrong: 'На сколько разрядов ×100 сдвигает запятую вправо? Чем заполнить недостающее место?',
    rule: '×100 — запятая на 2 шага вправо.',
  },
};

export default function D27_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'shift_word', level: '🔴' } });
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
        <CommaHop digitsAll={['1', '2', '5', '0']} newIdx={[3]} startPos={2} endPos={4} reveal={revealHop} />
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#6d28d9' }}>× 100</span>
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 6))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 130, height: 56, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ fontSize: 17, fontWeight: 700, color: '#64748b' }}>{t.unit}</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
