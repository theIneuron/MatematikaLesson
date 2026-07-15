// Dars14 · Amaliyot 01 — Teng maxraj belgisi · 🟢 · same_denom_sign (belgi qo'yish)
// 3/8 va 5/8. Teng maxraj — kirish. Belgi <.
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
const RuleChip = ({ text }) => (
  <div className="d14-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 24, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);
function SignPicker({ value, onPick, disabled, correct, checked, tint }) {
  const signs = ['<', '=', '>'];
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {signs.map((s) => {
        const on = value === s;
        let bd = tint ? '#bfdbfe' : '#d6dae3', bg = tint ? '#eff6ff' : '#fff', col = tint ? '#2563eb' : '#374151';
        if (on) { bd = '#2563eb'; bg = '#dbeafe'; col = '#1e40af'; }
        if (checked && on) { const ok = s === correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
        return <button key={s} type="button" disabled={disabled} onClick={() => onPick(s)} style={{ width: 64, height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 30, fontWeight: 800, cursor: disabled ? 'default' : 'pointer' }}>{s}</button>;
      })}
    </div>
  );
}

const D01_CORRECT = '<';
const D01_T = {
  uz: {
    eyebrow: "Belgi qo'ying", setup: "Javohir ikki kasrni solishtirmoqchi: 3/8 va 5/8.",
    ask: "3/8 va 5/8 orasiga qaysi belgi to'g'ri keladi?",
    correct: "To'g'ri. Maxrajlar teng (8), demak surat katta bo'lgan kasr kattaroq: 3/8 < 5/8.",
    wrong: "Maslahat: maxrajlar bir xil (8). Bunday holda surat qancha katta — kasr shuncha katta.",
    rule: "Maxrajlar teng bo'lsa: surat katta bo'lgan kasr kattaroq.",
  },
  ru: {
    eyebrow: 'Поставьте знак', setup: 'Джавохир хочет сравнить две дроби: 3/8 и 5/8.',
    ask: 'Какой знак верен между 3/8 и 5/8?',
    correct: 'Верно. Знаменатели равны (8), значит больше та дробь, у которой больше числитель: 3/8 < 5/8.',
    wrong: 'Подсказка: знаменатели одинаковы (8). Тогда чем больше числитель — тем больше дробь.',
    rule: 'При равных знаменателях: больше та дробь, у которой числитель больше.',
  },
};
export default function D14_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D01_T[lang] || D01_T.uz;
  const isReview = mode === 'review';
  const [sign, setSign] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sign) { setSign(sa.sign); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sign != null && !checked); }, [sign, checked, onReady]);
  const check = useCallback(() => {
    const correct = sign === D01_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sign }, correctAnswer: { sign: '<' }, correct, meta: { tag: 'same_denom_sign', level: '🟢' } });
  }, [sign, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d14-pop { animation: d14pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d14pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d14-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '14px 0' }}>
        <Frac num="3" den="8" size={36} color="#2563eb" />
        <div style={{ width: 44, height: 44, borderRadius: 10, border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 26, fontWeight: 800, color: sign ? '#1f2430' : '#cbd5e1' }}>{sign || '?'}</div>
        <Frac num="5" den="8" size={36} color="#2563eb" />
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <SignPicker value={sign} onPick={(s) => !checked && !isReview && setSign(s)} disabled={isReview || checked} correct={D01_CORRECT} checked={checked} tint />
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
