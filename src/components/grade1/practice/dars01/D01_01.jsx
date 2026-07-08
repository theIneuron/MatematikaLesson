// Dars01 · Amaliyot 01 — P1 Sanash · 🟢 · Ra'no bog'da (lola) · tag: count_pick
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q.
// Animatsiya: lolalar poyadan ochiladi va shabadada tebranadi (uzluksiz harakat).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 2, options: [1, 2, 3], ptype: 'P1', level: '🟢', tag: 'count_pick' };
const T = {
  uz: {
    eyebrow: 'Ra\'noning tongi', title: 'Sanash',
    setup: 'Ra\'no ertalab bog\'ga chiqdi. Quyoshda lolalar ochilmoqda.',
    ask: 'Nechta lola ochildi?',
    correct: 'Barakalla! Ikkita lola.', hint: 'Yana sanang — har lolani bir marta bosing.',
  },
  ru: {
    eyebrow: 'Утро Рано', title: 'Счёт',
    setup: 'Рано вышла утром в сад. На солнце распускаются тюльпаны.',
    ask: 'Сколько тюльпанов распустилось?',
    correct: 'Молодец! Два тюльпана.', hint: 'Посчитай ещё — трогай каждый один раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D01_01(props) {
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
    <div className="pq pq01">
      <style>{`
        .pq01{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq01 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2f9e57;text-transform:uppercase;}
        .pq01 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq01 .pq-setup{color:#5c6672;font-weight:500;}
        .pq01 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq01 .pq-stage{position:relative;}
        .pq01 .pq-field{position:relative;display:flex;gap:26px;justify-content:center;align-items:flex-end;padding:28px 20px 20px;background:linear-gradient(#f2fbf3,#eaf7ec);border:2px solid #cfead2;border-radius:22px;overflow:hidden;}
        .pq01 .pq-field::after{content:"";position:absolute;left:0;right:0;bottom:0;height:26px;background:#d9efdc;}
        .pq01 .pq-flower{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;transform-origin:bottom center;animation:pqSway 3.2s ease-in-out infinite;}
        .pq01 .pq-flower.f1{animation-delay:.0s} .pq01 .pq-flower.f2{animation-delay:.6s}
        .pq01 .pq-bloom{font-size:46px;line-height:1;animation:pqBloom .6s cubic-bezier(.3,1.5,.5,1) both;}
        .pq01 .pq-stem{width:5px;height:42px;background:linear-gradient(#4bb768,#2f9e57);border-radius:4px;margin-top:-4px;}
        .pq01 .pq-cnt{position:absolute;top:-10px;right:-14px;min-width:24px;height:24px;padding:0 4px;border-radius:50%;background:#2563eb;color:#fff;font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq01 .pq-ans{position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:34px;font-weight:900;color:#1a7f43;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:3;}
        .pq01 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq01 .pq-opt{width:70px;height:70px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq01 .pq-opt:hover:not(:disabled){border-color:#9bd6ac;transform:translateY(-2px);}
        .pq01 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq01 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq01 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq01 .pq-opt:disabled{cursor:default;}
        .pq01 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq01 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq01 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-4deg);}50%{transform:rotate(4deg);}}
        @keyframes pqBloom{0%{opacity:0;transform:scale(.2) translateY(10px);}100%{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        <div className="pq-field">
          {ok && <span className="pq-ans">{DATA.target}</span>}
          {Array.from({ length: DATA.target }).map((_, i) => (
            <div key={i} className={'pq-flower f' + (i + 1)}>
              <span className="pq-bloom" style={{ animationDelay: `${i * 0.18}s` }}>🌷{ok && <b className="pq-cnt">{i + 1}</b>}</span>
              <span className="pq-stem" />
            </div>
          ))}
        </div>
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
