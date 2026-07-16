// Dars01 · Amaliyot 03 — Sinflarga ajratish · 🟡 · Sardor · tag: class_group
// To'g'ri javobdan keyin 102812443 bo'shliqlarga bo'linadi va har sinf o'z
// rangini oladi — o'ngdan chapga, ketma-ket.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const S = {
  wrap: { maxWidth: 640, margin: '0 auto', padding: '4px 2px 8px' },
  eyebrow: { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#fe5b1a', textTransform: 'uppercase' },
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

const NUM = '102812443';
const COLORS = ['#fe5b1a', '#7c3aed', '#0f766e']; // 102 · 812 · 443
const T = {
  uz: {
    eyebrow: 'Atrofimizda',
    setup: "Sardor sonni bo'shliqsiz ko'chirib oldi:",
    ask: "Bu son sinflarga qanday to'g'ri ajratiladi?",
    opts: ['102 812 443', '1 028 124 43', '10 281 2443'],
    correct: "To'g'ri. O'ng tomondan har uch raqamdan ajratamiz: 102 812 443.",
    wrongMsg: "Maslahat: sinflar qaysi tomondan — chapdanmi yoki o'ngdanmi — sanala boshlaydi?",
  },
  ru: {
    eyebrow: 'Вокруг нас',
    setup: 'Сардор переписал число без пробелов:',
    ask: 'Как правильно разбить число на классы?',
    opts: ['102 812 443', '1 028 124 43', '10 281 2443'],
    correct: 'Верно. Справа по три цифры: 102 812 443.',
    wrongMsg: 'Подсказка: с какой стороны начинают отсчитывать классы — слева или справа?',
  },
};

export default function D01_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [split, setSplit] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); setSplit(!!initialAnswer.correct); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 0;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) timer.current = setTimeout(() => setSplit(true), 300);
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: t.opts[0] },
      correct, meta: { tag: 'class_group', level: '🟡' },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const active = picked === i, show = checked && active;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (active) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { display: 'block', width: '100%', textAlign: 'left', padding: '13px 15px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 15.5, fontWeight: 600, cursor: (isReview || checked) ? 'default' : 'pointer', marginBottom: 9, fontFamily: 'inherit', minHeight: 48 };
  };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 20px' }}>
        {NUM.split('').map((c, i) => {
          const g = Math.floor(i / 3);                 // 0 · 1 · 2
          const delay = split ? (2 - g) * 320 : 0;     // o'ngdan chapga
          return (
            <span key={i} style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 34, fontWeight: 700, lineHeight: 1,
              color: split ? COLORS[g] : '#1f2430',
              marginLeft: split && i % 3 === 0 && i > 0 ? 16 : 0,
              transition: `color .45s ease ${delay}ms, margin-left .45s cubic-bezier(.22,1,.36,1) ${delay}ms`,
            }}>{c}</span>
          );
        })}
      </div>

      <p style={S.ask}>{t.ask}</p>
      {t.opts.map((o, i) => (
        <button key={i} type="button" style={optStyle(i)} disabled={isReview || checked} onClick={() => setPicked(i)}>{o}</button>
      ))}
      {fb && <HFB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
