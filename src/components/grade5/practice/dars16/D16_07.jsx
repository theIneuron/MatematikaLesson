// Dars16 · Amaliyot 07 — Xatoni top · 🔴 · tag: find_wrong
// 6/8 = 3/8 xato (faqat surat bo'lingan).
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
    {ok ? <IconOk /> : <IconNo />}<span>{renderFr(text)}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d16-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{renderFr(text)}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
// matn ichidagi kasrlarni ikki qatorli ko'rsatish (a/b, ?/b, ?/? tokenlari)
const renderFr = (text) => String(text).split(/([\d?]+\/[\d?]+)/g).map((p, i) => {
  const m = /^([\d?]+)\/([\d?]+)$/.exec(p);
  return m ? <Frac key={i} num={m[1]} den={m[2]} size={14} color="currentColor" /> : p;
});

// ikki qatorli kasr (qoida bo'yicha yozuv)
const Frac = ({ num, den, size = 20, color = '#334155' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 3px 1px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '1px 3px 0' }}>{den}</span>
  </span>
);
const FracStr = ({ s, size = 20, color }) => { const [n, d] = String(s).split('/'); return <Frac num={n} den={d} size={size} color={color} />; };

// 6/8 = 3/8 xato (faqat surat bo'lingan).
const D07_ROWS = [
  { l: '6/8', r: '3/4', ok: true },
  { l: '8/12', r: '2/3', ok: true },
  { l: '6/8', r: '3/8', ok: false }, // XATO — faqat surat
  { l: '10/15', r: '2/3', ok: true },
];
const D07_CORRECT = 2;
const D07_T = {
  uz: {
    eyebrow: 'Xatoni toping', setup: "To'rtta qisqartirishdan uchtasi to'g'ri, bittasi — yo'q.",
    ask: "Qaysi qisqartirish NOTO'G'RI?",
    correct: "To'g'ri. 6/8 = 3/8 xato: faqat surat 2 ga bo'lingan, maxraj esa o'sha 8 qolgan. To'g'risi 6/8 = 3/4.",
    wrong: "Maslahat: har qisqartirishda surat VA maxraj bir xil songa bo'linganmi tekshiring. Faqat biri bo'linsa — xato.",
    rule: "Faqat suratni bo'lish — xato. Maxrajni ham o'sha songa bo'ling.",
  },
  ru: {
    eyebrow: 'Найдите ошибку', setup: 'Из четырёх сокращений три верны, одно — нет.',
    ask: 'Какое сокращение НЕВЕРНО?',
    correct: 'Верно. 6/8 = 3/8 неверно: числитель поделён на 2, а знаменатель остался 8. Правильно 6/8 = 3/4.',
    wrong: 'Подсказка: проверь, поделены ли числитель И знаменатель на одно число. Если только один — ошибка.',
    rule: 'Делить только числитель — ошибка. Раздели и знаменатель на то же число.',
  },
};
export default function D16_07(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D07_T[lang] || D07_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D07_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: D07_ROWS.map((r, i) => ({ id: String(i), label: r.l + ' = ' + r.r })), studentAnswer: { idx: picked }, correctAnswer: { idx: 2 }, correct, meta: { tag: 'find_wrong', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d16-pop { animation: d16pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d16pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d16-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{renderFr(t.setup)}</p>
      <p style={S.ask}>{renderFr(t.ask)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {D07_ROWS.map((r, i) => {
          const on = picked === i;
          let bd = '#e2e8f0', bg = '#fff', col = '#334155';
          if (on) { bd = '#93c5fd'; bg = '#f0f6ff'; col = '#1e40af'; }
          if (checked && on) { const ok = i === D07_CORRECT; bd = ok ? '#86efac' : '#fca5a5'; bg = ok ? '#f0fdf4' : '#fef2f2'; col = ok ? '#15803d' : '#b91c1c'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ padding: '12px 14px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, cursor: (isReview || checked) ? 'default' : 'pointer', minHeight: 56 }}><span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><FracStr s={r.l} size={20} color={col} /><span style={{ ...S.mono, fontSize: 20, fontWeight: 800 }}>=</span><FracStr s={r.r} size={20} color={col} /></span></button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
