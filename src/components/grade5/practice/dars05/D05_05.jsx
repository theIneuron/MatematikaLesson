// Dars05 · Amaliyot 05 — Ortiq qoladi · 🟡 · Sardor · tag: remainder_context
// 50 : 8. Sardor 50 olmani 8 tadan qutilarga joylaydi. Nechta to'liq quti + qoldiq.
// To'g'ri javobdan keyin: 6 quti to'ladi, 2 olma ortib qoladi (chetda).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D05_DATA = { boxes: 6, rem: 2, ans: 6 };
const D05_T = {
  uz: {
    eyebrow: 'Masala', setup: "Sardorda 50 ta olma bor. Har bir qutiga 8 tadan joylaydi.",
    ask: "Nechta TO'LIQ quti bo'ladi?", label: "To'liq qutilar soni:",
    correct: "To'g'ri. 50 : 8 = 6 (qoldiq 2). 6 ta to'liq quti, 2 ta olma ortib qoladi.",
    wrong: "Maslahat: olmalarni 8 tadan joylang. 8 ni necha marta olsangiz, 50 dan oshmaydi? O'sha son to'liq qutilar bo'ladi.",
    full: "to'liq", left: 'ortdi',
  },
  ru: {
    eyebrow: 'Задача', setup: 'У Сардора 50 яблок. В каждую коробку он кладёт по 8.',
    ask: 'Сколько получится ПОЛНЫХ коробок?', label: 'Число полных коробок:',
    correct: 'Верно. 50 : 8 = 6 (остаток 2). 6 полных коробок, 2 яблока остаются.',
    wrong: 'Подсказка: раскладывай по 8. Сколько раз можно взять 8, не превысив 50? Это и будет число полных коробок.',
    full: 'полных', left: 'осталось',
  },
};
export default function D05_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0); // to'lgan qutilar soni (0..6), 7 = ortiqlar
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setStep(7); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D05_DATA.ans;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [0, 1, 2, 3, 4, 5, 6].forEach((k) => timers.current.push(setTimeout(() => setStep(k + 1), 300 + k * 450)));
    onSubmit?.({ questionText: '50 : 8', options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D05_DATA.ans }, correct, meta: { tag: 'remainder_context', level: '🟡' } });
  }, [val, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#fe5b1a';
  return (
    <div style={S.wrap}>
      <style>{`
        .d5-pop { animation: d5pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d5pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d5-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ maxHeight: step > 0 ? 130 : 0, opacity: step > 0 ? 1 : 0, overflow: 'hidden', transition: 'max-height .6s ease, opacity .5s ease' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', padding: '12px 0 6px' }}>
          {Array.from({ length: 6 }).map((_, b) => (
            <div key={b} className={step > b ? 'd5-pop' : undefined} style={{ width: 46, padding: 4, borderRadius: 9, background: step > b ? '#ffe7d8' : '#f1f5f9', border: '2px solid ' + (step > b ? '#fe5b1a' : '#e5e7eb'), opacity: step > b ? 1 : 0.4, transition: 'all .45s' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {Array.from({ length: 8 }).map((_, k) => <span key={k} style={{ width: 8, height: 8, borderRadius: 999, background: step > b ? '#dc2626' : '#cbd5e1' }} />)}
              </div>
            </div>
          ))}
          {/* ortgan 2 olma */}
          {step >= 7 && (
            <div className="d5-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 6px', borderLeft: '2px dashed #cbd5e1' }}>
              <div style={{ display: 'flex', gap: 3 }}>{[0, 1].map((k) => <span key={k} style={{ width: 10, height: 10, borderRadius: 999, background: '#f59e0b' }} />)}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#c2410c', marginTop: 3 }}>{t.left} 2</div>
            </div>
          )}
        </div>
        {step >= 7 && <div className="d5-pop" style={{ textAlign: 'center', ...S.mono, fontSize: 16, fontWeight: 800, color: '#fe5b1a' }}>50 : 8 = 6 ({t.left} 2)</div>}
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="0"
          style={{ width: 130, height: 56, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff', letterSpacing: 2 }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
