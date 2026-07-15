// Dars27 · Amaliyot 07 — Konstruktor: yo'nalish + qadam · 🔴 · tag: shift_steps
// 6,4 → 640. Vergulni qaysi tomonga va necha qadam surish kerak? To'g'ri: o'ngga, 2 qadam (×100).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#6d28d9', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 8px' },
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
  .d27-comma { animation: d27hop .95s ease both; }
  @keyframes d27hop { from { left: var(--from); } to { left: var(--to); } }
  .d27-zero { animation: d27zero .95s ease both; }
  @keyframes d27zero { 0%,60% { opacity: 0; } 100% { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .d27-pop,.d27-comma,.d27-zero { animation: none !important; } }
`;
function CommaHop({ digitsAll, startPos, endPos, newIdx = [], reveal, cellW = 40 }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end', height: 52, ...S.mono }}>
      {digitsAll.map((d, i) => {
        const isNew = newIdx.includes(i);
        const hidden = isNew && !reveal;
        return <span key={i} className={reveal && isNew ? 'd27-zero' : ''} style={{ width: cellW, textAlign: 'center', fontSize: 36, fontWeight: 800, color: isNew ? '#6d28d9' : '#1f2430', opacity: hidden ? 0 : 1, lineHeight: 1.2 }}>{d}</span>;
      })}
      <span className={reveal ? 'd27-comma' : ''} style={{ position: 'absolute', bottom: 0, left: (reveal ? endPos : startPos) * cellW - 4, fontSize: 36, fontWeight: 800, color: '#1f2430', lineHeight: 1.2, '--from': (startPos * cellW - 4) + 'px', '--to': (endPos * cellW - 4) + 'px' }}>,</span>
    </div>
  );
}

const D07_DIR = 'right', D07_STEPS = 2;
const D07_T = {
  uz: {
    eyebrow: 'Konstruktor', setup: "Kamol 6,4 ni 640 ga aylantirmoqchi. Vergulni to'g'ri surish kerak.",
    ask: "Yo'nalish va qadam sonini tanlang:",
    dirL: "Yo'nalish:", stepsL: 'Qadam soni:',
    left: 'chapga', right: "o'ngga",
    correct: "To'g'ri. O'ngga 2 qadam = ×100: 6,4 → 64 → 640.",
    wrong: "6,4 dan 640 gacha vergul qaysi tomonga va nechta xona surilganini sanang.",
    rule: "Qadam soni = nechta nolli 10: o'ngga 2 qadam = ×100.",
  },
  ru: {
    eyebrow: 'Конструктор', setup: 'Камол хочет превратить 6,4 в 640. Нужно верно сдвинуть запятую.',
    ask: 'Выбери направление и число шагов:',
    dirL: 'Направление:', stepsL: 'Число шагов:',
    left: 'влево', right: 'вправо',
    correct: 'Верно. Вправо на 2 шага = ×100: 6,4 → 64 → 640.',
    wrong: 'Из 6,4 в 640 — посчитай, в какую сторону и на сколько разрядов сдвинулась запятая.',
    rule: 'Число шагов = число нулей у 10: вправо 2 шага = ×100.',
  },
};

export default function D27_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [dir, setDir] = useState(null);
  const [steps, setSteps] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.dir != null) { setDir(sa.dir); setSteps(sa.steps); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(dir != null && steps != null && !checked); }, [dir, steps, checked, onReady]);
  const check = useCallback(() => {
    const correct = dir === D07_DIR && steps === D07_STEPS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { dir, steps }, correctAnswer: { dir: D07_DIR, steps: D07_STEPS }, correct, meta: { tag: 'shift_steps', level: '🔴' } });
  }, [dir, steps, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealHop = checked && fb?.correct;
  const locked = isReview || checked;
  const dirBtn = (val, label, arrow) => {
    const on = dir === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#6d28d9'; bg = '#f3edfe'; col = '#1f2430'; }
    if (checked && on) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={locked} onClick={() => setDir(val)} style={{ flex: 1, height: 52, borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 700, cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><span style={{ fontSize: 20 }}>{arrow}</span>{label}</button>;
  };
  const stepBtn = (n) => {
    const on = steps === n;
    let bd = '#d6dae3', bg = '#fff', col = '#1f2430';
    if (on) { bd = '#6d28d9'; bg = '#f3edfe'; }
    if (checked && on) { const ok = fb?.correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button key={n} type="button" disabled={locked} onClick={() => setSteps(n)} style={{ width: 56, height: 52, borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 24, fontWeight: 800, cursor: locked ? 'default' : 'pointer' }}>{n}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{D27STYLE}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, margin: '8px 0 6px' }}>
        <CommaHop digitsAll={['6', '4', '0']} newIdx={[2]} startPos={1} endPos={3} reveal={revealHop} />
        <span style={{ ...S.mono, fontSize: 24, fontWeight: 800, color: '#94a3b8' }}>→</span>
        <span style={{ ...S.mono, fontSize: 30, fontWeight: 800, color: '#6d28d9' }}>640</span>
      </div>
      <p style={S.ask}>{t.ask}</p>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '4px 0 6px' }}>{t.dirL}</p>
      <div style={{ display: 'flex', gap: 10 }}>{dirBtn('left', t.left, '◀')}{dirBtn('right', t.right, '▶')}</div>
      <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 700, margin: '12px 0 6px' }}>{t.stepsL}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>{[1, 2, 3].map(stepBtn)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
