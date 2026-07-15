// Dars14 · Amaliyot 03 — Umumiy ulushga keltirish · 🟡 · common_units_fill (bo'sh katak)
// 1/2 va 2/3 ni 6 ta ulushga keltiring: 1/2=3/6, 2/3=4/6. Bola suratlarni yozadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
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
  <div className="d14-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

const D03_A = [3, 6], D03_B = [4, 6]; // to'g'ri suratlar
const D03_T = {
  uz: {
    eyebrow: 'Umumiy ulush', setup: "Umid 1/2 va 2/3 ni solishtirmoqchi, lekin maxrajlar har xil.",
    ask: "Ikkalasini 6 ta teng ulushga keltiring. Bo'sh kataklarga suratni yozing:",
    correct: "To'g'ri. 1/2 = 3/6, 2/3 = 4/6. Endi solishtirsa bo'ladi: 3/6 < 4/6, demak 1/2 < 2/3.",
    wrong: "Maslahat: butun 6 teng ulushga bo'linsa, 1/2 nechta ulushni, 2/3 nechta ulushni egallaydi? Chizmada tasavvur qilib ko'ring.",
    rule: "Har xil maxrajni bir xil ulushga keltiring, keyin suratlarni solishtiring.",
  },
  ru: {
    eyebrow: 'Общие доли', setup: 'Умид хочет сравнить 1/2 и 2/3, но знаменатели разные.',
    ask: 'Приведите обе к 6 равным долям. Впишите числители в пустые клетки:',
    correct: 'Верно. 1/2 = 3/6, 2/3 = 4/6. Теперь можно сравнить: 3/6 < 4/6, значит 1/2 < 2/3.',
    wrong: 'Подсказка: если целое разделить на 6 равных долей, сколько долей займёт 1/2, а сколько 2/3? Представь это на рисунке.',
    rule: 'Приведи разные знаменатели к одинаковым долям, потом сравни числители.',
  },
};
export default function D14_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa) { if (sa.a != null) setA(String(sa.a)); if (sa.b != null) setB(String(sa.b)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = /^\d+$/.test(a) && /^\d+$/.test(b);
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(a, 10) === D03_A[0] && parseInt(b, 10) === D03_B[0];
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { a: parseInt(a, 10), b: parseInt(b, 10) }, correctAnswer: { a: 3, b: 4 }, correct, meta: { tag: 'common_units_fill', level: '🟡' } });
  }, [a, b, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = (v, ok) => checked ? (v === ok ? '#1a7f43' : '#c0392b') : '#2563eb';
  const cell = (val, set, ok) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <input value={val} onChange={(e) => set(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?" style={{ width: 56, height: 40, textAlign: 'center', fontSize: 22, fontWeight: 800, borderRadius: 10, border: '2px solid ' + bd(parseInt(val, 10), ok), color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      <div style={{ width: 62, height: 2, background: '#1f2430' }} />
      <div style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#64748b' }}>6</div>
    </div>
  );
  return (
    <div style={S.wrap}>
      <style>{`
        .d14-pop { animation: d14pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d14pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d14-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={{ ...S.ask, fontSize: 15.5 }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '14px 0 8px' }}>
        <Frac num="1" den="2" size={26} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>=</span>
        {cell(a, setA, D03_A[0])}
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#cbd5e1', margin: '0 4px' }}>|</span>
        <Frac num="2" den="3" size={26} color="#14b8a6" />
        <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#94a3b8' }}>=</span>
        {cell(b, setB, D03_B[0])}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
