// Dars32 · Amaliyot 01 — Xazina xaritasi · 🟢 · tag: whole_basic
// 20% = 10 katak → butun = 10 : 20 × 100 = 50. Vizual: katak-to'r (fragment → butun 50 katak, reveal).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#b45309', background: '#fff7ed', border: '1px solid #fed7aa', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
function Cell({ found }) {
  return <div style={{ width: 22, height: 22, borderRadius: 5, background: found ? '#f97316' : '#fed7aa', border: '1.5px solid ' + (found ? '#c2410c' : '#fdba74') }} />;
}

const D01_OPTS = ['50', '30', '2', '100'];
const D01_CORRECT = 0;
const D01_T = {
  uz: {
    eyebrow: 'Butunni top', setup: "Oybek tokchadan eski xazina xaritasini topdi, ammo uning faqat bir parchasi saqlanib qolgan. Bu parcha butun xaritaning 20% i — unda 10 ta katak bor.",
    ask: "Butun xaritada nechta katak bo'lgan?",
    correct: "To'g'ri. 20% = 10 katak. 20% ni 5 marta olsak 100% bo'ladi: 10 × 5 = 50 katak.",
    wrong: "20% ni necha marta olsak 100% bo'ladi? Qismni ham xuddi shuncha marta oling.",
    rule: "Butun = qism : foiz × 100.",
  },
  ru: {
    eyebrow: 'Найди целое', setup: 'Ойбек нашёл на полке старую карту клада, но сохранился только её обрывок. Этот обрывок — 20% всей карты, в нём 10 клеток.',
    ask: 'Сколько клеток было на всей карте?',
    correct: 'Верно. 20% = 10 клеток. Если взять 20% пять раз — получится 100%: 10 × 5 = 50 клеток.',
    wrong: 'Сколько раз нужно взять 20%, чтобы получить 100%? Возьми часть столько же раз.',
    rule: 'Целое = часть : процент × 100.',
  },
};

export default function D32_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D01_OPTS.map((o, i) => ({ id: String(i), label: o })), studentAnswer: { idx: pick }, correctAnswer: { idx: D01_CORRECT }, correct, meta: { tag: 'whole_basic', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const reveal = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d32-grid { animation: d32in .55s ease both; }
        @keyframes d32in { 0% { opacity: 0; transform: translateY(8px) scale(.9); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d32-pop, .d32-grid { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '8px 0 4px', padding: '12px 10px', borderRadius: 14, background: '#fffbeb', border: '1.5px solid #fde68a' }}>
        {reveal ? (
          <div className="d32-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 22px)', gap: 4 }}>
              {Array.from({ length: 50 }).map((_, i) => <Cell key={i} found={i < 10} />)}
            </div>
            <div style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#b45309' }}>100% = 50 katak</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 22px)', gap: 4 }}>
              {Array.from({ length: 10 }).map((_, i) => <Cell key={i} found />)}
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#b45309' }}>{lang === 'uz' ? "topilgan parcha · 20%" : 'обрывок · 20%'}</div>
          </div>
        )}
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '8px 0' }}>
        {D01_OPTS.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff';
          if (on) { bd = '#c2410c'; bg = '#fff7ed'; }
          if (checked && on) { const ok = i === D01_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; }
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
