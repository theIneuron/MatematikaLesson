// Dars13 · Amaliyot 01 — Qaysi bo'lak katta · 🟢 · pick_image
// Mexanika: matnli variant emas — rasmning o'zini bosish (ikki non 1/2 vs 1/4).
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Frac = ({ a, b, size = 20, tone = '#1f2430' }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1, color: tone, margin: '0 2px' }}>
    <span style={{ fontSize: size, fontWeight: 700 }}>{a}</span>
    <span style={{ width: size * 1.15, height: 2, background: 'currentColor', margin: '2px 0' }} />
    <span style={{ fontSize: size, fontWeight: 700 }}>{b}</span>
  </span>
);

const FB = ({ ok, text }) => (
  <div className={'pq-fb ' + (ok ? 'ok' : 'no')}>{ok ? <IconOk /> : <IconNo />}<span>{text}</span></div>
);

function useRegister(check, registerCheck) {
  const ref = useRef(check); ref.current = check;
  useEffect(() => { registerCheck?.(() => ref.current()); }, [registerCheck]);
}

const PQ_CSS = `
  .pq { max-width: 640px; margin: 0 auto; padding: 4px 2px 8px; }
  .pq-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .04em; color: #fe5b1a; text-transform: uppercase; }
  .pq-setup { font-size: 16px; line-height: 1.5; margin: 6px 0 12px; color: #374151; }
  .pq-ask { font-size: 17px; font-weight: 700; margin: 14px 0 12px; }
  .pq-fb { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 13px 15px; border-radius: 14px; font-size: 15px; line-height: 1.45; font-weight: 600; animation: pqIn .5s ease both; }
  .pq-fb.ok { background: #e8f7ee; color: #1a7f43; }
  .pq-fb.no { background: #fdecec; color: #c0392b; }
  .pq-fb svg { flex: 0 0 auto; margin-top: 1px; }
  @keyframes pqIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .pq button:focus-visible, .pq input:focus-visible, .pq [role=button]:focus-visible { outline: 3px solid #ffb488; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { .pq *, .pq { animation: none !important; transition: none !important; } }
`;

const D13_01_DATA = { correct: 0, tag: 'compare_same_num', level: '🟢' };
const D13_01_T = {
  uz: {
    eyebrow: "Ko'rish", setup: "Ikki bir xil non. Biri 2 ta teng bo'lakka, ikkinchisi 4 ta teng bo'lakka bo'lingan. Har biridan bitta bo'lak olingan.",
    ask: "Qaysi bo'lak kattaroq? Bo'lakning o'zini bosing.",
    correct: "To'g'ri. Non qancha ko'p bo'lakka bo'linsa, har bir bo'lak shuncha mayda bo'ladi.",
    wrongMsg: "Maslahat: 4 soni 2 dan katta. Lekin bu yerda 4 — bo'laklar soni, bo'lak kattaligi emas. Rasmga qarang.",
  },
  ru: {
    eyebrow: 'Взгляд', setup: 'Два одинаковых хлеба. Один разделён на 2 равные части, другой — на 4. Из каждого взяли одну часть.',
    ask: 'Какая часть больше? Нажмите на саму часть.',
    correct: 'Верно. Чем на большее число частей делят хлеб, тем мельче каждая часть.',
    wrongMsg: 'Подсказка: 4 больше 2. Но здесь 4 — это количество частей, а не размер части. Посмотрите на рисунок.',
  },
};

export default function D13_01(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = D13_01_T[lang] || D13_01_T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [fb, setFb] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer?.studentAnswer?.idx != null) {
      setPicked(initialAnswer.studentAnswer.idx);
      if (typeof initialAnswer.correct === 'boolean') { setFb({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked != null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    const correct = picked === D13_01_DATA.correct;
    setFb({ correct }); setChecked(true);
    correct ? playCorrect?.() : playWrong?.();
    onSubmit?.({
      questionText: t.ask, options: [{ id: '0', label: '1/2' }, { id: '1', label: '1/4' }],
      studentAnswer: { idx: picked, label: picked === 0 ? '1/2' : '1/4' },
      correctAnswer: { idx: 0, label: '1/2' },
      correct, meta: { tag: D13_01_DATA.tag, level: D13_01_DATA.level },
    });
  }, [picked, t, playCorrect, playWrong, onSubmit]);
  useRegister(check, registerCheck);

  const Loaf = ({ n, idx }) => {
    const on = picked === idx;
    let ring = 'transparent';
    if (on) ring = '#fe5b1a';
    if (checked && on) ring = idx === D13_01_DATA.correct ? '#1a7f43' : '#c0392b';
    return (
      <button type="button" disabled={isReview || checked} onClick={() => setPicked(idx)}
        style={{ flex: 1, padding: 10, borderRadius: 16, border: '2.5px solid ' + (ring === 'transparent' ? '#e5e7eb' : ring), background: on ? '#f8fafc' : '#fff', cursor: (isReview || checked) ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'border-color .2s, background .2s' }}>
        <div style={{ display: 'flex', width: '100%', height: 74, border: '2px solid #1f2430', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: i === 0 ? '#f59e0b' : '#fff', boxShadow: i < n - 1 ? 'inset -2px 0 0 0 #1f2430' : 'none' }} />
          ))}
        </div>
        <div style={{ marginTop: 8 }}><Frac a={1} b={n} size={17} /></div>
      </button>
    );
  };

  return (
    <div className="pq">
      <style>{PQ_CSS}</style>
      <div className="pq-eyebrow">{t.eyebrow}</div>
      <p className="pq-setup">{t.setup}</p>
      <p className="pq-ask">{t.ask}</p>
      <div style={{ display: 'flex', gap: 12 }}><Loaf n={2} idx={0} /><Loaf n={4} idx={1} /></div>
      {fb && <FB ok={fb.correct} text={fb.correct ? t.correct : t.wrongMsg} />}
    </div>
  );
}
