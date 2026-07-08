// Dars01 · Amaliyot 06 — P1 Sanash · 🟡 · Barmoqlar · tag: count_pick
// Qo'l — katta, statik (animatsiyasiz). To'g'ri javobda pastda 1..5 sanoq chiplari.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 5, options: [3, 4, 5], ptype: 'P1', level: '🟡', tag: 'count_pick' };
const T = {
  uz: {
    eyebrow: 'Barmoq o\'yini', title: 'Sanash',
    setup: 'Ra\'no barmoqlarini ko\'rsatdi.',
    ask: 'Nechta barmoq ko\'rsatilgan?',
    correct: 'Barakalla! Beshta barmoq.', hint: 'Har barmoqni bir marta sanang.',
  },
  ru: {
    eyebrow: 'Игра пальчиков', title: 'Счёт',
    setup: 'Рано показала пальцы.',
    ask: 'Сколько пальцев показано?',
    correct: 'Молодец! Пять пальцев.', hint: 'Считай каждый палец один раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D01_06(props) {
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
    <div className="pq pq06">
      <style>{`
        .pq06{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq06 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#d98a3c;text-transform:uppercase;}
        .pq06 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq06 .pq-setup{color:#5c6672;font-weight:500;}
        .pq06 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq06 .pq-handwrap{position:relative;display:flex;flex-direction:column;align-items:center;gap:10px;padding:22px 14px;background:linear-gradient(#fdf3e9,#fbe7d2);border:2px solid #f4d6b4;border-radius:22px;}
        .pq06 .pq-hand{font-size:132px;line-height:1;filter:drop-shadow(0 6px 10px rgba(0,0,0,.18));}
        .pq06 .pq-hand.win{animation:pqCele .6s ease;}
        .pq06 .pq-ans{position:absolute;top:10px;right:16px;font-size:38px;font-weight:900;color:#1a7f43;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq06 .pq-chips{display:flex;gap:8px;}
        .pq06 .pq-chip{width:34px;height:34px;border-radius:50%;background:#2563eb;color:#fff;font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq06 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq06 .pq-opt{width:70px;height:70px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq06 .pq-opt:hover:not(:disabled){border-color:#f4d6b4;transform:translateY(-2px);}
        .pq06 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq06 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq06 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq06 .pq-opt:disabled{cursor:default;}
        .pq06 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq06 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq06 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:scale(.3);}100%{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-handwrap">
        {ok && <span className="pq-ans">{DATA.target}</span>}
        <span className={'pq-hand' + (ok ? ' win' : '')} role="img" aria-label="qo'l">🖐️</span>
        {ok && (
          <div className="pq-chips">
            {[1, 2, 3, 4, 5].map((n) => (<span key={n} className="pq-chip" style={{ animationDelay: `${(n - 1) * 0.1}s` }}>{n}</span>))}
          </div>
        )}
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
