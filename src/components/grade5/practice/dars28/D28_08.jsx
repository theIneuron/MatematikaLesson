// Dars28 · Amaliyot 08 — Masala: shishalar · 🔴 · tag: mul_word
// Bir shisha 1,5 litr. 4 shisha necha litr? 1,5 × 4 = 6. Input.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
function Bottle({ label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <svg width="34" height="58" viewBox="0 0 34 58"><rect x="13" y="2" width="8" height="8" rx="2" fill="#94a3b8" /><path d="M11 12 h12 v6 l3 6 v28 a4 4 0 0 1-4 4 h-10 a4 4 0 0 1-4-4 v-28 l3-6 z" fill="#86efac" stroke="#15803d" strokeWidth="1.6" /></svg>
      <span style={{ ...S.mono, fontSize: 12, fontWeight: 800, color: '#15803d' }}>{label}</span>
    </div>
  );
}

const D08_ANS = 6;
const D08_T = {
  uz: {
    eyebrow: 'Masala', setup: "Bir shisha suvda 1,5 litr bor. Nodira 4 ta shunday shisha oldi.",
    ask: '4 shishada jami necha litr suv bor?',
    unit: 'litr',
    correct: "To'g'ri. 1,5 ni 4 marta oldingiz: 1,5 × 4 = 6 litr.",
    wrong: "4 shisha — 1,5 ni necha marta olish? Butun sondek hisoblasangiz, vergul o'rnini nima belgilaydi?",
    rule: "Takror qo'shishni ko'paytirish bilan almashtiring: 1,5 × 4.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'В одной бутылке 1,5 литра воды. Нодира взяла 4 такие бутылки.',
    ask: 'Сколько всего литров воды в 4 бутылках?',
    unit: 'литра',
    correct: 'Верно. Ты взял 1,5 четыре раза: 1,5 × 4 = 6 литров.',
    wrong: '4 бутылки — сколько раз взять 1,5? Если считать как целое, что определит место запятой?',
    rule: 'Замени повторное сложение умножением: 1,5 × 4.',
  },
};

export default function D28_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.raw != null) { setVal(String(sa.raw)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const valid = /^\d+([.,]\d+)?$/.test(val.trim());
  useEffect(() => { onReady?.(valid && !checked); }, [valid, checked, onReady]);
  const check = useCallback(() => {
    const num = parseFloat(val.trim().replace(',', '.'));
    const correct = Math.abs(num - D08_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { raw: val.trim(), value: num }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'mul_word', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#16a34a';
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d28-rise { animation: d28rise .5s ease both; }
        @keyframes d28rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d28-pop, .d28-rise { animation: none !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '8px 0' }}>
        {['1,5', '1,5', '1,5', '1,5'].map((l, i) => <Bottle key={i} label={l} />)}
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 76, height: 48, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>{t.unit}</span>
      </div>
      {revealed && (
        <div className="d28-pop" style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 2px' }}>
          <span style={{ ...S.mono, fontSize: 16, fontWeight: 800, color: '#15803d', padding: '9px 14px', borderRadius: 12, background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>1,5 + 1,5 + 1,5 + 1,5 = 6</span>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
