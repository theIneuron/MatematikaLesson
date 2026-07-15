// Dars05 · Amaliyot 07 — Katta bo'lish · 🔴 · tag: long_div_input
// 6489 : 7 = 927 (qoldiq 0). Bo'linma katakchalarga.
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
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function D06_buildQ(dividend, divisor) {
  const digs = String(dividend).split('').map(Number);
  const q = []; let rem = 0;
  for (let i = 0; i < digs.length; i++) { const cur = rem * 10 + digs[i]; q.push(Math.floor(cur / divisor)); rem = cur % divisor; }
  return { digs, q, rem };
}

const D07_DIVIDEND = 6489, D07_DIVISOR = 7;
const D07_T = {
  uz: {
    eyebrow: "Katta bo'lish", setup: "6489 ni 7 ga burchak usulida bo'ling. Bo'linmaning har raqamini katakka yozing.",
    correct: "To'g'ri. 6489 : 7 = 927.",
    wrong: "Maslahat: eng chapdagi raqam bo'luvchi 7 dan kichik bo'lsa, bo'linmaning o'sha birinchi katagida qanday raqam turadi? So'ng uni qaysi raqam bilan birga qarash kerak?",
  },
  ru: {
    eyebrow: 'Большое деление', setup: 'Разделите 6489 на 7 уголком. Впишите каждую цифру частного в клетку.',
    correct: 'Верно. 6489 : 7 = 927.',
    wrong: 'Подсказка: если самая левая цифра меньше делителя 7, какая цифра встанет в первой клетке частного? С какой цифрой её тогда рассмотреть вместе?',
  },
};
export default function D05_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const { digs, q } = D06_buildQ(D07_DIVIDEND, D07_DIVISOR);
  const qStr = q.join(''); // '0927'
  const N = digs.length;
  const [qv, setQv] = useState(() => Array(N).fill(''));
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.q) { setQv(sa.q.slice(0, N)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer, N]);
  const filled = qv.every((x, i) => qStr[i] === '0' ? true : x !== '');
  useEffect(() => { onReady?.(filled && !checked); }, [filled, checked, onReady]);
  const last = (v) => String(v).replace(/[^0-9]/g, '').slice(-1);
  const check = useCallback(() => {
    const correct = qv.every((x, i) => (qStr[i] === '0' ? (x === '' || x === '0') : x === qStr[i]));
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: '6489 : 7', options: [], studentAnswer: { q: qv }, correctAnswer: { q: qStr }, correct, meta: { tag: 'long_div_input', level: '🔴' } });
  }, [qv, qStr, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const cw = 44;
  const cin = (i) => {
    const lead = qStr[i] === '0';
    const st = checked ? ((lead ? (qv[i] === '' || qv[i] === '0') : qv[i] === qStr[i]) ? 'ok' : 'no') : '';
    const c = st === 'ok' ? '#1a7f43' : st === 'no' ? '#c0392b' : '#93c5fd';
    const bg = st === 'ok' ? '#e8f7ee' : st === 'no' ? '#fdecec' : '#eff6ff';
    return { width: cw, height: 50, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 10, border: '2px solid ' + c, background: bg, color: st ? c : '#1e40af', outline: 'none', ...S.mono, boxSizing: 'border-box' };
  };
  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ ...S.mono, fontSize: 28, fontWeight: 800, paddingTop: 4 }}>{D07_DIVIDEND}</div>
          <div style={{ borderLeft: '3px solid #1f2430', borderBottom: '3px solid #1f2430', paddingLeft: 10, marginLeft: 6, paddingBottom: 6 }}>
            <div style={{ ...S.mono, fontSize: 28, fontWeight: 800, color: '#c2410c' }}>{D07_DIVISOR}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        <div style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#6b7280', alignSelf: 'center', marginRight: 4 }}>{lang === 'uz' ? "bo'linma:" : 'частное:'}</div>
        {Array.from({ length: N }).map((_, i) => (
          <input key={i} value={qv[i]} onChange={(e) => !checked && setQv((p) => { const n = p.slice(); n[i] = last(e.target.value); return n; })} inputMode="numeric" maxLength={1} disabled={isReview || checked} placeholder={qStr[i] === '0' ? '0' : ''} style={cin(i)} />
        ))}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
    </div>
  );
}
