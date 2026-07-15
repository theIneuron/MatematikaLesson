// Dars03 · Amaliyot 05 — P1 Sanash «5 va yana» · 🟡 · Jasur · tag: count_five_more
// 9 = 5 va yana 4.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const FIVE = 5, MORE = 4, COUNT = FIVE + MORE; // 9
const DATA = { target: COUNT, options: [8, 9, 10], ptype: 'P1', level: '🟡', tag: 'count_five_more' };
const T = {
  uz: {
    eyebrow: 'Hosil bayrami · Jasur', title: 'Sanash',
    setup: 'Jasur bayramga bobosining bog\'idan yong\'oq olib keldi: to\'liq bitta beshlik va yana to\'rttasi.',
    ask: 'Hammasi bo\'lib nechta yong\'oq?',
    correct: 'Barakalla! Besh va yana to\'rt — to\'qqizta yong\'oq.', hint: 'Avval beshlikni, keyin qolganini sanang.',
  },
  ru: {
    eyebrow: 'Праздник урожая · Джасур', title: 'Счёт',
    setup: 'Джасур принёс на праздник орехи из дедушкиного сада: полная пятёрка и ещё четыре.',
    ask: 'Сколько всего орехов?',
    correct: 'Молодец! Пять и ещё четыре — девять орехов.', hint: 'Сначала пятёрка, потом остальные.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D03_05(props) {
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
    <div className="pq pq0305">
      <style>{`
        .pq0305{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0305 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#d6577a;text-transform:uppercase;}
        .pq0305 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq0305 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0305 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0305 .pq-stage{position:relative;display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;}
        .pq0305 .pq-tray{display:flex;flex-wrap:wrap;max-width:230px;gap:7px;padding:14px 12px;border-radius:18px;background:#fbf7ef;border:2px solid #efe6d4;justify-content:center;}
        .pq0305 .pq-tray.five{border-color:#f0c3d3;background:#fdeff4;}
        .pq0305 .pq-plus{font-size:26px;font-weight:900;color:#b9a9b1;}
        .pq0305 .pq-tray.win{animation:pqCele .5s ease;}
        .pq0305 .pq-item{position:relative;font-size:34px;line-height:1;animation:pqDrop .45s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0305 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:19px;height:19px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq0305 .pq-ans{position:absolute;top:-30px;left:50%;transform:translateX(-50%);font-size:32px;font-weight:900;color:#1a7f43;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0305 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:26px;}
        .pq0305 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0305 .pq-opt:hover:not(:disabled){border-color:#f0c3d3;transform:translateY(-2px);}
        .pq0305 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0305 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0305 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0305 .pq-opt:disabled{cursor:default;}
        .pq0305 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0305 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0305 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-32px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        {ok && <span className="pq-ans">{DATA.target}</span>}
        <div className={'pq-tray five' + (ok ? ' win' : '')}>
          {Array.from({ length: FIVE }).map((_, i) => (
            <span key={i} className="pq-item" style={{ animationDelay: `${i * 0.07}s` }}>🌰{ok && <b className="pq-cnt">{i + 1}</b>}</span>
          ))}
        </div>
        <span className="pq-plus">+</span>
        <div className={'pq-tray' + (ok ? ' win' : '')}>
          {Array.from({ length: MORE }).map((_, i) => (
            <span key={i} className="pq-item" style={{ animationDelay: `${(FIVE + i) * 0.07}s` }}>🌰{ok && <b className="pq-cnt">{FIVE + i + 1}</b>}</span>
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
