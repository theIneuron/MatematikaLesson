// Dars27 · Amaliyot 06 — Ha yoki yo'q · 🟡 · tag: shift_yesno
// 0,3 × 100 = 30. To'g'rimi? Ha. Kerak bo'lsa nol bilan to'ldir: 0,3 = 0,30 → 30.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#6d28d9', textTransform: 'uppercase' },
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
  <div className="d27-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const D27STYLE = `
  .d27-pop { animation: d27pop .6s cubic-bezier(.34,1.4,.64,1) both; }
  @keyframes d27pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
  .d27-s2 { animation: d27pop .6s cubic-bezier(.34,1.4,.64,1) .35s both; }
  @media (prefers-reduced-motion: reduce) { .d27-pop,.d27-s2 { animation: none !important; } }
`;

const D06_ANS = true;
const D06_T = {
  uz: {
    eyebrow: "To'g'rimi?", setup: "Bekzod shunday yozdi: 0,3 × 100 = 30.",
    ask: "Bu tenglik to'g'rimi?", yes: "Ha, to'g'ri", no: "Yo'q, xato",
    correct: "Ha, to'g'ri. 0,3 = 0,30, vergul 2 o'ngga: 0,30 → 30. Demak 0,3 × 100 = 30.",
    wrong: "Vergulni surishga o'nlik xona yetmasa, bo'sh o'ringa qanday raqam yozish mumkin? 0,3 ga shu tomondan qarang.",
    rule: "Yetmasa nol bilan to'ldiring: 0,3 = 0,30, keyin vergulni suring.",
  },
  ru: {
    eyebrow: 'Верно ли?', setup: 'Бекзод написал: 0,3 × 100 = 30.',
    ask: 'Это равенство верное?', yes: 'Да, верно', no: 'Нет, ошибка',
    correct: 'Да, верно. 0,3 = 0,30, запятая на 2 вправо: 0,30 → 30. Значит 0,3 × 100 = 30.',
    wrong: 'Если для сдвига запятой не хватает разряда, какую цифру можно записать на пустое место? Посмотри на 0,3 с этой стороны.',
    rule: 'Если не хватает — дополни нулём: 0,3 = 0,30, затем сдвинь запятую.',
  },
};

export default function D27_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.pick != null) { setPick(initialAnswer.studentAnswer.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D06_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D06_ANS }, correct, meta: { tag: 'shift_yesno', level: '🟡' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#6d28d9'; bg = '#f3edfe'; col = '#1f2430'; }
    if (checked && on) { const ok = val === D06_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{D27STYLE}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0', padding: '12px', borderRadius: 12, background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>0,3 × 100 = 30</span>
      </div>
      {checked && fb?.correct && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '4px 0 8px' }}>
          <span className="d27-pop" style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#6d28d9', background: '#f3edfe', borderRadius: 8, padding: '4px 8px' }}>0,3 = 0,30</span>
          <span className="d27-s2" style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#94a3b8' }}>→</span>
          <span className="d27-s2" style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1a7f43', background: '#e8f7ee', borderRadius: 8, padding: '4px 8px' }}>30</span>
        </div>
      )}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
