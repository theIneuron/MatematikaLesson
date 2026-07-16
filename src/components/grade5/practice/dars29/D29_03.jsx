// Dars29 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: div_yesno
// 4 : 0,5 = 8. To'g'rimi? → Ha. Har butunda 2 ta yarim: 4 × 2 = 8. (:0,5 = ×2)
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#7c3aed', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d29-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function Glass({ i, animate }) {
  const w = 24, h = 38;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <rect x="3" y="2" width={w - 6} height={h - 4} rx="4" fill="#fff" stroke="#d6dae3" strokeWidth="1.4" />
      <rect className={animate ? 'd29-fill' : ''} style={animate ? { animationDelay: (i * 0.3) + 's' } : undefined} x="4.4" y="3.4" width={w - 8.8} height={h - 6.8} rx="3" fill="#a855f7" />
    </svg>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: "Ha yoki yo'q", setup: "Oybek shunday yozdi: 4 : 0,5 = 8. 4 litr ichiga 0,5 litrli stakan 8 marta sig'adi.",
    ask: "4 : 0,5 = 8 — to'g'rimi?", yes: "Ha, to'g'ri", no: "Yo'q, xato",
    correct: "To'g'ri. Har butun litrda 2 ta yarim stakan: 4 × 2 = 8.",
    wrong: "Bo'lish «necha marta sig'adi»ni bildiradi — har butun litrda nechta yarim stakan borligini o'ylang.",
    rule: ":0,5 = ×2.",
  },
  ru: {
    eyebrow: 'Да или нет', setup: 'Ойбек написал: 4 : 0,5 = 8. В 4 литра стакан 0,5 литра помещается 8 раз.',
    ask: '4 : 0,5 = 8 — это верно?', yes: 'Да, верно', no: 'Нет, ошибка',
    correct: 'Верно. В каждом целом литре 2 половинки: 4 × 2 = 8.',
    wrong: 'Деление — это «сколько раз помещается». Подумай, сколько половинок в каждом целом литре.',
    rule: ':0,5 = ×2.',
  },
};

export default function D29_03(props) {
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
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'div_yesno', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#1f2430'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d29-pop { animation: d29pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d29pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        .d29-drop { animation: d29drop .5s ease both; }
        @keyframes d29drop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .d29-fill { transform-box: fill-box; transform-origin: bottom; animation: d29fill .5s ease both; }
        @keyframes d29fill { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) { .d29-pop, .d29-drop, .d29-fill { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && (
        <div className="d29-pop" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 7, margin: '6px auto 12px', padding: '12px', borderRadius: 14, background: '#faf5ff', border: '1.5px solid #e9d5ff', maxWidth: 320 }}>
          {Array.from({ length: 8 }).map((_, i) => <Glass key={i} i={i} animate />)}
        </div>
      )}
      <div className={revealed ? 'd29-drop' : ''} style={{ ...S.mono, fontSize: 20, fontWeight: 800, color: '#1f2430', textAlign: 'center', margin: '2px 0' }}>4 : 0,5 = 8</div>
      <p className={revealed ? 'd29-drop' : ''} style={{ ...S.ask, fontSize: 16, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {revealed && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
