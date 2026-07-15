// Dars28 · Amaliyot 06 — Xato qadamni top · 🟡 · tag: mul_comma_error
// Jasur 0,3 × 0,2 = 0,6 dedi. Xato — vergul joyi: ikkala sonda 1 tadan kasr xona → jami 2. To'g'ri 0,06.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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

const D06_CORRECT = 1; // xato — 2-qadam (vergul joyi)
const D06_T = {
  uz: {
    eyebrow: 'Xato qadamni top', setup: "Jasur 0,3 × 0,2 ni shunday hisobladi. Bir qadamda xato bor — xato qadamni bosing.",
    ask: 'Qaysi qadamda xato bor?',
    steps: ['3 × 2 = 6', 'Verguldan oldin 1 ta xona qoldirdim → 0,6', 'Javob: 0,6'],
    correct: "To'g'ri. Ikkala sonda ham bittadan kasr xona bor → jami 2 xona. 6 → 0,06.",
    wrong: "Ko'paytuvchilardagi kasr xonalarni sanang — natijada shuncha kasr xona bo'lishi kerak.",
    rule: "Ko'paytmada kasr xonalar soni = ikkala ko'paytuvchidagi xonalar YIG'INDISI.",
  },
  ru: {
    eyebrow: 'Найди неверный шаг', setup: 'Жасур посчитал 0,3 × 0,2 так. В одном шаге ошибка — нажми неверный шаг.',
    ask: 'В каком шаге ошибка?',
    steps: ['3 × 2 = 6', 'Оставил 1 цифру после запятой → 0,6', 'Ответ: 0,6'],
    correct: 'Верно. В обоих числах по одной дробной цифре → всего 2. 6 → 0,06.',
    wrong: 'Посчитай дробные разряды множителей — в результате должно быть столько же дробных разрядов.',
    rule: 'Число дробных цифр в произведении = СУММА цифр обоих множителей.',
  },
};

export default function D28_06(props) {
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
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D06_CORRECT }, correct, meta: { tag: 'mul_comma_error', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d28-pop { animation: d28pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d28pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d28-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '8px 0', padding: '8px 12px', borderRadius: 12, background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1f2430' }}>0,3 × 0,2 = ?</span>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((s, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#d97706'; bg = '#fffbeb'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D06_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}><span style={{ ...S.mono, fontSize: 13, fontWeight: 800, color: '#94a3b8', minWidth: 18 }}>{i + 1}.</span><span style={S.mono}>{s}</span></button>;
        })}
      </div>
      {checked && fb?.correct && (
        <div className="d28-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0 2px' }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1a7f43' }}>0,3 × 0,2 = 0,06</span>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
