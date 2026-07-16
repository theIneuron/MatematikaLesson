// Dars15 · Amaliyot 01 — Teng bar · 🟢 · Aziza · tag: equal_bars
// 1/2 va 3/6 bir xil bo'yalgan. Tengmi? Ha.
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
const RuleChip = ({ text }) => (
  <div className="d15-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// gorizontal bar: den ulush, shaded bo'yalgan
const Bar = ({ den, shaded, width = 280, color = '#fe5b1a', light = '#e0ecff', label }) => (
  <div>
    {label && <div style={{ fontSize: 13, fontWeight: 800, color, marginBottom: 4, ...S.mono }}>{label}</div>}
    <div style={{ display: 'flex', width, height: 36, border: '2px solid ' + color, borderRadius: 8, overflow: 'hidden' }}>
      {Array.from({ length: den }).map((_, i) => (
        <div key={i} style={{ flex: 1, borderRight: i < den - 1 ? '1.5px solid ' + color : 'none', background: i < shaded ? color : light, transition: 'background .5s ease ' + (i < shaded ? i * 0.15 : 0) + 's' }} />
      ))}
    </div>
  </div>
);

/* =================== 01 · Teng bar · 🟢 · equal_bars (ha/yo'q + vizual) =================== */
// 1/2 va 3/6 bir xil bo'yalgan. Tengmi? Ha.

const D01_CORRECT = 'ha';
const D01_T = {
  uz: {
    eyebrow: 'Tengmi?', setup: "Aziza ikki bir xil lentani bo'yamoqchi: birini 1/2 ga, ikkinchisini 3/6 ga.",
    ask: "Bo'yalgan uzunliklar teng chiqadimi? 1/2 va 3/6 teng kasrmi?",
    yes: 'Ha, teng', no: "Yo'q, teng emas",
    correct: "To'g'ri. Bo'yalgan qismlar bir xil uzunlikda — 1/2 = 3/6. Bu teng kasrlar.",
    wrong: "Maslahat: lentalarga qarang. Bo'yalgan qismlar bir xil uzunlikdami? Ha bo'lsa — teng kasrlar.",
    rule: "Teng (ekvivalent) kasrlar bir xil qiymatni bildiradi: 1/2 = 3/6.",
  },
  ru: {
    eyebrow: 'Равны ли?', setup: 'Азиза хочет закрасить две одинаковые ленты: одну на 1/2, другую на 3/6.',
    ask: 'Закрашенные длины совпадут? Равны ли дроби 1/2 и 3/6?',
    yes: 'Да, равны', no: 'Нет, не равны',
    correct: 'Верно. Закрашенные части одной длины — 1/2 = 3/6. Это равные дроби.',
    wrong: 'Подсказка: посмотри на ленты. Закрашенные части одной длины? Если да — дроби равны.',
    rule: 'Равные (эквивалентные) дроби означают одно значение: 1/2 = 3/6.',
  },
};
export default function D15_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [fillA, setFillA] = useState(0); // 1/2 → 1 ulush
  const [fillB, setFillB] = useState(0); // 3/6 → 3 ulush
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.pick) { setPick(sa.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) { setFillA(1); setFillB(3); } } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => setFillA(1), 600));
      [1, 2, 3].forEach((k) => timers.current.push(setTimeout(() => setFillB(k), 600 + k * 700)));
    }
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { pick }, correctAnswer: { pick: 'ha' }, correct, meta: { tag: 'equal_bars', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (val, label, color) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = color; bg = color === '#1a7f43' ? '#e8f7ee' : '#fff0e8'; col = color; }
    if (checked && on) { const ok = val === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, padding: '14px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', minHeight: 52 }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d15-pop { animation: d15pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d15pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d15-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, margin: '12px 0' }}>
        <Bar den={2} shaded={fillA} width={290} color="#fe5b1a" label="1/2" />
        <Bar den={6} shaded={fillB} width={290} color="#14b8a6" light="#d5f5f0" label="3/6" />
      </div>
      <p style={{ ...S.ask, fontSize: 16 }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>{btn('ha', t.yes, '#1a7f43')}{btn('yoq', t.no, '#fe5b1a')}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
