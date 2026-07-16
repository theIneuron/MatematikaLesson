// Dars07 · Amaliyot 05 — Nol qayerda · 🟡 · zero_rule (o'q + belgi)
// 0 __ -3. Nol har qanday manfiydan katta. <,>,= tanlaydi.
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
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d7-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
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

const D05_L = 0, D05_R = -3, D05_SIGN = '>';
const D05_T = {
  uz: {
    eyebrow: 'Nol qoidasi', setup: "Nol — musbat va manfiy sonlar chegarasi.",
    ask: "Qaysi belgi to'g'ri?",
    correct: "To'g'ri. Nol har qanday manfiy sondan katta: 0 > -3.",
    wrong: "Maslahat: son o'qida nol -3 dan o'ngda. O'ngdagi son kattaroq.",
    rule: "Nol har qanday manfiy sondan katta, har qanday musbatdan kichik.",
  },
  ru: {
    eyebrow: 'Правило нуля', setup: 'Ноль — граница между положительными и отрицательными.',
    ask: 'Какой знак верный?',
    correct: 'Верно. Ноль больше любого отрицательного: 0 > -3.',
    wrong: 'Подсказка: на оси ноль правее -3. Правое число больше.',
    rule: 'Ноль больше любого отрицательного и меньше любого положительного.',
  },
};
export default function D07_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D05_T[lang] || D05_T.uz;
  const isReview = mode === 'review';
  const [pick, setPick] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);
  const timer = useRef(null);
  const SIGNS = ['<', '=', '>'];
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.sign != null) { setPick(initialAnswer.studentAnswer.sign); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setShow(!!initialAnswer.correct); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(pick != null && !checked); }, [pick, checked, onReady]);
  const check = useCallback(() => {
    const correct = SIGNS[pick] === D05_SIGN;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setShow(true), 350);
    onSubmit?.({ questionText: `${D05_L} __ ${D05_R}`, options: SIGNS.map((s, i) => ({ id: String(i), label: s })), studentAnswer: { sign: pick, label: SIGNS[pick] }, correctAnswer: { label: D05_SIGN }, correct, meta: { tag: 'zero_rule', level: '🟡' } });
  }, [pick, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const nums = [-6, -5, -4, -3, -2, -1, 0, 1, 2];
  return (
    <div style={S.wrap}>
      <style>{`
        .d7-pop { animation: d7pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d7pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d7-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ maxHeight: show ? 66 : 0, opacity: show ? 1 : 0, overflow: 'hidden', transition: 'max-height .5s ease, opacity .5s ease' }}>
        <div style={{ position: 'relative', height: 50, margin: '8px 10px 0' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 20, height: 3, background: '#cbd5e1', borderRadius: 2 }} />
          {nums.map((v, i) => {
            const hl = v === D05_L || v === D05_R;
            const c = v === D05_L ? '#1a7f43' : v === D05_R ? '#c0392b' : '#cbd5e1';
            return (
              <div key={v} style={{ position: 'absolute', left: (i / (nums.length - 1) * 100) + '%', top: 10, transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ width: hl ? 14 : 8, height: hl ? 14 : 8, borderRadius: 999, background: hl ? c : '#cbd5e1', margin: '0 auto', border: v === 0 ? '2px solid #1a7f43' : 'none' }} />
                {hl && <div style={{ marginTop: 4, fontSize: 11, fontWeight: 800, color: c, ...S.mono }}>{v}</div>}
              </div>
            );
          })}
        </div>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '8px 0 14px' }}>
        <span style={{ ...S.mono, fontSize: 32, fontWeight: 800, color: '#1a7f43' }}>{D05_L}</span>
        <span style={{ ...S.mono, fontSize: 28, fontWeight: 800, color: pick != null ? '#fe5b1a' : '#cbd5e1', minWidth: 40, textAlign: 'center' }}>{pick != null ? SIGNS[pick] : '?'}</span>
        <span style={{ ...S.mono, fontSize: 32, fontWeight: 800, color: '#c0392b' }}>{D05_R}</span>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {SIGNS.map((s, i) => <button key={i} type="button" style={{ ...optStyle(pick, i, 0, false, isReview, { center: true, mono: true }), width: 74, marginBottom: 0, fontSize: 26, ...(checked && pick === i ? { borderColor: SIGNS[i] === D05_SIGN ? '#1a7f43' : '#c0392b', background: SIGNS[i] === D05_SIGN ? '#e8f7ee' : '#fdecec', color: SIGNS[i] === D05_SIGN ? '#1a7f43' : '#c0392b' } : {}) }} disabled={isReview || checked} onClick={() => setPick(i)}>{s}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
