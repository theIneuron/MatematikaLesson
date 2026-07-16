// Dars14 · Amaliyot 02 — Bir surat, bar solishtirish · 🟢 · same_num_bars (belgi + vizual)
// 1/2 va 1/3. Surat teng. Bar bilan ko'rinadi: kamroq ulush → yiriroq. Belgi >.
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
  <div className="d14-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Bar = ({ den, shaded, width = 260, color = '#fe5b1a', light = '#e0ecff', label }) => (
  <div>
    {label && <div style={{ fontSize: 13, fontWeight: 800, color, marginBottom: 4, ...S.mono }}>{label}</div>}
    <div style={{ display: 'flex', width, height: 38, border: '2px solid ' + color, borderRadius: 8, overflow: 'hidden' }}>
      {Array.from({ length: den }).map((_, i) => (
        <div key={i} style={{ flex: 1, borderRight: i < den - 1 ? '1.5px solid ' + color : 'none', background: i < shaded ? color : light, transition: 'background .5s ease' }} />
      ))}
    </div>
  </div>
);
function SignPicker({ value, onPick, disabled, correct, checked, tint }) {
  const signs = ['<', '=', '>'];
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {signs.map((s) => {
        const on = value === s;
        let bd = tint ? '#ffd6bd' : '#d6dae3', bg = tint ? '#fff4ee' : '#fff', col = tint ? '#fe5b1a' : '#374151';
        if (on) { bd = '#fe5b1a'; bg = '#ffe7d8'; col = '#b83d0e'; }
        if (checked && on) { const ok = s === correct; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
        return <button key={s} type="button" disabled={disabled} onClick={() => onPick(s)} style={{ width: 64, height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 30, fontWeight: 800, cursor: disabled ? 'default' : 'pointer' }}>{s}</button>;
      })}
    </div>
  );
}

const D02_CORRECT = '>';
const D02_T = {
  uz: {
    eyebrow: 'Solishtiring', setup: "Ikki bir xil uzunlikdagi lenta: biri 1/2 ga, biri 1/3 ga bo'yalgan.",
    ask: "1/2 va 1/3 orasiga qaysi belgi to'g'ri keladi?",
    correct: "To'g'ri. Butun 2 ga bo'linsa, ulush yirik; 3 ga bo'linsa — maydaroq. Shuning uchun 1/2 > 1/3.",
    wrong: "Maslahat: lentalarga qarang. Qaysi bo'yalgan qism uzunroq? Suratlar teng (1), maxraj kichik bo'lsa ulush yirik.",
    rule: "Suratlar teng bo'lsa: maxraj kichik bo'lgan kasr kattaroq (ulushlari yirikroq).",
  },
  ru: {
    eyebrow: 'Сравните', setup: 'Две ленты одной длины: одна закрашена на 1/2, другая на 1/3.',
    ask: 'Какой знак верен между 1/2 и 1/3?',
    correct: 'Верно. Если целое делить на 2 — доли крупные; на 3 — мельче. Поэтому 1/2 > 1/3.',
    wrong: 'Подсказка: посмотри на ленты. Какая закрашенная часть длиннее? Числители равны (1), при меньшем знаменателе доля крупнее.',
    rule: 'При равных числителях: больше та дробь, у которой знаменатель меньше (доли крупнее).',
  },
};
export default function D14_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D02_T[lang] || D02_T.uz;
  const isReview = mode === 'review';
  const [sign, setSign] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { const sa = initialAnswer?.studentAnswer; if (sa?.sign) { setSign(sa.sign); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(sign != null && !checked); }, [sign, checked, onReady]);
  const check = useCallback(() => {
    const correct = sign === D02_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: [], studentAnswer: { sign }, correctAnswer: { sign: '>' }, correct, meta: { tag: 'same_num_bars', level: '🟢' } });
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, margin: '12px 0' }}>
        <Bar den={2} shaded={1} width={280} color="#fe5b1a" label="1/2" />
        <Bar den={3} shaded={1} width={280} color="#14b8a6" light="#d5f5f0" label="1/3" />
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{t.ask}</p>
      <SignPicker value={sign} onPick={(s) => !checked && !isReview && setSign(s)} disabled={isReview || checked} correct={D02_CORRECT} checked={checked} />
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
