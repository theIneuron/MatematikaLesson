// Dars11 · Amaliyot 09 — To'rtburchak tomoni · 🔴 · rectangle_side (variant)
// Yuzi 19, bir tomoni 7. Ikkinchi tomon = 19:7 = 19/7.
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
  <div className="d11-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}
function optStyle(picked, i, correctIdx, checked, isReview, opts = {}) {
  const on = picked === i, show = checked && on;
  let bg = '#fff', bd = '#d6dae3', col = '#374151';
  if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}

const D09_CORRECT = 0;
const D09_T = {
  uz: {
    eyebrow: "To'rtburchak tomoni", setup: "To'g'ri to'rtburchakning yuzi 19 sm², bir tomoni 7 sm.",
    ask: 'Ikkinchi tomoni necha sm?',
    opts: ['19/7', '7/19', '26/7', '19 × 7'],
    correct: "To'g'ri. Tomon = yuza : tomon = 19 : 7 = 19/7 sm.",
    wrong: "Maslahat: to'rtburchak yuzasi = tomon × tomon. Bitta tomon ma'lum bo'lsa, ikkinchisini qaysi teskari amal bilan topamiz?",
    rule: "To'rtburchak tomoni = yuza : ma'lum tomon. 19 : 7 = 19/7.",
  },
  ru: {
    eyebrow: 'Сторона прямоугольника', setup: 'Площадь прямоугольника 19 см², одна сторона 7 см.',
    ask: 'Чему равна вторая сторона в см?',
    opts: ['19/7', '7/19', '26/7', '19 × 7'],
    correct: 'Верно. Сторона = площадь : сторона = 19 : 7 = 19/7 см.',
    wrong: 'Подсказка: площадь прямоугольника = сторона × сторона. Если одна сторона известна, каким обратным действием найти вторую?',
    rule: 'Сторона прямоугольника = площадь : известная сторона. 19 : 7 = 19/7.',
  },
};
export default function D11_09(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D09_T[lang] || D09_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D09_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 0, label: '19/7' }, correct, meta: { tag: 'rectangle_side', level: '🔴' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d11-pop { animation: d11pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d11pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d11-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* to'rtburchak: pastda 7, chapda ?, ichida S=19 */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
        <div style={{ position: 'relative', width: 170, height: 96 }}>
          <div style={{ width: '100%', height: '100%', border: '3px solid #14b8a6', borderRadius: 8, background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, fontSize: 14, fontWeight: 800, color: '#0f766e' }}>S = 19 sm²</div>
          <span style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', background: '#fff', ...S.mono, fontSize: 14, fontWeight: 800, color: '#0f766e', padding: '0 4px' }}>7 sm</span>
          <span style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', background: '#fff', ...S.mono, fontSize: 15, fontWeight: 800, color: '#7c3aed', padding: '0 3px' }}>?</span>
        </div>
      </div>
      <p style={{ ...S.ask, marginTop: 18 }}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, 0, checked, isReview, { half: true, center: true, mono: i < 3, fs: i < 3 ? 20 : 16 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
