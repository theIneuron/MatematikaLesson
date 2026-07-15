// Dars07 · Amaliyot 04 — Kim balandroq · 🟡 · compare_two_neg (kontekst + kiritish)
// Ikki g'avvos: biri -17 m, biri -11 m. Qaysi biri BALANDROQ (sathga yaqinroq)?
// Kartani tanlaydi. Vertikal shkala vizual.
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
  <div className="d7-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D04_A = -17, D04_B = -11, D04_HIGHER = 'B'; // -11 balandroq
const D04_T = {
  uz: {
    eyebrow: 'Kim balandroq', setup: "Ikki g'avvos suv ostida: Bekzod -17 m, Sardor -11 m chuqurlikda.",
    ask: "Qaysi g'avvos suv sathiga YAQINROQ (balandroq)?",
    optA: 'Bekzod (-17 m)', optB: 'Sardor (-11 m)',
    correct: "To'g'ri. -11 nolga yaqinroq — Sardor balandroqda. -11 > -17.",
    wrong: "Maslahat: suv sathi — bu 0. Ikki chuqurlikdan qaysi biri 0 ga yaqinroq turibdi?",
    rule: "Ikki manfiy sondan nolga yaqinrog'i kattaroq (balandroq).",
  },
  ru: {
    eyebrow: 'Кто выше', setup: 'Два ныряльщика под водой: Бекзод -17 м, Сардор -11 м.',
    ask: 'Кто БЛИЖЕ к поверхности (выше)?',
    optA: 'Бекзод (-17 м)', optB: 'Сардор (-11 м)',
    correct: 'Верно. -11 ближе к нулю — Сардор выше. -11 > -17.',
    wrong: 'Подсказка: поверхность воды — это 0. Какая из двух глубин ближе к 0?',
    rule: 'Из двух отрицательных то, что ближе к нулю — больше (выше).',
  },
};
export default function D07_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null); // 'A' | 'B'
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.pick != null) { setPick(initialAnswer.studentAnswer.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D04_HIGHER;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'A', label: t.optA }, { id: 'B', label: t.optB }], studentAnswer: { pick }, correctAnswer: { pick: D04_HIGHER }, correct, meta: { tag: 'compare_two_neg', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cardStyle = (which) => {
    const on = pick === which;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1e40af'; }
    if (checked && on) { const ok = which === D04_HIGHER; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: 1, padding: '15px 10px', borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer', minHeight: 54 };
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d7-pop { animation: d7pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d7pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d7-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* vertikal shkala: sath 0, ikki g'avvos */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
        <div style={{ width: 220, borderRadius: 14, overflow: 'hidden', border: '2px solid #e5e7eb' }}>
          <div style={{ background: '#dbeafe', borderBottom: '2px dashed #60a5fa', padding: '5px 10px', textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#1e40af' }}>~ 0 m ~</div>
          <div style={{ background: '#cffafe', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 20 }}>🤿</span><span style={{ fontSize: 13, fontWeight: 700, color: '#0e7490' }}>Sardor</span><span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#0e7490' }}>-11</span>
          </div>
          <div style={{ background: '#a5f3fc', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #67e8f9' }}>
            <span style={{ fontSize: 20 }}>🤿</span><span style={{ fontSize: 13, fontWeight: 700, color: '#155e75' }}>Bekzod</span><span style={{ ...S.mono, fontSize: 17, fontWeight: 800, color: '#155e75' }}>-17</span>
          </div>
        </div>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" style={cardStyle('A')} disabled={isReview || checked} onClick={() => setPick('A')}>{t.optA}</button>
        <button type="button" style={cardStyle('B')} disabled={isReview || checked} onClick={() => setPick('B')}>{t.optB}</button>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
