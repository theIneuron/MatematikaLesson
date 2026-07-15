// Dars31 · Amaliyot 03 — 80 ning 25% i · 🟢 · tag: of_quarter
// "80 ning 25% i 20 ga tengmi?" → Ha. Vizual: 4 bo'lakli chorak-lenta. Rang: teal pill.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { dark: '#0f766e', light: '#f0fdfa', mid: '#99f6e4', fill: '#14b8a6', faint: '#eefdfb', soft: '#5eead4', muted: '#4a8f88' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.light, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 16, fontWeight: 700, margin: '14px 0 12px' },
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
function QuarterBar({ run }) {
  const w = 288, h = 44;
  const cell = (w - 4) / 4;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', maxWidth: '100%', margin: '12px auto 4px' }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="6" fill={C.faint} stroke={C.soft} strokeWidth="1.5" />
      {run && <rect className="d31-pop" x="2" y="2" width={cell} height={h - 4} rx="5" fill={C.fill} />}
      {[1, 2, 3].map((i) => <line key={i} x1={2 + cell * i} y1="2" x2={2 + cell * i} y2={h - 2} stroke={C.soft} strokeWidth="1.5" />)}
      {run && [0, 1, 2, 3].map((i) => <text key={i} x={2 + cell * i + cell / 2} y={h / 2 + 5} textAnchor="middle" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800 }} fill={i === 0 ? '#fff' : C.muted}>20</text>)}
    </svg>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: 'Chorak', setup: "Bog'da 80 tup atirgul bor. Zaynab ularning 25% ini sug'ordi.",
    ask: '80 ning 25% i 20 ga tengmi?', yes: 'Ha', no: "Yo'q",
    correct: "To'g'ri. 25% — chorak: 80 : 4 = 20.",
    wrong: "25% — bu chorak. Butunni nechaga bo'lsangiz bitta chorak chiqadi?",
    rule: "25% = chorak (: 4).",
  },
  ru: {
    eyebrow: 'Четверть', setup: 'В саду 80 кустов роз. Зайнаб полила 25% из них.',
    ask: '25% от 80 равно 20?', yes: 'Да', no: 'Нет',
    correct: 'Верно. 25% — это четверть: 80 : 4 = 20.',
    wrong: '25% — это четверть. На сколько разделить целое, чтобы получить одну четверть?',
    rule: '25% = четверть (: 4).',
  },
};

export default function D31_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D03_T[lang] || D03_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.pick != null) { setPick(initialAnswer.studentAnswer.pick); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = pick === D03_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'of_quarter', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (val, label) => {
    const on = pick === val;
    let bd = C.mid, bg = '#fff', col = '#374151';
    if (on) { bd = C.fill; bg = C.light; col = '#1f2430'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d31-pop { animation: d31pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d31pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d31-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <QuarterBar run={checked && fb?.correct} />
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
