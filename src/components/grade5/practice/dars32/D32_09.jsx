// Dars32 · Amaliyot 09 — Qaysi bog'da ko'proq · 🔴 · tag: whole_compare
// Anvar 50% = 20 kg → butun 40; Bekzod 20% = 12 kg → butun 60. Bekzodniki kattaroq.
// Markaziy xato: "ko'proq terilgan / katta foiz → kattaroq butun". Ikkala butunni hisoblab solishtirish shart.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#0e7490', background: '#ecfeff', border: '1px solid #a5f3fc', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
// Bog' kartochkasi: savat + terilgan foiz va qism (butunni oshkor qilmaydi)
function GardenCard({ name, pct, part, active, state }) {
  let bd = '#cbd5e1', bg = '#fff';
  if (state === 'ok') { bd = '#1a7f43'; bg = '#e8f7ee'; }
  else if (state === 'no') { bd = '#c0392b'; bg = '#fdecec'; }
  else if (active) { bd = '#0e7490'; bg = '#ecfeff'; }
  return (
    <div style={{ width: 150, borderRadius: 16, border: '2px solid ' + bd, background: bg, padding: '10px 8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 14, fontWeight: 800, color: '#0e7490' }}>{name}</span>
      <svg width="76" height="52" viewBox="0 0 76 52" style={{ display: 'block' }}>
        <path d="M14 18 L62 18 L56 46 Q55 50 50 50 L26 50 Q21 50 20 46 Z" fill="#fde68a" stroke="#b45309" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="30" cy="28" r="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />
        <circle cx="46" cy="28" r="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />
        <circle cx="38" cy="38" r="7" fill="#f87171" stroke="#b91c1c" strokeWidth="1.2" />
        <line x1="14" y1="18" x2="62" y2="18" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#0e7490' }}>{pct}% = {part}</span>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b' }}>terilgan</span>
    </div>
  );
}

const D09_CORRECT = 1; // 0=Anvar, 1=Bekzod, 2=teng
const D09_T = {
  uz: {
    eyebrow: "Qaysi bog'da ko'proq", setup: "Ikki bog'bon olma terdi. Anvar o'z bog'idagi olmaning 50% ini — 20 kg terdi. Bekzod esa o'z bog'idagi olmaning 20% ini — 12 kg terdi.",
    ask: "Qaysi bog'da jami olma ko'proq?",
    A: 'Anvar', B: 'Bekzod',
    opts: ["Anvar bog'ida", "Bekzod bog'ida", 'Teng'],
    correct: "To'g'ri. Anvar: 20 : 50 × 100 = 40 kg. Bekzod: 12 : 20 × 100 = 60 kg. Ko'proq terilgani butun ko'proq degani emas.",
    wrong: "Ko'proq terilgani yoki katta foiz doim kattaroq butun degani emas. Har bir bog'ning butunini alohida hisoblang (qism : foiz × 100), keyin solishtiring.",
    rule: "Butunni hisoblamasdan solishtirib bo'lmaydi: qism : foiz × 100.",
  },
  ru: {
    eyebrow: 'Где яблок больше', setup: 'Два садовника собирали яблоки. Анвар собрал 50% яблок своего сада — 20 кг. А Бекзод собрал 20% яблок своего сада — 12 кг.',
    ask: 'В каком саду яблок больше?',
    A: 'Анвар', B: 'Бекзод',
    opts: ['В саду Анвара', 'В саду Бекзода', 'Поровну'],
    correct: 'Верно. Анвар: 20 : 50 × 100 = 40 кг. Бекзод: 12 : 20 × 100 = 60 кг. Кто собрал больше — не значит, что целое больше.',
    wrong: 'Кто собрал больше или у кого процент выше — не всегда больше целое. Посчитай целое каждого сада отдельно (часть : процент × 100), потом сравни.',
    rule: 'Нельзя сравнить, не посчитав целое: часть : процент × 100.',
  },
};

export default function D32_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPick(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D09_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: pick, label: t.opts[pick] }, correctAnswer: { idx: D09_CORRECT }, correct, meta: { tag: 'whole_compare', level: '🔴' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const reveal = checked && fb?.correct;
  // kartochka holati: to'g'ri javobdan keyin faqat to'g'ri bog' (Bekzod) yashil; xato javobda hech biri yashil emas
  const cardState = (idx) => {
    if (!checked) return null;
    if (fb?.correct) return idx === D09_CORRECT ? 'ok' : null;
    return idx === pick ? 'no' : null;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d32-pop { animation: d32pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d32pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d32-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '10px 0 6px' }}>
        <GardenCard name={t.A} pct={50} part="20 kg" active={pick === 0} state={cardState(0)} />
        <GardenCard name={t.B} pct={20} part="12 kg" active={pick === 1} state={cardState(1)} />
      </div>
      {reveal && <div className="d32-pop" style={{ ...S.mono, textAlign: 'center', fontSize: 14.5, fontWeight: 800, color: '#0e7490', margin: '4px 0' }}>Anvar: 40 kg &nbsp;·&nbsp; Bekzod: 60 kg</div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        {t.opts.map((o, i) => {
          const on = pick === i;
          let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
          if (on) { bd = '#0e7490'; bg = '#ecfeff'; }
          if (checked && on) { const ok = i === D09_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPick(i)} style={{ flex: 1, minHeight: 52, padding: '10px 6px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
