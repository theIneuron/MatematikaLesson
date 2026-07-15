// Dars32 · Amaliyot 07 — Xatoni top · 🔴 · tag: whole_error
// Nodira: 20% = 10 → butun = 10 × 20 = 200 (qismni foizga ko'paytirdi). To'g'ri: butun = 10 : 20 × 100 = 50.
// Xato qadam — 2-qadam (10 × 20). Student noto'g'ri qadamni bosadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#4338ca', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d32-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D07_CORRECT = 1; // xato qadam indeksi
const D07_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Nodira daftariga butunni topish yo'lini yozdi: «20% = 10, unda butun = 10 × 20 = 200». Ustoz daftarga qarab, bir qadamda xato borligini aytdi.",
    ask: 'Qaysi qadamda xato bor? Xato qadamni bosing:',
    steps: ['20% = 10', '10 × 20 = 200', 'butun = 200'],
    correct: "To'g'ri. Qismni foizga ko'paytirish xato. Butun = qism : foiz × 100 = 10 : 20 × 100 = 50.",
    wrong: "Qaysi qadamdagi amal butunni topish qoidasiga to'g'ri kelmaydi? Qismni foizga ko'paytirish to'g'rimi — har bir qadamni tekshiring.",
    rule: "Butun uchun: qism : foiz × 100 (foizga ko'paytirmang).",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Нодира записала в тетради путь поиска целого: «20% = 10, значит целое = 10 × 20 = 200». Учитель посмотрел и сказал, что в одном шаге ошибка.',
    ask: 'В каком шаге ошибка? Нажми на ошибочный шаг:',
    steps: ['20% = 10', '10 × 20 = 200', 'целое = 200'],
    correct: 'Верно. Умножать часть на процент нельзя. Целое = часть : процент × 100 = 10 : 20 × 100 = 50.',
    wrong: 'Какое действие в шагах не соответствует правилу поиска целого? Верно ли умножать часть на процент — проверь каждый шаг.',
    rule: 'Для целого: часть : процент × 100 (не умножай на процент).',
  },
};

export default function D32_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick }, correctAnswer: { idx: D07_CORRECT }, correct, meta: { tag: 'whole_error', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d32-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((step, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = '#4338ca'; bg = '#eef2ff'; }
          if (checked && on) { const ok = i === D07_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer', textAlign: 'left' }}>
              <span style={{ width: 24, height: 24, borderRadius: 999, background: '#e0e7ff', color: '#4338ca', fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ ...S.mono, fontSize: 19, fontWeight: 800, color: '#1f2430' }}>{step}</span>
            </button>
          );
        })}
      </div>
      {checked && fb?.correct && (
        <div className="d32-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0 0' }}>
          <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span>
          <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#1a7f43' }}>10 : 20 × 100 = 50</span>
        </div>
      )}
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
