// Dars28 · Amaliyot 04 — 2,5 uch marta · 🟡 · tag: mul_mixed_int
// 2,5 × 3 = 7,5. Butun va kasr qismni alohida: 2×3=6, 0,5×3=1,5 → 7,5. Input.
// Ishlangan-yechim faqat to'g'ri javobdan keyin (NAQSH A). jsx-question kontrakti. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0f766e', background: '#f0fdfa', border: '1px solid #99f6e4', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d28-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Qadamli hisob: 2×3=6 · 0,5×3=1,5 · 6+1,5=7,5. Har qator ketma-ket tushadi.
function StepCalc() {
  const rows = [['2 × 3', '6'], ['0,5 × 3', '1,5'], ['6 + 1,5', '7,5']];
  return (
    <div className="d28-pop" style={{ display: 'flex', flexDirection: 'column', gap: 7, margin: '6px auto 4px', padding: '14px 18px', borderRadius: 14, background: '#f0fdfa', border: '1.5px solid #99f6e4', width: 'fit-content' }}>
      {rows.map((r, i) => (
        <div key={i} className="d28-drop" style={{ animationDelay: (i * 0.13) + 's', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: '#334155', minWidth: 92, textAlign: 'right' }}>{r[0]}</span>
          <span style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: '#0f766e' }}>=</span>
          <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: i === 2 ? '#0f766e' : '#1f2430' }}>{r[1]}</span>
        </div>
      ))}
    </div>
  );
}

const D04_ANS = 7.5;
const D04_T = {
  uz: {
    eyebrow: '2,5 uch marta', setup: "Oybek har biriga 2,5 litr suv quyilgan 3 ta chelakni to'ldirdi.",
    ask: '2,5 × 3 = ?',
    correct: "To'g'ri. 2 × 3 = 6, 0,5 × 3 = 1,5. Jami 6 + 1,5 = 7,5.",
    wrong: "2,5 ni butun sondek (25) ko'paytirsangiz, natijada vergul o'rnini nima belgilaydi?",
    rule: "Butun va kasr qismni alohida ko'paytiring, keyin qo'shing.",
  },
  ru: {
    eyebrow: '2,5 три раза', setup: 'Ойбек наполнил 3 ведра, в каждом по 2,5 литра воды.',
    ask: '2,5 × 3 = ?',
    correct: 'Верно. 2 × 3 = 6, 0,5 × 3 = 1,5. Всего 6 + 1,5 = 7,5.',
    wrong: 'Если умножить 2,5 как целое (25), что определит место запятой в ответе?',
    rule: 'Умножь целую и дробную части отдельно, затем сложи.',
  },
};

export default function D28_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.raw != null) { setVal(String(sa.raw)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const valid = /^\d+([.,]\d+)?$/.test(val.trim());
  useEffect(() => { onReady?.(valid && !checked); }, [valid, checked, onReady]);
  const check = useCallback(() => {
    const num = parseFloat(val.trim().replace(',', '.'));
    const correct = Math.abs(num - D04_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { raw: val.trim(), value: num }, correctAnswer: { value: D04_ANS }, correct, meta: { tag: 'mul_mixed_int', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#0d9488';
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d28-drop { animation: d28drop .5s ease both; }
        @keyframes d28drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d28-pop, .d28-drop { animation: none !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && <div style={{ display: 'flex', justifyContent: 'center' }}><StepCalc /></div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>2,5 × 3 =</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="decimal" placeholder="0,0" style={{ width: 80, height: 48, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
