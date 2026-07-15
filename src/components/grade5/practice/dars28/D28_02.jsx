// Dars28 · Amaliyot 02 — 0,2 to'rt marta · 🟢 · tag: mul_tenth_int
// 0,2 × 4 = 0,8. Guruh-nusxa: 4 ta 0,2 tomchi qo'shilib 0,8. Input.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#be123c', background: '#fff1f2', border: '1px solid #fecdd3', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
// Guruh-nusxa: 4 ta bir xil 0,2 tomchi, ketma-ket paydo bo'ladi, ostida yig'indi
function DropGroup() {
  return (
    <div className="d28-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '6px auto 4px', padding: '14px 16px', borderRadius: 16, background: '#fff5f6', border: '1.5px solid #fecdd3', width: 'fit-content' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="d28-rise" style={{ animationDelay: (i * 0.14) + 's', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <svg width="30" height="38" viewBox="0 0 30 38"><path d="M15 2 C15 2 26 18 26 26 A11 11 0 1 1 4 26 C4 18 15 2 15 2 Z" fill="#fb7185" stroke="#be123c" strokeWidth="1.4" /></svg>
            <span style={{ ...S.mono, fontSize: 12, fontWeight: 800, color: '#be123c' }}>0,2</span>
          </div>
        ))}
      </div>
      <span style={{ ...S.mono, fontSize: 14.5, fontWeight: 800, color: '#be123c' }}>0,2 + 0,2 + 0,2 + 0,2 = 0,8</span>
    </div>
  );
}

const D02_ANS = 0.8;
const D02_T = {
  uz: {
    eyebrow: "0,2 to'rt marta", setup: "Bekzod 4 ta bir xil o'lchov idishini, har biriga 0,2 litrdan quyib to'ldirdi.",
    ask: '0,2 × 4 = ?',
    correct: "To'g'ri. 4 ta 0,2 birlashdi: 0,2 × 4 = 0,8.",
    wrong: "0,2 ni 4 marta qo'shsangiz nima chiqadi? Ko'paytuvchida nechta o'nli xona bor — natijada-chi?",
    rule: "0,2 × 4 = 2 × 4 o'ndan = 8 o'ndan = 0,8.",
  },
  ru: {
    eyebrow: '0,2 четыре раза', setup: 'Бекзод наполнил 4 одинаковых мерных стакана, в каждый по 0,2 литра.',
    ask: '0,2 × 4 = ?',
    correct: 'Верно. Четыре 0,2 объединились: 0,2 × 4 = 0,8.',
    wrong: 'Что получится, если сложить 0,2 четыре раза? Сколько десятичных разрядов у множителя — а сколько в ответе?',
    rule: '0,2 × 4 = 2 × 4 десятых = 8 десятых = 0,8.',
  },
};

export default function D28_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.raw != null) { setVal(String(sa.raw)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const valid = /^\d+([.,]\d+)?$/.test(val.trim());
  useEffect(() => { onReady?.(valid && !checked); }, [valid, checked, onReady]);
  const check = useCallback(() => {
    const num = parseFloat(val.trim().replace(',', '.'));
    const correct = Math.abs(num - D02_ANS) < 1e-9;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { raw: val.trim(), value: num }, correctAnswer: { value: D02_ANS }, correct, meta: { tag: 'mul_tenth_int', level: '🟢' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#e11d48';
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d28-rise { animation: d28rise .5s ease both; }
        @keyframes d28rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d28-pop, .d28-rise { animation: none !important; transform: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && <div style={{ display: 'flex', justifyContent: 'center' }}><DropGroup /></div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>0,2 × 4 =</span>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="decimal" placeholder="0,0" style={{ width: 76, height: 48, textAlign: 'center', fontSize: 24, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
