// Dars14 · Amaliyot 08 — Xatoni top · 🔴 · find_wrong (variant)
// 4 solishtirishdan biri noto'g'ri. 3/5 > 2/3 NOTO'G'RI (aslida <).
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
  <div className="d14-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D08_ROWS = [
  { txt: '3/8 < 5/8', ok: true },
  { txt: '1/2 > 1/3', ok: true },
  { txt: '3/5 > 2/3', ok: false }, // NOTO'G'RI
  { txt: '2/3 < 3/4', ok: true },
];
const D08_CORRECT = 2;
const D08_T = {
  uz: {
    eyebrow: 'Xatoni toping', setup: "To'rtta solishtirishdan uchtasi to'g'ri, bittasi — yo'q.",
    ask: "Qaysi solishtirish NOTO'G'RI?",
    correct: "To'g'ri. 3/5 va 2/3 ni 15 ulushga keltirsak: 9/15 < 10/15. Demak 3/5 < 2/3, yozilgani noto'g'ri.",
    wrong: "Maslahat: har bir yozuvni alohida tekshir — kasrlarni bir xil ulushga keltirib solishtiring. Katta surat har doim katta kasrni bildiradimi?",
    rule: "Suratni maxrajsiz solishtirish xato. 3 > 2 bo'lsa ham, 3/5 < 2/3.",
  },
  ru: {
    eyebrow: 'Найдите ошибку', setup: 'Из четырёх сравнений три верны, одно — нет.',
    ask: 'Какое сравнение НЕВЕРНО?',
    correct: 'Верно. 3/5 и 2/3 к 15 долям: 9/15 < 10/15. Значит 3/5 < 2/3, запись неверна.',
    wrong: 'Подсказка: проверь каждую запись отдельно — приведи дроби к одинаковым долям и сравни. Всегда ли больший числитель означает большую дробь?',
    rule: 'Сравнивать числители без знаменателей — ошибка. Хоть 3 > 2, но 3/5 < 2/3.',
  },
};
export default function D14_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D08_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D08_ROWS.map((r, i) => ({ id: String(i), label: r.txt })), studentAnswer: { idx: picked }, correctAnswer: { idx: 2 }, correct, meta: { tag: 'find_wrong', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d14-pop { animation: d14pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d14pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d14-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {D08_ROWS.map((r, i) => {
          const on = picked === i;
          let bd = '#e2e8f0', bg = '#fff', col = '#334155';
          if (on) { bd = '#93c5fd', bg = '#f0f6ff', col = '#1e40af'; }
          if (checked && on) { const ok = i === D08_CORRECT; bd = ok ? '#86efac' : '#fca5a5'; bg = ok ? '#f0fdf4' : '#fef2f2'; col = ok ? '#15803d' : '#b91c1c'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ ...S.mono, fontSize: 20, fontWeight: 800, padding: '14px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', textAlign: 'center', minHeight: 52 }}>{r.txt}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
