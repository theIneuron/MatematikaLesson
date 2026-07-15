// Dars20 · Amaliyot 04 — Umumiy maxraj qaysi · 🟢 · tag: sub_pick_lcd
// 3/4 − 1/6 → eng kichik umumiy maxraj 12. Tuzoq 24 (4×6, minimal emas).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d20-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

const D04_OPTS = [10, 12, 6, 24];
const D04_CORRECT = 1; // 12
const D04_T = {
  uz: {
    eyebrow: 'Umumiy maxraj', setup: "Madina 3/4 dan 1/6 ni ayirmoqchi, lekin maxrajlari har xil.",
    ask: '3/4 − 1/6 uchun eng kichik umumiy maxraj qaysi?',
    correct: "To'g'ri. 12 ham 4 ga, ham 6 ga bo'linadi va eng kichigi. 3/4 = 9/12, 1/6 = 2/12 → 9/12 − 2/12 = 7/12.",
    wrong: "Maslahat: umumiy maxraj ikkala maxrajga qanday bog'liq bo'lishi kerak? Mos sonlar ko'p bo'lsa, qaysinisini olamiz?",
    rule: "Eng kichik umumiy maxraj — ikkala maxrajga ham bo'linadigan eng kichik son (bu yerda 12).",
  },
  ru: {
    eyebrow: 'Общий знаменатель', setup: 'Мадина хочет вычесть из 3/4 дробь 1/6, но знаменатели у них разные.',
    ask: 'Какой наименьший общий знаменатель для 3/4 − 1/6?',
    correct: 'Верно. 12 делится и на 4, и на 6, и он наименьший. 3/4 = 9/12, 1/6 = 2/12 → 9/12 − 2/12 = 7/12.',
    wrong: 'Подсказка: как общий знаменатель связан с обоими знаменателями? Если подходящих чисел несколько, какое берём?',
    rule: 'Наименьший общий знаменатель — наименьшее число, делящееся на оба знаменателя (здесь 12).',
  },
};

export default function D20_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D04_OPTS.map((l) => ({ id: String(l), label: String(l) })), studentAnswer: { idx: picked, label: String(D04_OPTS[picked]) }, correctAnswer: { idx: D04_CORRECT, label: '12' }, correct, meta: { tag: 'sub_pick_lcd', level: '🟢' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d20-in { opacity: 0; animation: d20in .7s ease .12s forwards; }
        .d20-pop { animation: d20pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d20in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes d20pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d20-in, .d20-pop { animation: none !important; opacity: 1 !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div className="d20-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '14px 0 8px' }}>
        <Frac num="3" den="4" size={34} color="#2563eb" />
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>−</span>
        <Frac num="1" den="6" size={34} color="#2563eb" />
      </div>
      <p style={{ ...S.ask, fontSize: 15.5, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {D04_OPTS.map((n, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1e40af'; }
          if (checked && on) { const ok = i === D04_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={n} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ width: 62, height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, color: col, ...S.mono, fontSize: 24, fontWeight: 800, cursor: (isReview || checked) ? 'default' : 'pointer' }}>{n}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
