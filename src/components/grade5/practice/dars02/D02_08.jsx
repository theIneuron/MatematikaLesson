// Dars02 · Amaliyot 08 — Aholi sonini milliongacha yaxlitlash · 🔴 · tag: round_big_context
// To'g'ri javobdan keyin: berilgan son chapdan o'ngga o'chiriladi, so'ng natija
// o'ngdan chapga yoziladi. Sekin.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#2563eb', textTransform: 'uppercase' },
  setup: { fontSize: 16, lineHeight: 1.5, margin: '6px 0 12px', color: '#374151' },
  ask: { fontSize: 17, fontWeight: 700, margin: '14px 0 12px' },
};
const HFB = ({ ok, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: '13px 15px', borderRadius: 14, fontSize: 15, lineHeight: 1.45, fontWeight: 600, background: ok ? '#e8f7ee' : '#fdecec', color: ok ? '#1a7f43' : '#c0392b' }}>
    {ok ? <IconOk /> : <IconNo />}<span>{text}</span>
  </div>
);
function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const D08_FROM = '7 137 577 750';
const D08_TO = '7 138 000 000';
const D08_ERASE_STEP = 150, D08_WRITE_STEP = 170;
const D08_T = {
  uz: {
    eyebrow: 'Dunyoda',
    setup: '2014-yilda dunyo aholisi 7 137 577 750 kishiga yetdi.',
    ask: 'Bu sonni milliongacha yaxlitlang.',
    opts: ['7 138 000 000', '7 137 000 000', '7 000 000 000', '7 137 578 000'],
    correct: "To'g'ri. Millionlardan keyingi raqam 5, shuning uchun millionlarga bir qo'shiladi va o'ngdagi hamma xonalar nolga aylanadi.",
    wrongMsg: "Maslahat: o'ngdagi raqamlar nolga aylanadi. Asosiy savol — millionlar o'sadimi yoki o'zgarishsiz qoladimi?",
  },
  ru: {
    eyebrow: 'В мире',
    setup: 'В 2014 году население мира достигло 7 137 577 750 человек.',
    ask: 'Округлите это число до миллионов.',
    opts: ['7 138 000 000', '7 137 000 000', '7 000 000 000', '7 137 578 000'],
    correct: 'Верно. После миллионов стоит 5, поэтому миллионы увеличиваются на единицу, а все разряды справа становятся нулями.',
    wrongMsg: 'Подсказка: цифры справа станут нулями. Главный вопрос — увеличатся ли миллионы или останутся без изменения?',
  },
};

export default function D02_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D08_T[lang] || D08_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [erase, setErase] = useState(false);
  const [write, setWrite] = useState(false);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); if (initialAnswer.correct) { setErase(true); setWrite(true); } }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 0;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => setErase(true), 450));
      timers.current.push(setTimeout(() => setWrite(true), 450 + D08_FROM.length * D08_ERASE_STEP + 500));
    }
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: D08_TO },
      correct, meta: { tag: 'round_big_context', level: '🔴' },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#eaf0fe'; bd = '#2563eb'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '12px 8px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 14.5, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 };
  };

  const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 24, fontWeight: 700 };
  const N = D08_FROM.length;

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ position: 'relative', height: 46, margin: '16px 0 18px' }}>
        {/* berilgan son — chapdan o'ngga o'chiriladi */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', ...mono }}>
          {D08_FROM.split('').map((c, i) => (
            <span key={i} style={{
              width: c === ' ' ? 9 : 16, textAlign: 'center', color: '#1f2430',
              opacity: erase ? 0 : 1, transform: erase ? 'translateY(10px)' : 'none',
              transition: `opacity .45s ease ${i * D08_ERASE_STEP}ms, transform .45s ease ${i * D08_ERASE_STEP}ms`,
            }}>{c === ' ' ? ' ' : c}</span>
          ))}
        </div>
        {/* natija — o'ngdan chapga yoziladi */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', ...mono }}>
          {D08_TO.split('').map((c, i) => (
            <span key={i} style={{
              width: c === ' ' ? 9 : 16, textAlign: 'center', color: '#1a7f43',
              opacity: write ? 1 : 0, transform: write ? 'none' : 'translateY(-10px)',
              transition: `opacity .4s ease ${(N - 1 - i) * D08_WRITE_STEP}ms, transform .4s cubic-bezier(.22,1,.36,1) ${(N - 1 - i) * D08_WRITE_STEP}ms`,
            }}>{c === ' ' ? ' ' : c}</span>
          ))}
        </div>
      </div>

      <p style={S.ask}>{t.ask}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
        {t.opts.map((o, i) => <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>)}
      </div>
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
