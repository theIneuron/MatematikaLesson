// Dars27 · Amaliyot 10 — Zanjir · 🔴 · tag: shift_chain
// 5,6 × 10 : 100 = ? Ketma-ket: 5,6 × 10 = 56; 56 : 100 = 0,56.
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
  .d27-s2 { animation: d27pop .6s cubic-bezier(.34,1.4,.64,1) .4s both; }
  @media (prefers-reduced-motion: reduce) { .d27-pop,.d27-s2 { animation: none !important; } }
`;

const D10_ANS = 0.56;
const D10_T = {
  uz: {
    eyebrow: 'Zanjir', setup: "Rustam ikki amalni ketma-ket bajarmoqchi. Zanjirni chapdan o'ngga bajaring.",
    ask: '5,6 × 10 : 100 = ?  Javobni yozing:',
    correct: "To'g'ri. 5,6 × 10 = 56 (vergul 1 o'ngga); 56 : 100 = 0,56 (vergul 2 chapga).",
    wrong: "Zanjirda amallarni qaysi tartibda bajarasiz? Har bir amal vergulni qaysi tomonga suradi?",
    rule: "Zanjirni chapdan o'ngga, bosqichma-bosqich bajaring.",
    s1: '5,6 × 10 = 56', s2: '56 : 100 = 0,56',
  },
  ru: {
    eyebrow: 'Цепочка', setup: 'Рустам выполняет два действия подряд. Считай цепочку слева направо.',
    ask: '5,6 × 10 : 100 = ?  Запиши ответ:',
    correct: 'Верно. 5,6 × 10 = 56 (запятая на 1 вправо); 56 : 100 = 0,56 (запятая на 2 влево).',
    wrong: 'В каком порядке выполняешь действия в цепочке? В какую сторону каждое сдвигает запятую?',
    rule: 'Цепочку выполняй слева направо, шаг за шагом.',
    s1: '5,6 × 10 = 56', s2: '56 : 100 = 0,56',
  },
};

export default function D27_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.raw != null) { setVal(String(sa.raw)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+[,.]\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const num = parseFloat(val.replace(',', '.'));
    const correct = Math.abs(num - D10_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { raw: val, value: num }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'shift_chain', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#6d28d9';
  return (
    <div style={S.wrap}>
      <style>{D27STYLE}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0', padding: '12px', borderRadius: 12, background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>5,6</span>
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#6d28d9', margin: '0 6px' }}>× 10</span>
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#6d28d9', margin: '0 6px' }}>: 100</span>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>= ?</span>
      </div>
      {checked && fb?.correct && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '4px 0 8px' }}>
          <span className="d27-pop" style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#6d28d9', background: '#f3edfe', borderRadius: 8, padding: '4px 8px' }}>{t.s1}</span>
          <span className="d27-s2" style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#1a7f43', background: '#e8f7ee', borderRadius: 8, padding: '4px 8px' }}>{t.s2}</span>
        </div>
      )}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').replace('.', ',').slice(0, 6))} disabled={isReview || checked} inputMode="decimal" placeholder="0,0" style={{ width: 130, height: 56, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
