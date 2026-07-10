// Dars04 · Amaliyot 08 — Uch xonali ko'paytma · 🔴 · Sardor · tag: column_mul_big
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TARGET = 273808;
const DATA = { tag: 'column_mul_big', level: '🔴' };
const T = {
  uz: {
    eyebrow: "Ko'paytirish", title: "Ko'paytma",
    setup: "Sardor uch xonali sonlarni ustunda ko'paytirdi:",
    words: '872 × 314',
    label: 'Javobni yozing:',
    live: 'Sizning javobingiz:',
    correct: "To'g'ri. 872 × 314 = 273 808.",
    wrong: "Hali to'g'ri emas. Yana bir bor o'ylab ko'ring.",
  },
  ru: {
    eyebrow: 'Умножение', title: 'Произведение',
    setup: 'Сардор умножил трёхзначные числа столбиком:',
    words: '872 × 314',
    label: 'Запишите ответ:',
    live: 'Ваш ответ:',
    correct: 'Верно. 872 × 314 = 273 808.',
    wrong: 'Пока неверно. Подумайте ещё раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const cleanInt = (raw) => String(raw).replace(/[^0-9]/g, '');
const groupSpaces = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function D04_08(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [val, setVal] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer && initialAnswer.studentAnswer.value != null) {
      setVal(String(initialAnswer.studentAnswer.value));
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(val.trim() !== '' && !checked); }, [val, checked, onReady]);

  const check = useCallback(() => {
    const v = parseInt(cleanInt(val) || '-1', 10);
    const correct = v === TARGET;
    setFeedback({ correct }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: t.setup + ' ' + t.words, options: [],
      studentAnswer: { value: v }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level },
    });
  }, [val, playCorrect, playWrong, onSubmit, t.setup, t.words]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const preview = cleanInt(val) ? groupSpaces(cleanInt(val)) : '—';
  return (
    <div className="pq pq08">
      <style>{`
        .pq08 { max-width:640px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .pq08 .pq-eyebrow { font-size:12px; font-weight:800; letter-spacing:.04em; color:#2563eb; text-transform:uppercase; }
        .pq08 .pq-setup { font-size:16px; line-height:1.5; margin:6px 0 6px; color:#374151; }
        .pq08 .pq-words { font-size:22px; font-weight:800; color:#2563eb; margin:2px 0 18px; }
        .pq08 .pq-label { display:block; font-size:14px; font-weight:600; color:#374151; margin-bottom:6px; }
        .pq08 input.pq-input { width:100%; box-sizing:border-box; font-size:24px; font-weight:800; text-align:center; padding:13px 14px; border-radius:14px; border:2px solid #d6dae3; background:#f8fafc; outline:none; font-variant-numeric:tabular-nums; }
        .pq08 input.pq-input:focus { border-color:#5b8def; background:#fff; }
        .pq08 input.pq-input:disabled { opacity:.85; }
        .pq08 .pq-live { text-align:center; margin:12px 0 2px; }
        .pq08 .pq-live-lbl { font-size:13px; color:#9aa1ad; font-weight:600; }
        .pq08 .pq-live-num { font-size:26px; font-weight:800; font-variant-numeric:tabular-nums; letter-spacing:.02em; }
        .pq08 .pq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:16px; padding:13px 15px; border-radius:14px; font-size:15px; line-height:1.45; font-weight:600; animation:pqIn .22s ease both; }
        .pq08 .pq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .pq08 .pq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes pqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        .pq08 .a { opacity:0; animation:pqUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .pq08 .a2 { animation-delay:.08s; }
        .pq08 .a3 { animation-delay:.16s; }
        @keyframes pqUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pqReveal { from { opacity:0; transform:scale(.82);} to { opacity:1; transform:scale(1);} }
        @keyframes pqPop { 0%{transform:scale(1);} 45%{transform:scale(1.05);} 100%{transform:scale(1);} }
        @keyframes pqShake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-5px);} 75%{transform:translateX(5px);} }
      `}</style>
      <div className="pq-eyebrow a">{t.eyebrow}</div>
      <p className="pq-setup a a2">{t.setup}</p>
      <p className="pq-words a a3">{t.words}</p>
      <label className="pq-label" htmlFor="pq08-in">{t.label}</label>
      <input id="pq08-in" className="pq-input" value={val} onChange={(e) => setVal(cleanInt(e.target.value))} inputMode="numeric" pattern="[0-9]*" disabled={isReview || checked} placeholder="0" />
      <div className="pq-live">
        <div className="pq-live-lbl">{t.live}</div>
        <div className="pq-live-num" style={{ color: checked ? (feedback?.correct ? '#1a7f43' : '#c0392b') : '#1f2430' }}>{preview}</div>
      </div>
      {feedback && (
        <div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.correct ? t.correct : t.wrong}</span>
        </div>
      )}
    </div>
  );
}
