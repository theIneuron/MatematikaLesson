// Dars30 · Amaliyot 07 — Xatoni top · 🔴 · tag: pct_error
// Sabina: 5% = 1/5 dedi. To'g'ri: 5% = 5/100 = 1/20. Xato — 2-qadamda. correct = 1.
// Eyebrow pill: indigo. jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q. Faqat react.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = { d: '#4338ca', l: '#eef2ff', m: '#c7d2fe', fill: '#818cf8' };
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

const D07_CORRECT = 1;
const D07_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Sabina 5% ni kasrga aylantirdi. Ustoz bir qadamda xato borligini aytdi. Xato qadamni bosing.",
    ask: 'Qaysi qadam xato?',
    steps: ["5% ni oldi.", "5% = 1/5 deb yozdi.", "Demak javob 1/5, dedi."],
    correct: "To'g'ri. 5% = 5/100 = 1/20, 1/5 emas. 1/5 esa 20% bo'ladi.",
    wrong: "5% ni kasr qilib yozing (yuzdan nechta?). 1/5 xuddi shu ulushmi — tekshiring.",
    rule: "N% = N/100 (N/1 emas).",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Сабина перевела 5% в дробь. Учитель сказал, что в одном шаге ошибка. Нажми на шаг с ошибкой.',
    ask: 'Какой шаг ошибочный?',
    steps: ['Взяла 5%.', 'Записала 5% = 1/5.', 'Значит ответ 1/5, сказала она.'],
    correct: 'Верно. 5% = 5/100 = 1/20, а не 1/5. А 1/5 — это 20%.',
    wrong: '5% запиши как дробь (сколько сотых?). Равно ли это 1/5 — проверь.',
    rule: 'N% = N/100 (не N/1).',
  },
};

export default function D30_07(props) {
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
    onSubmit?.({ questionText: t.ask, options: t.steps.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked }, correctAnswer: { idx: D07_CORRECT }, correct, meta: { tag: 'pct_error', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d30-pop { animation: d30pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d30pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d30-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {checked && fb?.correct && (
        <div className="d30-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '6px 0' }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span>
          <span style={{ ...S.mono, fontSize: 18, fontWeight: 800, color: '#1a7f43' }}>5% = 5/100 = 1/20</span>
        </div>
      )}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.steps.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = C.d; bg = C.l; col = '#1f2430'; }
          if (checked && on) { const ok = i === D07_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return (
            <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>
              <span style={{ ...S.mono, fontSize: 14, fontWeight: 800, color: '#94a3b8', minWidth: 22 }}>{i + 1}.</span>
              <span>{renderFr(o)}</span>
            </button>
          );
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
