// Dars34 · Amaliyot 03 — Kvadrat perimetri · 🟢 · tag: peri_square
// Kvadrat tomoni 6 m. P = 4 × 6 = 24 m. "P = 24 to'g'rimi?" → Ha.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#7c3aed', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d34-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function RectWalk({ a, b, unit = 'm', accent = '#7c3aed', square = false }) {
  const RW = square ? 122 : 168, RH = square ? 122 : 104, px = 36, py = 28, fs = 15;
  return (
    <div style={{ margin: '8px auto 2px', width: RW + px * 2, maxWidth: '100%' }}>
      <style>{`
        .d34w-s{stroke-dasharray:1;stroke-dashoffset:1;animation:d34draw .8s ease forwards;}
        .d34w-s2{animation-delay:.8s}.d34w-s3{animation-delay:1.6s}.d34w-s4{animation-delay:2.4s}
        .d34w-l{opacity:0;animation:d34lab .5s ease forwards;}
        .d34w-l1{animation-delay:.6s}.d34w-l2{animation-delay:1.4s}.d34w-l3{animation-delay:2.2s}.d34w-l4{animation-delay:3s}
        .d34w-dot{animation:d34dotK 3.2s linear forwards;}
        @keyframes d34draw{to{stroke-dashoffset:0}}
        @keyframes d34lab{to{opacity:1}}
        @keyframes d34dotK{0%{transform:translate(0px,0px)}25%{transform:translate(${RW}px,0px)}50%{transform:translate(${RW}px,${RH}px)}75%{transform:translate(0px,${RH}px)}100%{transform:translate(0px,0px)}}
        @media (prefers-reduced-motion: reduce){
          .d34w-s{stroke-dashoffset:0!important;animation:none!important}
          .d34w-l{opacity:1!important;animation:none!important}
          .d34w-dot{animation:none!important}
        }
      `}</style>
      <svg width={RW + px * 2} height={RH + py * 2} viewBox={`0 0 ${RW + px * 2} ${RH + py * 2}`} style={{ display: 'block', maxWidth: '100%' }}>
        <rect x={px} y={py} width={RW} height={RH} fill="#faf5ff" />
        <rect x={px} y={py} width={RW} height={RH} fill="none" stroke="#d6dae3" strokeWidth="2" />
        <line className="d34w-s" pathLength="1" x1={px} y1={py} x2={px + RW} y2={py} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34w-s d34w-s2" pathLength="1" x1={px + RW} y1={py} x2={px + RW} y2={py + RH} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34w-s d34w-s3" pathLength="1" x1={px + RW} y1={py + RH} x2={px} y2={py + RH} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <line className="d34w-s d34w-s4" pathLength="1" x1={px} y1={py + RH} x2={px} y2={py} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <text className="d34w-l d34w-l1" x={px + RW / 2} y={py - 9} textAnchor="middle" fontSize={fs} fontWeight="800" fill="#1f2430" fontFamily="'JetBrains Mono',monospace">{a}{unit ? ' ' + unit : ''}</text>
        <text className="d34w-l d34w-l2" x={px + RW + 9} y={py + RH / 2 + 5} textAnchor="start" fontSize={fs} fontWeight="800" fill="#1f2430" fontFamily="'JetBrains Mono',monospace">{b}{unit ? ' ' + unit : ''}</text>
        {!square && <text className="d34w-l d34w-l3" x={px + RW / 2} y={py + RH + 19} textAnchor="middle" fontSize={fs} fontWeight="800" fill="#9ca3af" fontFamily="'JetBrains Mono',monospace">{a}{unit ? ' ' + unit : ''}</text>}
        {!square && <text className="d34w-l d34w-l4" x={px - 9} y={py + RH / 2 + 5} textAnchor="end" fontSize={fs} fontWeight="800" fill="#9ca3af" fontFamily="'JetBrains Mono',monospace">{b}{unit ? ' ' + unit : ''}</text>}
        <circle className="d34w-dot" cx={px} cy={py} r="6.5" fill={accent} stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  );
}

const D03_ANS = true;
const D03_T = {
  uz: {
    eyebrow: "Ha yoki yo'q", setup: "Alisher kvadrat plitkani o'lchadi: tomoni 6 m. Uning 4 tomoni ham teng.",
    ask: "Perimetr P = 24 m — bu to'g'rimi?", yes: "Ha, to'g'ri", no: "Yo'q, xato",
    correct: "To'g'ri. Kvadratning 4 tomoni teng: 4 × 6 = 24 m.",
    wrong: "Kvadratning to'rt tomoni ham teng. Butun chegara nechta shunday tomondan iborat? Savol yuza haqida emas, chegara haqida.",
    rule: "Kvadrat: P = 4 × a.",
  },
  ru: {
    eyebrow: 'Да или нет', setup: 'Алишер измерил квадратную плитку: сторона 6 м. У неё 4 равные стороны.',
    ask: 'Периметр P = 24 м — это верно?', yes: 'Да, верно', no: 'Нет, ошибка',
    correct: 'Верно. У квадрата 4 равные стороны: 4 × 6 = 24 м.',
    wrong: 'У квадрата все четыре стороны равны. Из скольких таких сторон состоит вся граница? Вопрос про границу, а не про площадь.',
    rule: 'Квадрат: P = 4 × a.',
  },
};

export default function D34_03(props) {
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
    onSubmit?.({ questionText: t.ask, options: [{ id: 'yes', label: t.yes }, { id: 'no', label: t.no }], studentAnswer: { pick }, correctAnswer: { pick: D03_ANS }, correct, meta: { tag: 'peri_square', level: '🟢' } });
  }, [pick, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const revealed = checked && fb?.correct;
  const btn = (val, label) => {
    const on = pick === val;
    let bd = '#d6dae3', bg = '#fff', col = '#374151';
    if (on) { bd = '#7c3aed'; bg = '#faf5ff'; col = '#1f2430'; }
    if (checked && on) { const ok = val === D03_ANS; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
    return <button type="button" disabled={isReview || checked} onClick={() => setPick(val)} style={{ flex: 1, height: 56, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit' }}>{label}</button>;
  };
  return (
    <div style={S.wrap}>
      <style>{`
        .d34-pop { animation: d34pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d34pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d34-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {revealed && <RectWalk a="6" b="6" square />}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}>{btn(true, t.yes)}{btn(false, t.no)}</div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
