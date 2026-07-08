// Dars03 · Amaliyot 08 — P1 Sanash (count-all, aralash sahna) · 🔴 · Ra'no va Anvar · tag: count_all_mixed
// 10 = 6 olma + 4 nok. Hammasini birga sanash kerak.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const APPLES = 6, PEARS = 4, COUNT = APPLES + PEARS; // 10
const ITEMS = ['🍎', '🍎', '🍐', '🍎', '🍐', '🍎', '🍎', '🍐', '🍎', '🍐']; // aralash tartib
const DATA = { target: COUNT, options: [8, 9, 10], ptype: 'P1', level: '🔴', tag: 'count_all_mixed' };
const T = {
  uz: {
    eyebrow: 'Hosil bayrami · Ra\'no va Anvar', title: 'Hammasini sana',
    setup: 'Bayram tugamoqda. Ra\'no va Anvar sovg\'a savatini tayyorlashdi: ichida olmalar ham, noklar ham bor.',
    ask: 'Savatda hammasi bo\'lib nechta meva?',
    correct: 'Barakalla! Olma va noklar birga — o\'nta meva. Sovg\'a tayyor!', hint: 'Olmani ham, nokni ham qoldirmasdan birga sanang.',
  },
  ru: {
    eyebrow: 'Праздник урожая · Рано и Анвар', title: 'Посчитай всё',
    setup: 'Праздник подходит к концу. Рано и Анвар собрали подарочную корзину: внутри и яблоки, и груши.',
    ask: 'Сколько всего фруктов в корзине?',
    correct: 'Молодец! Яблоки и груши вместе — десять фруктов. Подарок готов!', hint: 'Считай вместе и яблоки, и груши, ничего не пропуская.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D03_08(props) {
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
    <div className="pq pq0308">
      <style>{`
        .pq0308{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0308 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3a8f4d;text-transform:uppercase;}
        .pq0308 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0308 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0308 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0308 .pq-scene{position:relative;max-width:400px;margin:0 auto;padding:20px 16px 16px;border-radius:20px;background:linear-gradient(#f3fbf1,#e9f6e4);border:2px solid #d4ecc9;}
        .pq0308 .pq-basket{position:relative;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:14px 10px 10px;}
        .pq0308 .pq-item{position:relative;font-size:36px;line-height:1;animation:pqDrop .45s cubic-bezier(.3,1.4,.5,1) both,pqSway 3.2s ease-in-out infinite;}
        .pq0308 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq0308 .pq-basket{position:relative;z-index:1;padding-bottom:0;}
        .pq0308 .pq-rim{position:relative;z-index:2;height:42px;margin:-16px 14px 0;border-radius:6px 6px 44px 44px;border:2px solid #8a5a2b;border-top:5px solid #7a4a20;background:repeating-linear-gradient(115deg,rgba(122,74,32,.3) 0 7px,transparent 7px 14px),repeating-linear-gradient(65deg,rgba(122,74,32,.3) 0 7px,transparent 7px 14px),linear-gradient(#cf9f62,#96662f);box-shadow:inset 0 5px 7px rgba(0,0,0,.2),0 4px 8px rgba(122,90,43,.22);}
        .pq0308 .pq-ans{position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:32px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 14px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.2);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:2;}
        .pq0308 .pq-scene.win{animation:pqCele .5s ease;}
        .pq0308 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:24px;}
        .pq0308 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0308 .pq-opt:hover:not(:disabled){border-color:#b6dfa8;transform:translateY(-2px);}
        .pq0308 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0308 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0308 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0308 .pq-opt:disabled{cursor:default;}
        .pq0308 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0308 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0308 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-32px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className={'pq-scene' + (ok ? ' win' : '')}>
        {ok && <span className="pq-ans">= {DATA.target}</span>}
        <div className="pq-basket">
          {ITEMS.map((em, i) => (
            <span key={i} className="pq-item" style={{ animationDelay: `${i * 0.06}s, ${(i % 4) * 0.4}s` }}>
              {em}{ok && <b className="pq-cnt">{i + 1}</b>}
            </span>
          ))}
        </div>
        <div className="pq-rim" />
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
