// Dars03 · Amaliyot 02 — P2 Raqamni tanish · 🟢 · Anvar · tag: digit_recognize
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 7, options: [6, 7, 8], ptype: 'P2', level: '🟢', tag: 'digit_recognize' };
const T = {
  uz: {
    eyebrow: 'Hosil bayrami · Anvar', title: 'Raqamni tanish',
    setup: 'Anvar bayramda stollarga raqam kartalarini ilmoqda. Mana navbatdagi stolning kartasi.',
    ask: 'Bu qaysi raqam?',
    correct: 'Barakalla! Bu yetti — yettinchi stol tayyor.', hint: 'Kartaga qarang va shu raqamni tanlang.',
  },
  ru: {
    eyebrow: 'Праздник урожая · Анвар', title: 'Узнай цифру',
    setup: 'Анвар развешивает на праздничные столы карточки с номерами. Вот карточка следующего стола.',
    ask: 'Какая это цифра?',
    correct: 'Молодец! Это семь — седьмой стол готов.', hint: 'Посмотри на карточку и выбери эту цифру.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D03_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === DATA.target;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options.map(String), studentAnswer: { value: picked }, correctAnswer: { value: DATA.target }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0302">
      <style>{`
        .pq0302{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0302 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b7fc4;text-transform:uppercase;}
        .pq0302 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq0302 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0302 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0302 .pq-stage{display:flex;justify-content:center;padding:18px;}
        .pq0302 .pq-card{position:relative;width:150px;height:190px;border-radius:20px;background:linear-gradient(#fff,#eef4fb);border:3px solid #cfe0f0;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(43,127,196,.16);animation:pqFloat 3.4s ease-in-out infinite;}
        .pq0302 .pq-digit{font-size:104px;font-weight:900;color:#2b7fc4;font-variant-numeric:tabular-nums;line-height:1;}
        .pq0302 .pq-card.win{animation:pqCele .6s ease;}
        .pq0302 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq0302 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0302 .pq-opt:hover:not(:disabled){border-color:#cfe0f0;transform:translateY(-2px);}
        .pq0302 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0302 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0302 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0302 .pq-opt:disabled{cursor:default;}
        .pq0302 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0302 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0302 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqFloat{0%,100%{transform:translateY(0) rotate(-1.5deg);}50%{transform:translateY(-8px) rotate(1.5deg);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className={'pq-card' + (ok ? ' win' : '')}><span className="pq-digit">{DATA.target}</span></div>
      </div>

      <div className="pq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
