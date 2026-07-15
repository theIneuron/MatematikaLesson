// Dars35 · Amaliyot 08 — Gilam masalasi · 🔴 · tag: area_word
// Xona 4 m × 3,5 m. Gilam butun polni qoplashi kerak: S = 4 × 3,5 = 14 m².
// To'g'ri javobdan keyin tenglik ochiladi. jsx-question kontrakti: onReady/registerCheck/onSubmit.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
// Rang: fuchsia
const C = { dark: '#a21caf', lt: '#fdf4ff', mid: '#f5d0fe', fill: '#fae8ff', stroke: '#c026d3', motif: '#e879f9' };
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { display: 'inline-block', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: C.dark, background: C.lt, border: '1px solid ' + C.mid, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase' },
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
  <div className="d35-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: C.lt, border: '1.5px solid ' + C.mid, color: C.dark }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// Naqshli gilam
function Carpet({ lang, w = 150, h = 116 }) {
  return (
    <svg width={w + 2} height={h + 2} viewBox={`0 0 ${w + 2} ${h + 2}`} style={{ display: 'block' }}>
      <rect x="1" y="1" width={w} height={h} rx="6" fill={C.fill} stroke={C.stroke} strokeWidth="2.4" />
      <rect x="9" y="9" width={w - 16} height={h - 16} rx="4" fill="none" stroke={C.motif} strokeWidth="1.6" strokeDasharray="5 4" />
      <path d={`M ${1 + w / 2} 20 L ${1 + w / 2 + 12} ${1 + h / 2} L ${1 + w / 2} ${h - 18} L ${1 + w / 2 - 12} ${1 + h / 2} Z`} fill="none" stroke={C.motif} strokeWidth="1.6" />
      <text x={1 + w / 2} y={1 + h / 2 + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={C.dark} fontFamily="'Manrope', sans-serif">{lang === 'uz' ? 'gilam' : 'ковёр'}</text>
    </svg>
  );
}

const D08_ANS = 14;
const D08_T = {
  uz: {
    eyebrow: 'Gilam masalasi', setup: "Oybekning xonasi 4 m va 3,5 m. Gilam butun polni qoplashi kerak.",
    ask: 'Necha m² gilam kerak?', unit: 'm²',
    correct: "To'g'ri. S = 4 × 3,5 = 14 m².",
    wrong: "Gilam butun polni qoplaydi — yuza ikkala xona tomonidan hosil bo'ladi.",
    rule: "Qoplash yuzasi = a × b.",
  },
  ru: {
    eyebrow: 'Задача про ковёр', setup: 'Комната Ойбека 4 м и 3,5 м. Ковёр должен покрыть весь пол.',
    ask: 'Сколько м² ковра нужно?', unit: 'м²',
    correct: 'Верно. S = 4 × 3,5 = 14 м².',
    wrong: 'Ковёр покрывает весь пол — площадь получается из обеих сторон комнаты.',
    rule: 'Площадь покрытия = a × b.',
  },
};

export default function D35_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const num = (s) => parseFloat(String(s).replace(',', '.'));
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.value != null) { setVal(String(sa.value)); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(val.trim() !== '' && !isNaN(num(val)) && !checked); }, [val, checked, onReady]);
  const check = useCallback(() => {
    const correct = num(val) === D08_ANS;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { value: num(val) }, correctAnswer: { value: D08_ANS }, correct, meta: { tag: 'area_word', level: '🔴' } });
  }, [val, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const bd = checked ? (fb?.correct ? '#1a7f43' : '#c0392b') : C.dark;
  const revealed = checked && fb?.correct;
  return (
    <div style={S.wrap}>
      <style>{`
        .d35-pop { animation: d35pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d35pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d35-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, margin: '10px 0 6px' }}>
        <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>3,5 m</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Carpet lang={lang} />
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: C.dark }}>4 m</span>
        </div>
      </div>
      {revealed && <div className="d35-pop" style={{ ...S.mono, textAlign: 'center', fontSize: 15, fontWeight: 800, color: C.dark, margin: '4px 0' }}>4 × 3,5 = 14</div>}
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d.,]/g, '').slice(0, 5))} disabled={isReview || checked} inputMode="decimal" placeholder="0" style={{ width: 90, height: 52, textAlign: 'center', fontSize: 26, fontWeight: 800, borderRadius: 12, border: '2px solid ' + bd, color: '#1f2430', fontFamily: "'JetBrains Mono', monospace", background: '#fff' }} />
        <span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#475569' }}>{t.unit}</span>
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
