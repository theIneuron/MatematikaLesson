// Dars36 · Amaliyot 06 — Xatoni top · 🟡 · tag: tri_error
// Temur asos 6, balandlik 4 → 6×4=24 dedi, lekin 2 ga bo'lishni unutdi. To'g'ri javob 12.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// HUE: red
const HUE = { d: '#dc2626', l: '#fef2f2', m: '#fecaca', deep: '#991b1b', fill: '#ef4444' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: HUE.d, background: HUE.l, border: '1px solid ' + HUE.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d36-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_CORRECT = 1; // xato qadam — 2 ga bo'linmadi
const D06_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Temur uchburchak yuzasini hisobladi: asos 6, balandlik 4. Uning qadamlarida bitta xato bor.",
    ask: 'Qaysi qadam xato? Bosing:',
    steps: ['6 × 4 = 24', 'Yuza = 24 sm²', 'Javob: 24 sm²'],
    correct: "To'g'ri. 24 — bu to'rtburchakning yuzasi. Uchburchak uning yarmi: 24 : 2 = 12.",
    wrong: "Ko'paytirishdan keyin yana bitta amal kerak edi. Uchburchak to'rtburchakning yarmi — qaysi qadamda shu amal tushib qolgan?",
    rule: "2 ga bo'lishni unutma.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Темур считал площадь треугольника: основание 6, высота 4. В его шагах одна ошибка.',
    ask: 'Какой шаг ошибочный? Нажми:',
    steps: ['6 × 4 = 24', 'Площадь = 24 см²', 'Ответ: 24 см²'],
    correct: 'Верно. 24 — это площадь прямоугольника. Треугольник это его половина: 24 : 2 = 12.',
    wrong: 'После умножения нужно было ещё одно действие. Треугольник — половина прямоугольника: в каком шаге это действие пропущено?',
    rule: 'Не забывай делить на 2.',
  },
};

export default function D36_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D06_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D06_CORRECT }, correct, meta: { tag: 'tri_error', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d36-pop { animation: d36pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d36pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d36-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((step, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = HUE.d; bg = HUE.l; }
          if (checked && on) { const ok = i === D06_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '12px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#9ca3af', minWidth: 18 }}>{i + 1}</span>
              <span style={{ ...S.mono, fontSize: 17, fontWeight: 800 }}>{step}</span>
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="d36-pop" style={{ ...S.mono, textAlign: 'center', marginTop: 12, padding: '10px', borderRadius: 12, fontSize: 15, fontWeight: 800, color: '#1a7f43', background: '#e8f7ee', border: '1.5px solid #a7f3d0' }}>24 : 2 = 12</div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
