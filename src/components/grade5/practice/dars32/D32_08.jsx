// Dars32 · Amaliyot 08 — Sinf masalasi · 🔴 · tag: whole_word
// 40% = 10 → 1% = 10 : 40 = 0,25 → butun = 0,25 × 100 = 25. Qismdan butunga.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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

const D08_ANS = 25;
const D08_T = {
  uz: {
    eyebrow: 'Masala', setup: "Dilnoza sinfida matematika to'garagiga o'quvchilarning 40% i yozildi. Ro'yxatga qaragan Dilnoza u yerda 10 nafar o'quvchi borligini ko'rdi va butun sinfda nechta o'quvchi borligini hisoblamoqchi bo'ldi.",
    ask: "Sinfda jami nechta o'quvchi bor?", label: 'jami:',
    correct: "To'g'ri. 40% = 10 → 1% = 10 : 40 = 0,25 → butun = 0,25 × 100 = 25 o'quvchi.",
    wrong: "Berilgan qism — necha foizga to'g'ri keladi? Undan 100% (butun) ga qanday o'tasiz?",
    rule: "Qismdan butunga: qism : foiz × 100.",
  },
  ru: {
    eyebrow: 'Задача', setup: 'В классе Дилнозы на математический кружок записались 40% учеников. Заглянув в список, Дилноза увидела там 10 учеников и захотела посчитать, сколько всего учеников в классе.',
    ask: 'Сколько всего учеников в классе?', label: 'всего:',
    correct: 'Верно. 40% = 10 → 1% = 10 : 40 = 0,25 → целое = 0,25 × 100 = 25 учеников.',
    wrong: 'Данная часть — это сколько процентов? Как от неё перейти к 100% (целому)?',
    rule: 'От части к целому: часть : процент × 100.',
  },
};

export default function D32_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'whole_word', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : '#15803d';
  const reveal = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d32-grow { transform-box: fill-box; transform-origin: left; animation: d32grow .55s ease both; }
        @keyframes d32grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .d32-pop, .d32-grow { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {reveal ? (
        <div className="d32-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '8px 0 4px' }}>
          <div style={{ display: 'flex', width: 250, height: 34, borderRadius: 9, overflow: 'hidden', border: '2px solid #bbf7d0' }}>
            <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#22c55e', color: '#fff', ...S.mono, fontSize: 13, fontWeight: 800 }}>10</div>
            <div className="d32-grow" style={{ width: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#bbf7d0', color: '#15803d', ...S.mono, fontSize: 13, fontWeight: 800 }}>+15</div>
          </div>
          <div style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#15803d' }}>100% = 25</div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '10px 0 6px' }}>
          <span style={{ padding: '8px 14px', borderRadius: 12, background: '#f0fdf4', border: '2px solid #bbf7d0', ...S.mono, fontSize: 17, fontWeight: 800, color: '#15803d' }}>40% = 10</span>
        </div>
      )}
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
