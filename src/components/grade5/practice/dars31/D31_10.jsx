// Dars31 · Amaliyot 10 — Qaysi ko'proq · 🔴 · tag: of_compare
// "80 ning 25% i yoki 60 ning 30% i qaysi ko'proq?" 80:4=20; 60:100×30=18. 20 > 18 → birinchisi.
// Vizual: taqqoslash ustunlari (bar) faqat to'g'ri javobdan keyin. Rang: pink pill.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { dark: '#be185d', light: '#fdf2f8', mid: '#f9a8d4', fill: '#db2777', muted: '#9d5675' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.light, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d31-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Taqqoslash ustunlari — to'g'ri javobdan keyin: 20 vs 18.
function CompareBars() {
  const bar = (label, v, win) => {
    const hpx = Math.round(28 + v * 3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: win ? '#1a7f43' : C.muted }}>{v}</span>
        <div style={{ width: 46, height: hpx, borderRadius: '8px 8px 4px 4px', background: win ? '#1a7f43' : C.fill, transition: 'height .5s ease' }} />
        <span style={{ ...S.mono, fontSize: 12.5, fontWeight: 700, color: '#6b7280' }}>{label}</span>
      </div>
    );
  };
  return (
    <div className="d31-pop" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 28, margin: '10px 0 2px', padding: '10px 0' }}>
      {bar('25% · 80', 20, true)}
      {bar('30% · 60', 18, false)}
    </div>
  );
}

const D10_CORRECT = 0;
const D10_T = {
  uz: {
    eyebrow: "Qaysi ko'proq", setup: "Ikki savat mevaga chegirma. Birinchisida 80 tadan 25%, ikkinchisida 60 tadan 30%.",
    ask: "Qaysi ulush ko'proq?",
    opts: ["80 ning 25% i", "60 ning 30% i", "Teng"],
    correct: "To'g'ri. 80 : 4 = 20; 60 : 100 × 30 = 18. 20 > 18.",
    wrong: "Faqat foizga qarab bo'lmaydi — butun sonlar har xil. Qaysi savatning ulushi aslida kattaroq?",
    rule: "Katta foiz har doim katta miqdor bermaydi — butun ham muhim.",
  },
  ru: {
    eyebrow: 'Что больше', setup: 'Скидка на две корзины фруктов. В первой 25% от 80, во второй 30% от 60.',
    ask: 'Какая доля больше?',
    opts: ['25% от 80', '30% от 60', 'Поровну'],
    correct: 'Верно. 80 : 4 = 20; 60 : 100 × 30 = 18. 20 > 18.',
    wrong: 'Нельзя судить только по проценту — целые числа разные. Чья доля на самом деле больше?',
    rule: 'Больший процент не всегда даёт больше — важно и само число.',
  },
};

export default function D31_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'of_compare', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d31-pop { animation: d31pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d31pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d31-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed ? (
        <CompareBars />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '8px 0 4px' }}>
          <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: C.dark, background: C.light, border: '1.5px solid ' + C.mid, borderRadius: 10, padding: '8px 12px' }}>25% · 80</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#9ca3af' }}>?</span>
          <span style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: C.dark, background: C.light, border: '1.5px solid ' + C.mid, borderRadius: 10, padding: '8px 12px' }}>30% · 60</span>
        </div>
      )}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = C.mid, bg = '#fff', col = '#1f2430';
          if (on) { bd = C.fill; bg = C.light; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
