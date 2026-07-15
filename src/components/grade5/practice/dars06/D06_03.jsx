// Dars06 · Amaliyot 03 — Son o'qida belgila · 🟡 · numberline_place (interaktiv)
// -9..9 son o'qi. Bola -7 nuqtasini bosib belgilaydi. To'g'ri javobdan keyin
// noldan chapga qadam animatsiya.
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
const RuleChip = ({ text }) => (
  <div className="d6-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D03_LO = -9, D03_HI = 9, D03_TARGET = -7;
const D03_T = {
  uz: {
    eyebrow: "Son o'qi", setup: "Son o'qini diqqat bilan kuzating.",
    rule: "Manfiy sonlar noldan chapda joylashadi. Chapga — kichrayadi.",
    ask: "-7 sonini son o'qida belgilang:",
    correct: "To'g'ri. -7 noldan 7 birlik chapda.",
    wrong: "Maslahat: manfiy son noldan qaysi tomonda joylashadi? Son qancha kichik bo'lsa, noldan shuncha uzoqroqda.",
  },
  ru: {
    eyebrow: 'Числовая ось', setup: 'Внимательно посмотрите на числовую ось.',
    rule: 'Отрицательные числа стоят слева от нуля. Влево — уменьшается.',
    ask: 'Отметьте число -7 на числовой оси:',
    correct: 'Верно. -7 на 7 единиц левее нуля.',
    wrong: 'Подсказка: с какой стороны от нуля стоит отрицательное число? Чем меньше число, тем дальше оно от нуля.',
  },
};
export default function D06_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [walk, setWalk] = useState(null); // qadam animatsiya pozitsiyasi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.value != null) { setPick(initialAnswer.studentAnswer.value); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setWalk(D03_TARGET); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_TARGET;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) { [0,-1,-2,-3,-4,-5,-6,-7].forEach((v, k) => timers.current.push(setTimeout(() => setWalk(v), 300 + k * 380))); }
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: pick }, correctAnswer: { value: D03_TARGET }, correct, meta: { tag: 'numberline_place', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const nums = [];
  for (let v = D03_LO; v <= D03_HI; v++) nums.push(v);
  const W = 100 / (nums.length - 1);
  return (
    <div style={S.wrap}>
      <style>{`
        .d6-pop { animation: d6pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d6pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d6-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ position: 'relative', height: 96, margin: '18px 6px 8px' }}>
        <div style={{ position: 'absolute', left: '4%', right: '4%', top: 44, height: 3, background: '#cbd5e1', borderRadius: 2 }} />
        {/* qadam yuruvchi token */}
        {walk != null && (
          <div style={{ position: 'absolute', left: `calc(4% + ${(walk - D03_LO) * W * 0.92}%)`, top: 14, transform: 'translateX(-50%)', transition: 'left .5s cubic-bezier(.34,1.56,.64,1)' }}>
            <div style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#c2410c' }}>▼</div>
          </div>
        )}
        {nums.map((v, i) => {
          const on = pick === v;
          const isZero = v === 0;
          let dotBg = isZero ? '#94a3b8' : '#cbd5e1';
          if (on) dotBg = '#2563eb';
          if (checked && on) dotBg = (v === D03_TARGET ? '#1a7f43' : '#c0392b');
          return (
            <div key={v} onClick={() => { if (!checked && !isReview) setPick(v); }} style={{ position: 'absolute', left: `calc(4% + ${i * W * 0.92}%)`, top: 30, transform: 'translateX(-50%)', textAlign: 'center', cursor: (checked || isReview) ? 'default' : 'pointer' }}>
              <div style={{ width: on ? 20 : 13, height: on ? 20 : 13, borderRadius: 999, background: dotBg, margin: '0 auto', transition: 'all .2s', border: v < 0 ? '2px solid #93c5fd' : 'none' }} />
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 800, color: v < 0 ? '#2563eb' : (isZero ? '#64748b' : '#94a3b8'), ...S.mono }}>{v}</div>
            </div>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
