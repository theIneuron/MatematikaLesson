// Dars31 · Amaliyot 04 — Chegirma miqdori · 🟡 · tag: of_discount_amount
// "Smartfon 1200 so'm. Chegirma 20%. Qancha arzonlashadi?" → 240. Vizual: narx yorlig'i (tag).
// Rang: blue pill. Chizma narxni ko'rsatadi (masala sharti); miqdor faqat to'g'ri javobdan keyin.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { dark: '#e24e12', light: '#fff4ee', mid: '#ffd6bd', fill: '#fb7233', faint: '#f5f9ff', soft: '#ffb488', muted: '#5878b5' };
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
function useCountUp(target, run, dur = 850) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) { setN(0); return; }
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(target); return; }
    let raf, start = null;
    const step = (ts) => { if (start == null) start = ts; const p = Math.min(1, (ts - start) / dur); setN(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return n;
}
// Narx yorlig'i: 1200 so'm, −20% tasma. To'g'ri javobdan keyin chegirma miqdori sanaladi.
function PriceTag({ run }) {
  const shown = useCountUp(240, run, 850);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '10px 0 4px' }}>
      <svg width="150" height="70" viewBox="0 0 150 70" style={{ display: 'block' }}>
        <path d="M28 6 L142 6 Q148 6 148 12 L148 58 Q148 64 142 64 L28 64 L6 35 Z" fill={C.faint} stroke={C.soft} strokeWidth="2" />
        <circle cx="24" cy="35" r="5" fill="#fff" stroke={C.soft} strokeWidth="2" />
        <text x="86" y="42" textAnchor="middle" style={{ ...S.mono, fontSize: 22, fontWeight: 800 }} fill={C.dark}>1200</text>
      </svg>
      <span style={{ fontSize: 13, fontWeight: 800, color: C.dark, background: C.light, border: '1px solid ' + C.mid, borderRadius: 8, padding: '4px 10px' }}>−20%</span>
      {run && <div className="d31-pop" style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: C.dark }}>−{shown}</div>}
    </div>
  );
}

const D04_ANS = 240;
const D04_T = {
  uz: {
    eyebrow: 'Chegirma', setup: "Smartfon narxi 1200 so'm. Do'kon 20% chegirma e'lon qildi.",
    ask: 'Qancha ARZONLASHADI (chegirma miqdori)?', label: "so'm:",
    correct: "To'g'ri. 1200 : 100 = 12, 12 × 20 = 240.",
    wrong: "Arzonlashuv — 1200 ning 20% i. Sonning 1% i qancha — undan kerakli foizga qanday o'tasiz?",
    rule: "Chegirma miqdori = narx × foiz : 100.",
  },
  ru: {
    eyebrow: 'Скидка', setup: 'Цена смартфона 1200 сум. Магазин объявил скидку 20%.',
    ask: 'На сколько СНИЗИТСЯ цена (величина скидки)?', label: 'сум:',
    correct: 'Верно. 1200 : 100 = 12, 12 × 20 = 240.',
    wrong: 'Скидка — 20% от 1200. Сколько 1% от числа — и как перейти к нужному проценту?',
    rule: 'Величина скидки = цена × процент : 100.',
  },
};

export default function D31_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(/^\d+$/.test(val.trim()) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = parseInt(val, 10) === D04_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: parseInt(val, 10) }, correctAnswer: { value: D04_ANS }, correct, meta: { tag: 'of_discount_amount', level: '🟡' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : C.fill;
  return (
    <div style={S.wrap}>
      <style>{`
        .d31-pop { animation: d31pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d31pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d31-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <PriceTag run={checked && fb?.correct} />
      <p style={S.ask}>{t.ask}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '0 0 6px', textAlign: 'center' }}>{t.label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, '').slice(0, 5))} disabled={isReview || checked} inputMode="numeric" placeholder="0" style={{ width: 120, height: 52, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
