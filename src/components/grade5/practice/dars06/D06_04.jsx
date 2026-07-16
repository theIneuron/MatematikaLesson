// Dars06 · Amaliyot 04 — Taqqoslash · 🟡 · compare_neg (belgi tanlash)
// -12 __ -9. Bola <, =, > belgisidan birini tanlaydi. Son o'qida ikkalasi ko'rsatiladi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const RuleChip = ({ text }) => (
  <div className="d6-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = '#fff', bd = '#d6dae3', col = '#374151';
  if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}

const D04_L = -12, D04_R = -9, D04_SIGN = '<'; // -12 < -9
const D04_T = {
  uz: {
    eyebrow: 'Taqqoslash', setup: "Ikki manfiy sonni taqqoslang.",
    ask: "Bo'sh joyga qaysi belgi to'g'ri keladi?",
    correct: "To'g'ri. -12 son o'qida -9 dan chapda, demak -12 < -9.",
    wrong: "Maslahat: manfiy sonlarda nolga yaqinrog'i kattaroq. Qaysi biri nolga yaqin?",
  },
  ru: {
    eyebrow: 'Сравнение', setup: 'Сравните два отрицательных числа.',
    ask: 'Какой знак верный?',
    correct: 'Верно. -12 левее -9 на оси, значит -12 < -9.',
    wrong: 'Подсказка: у отрицательных чисел больше то, что ближе к нулю. Какое из них ближе к нулю?',
  },
};
export default function D06_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const SIGNS = ['<', '=', '>'];
  useEffect(() => { if (initialAnswer?.studentAnswer?.sign != null) { setPick(initialAnswer.studentAnswer.sign); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setShow(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = SIGNS[pick] === D04_SIGN;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setShow(true), 350);
    onSubmit?.({ questionText: `${D04_L} __ ${D04_R}`, options: SIGNS.map((s, i) => ({ id: String(i), label: s })), studentAnswer: { sign: pick, label: SIGNS[pick] }, correctAnswer: { label: D04_SIGN }, correct, meta: { tag: 'compare_neg', level: '🟡' } });
  }, [pick, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  // mini son o'qi -6..0
  const nums = [-13,-12,-11,-10,-9,-8,-7,-6,0];
  return (
    <div style={S.wrap}>
      <style>{`
        .d6-pop { animation: d6pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d6pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d6-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* mini son o'qi to'g'ri javobdan keyin */}
      <div style={{ maxHeight: show ? 70 : 0, opacity: show ? 1 : 0, overflow: 'hidden', transition: 'max-height .5s ease, opacity .5s ease' }}>
        <div style={{ position: 'relative', height: 54, margin: '8px 12px 0' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 22, height: 3, background: '#cbd5e1', borderRadius: 2 }} />
          {nums.map((v, i) => {
            const hl = v === D04_L || v === D04_R;
            const c = v === D04_R ? '#1a7f43' : v === D04_L ? '#c0392b' : '#94a3b8';
            return (
              <div key={v} style={{ position: 'absolute', left: (i / (nums.length - 1) * 100) + '%', top: 12, transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ width: hl ? 15 : 9, height: hl ? 15 : 9, borderRadius: 999, background: hl ? c : '#cbd5e1', margin: '0 auto' }} />
                <div style={{ marginTop: 4, fontSize: 11, fontWeight: 800, color: c, ...S.mono }}>{v}</div>
              </div>
            );
          })}
        </div>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '8px 0 14px' }}>
        <span style={{ ...S.mono, fontSize: 34, fontWeight: 800, color: '#c0392b' }}>{D04_L}</span>
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: pick != null ? '#fe5b1a' : '#cbd5e1', minWidth: 40, textAlign: 'center' }}>{pick != null ? SIGNS[pick] : '?'}</span>
        <span style={{ ...S.mono, fontSize: 34, fontWeight: 800, color: '#1a7f43' }}>{D04_R}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {SIGNS.map((s, i) => <button key={i} type="button" style={{ ...optStyle(pick, i, 0, false, isReview, { center: true, mono: true }), width: 74, marginBottom: 0, fontSize: 26, ...(checked && pick === i ? { borderColor: SIGNS[i] === D04_SIGN ? '#1a7f43' : '#c0392b', background: SIGNS[i] === D04_SIGN ? '#e8f7ee' : '#fdecec', color: SIGNS[i] === D04_SIGN ? '#1a7f43' : '#c0392b' } : {}) }} disabled={isReview || checked} onClick={() => setPick(i)}>{s}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
