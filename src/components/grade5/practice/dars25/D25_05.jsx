// Dars25 · Amaliyot 05 — O'ndan birgacha yaxlitla · 🔴 · tag: round_tenth
// 3,76 ni o'ndan birgacha: keyingi (yuzdan) xona 6 ≥ 5 → o'ndan 7 → 8. 3,76 ≈ 3,8.
// Yaxlitlash yo'nalishi (≥5 ↑) OLDINDAN aytilmaydi — o'quvchi keyingi xonaga o'zi qaraydi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
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
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D05_ANS = 8; // 3,8 → o'ndan xonasi 8
const D05_T = {
  uz: {
    eyebrow: "O'ndan birgacha", setup: "Sardor 3,76 kg unni o'ndan birgacha yaxlitlamoqchi. Yaxlitlanadigan xona — o'ndan (7).",
    ask: 'Yaxlitla: 3,76 ≈ 3,?', label: "o'ndan xonasi:",
    correct: "To'g'ri. Keyingi xona 6 ≥ 5, o'ndan 7 → 8. Shuning uchun 3,76 ≈ 3,8.",
    wrong: "o'ndanni oshirish kerakmi yoki qoldirish — buni nima hal qiladi?",
    rule: "o'ndan birgacha: keyingi xona ≥ 5 bo'lsa o'ndan oshadi. 3,76 ≈ 3,8.",
  },
  ru: {
    eyebrow: 'До десятых', setup: 'Сардор хочет округлить 3,76 кг муки до десятых. Округляемый разряд — десятые (7).',
    ask: 'Округли: 3,76 ≈ 3,?', label: 'разряд десятых:',
    correct: 'Верно. Следующий разряд 6 ≥ 5, десятые 7 → 8. Поэтому 3,76 ≈ 3,8.',
    wrong: 'Что решает — увеличивать десятые или оставить как есть?',
    rule: 'До десятых: если следующий разряд ≥ 5, десятые увеличиваются. 3,76 ≈ 3,8.',
  },
};

export default function D25_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D05_ANS }, correct, meta: { tag: 'round_tenth', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, margin: '10px 0 4px' }}>
        <span style={{ ...S.mono, fontSize: 34, fontWeight: 800, color: '#1f2430' }}>3,</span>
        <span style={{ ...S.mono, fontSize: 34, fontWeight: 800, color: '#7c3aed', borderBottom: '3px solid #c4b5fd', padding: '0 2px' }}>7</span>
        <span style={{ ...S.mono, fontSize: 34, fontWeight: 800, color: '#f59e0b', background: '#fef3c7', borderRadius: 6, padding: '0 4px' }}>6</span>
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{t.ask}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: '#1f2430' }}>3,</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 1))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 54, height: 48, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
