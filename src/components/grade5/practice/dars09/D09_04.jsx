// Dars09 · Amaliyot 04 — Surat ma'nosi · 🟡 · surat_meaning (variant + diagramma)
// 5/8 da surat nimani bildiradi? Variant, kasr diagramma bilan.
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
  <div className="d9-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
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
  if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
  if (show) { const ok = i === correctIdx; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
  return {
    flex: opts.half ? '1 1 45%' : undefined, display: opts.half ? undefined : 'block', width: opts.half ? undefined : '100%',
    textAlign: opts.center ? 'center' : 'left', padding: '13px 14px', borderRadius: 13, border: '2px solid ' + bd,
    background: bg, color: col, fontSize: opts.fs || 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer',
    marginBottom: opts.half ? 0 : 9, fontFamily: opts.mono ? "'JetBrains Mono', monospace" : 'inherit', minHeight: 48,
  };
}
// kasr belgisi (surat/maxraj chiziqcha bilan)
const Frac = ({ num, den, size = 26, color = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...S.mono, fontWeight: 800, color, lineHeight: 1, verticalAlign: 'middle' }}>
    <span style={{ fontSize: size, padding: '0 4px 2px' }}>{num}</span>
    <span style={{ width: '100%', height: 2, background: color }} />
    <span style={{ fontSize: size, padding: '2px 4px 0' }}>{den}</span>
  </span>
);

const D04_NUM = 5, D04_DEN = 8, D04_CORRECT = 2;
const D04_T = {
  uz: {
    eyebrow: "Surat ma'nosi", setup: "5/8 kasri va uning diagrammasi berilgan.",
    ask: '5/8 kasrida surat (5) nimani bildiradi?',
    opts: ["Butun nechaga bo'lingani", 'Ortib qolgan qism', "Olingan (bo'yalgan) ulushlar soni", "Butun sonning o'zi"],
    correct: "To'g'ri. Surat — olingan ulushlar soni. 5/8 da 5 ta ulush olingan.",
    wrong: "Maslahat: maxraj butun nechaga bo'linganini aytadi. Unda surat butunni emas, nimani sanaydi?",
    rule: "Surat — olingan ulushlar soni. Maxraj — butun nechaga bo'lingani.",
  },
  ru: {
    eyebrow: 'Смысл числителя', setup: 'Дана дробь 5/8 и её диаграмма.',
    ask: 'Что означает числитель (5) в дроби 5/8?',
    opts: ['На сколько разделено целое', 'Оставшаяся часть', 'Число взятых (закрашенных) долей', 'Само целое число'],
    correct: 'Верно. Числитель — число взятых долей. В 5/8 взято 5 долей.',
    wrong: 'Подсказка: знаменатель говорит, на сколько разделено целое. А что тогда считает числитель?',
    rule: 'Числитель — число взятых долей. Знаменатель — на сколько разделено целое.',
  },
};
export default function D09_04(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D04_T[lang] || D04_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [lit, setLit] = useState(0); // sanoq animatsiyasi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (initialAnswer?.studentAnswer?.idx != null) { setPicked(initialAnswer.studentAnswer.idx); if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) setLit(D04_NUM); } } }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);
  const check = useCallback(() => {
    const correct = picked === D04_CORRECT;
    setFb({ correct }); setChecked(true); correct ? playCorrect?.() : playWrong?.();
    if (correct) Array.from({ length: D04_NUM }).forEach((_, k) => timers.current.push(setTimeout(() => setLit(k + 1), 400 + k * 350)));
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: 2 }, correct, meta: { tag: 'surat_meaning', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d9-pop { animation: d9pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes d9pop { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d9-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      {/* 8 ulushli polosa, 5 bo'yalgan; to'g'ri javobdan keyin ustki sanoq */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '8px 0 14px' }}>
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: D04_DEN }).map((_, i) => {
            const shaded = i < D04_NUM;
            const counted = checked && fb?.correct && i < lit;
            return (
              <div key={i} style={{ position: 'relative' }}>
                <span className={counted ? 'd9-pop' : undefined} style={{ display: 'block', width: 26, height: 46, borderRadius: 5, background: shaded ? (counted ? '#7c3aed' : '#8b5cf6') : '#ede9fe', border: '1.5px solid ' + (shaded ? '#6d28d9' : '#ddd6fe'), transition: 'background .2s' }} />
                {counted && <span className="d9-pop" style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', ...S.mono, fontSize: 12, fontWeight: 800, color: '#7c3aed' }}>{i + 1}</span>}
              </div>
            );
          })}
        </div>
        <Frac num="5" den="8" size={30} color="#6d28d9" />
      </div>
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(picked, i, D04_CORRECT, checked, isReview, { fs: 15 })} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
