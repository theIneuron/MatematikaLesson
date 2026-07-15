// Dars32 · Amaliyot 06 — Devor kafeli · 🟡 · tag: whole_assemble
// 25% = 15 kafel → butun = 15 × 4 = 60. NAQSH E: mexanik "bo'lak yig'ish" o'rniga o'quvchi butunni O'ZI hisoblab kiritadi.
// Reveal: 4 ta 25% bo'lak (15) yig'ilib butun (60) hosil qiladi.
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
  <div className="d32-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D06_ANS = 60;
const D06_T = {
  uz: {
    eyebrow: 'Masala', setup: "Bekzod hovli devoriga kafel teryapti. U devorning 25% ini terib bo'ldi — bunga 15 ta kafel ketdi. Endi butun devorni qoplash uchun jami qancha kafel kerakligini bilmoqchi.",
    ask: "Butun devor uchun jami nechta kafel kerak bo'ladi?", label: 'butun:',
    correct: "To'g'ri. 25% ni 4 marta olsak 100% bo'ladi: butun = 15 × 4 = 60 kafel.",
    wrong: "25% dan nechta bo'lak 100% ni to'ldiradi? Qismni ham xuddi shuncha marta oling.",
    rule: "Butun = qism : foiz × 100.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'Бекзод кладёт плитку на стену во дворе. Он выложил 25% стены — на это ушло 15 плиток. Теперь он хочет узнать, сколько всего плиток нужно, чтобы покрыть всю стену.',
    ask: 'Сколько всего плиток нужно на всю стену?', label: 'целое:',
    correct: 'Верно. Если взять 25% четыре раза — получится 100%: целое = 15 × 4 = 60 плиток.',
    wrong: 'Сколько частей по 25% заполнят 100%? Возьми часть столько же раз.',
    rule: 'Целое = часть : процент × 100.',
  },
};

export default function D32_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D06_ANS }, correct, meta: { tag: 'whole_assemble', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#dc2626';
  const reveal = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d32-blk { animation: d32in .5s ease both; }
        @keyframes d32in { 0% { opacity: 0; transform: translateY(10px) scale(.8); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d32-pop, .d32-blk { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ minHeight: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '8px 0 4px' }}>
        {reveal ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="d32-blk" style={{ animationDelay: (i * 0.3) + 's', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 62, height: 56, borderRadius: 10, background: '#fecaca', border: '2px solid #f87171' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#b91c1c' }}>25%</span>
                  <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#7f1d1d' }}>15</span>
                </div>
              ))}
            </div>
            <div className="d32-pop" style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>100% = 60 kafel</div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 66, height: 58, borderRadius: 10, background: '#fecaca', border: '2px solid #f87171' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#b91c1c' }}>25%</span>
              <span style={{ ...S.mono, fontSize: 19, fontWeight: 800, color: '#7f1d1d' }}>15</span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#dc2626' }}>{lang === 'uz' ? "terilgan qism · 25%" : 'выложено · 25%'}</div>
          </div>
        )}
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 90, height: 52, textAlign: 'center', fontSize: 28, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
