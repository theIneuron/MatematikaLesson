// Dars30 · Amaliyot 03 — Chorak mi · 🟢 · tag: pct_quarter
// 25% = 1/4 mi? → Ha. Vizual: lenta (4 bo'lak, 1 bo'yalgan) — NAQSH A reveal, faqat to'g'ri javobdan keyin.
// Eyebrow pill: purple. jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#7c3aed', l: '#faf5ff', m: '#e9d5ff', fill: '#a78bfa' };
const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.d, background: C.l, border: '1px solid ' + C.m, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 15.5, fontWeight: 700, margin: '14px 0 12px' },
  mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
};
const FB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.l, border: '1.5px solid ' + C.m, color: C.d }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 15, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 2px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 1.6, background: color }} />
    <span style={{ fontSize: size, padding: '1px 2px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});
// Lenta: parts bo'lakka bo'lingan, shaded tasi bo'yalgan
function Tape({ parts = 4, shaded = 1, color = C.fill, animate = false }) {
  return (
    <div style={{ display: 'flex', gap: 3, width: 260, maxWidth: '100%', padding: 5, background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: 12 }}>
      {Array.from({ length: parts }).map((_, i) => {
        const on = i < shaded;
        return <div key={i} className={on && animate ? 'd30-pop' : ''} style={{ flex: 1, height: 48, borderRadius: 7, background: on ? color : '#fff', border: '1.5px solid ' + (on ? color : '#e2e8f0'), animationDelay: (i * 0.1).toFixed(2) + 's' }} />;
      })}
    </div>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: 'Chorak mi', setup: "Zaynab yuz katakli kvadratning 25 bo'lagini bo'yadi — 25%.",
    ask: '25% = 1/4 mi?', yes: 'Ha, chorak', no: "Yo'q, chorak emas",
    correct: "Ha. 25% = 25/100 = 1/4 — chorak.",
    wrong: "25 — yuzning qanday ulushi? Butunni teng bo'laklarga bo'lsangiz, bir bo'lak shu ulushga to'g'ri keladimi?",
    rule: "25% = 1/4.",
  },
  ru: {
    eyebrow: 'Четверть ли', setup: 'Зайнаб закрасила 25 частей квадрата из ста клеток — 25%.',
    ask: '25% = 1/4?', yes: 'Да, четверть', no: 'Нет, не четверть',
    correct: 'Да. 25% = 25/100 = 1/4 — четверть.',
    wrong: '25 — какая доля от ста? Раздели целое на равные части — совпадёт ли одна доля с этой?',
    rule: '25% = 1/4.',
  },
};

export default function D30_03(props) {
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
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'pct_quarter', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = C.d; bg = C.l; col = '#1f2430'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d30-drop { animation: d30drop .5s ease both; }
        @keyframes d30drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d30-pop, .d30-drop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && (
        <div className="d30-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '6px 0 12px', padding: '12px', borderRadius: 14, background: C.l, border: '1.5px solid ' + C.m }}>
          <Tape parts={4} shaded={1} animate />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...S.mono, fontSize: 15, fontWeight: 800, color: C.d }}><span>25% =</span><Frac num="1" den="4" size={20} color={C.d} /></div>
        </div>
      )}
      <p className={revealed ? 'd30-drop' : ''} style={{ ...S.ask, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div className={revealed ? 'd30-drop' : ''} style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
