// Dars32 · Amaliyot 10 — Qaysi butun · 🔴 · tag: whole_mcq
// 30% = 60 → 1% = 60 : 30 = 2 → butun = 2 × 100 = 200. Chalg'ituvchi 180 (60×3), 90, 20.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#a21caf', background: '#fdf4ff', border: '1px solid #f5d0fe', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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

const D10_OPTS = ['200', '180', '90', '20'];
const D10_CORRECT = 0;
const D10_T = {
  uz: {
    eyebrow: 'Qaysi butun', setup: "Rustam qalin bir sarguzasht kitobini o'qiyapti. U kitobning 30% ini o'qib tugatdi — bu 60 bet bo'ldi. Endi butun kitob nechta bet ekanini topmoqchi.",
    ask: 'Butun kitob nechta bet? Butunni tanlang:',
    correct: "To'g'ri. 1% = 60 : 30 = 2. Butun = 2 × 100 = 200 bet.",
    wrong: "Berilgan qism — necha foizga to'g'ri keladi? Undan 100% (butun) ga qanday o'tasiz?",
    rule: "Butun = qism : foiz × 100.",
  },
  ru: {
    eyebrow: 'Какое целое', setup: 'Рустам читает толстую приключенческую книгу. Он прочитал 30% книги — это 60 страниц. Теперь он хочет узнать, сколько страниц во всей книге.',
    ask: 'Сколько страниц во всей книге? Выбери целое:',
    correct: 'Верно. 1% = 60 : 30 = 2. Целое = 2 × 100 = 200 страниц.',
    wrong: 'Данная часть — это сколько процентов? Как от неё перейти к 100% (целому)?',
    rule: 'Целое = часть : процент × 100.',
  },
};

export default function D32_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((o, i) => ({ id: String(i), label: o })), studentAnswer: { idx: pick }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'whole_mcq', level: '🔴' } });
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
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '10px 0 4px' }}>
        <span style={{ padding: '8px 14px', borderRadius: 12, background: '#fdf4ff', border: '2px solid #f5d0fe', ...S.mono, fontSize: 17, fontWeight: 800, color: '#a21caf' }}>30% = 60</span>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '8px 0' }}>
        {D10_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = '#a21caf'; bg = '#fdf4ff'; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ padding: '14px 10px', borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer', ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>{o}</button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
