// Dars02 · Amaliyot 06 — Son topishmog'i · 🟡 · Nilufar · tag: clue_compare
// To'g'ri javobdan keyin variantlar pastga suriladi va bo'shagan joyda 300 dan
// 310 gacha sonlar chapdan o'ngga ketma-ket yoziladi; 305 ajraladi.
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

const D06_RANGE = Array.from({ length: 11 }, (_, i) => 300 + i);
const D06_T = {
  uz: {
    eyebrow: 'Topishmoq',
    setup: "Nilufar son o'yladi: u 300 dan katta, 310 dan kichik, oxirgi raqami 5.",
    ask: "Nilufar qaysi sonni o'yladi?",
    opts: ['305', '315', '350', '205'],
    correct: "To'g'ri. 300 bilan 310 orasidagi, oxiri 5 bilan tugaydigan yagona son — 305.",
    wrongMsg: "Maslahat: bitta shart yetarli emas. Qaysi son uchala shartni ham bir vaqtda qanoatlantiradi?",
  },
  ru: {
    eyebrow: 'Загадка',
    setup: 'Нилуфар задумала число: больше 300, меньше 310, последняя цифра 5.',
    ask: 'Какое число задумала Нилуфар?',
    opts: ['305', '315', '350', '205'],
    correct: 'Верно. Единственное число между 300 и 310, оканчивающееся на 5, — это 305.',
    wrongMsg: 'Подсказка: одного условия мало. Какое число удовлетворяет всем трём условиям сразу?',
  },
};

export default function D02_06(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D06_T[lang] || D06_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);   // nechta son yozildi
  const [hi, setHi] = useState(false);     // 305 ajratildi
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const sa = initialAnswer?.studentAnswer;
    if (sa?.idx != null) {
      setPicked(sa.idx);
      if (typeof initialAnswer.correct === 'boolean') {
        setFb({ correct: initialAnswer.correct }); setChecked(true);
        if (initialAnswer.correct) { setOpen(true); setShown(11); setHi(true); }
      }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === 0;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    if (correct) {
      timers.current.push(setTimeout(() => setOpen(true), 300));
      D06_RANGE.forEach((_, i) => timers.current.push(setTimeout(() => setShown(i + 1), 1000 + i * 220)));
      timers.current.push(setTimeout(() => setHi(true), 1000 + 11 * 220 + 500));
    }
    onSubmit?.({
      questionText: t.ask, options: t.opts.map((l, i) => ({ id: String(i), label: l })),
      studentAnswer: { idx: picked, label: t.opts[picked] },
      correctAnswer: { idx: 0, label: '305' },
      correct, meta: { tag: 'clue_compare', level: '🟡' },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const optStyle = (i) => {
    const on = picked === i, show = checked && on;
    let bg = '#fff', bd = '#d6dae3', col = '#374151';
    if (on) { bg = '#fff0e8'; bd = '#fe5b1a'; col = '#1f2430'; }
    if (show) { const ok = i === 0; bg = ok ? '#e8f7ee' : '#fdecec'; bd = ok ? '#1a7f43' : '#c0392b'; col = ok ? '#1a7f43' : '#c0392b'; }
    return { flex: '1 1 45%', padding: '13px 10px', borderRadius: 13, border: '2px solid ' + bd, background: bg, color: col, fontSize: 16, fontWeight: 700, cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', minHeight: 48 };
  };

  return (
    <div style={S.wrap}>
      <div style={S.eyebrow}>{t.eyebrow}</div>
      <p style={S.setup}>{t.setup}</p>

      <div style={{ maxHeight: open ? 120 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height .8s cubic-bezier(.33,1,.42,1), opacity .6s ease' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: '12px 0 6px' }}>
          {D06_RANGE.map((n, i) => {
            const visible = i < shown;
            const star = hi && n === 305;
            return (
              <span key={n} style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: star ? 22 : 17, fontWeight: 800,
                padding: '6px 8px', borderRadius: 9,
                color: star ? '#166534' : '#64748b',
                background: star ? '#dcfce7' : 'transparent',
                opacity: visible ? 1 : 0,
                transform: visible ? (star ? 'scale(1.12)' : 'none') : 'translateY(-8px)',
                transition: 'opacity .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1), color .5s ease, background .5s ease, font-size .5s ease',
              }}>{n}</span>
            );
          })}
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
