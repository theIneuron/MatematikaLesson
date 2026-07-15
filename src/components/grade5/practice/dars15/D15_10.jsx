// Dars15 · Amaliyot 10 — Teng kasrlar zanjiri · 🔴 · tag: equal_chain
// 1/2 = 2/4 = 3/6 = ?/8. Zanjir bo'g'inlari birma-bir, oxirgi surat = 4.
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
  <div className="d15-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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

/* =================== 10 · Teng kasrlar zanjiri · 🔴 · equal_chain (ketma-ket to'ldirish + rasm) =================== */
// 1/2 = 2/4 = 3/6 = ?/8. Zanjir bo'g'inlari birma-bir, oxirgi surat = 4.

const D10_ANS = 4;
const D10_T = {
  uz: {
    eyebrow: 'Zanjir', setup: "Bir xil qiymatning teng kasrlar zanjiri: 1/2 = 2/4 = 3/6 = ?",
    ask: 'Naqshni davom ettiring. Oxirgi kasrning surati (maxraj 8):', label: 'Suratni yozing:',
    correct: "To'g'ri. Har qadamda surat va maxraj bir xil ko'payadi: 1/2, 2/4, 3/6, 4/8. Hammasi 1/2 ga teng.",
    wrong: "Maslahat: zanjirdagi har qadamda surat va maxraj bir xil o'sadi (1/2, 2/4, 3/6...). Maxraj 8 bo'lsa, keyingi suratni o'zingiz toping.",
    rule: "Teng kasrlar zanjiri: har qadamda surat va maxraj bir xil songa ko'payadi.",
  },
  ru: {
    eyebrow: 'Цепочка', setup: 'Цепочка равных дробей одного значения: 1/2 = 2/4 = 3/6 = ?',
    ask: 'Продолжите закономерность. Числитель последней дроби (знаменатель 8):', label: 'Впишите числитель:',
    correct: 'Верно. На каждом шаге числитель и знаменатель растут одинаково: 1/2, 2/4, 3/6, 4/8. Все равны 1/2.',
    wrong: 'Подсказка: в цепочке на каждом шаге числитель и знаменатель растут одинаково (1/2, 2/4, 3/6...). Если знаменатель 8, найди следующий числитель сам.',
    rule: 'Цепочка равных дробей: на каждом шаге числитель и знаменатель растут одинаково.',
  },
};
export default function D15_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [lit, setLit] = useState(0); // zanjir bo'g'inlari yoritiladi 0..4
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setLit(4); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D10_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) [1, 2, 3, 4].forEach((k) => timers.current.push(setTimeout(() => setLit(k), 400 + (k - 1) * 600)));
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D10_ANS }, correct, meta: { tag: 'equal_chain', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#2563eb';
  const chain = [['1', '2'], ['2', '4'], ['3', '6'], ['?', '8']];
  const cols = ['#2563eb', '#14b8a6', '#7c3aed', '#f97316'];
  return (
    <div style={S.wrap}>
      <style>{`
        .d15-pop { animation: d15pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d15pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d15-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* zanjir */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '14px 0 8px', flexWrap: 'wrap' }}>
        {chain.map((c, i) => {
          const on = checked && fb?.correct ? lit > i : true;
          const isLast = i === 3;
          const num = isLast && checked && fb?.correct ? '4' : c[0];
          return (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#cbd5e1' }}>=</span>}
              <span className={checked && fb?.correct && lit === i + 1 ? 'd15-pop' : undefined} style={{ opacity: on ? 1 : 0.3, transition: 'opacity .5s ease', padding: '4px 8px', borderRadius: 10, background: isLast ? '#fff7ed' : 'transparent', border: isLast ? '2px solid #fed7aa' : 'none' }}>
                <Frac num={num} den={c[1]} size={26} color={cols[i]} />
              </span>
            </React.Fragment>
          );
        })}
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <p style={{ fontSize: 13.5, color: '#6b7280', fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 2))} disabled={isReview || checked} inputMode="numeric" placeholder="?"
          style={{ width: 120, height: 54, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 14, border: '2px solid ' + bd, color: '#1f2430', fontFamily: 'inherit', background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
