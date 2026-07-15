// Dars25 · Amaliyot 09 — Xatoni top · 🟡 · tag: compare_find_error
// Jasur: 0,45 > 0,5 ("45 > 5"). Xato — raqamlar sonini emas, o'ndan xonasini solishtirish kerak. To'g'ri: 0,45 < 0,5.
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
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
const RuleChip = ({ text }) => (
  <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 13px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: '#faf5ff', border: '1.5px solid #e9d5ff', color: '#7c3aed' }}>
    <span style={{ fontSize: 15 }}>💡</span><span>{text}</span>
  </div>
);
function useReg(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D09_CORRECT = 0;
const D09_T = {
  uz: {
    eyebrow: 'Xatoni top', setup: "Jasur shunday yozdi: 0,45 > 0,5, «chunki 45, 5 dan katta». Ustoz bu yerda xato borligini aytdi.",
    ask: 'Xato qayerda?',
    opts: ["Raqamlar sonini emas, xonalarni solishtirish kerak. o'ndan: 4 < 5, demak 0,45 < 0,5.", "Belgi to'g'ri, lekin sonlar noto'g'ri.", "Xato yo'q, 0,45 haqiqatan katta."],
    correct: "To'g'ri. Verguldan keyingi raqamlar soni katta bo'lsa ham son katta bo'lmaydi. o'ndan 4 < 5 → 0,45 < 0,5.",
    wrong: "Jasur nimaga qarab solishtirdi? Uning fikri qaysi joyda buziladi?",
    rule: "O'nli sonlarni xonama-xona solishtir (o'ndandan). 0,45 < 0,5.",
  },
  ru: {
    eyebrow: 'Найди ошибку', setup: 'Жасур написал: 0,45 > 0,5, «потому что 45 больше 5». Учитель сказал, что здесь есть ошибка.',
    ask: 'Где ошибка?',
    opts: ['Сравнивать надо разряды, а не число цифр. Десятые: 4 < 5, значит 0,45 < 0,5.', 'Знак верный, но числа неверные.', 'Ошибки нет, 0,45 действительно больше.'],
    correct: 'Верно. Даже если после запятой больше цифр, число не становится больше. Десятые 4 < 5 → 0,45 < 0,5.',
    wrong: 'На что смотрел Жасур при сравнении? В каком месте его рассуждение ломается?',
    rule: 'Десятичные сравнивай поразрядно (с десятых). 0,45 < 0,5.',
  },
};

export default function D25_09(props) {
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
    onSubmit?.({ questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })), studentAnswer: { idx: picked, label: t.opts[picked] }, correctAnswer: { idx: D09_CORRECT }, correct, meta: { tag: 'compare_find_error', level: '🟡' } });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useReg(check, registerCheck);
  return (
    <div style={S.wrap}>
      <style>{`
        .d25-pop { animation: d25pop .6s cubic-bezier(.34,1.4,.64,1) both; }
        @keyframes d25pop { 0% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .d25-pop { animation: none !important; } }
      `}</style>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0 4px', padding: '10px', borderRadius: 12, background: '#fef7f7', border: '1.5px dashed #f6bcbc' }}>
        <span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>0,45</span><span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#c0392b' }}>&gt;</span><span style={{ ...S.mono, fontSize: 26, fontWeight: 800, color: '#1f2430' }}>0,5</span>
      </div>
      {checked && fb?.correct && (
        <div className="d25-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '4px 0' }}>
          <span style={{ ...S.mono, fontSize: 15, fontWeight: 800, color: '#1a7f43' }}>{lang === 'uz' ? "To'g'risi:" : 'Верно:'}</span><span style={{ ...S.mono, fontSize: 22, fontWeight: 800, color: '#1a7f43' }}>0,45 &lt; 0,5</span>
        </div>
      )}
      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {t.opts.map((o, i) => {
          const on = picked === i;
          let bd = '#d6dae3', bg = '#fff', col = '#374151';
          if (on) { bd = '#2563eb'; bg = '#eaf0fe'; col = '#1f2430'; }
          if (checked && on) { const ok = i === D09_CORRECT; bd = ok ? '#1a7f43' : '#c0392b'; bg = ok ? '#e8f7ee' : '#fdecec'; col = ok ? '#1a7f43' : '#c0392b'; }
          return <button key={i} type="button" disabled={isReview || checked} onClick={() => setPicked(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 }}>{o}</button>;
        })}
      </div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrong} />}
      {checked && fb?.correct && t.rule && <RuleChip text={t.rule} />}
    </div>
  );
}
