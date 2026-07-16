// Dars23 · Amaliyot 10 — Teskari masala (yopilgan son) · 🔴 · tag: add_mixed_choice
// ? 4/5 + 1 3/5 = 5 2/5. Kasrlar 4/5+3/5=7/5=1 2/5 (o'tkazma). Butunlar: ?+1+1=5 → ?=3.
// Tuzoq: 4 (o'tkazmani unutish → ?+1=5). To'g'risi 3 4/5.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d23-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
const Frac = ({ num, den, size = 20, color = '#1f2430' }) => (
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
const Mixed = ({ w, n, d, size = 22, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><span style={{ ...S.mono, fontWeight: 800, fontSize: size + 6, color }}>{w}</span><Frac num={n} den={d} size={size - 1} color={color} /></span>
);

const D10_OPTS = [[3, 4, 5], [4, 4, 5], [2, 4, 5], [5, 4, 5]];
const D10_CORRECT = 0; // 3 4/5
const D10_T = {
  uz: {
    eyebrow: 'Yopilgan son', setup: "Bekzod amalni yozdi, lekin birinchi qo'shiluvchining butun qismi dog' bilan yopilib qolgan: ? 4/5 + 1 3/5 = 5 2/5. Yopilgan son qaysi?",
    ask: 'Yopilgan son qaysi?',
    correct: "To'g'ri. Kasrlar 4/5 + 3/5 = 7/5 = 1 2/5. Demak butunlar: ? + 1 + 1 = 5, ya'ni ? = 3. Yopilgan son 3 4/5.",
    wrong: "Kasrlar yig'indisidan hosil bo'lgan butunni ham hisobga oldingizmi? Yana bir bor qarang.",
    rule: "Teskari masalada avval kasrlarni qo'shing; undan chiqqan butunni ham butunlar yig'indisiga qo'shib, noma'lumni toping.",
  },
  ru: {
    eyebrow: 'Скрытое число', setup: 'Бекзод записал действие, но целая часть первого слагаемого закрыта кляксой: ? 4/5 + 1 3/5 = 5 2/5. Какое число закрыто?',
    ask: 'Какое число закрыто?',
    correct: 'Верно. Дроби 4/5 + 3/5 = 7/5 = 1 2/5. Значит целые: ? + 1 + 1 = 5, то есть ? = 3. Скрытое число 3 4/5.',
    wrong: 'Учёл ли ты целое, которое получилось из суммы дробей? Посмотри ещё раз.',
    rule: 'В обратной задаче сначала сложи дроби; целое из них тоже прибавь к сумме целых и найди неизвестное.',
  },
};

export default function D23_10(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D10_T[lang] || D10_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D10_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D10_OPTS.map((o, i) => ({ id: String(i), label: o.join(' ') })), studentAnswer: { idx: picked }, correctAnswer: { idx: D10_CORRECT }, correct, meta: { tag: 'add_mixed_choice', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  const QBox = () => (<span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 34, borderRadius: 8, border: '2px dashed #94a3b8', background: '#f8fafc', ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8', verticalAlign: 'middle' }}>?</span>);
  return (
    <div style={S.wrap}>
      <style>{`
        .d23-pop { animation: d23pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d23pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d23-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '10px 0 6px', flexWrap: 'wrap' }}>
        <QBox /><Frac num="4" den="5" size={20} color="#7c3aed" /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>+</span><Mixed w={1} n={3} d={5} size={22} color="#fe5b1a" /><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#94a3b8' }}>=</span><Mixed w={5} n={2} d={5} size={22} color="#1f2430" />
      </div>
      <p style={{ ...S.ask, textAlign: 'center' }}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {D10_OPTS.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#fe5b1a'; bg = '#fff0e8'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D10_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ flex: '1 1 40%', minWidth: 110, height: 60, borderRadius: 14, border: '2px solid ' + bd, background: bg, cursor: (isReview || checked) ? 'default' : 'pointer' }}><Mixed w={o[0]} n={o[1]} d={o[2]} size={20} color={col} /></button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
