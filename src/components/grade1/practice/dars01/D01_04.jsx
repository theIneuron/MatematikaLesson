// Dars01 · Amaliyot 04 — P1 Sanash · 🟡 · Zuhra osmonga qaraydi (yulduz) · tag: count_pick
// Animatsiya: yulduzlar birma-bir yonadi va miltillaydi (uzluksiz).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 4, options: [3, 4, 5], ptype: 'P1', level: '🟡', tag: 'count_pick' };
const POS = [[18, 32], [40, 18], [62, 40], [82, 24]];
const T = {
  uz: {
    eyebrow: 'Kechqurun', title: 'Sanash',
    setup: 'Kech kirdi. Zuhra deraza oldida osmonga qaraydi. Yulduzlar birin-ketin yonmoqda.',
    ask: 'Nechta yulduz yondi?',
    correct: 'Barakalla! To\'rtta yulduz.', hint: 'Yana sanang — har yulduzni bir marta bosing.',
  },
  ru: {
    eyebrow: 'Вечером', title: 'Счёт',
    setup: 'Настал вечер. Зухра у окна смотрит на небо. Звёзды загораются одна за другой.',
    ask: 'Сколько звёзд загорелось?',
    correct: 'Молодец! Четыре звезды.', hint: 'Посчитай ещё — трогай каждую один раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D01_04(props) {
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
    <div className="pq pq04">
      <style>{`
        .pq04{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq04 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a5bd6;text-transform:uppercase;}
        .pq04 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq04 .pq-setup{color:#5c6672;font-weight:500;}
        .pq04 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq04 .pq-sky{position:relative;height:200px;background:linear-gradient(#2a2a5e,#3d3573);border-radius:22px;overflow:hidden;}
        .pq04 .pq-moon{position:absolute;top:16px;right:22px;font-size:38px;animation:pqFloat 5s ease-in-out infinite;}
        .pq04 .pq-star{position:absolute;font-size:34px;transform:translate(-50%,-50%);animation:pqTw 2.2s ease-in-out infinite;}
        .pq04 .pq-cnt{position:absolute;top:-14px;right:-14px;min-width:22px;height:22px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq04 .pq-ans{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-size:36px;font-weight:900;color:#ffe27a;z-index:4;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq04 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq04 .pq-opt{width:70px;height:70px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq04 .pq-opt:hover:not(:disabled){border-color:#c3b1f0;transform:translateY(-2px);}
        .pq04 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq04 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq04 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq04 .pq-opt:disabled{cursor:default;}
        .pq04 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq04 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq04 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqTw{0%,100%{opacity:.55;transform:translate(-50%,-50%) scale(.9);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.12);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-sky">
        <span className="pq-moon">🌙</span>
        {ok && <span className="pq-ans">{DATA.target}</span>}
        {POS.map((p, i) => (
          <span key={i} className="pq-star" style={{ left: p[0] + '%', top: p[1] + '%', animationDelay: `${i * 0.4}s` }}>⭐{ok && <b className="pq-cnt">{i + 1}</b>}</span>
        ))}
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
