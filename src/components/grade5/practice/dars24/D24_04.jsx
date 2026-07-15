// Dars24 · Amaliyot 04 — O'nlidan kasrga · 🟢 · tag: decimal_to_frac
// 0,9 → 9/10. Teskari yo'nalish: suratni raqamdan tanlab, maxrajni (10/100) belgilash.
// Setup usulni oshkor qilmaydi; wrong = turtki; qoida faqat to'g'ridan keyin.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d24-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
const PAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
function DigitPad({ onTap, disabled }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', maxWidth: 280, margin: '14px auto 0' }}>
      {PAD.map((d) => (
        <button key={d} type="button" disabled={disabled} onClick={() => onTap(d)} style={{ width: 46, height: 46, borderRadius: 11, border: '1.5px solid #cbd5e1', background: disabled ? '#f1f5f9' : '#fff', color: '#1f2430', fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", cursor: disabled ? 'default' : 'pointer' }}>{d}</button>
      ))}
    </div>
  );
}

const D04 = { num: 9, den: 10 }; // 0,9 = 9/10
const D04_T = {
  uz: {
    eyebrow: "Kasr ko'rinishi", setup: "Aziza 0,9 sonini oddiy kasr ko'rinishida yozmoqchi.",
    ask: "0,9 ni oddiy kasr ko'rinishida tuzing: suratni tanlang va mos maxrajni belgilang.",
    nlab: 'Surat', dlab: 'Maxraj',
    correct: "To'g'ri. 0,9 — bu 9 ta o'ndan, ya'ni 9/10.",
    wrong: "0,9 da verguldan keyin nechta raqam bor? Bu maxraj 10 mi yoki 100 mi — o'ylab ko'ring.",
    rule: "Bitta o'ndan xonasi → maxraj 10, surat esa o'sha raqam. 0,9 = 9/10.",
  },
  ru: {
    eyebrow: 'Вид дроби', setup: 'Азиза хочет записать число 0,9 обыкновенной дробью.',
    ask: 'Составьте из 0,9 обыкновенную дробь: выберите числитель и укажите знаменатель.',
    nlab: 'Числитель', dlab: 'Знаменатель',
    correct: 'Верно. 0,9 — это 9 десятых, то есть 9/10.',
    wrong: 'Сколько цифр после запятой в 0,9? Подумайте, знаменатель 10 или 100.',
    rule: 'Один разряд десятых → знаменатель 10, числитель — эта цифра. 0,9 = 9/10.',
  },
};

export default function D24_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [num, setNum] = useState(null);
  const [den, setDen] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const s = initialAnswer?.studentAnswer; if (s) { if (s.num != null) setNum(s.num); if (s.den != null) setDen(s.den); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  const full = num != null && den != null;
  useEffect(() => { onReady?.(full && !checked); }, [full, checked, onReady]);
  const locked = isReview || checked;
  const check = useCallback(() => {
    const correct = num === D04.num && den === D04.den;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { num, den }, correctAnswer: D04, correct, meta: { tag: 'decimal_to_frac', level: '🟢' } });
  }, [num, den, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const numBd = checked ? (num === D04.num ? '#1a7f43' : '#c0392b') : (num != null ? '#2563eb' : '#cbd5e1');
  const denBtn = (d) => {
    const on = den === d;
    let bd = '#cbd5e1', bg = '#fff', col = '#1f2430';
    if (on) { bd = '#2563eb'; bg = '#eaf0fe'; }
    if (checked && on) { const ok = d === D04.den; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button key={d} type="button" disabled={locked} onClick={() => setDen(d)} style={{ width: 60, height: 46, borderRadius: 11, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 22, fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>{d}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d24-pop { animation: d24pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d24pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d24-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '10px 0' }}>
        <span style={{ ...S.mono, fontSize: 34, fontWeight: 800, color: '#2563eb' }}>0,9</span>
        <span style={{ fontSize: 24, fontWeight: 800, color: '#94a3b8' }}>=</span>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 11.5, color: '#6b7280', fontWeight: 700 }}>{t.nlab}</span>
          <div style={{ width: 54, height: 46, borderRadius: 11, border: '2px solid ' + numBd, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 24, fontWeight: 800, color: '#1f2430' }}>{num != null ? num : '?'}</div>
          <div style={{ width: 60, height: 2.5, background: '#1f2430' }} />
          <div style={{ ...S.mono, fontSize: 25, fontWeight: 800, color: den != null ? '#1f2430' : '#94a3b8' }}>{den != null ? den : '?'}</div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '4px 0 0', textAlign: 'center' }}>{t.nlab}:</p>
      {!locked && <DigitPad onTap={(d) => setNum(d)} disabled={locked} />}
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '14px 0 6px', textAlign: 'center' }}>{t.dlab}:</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>{denBtn(10)}{denBtn(100)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
