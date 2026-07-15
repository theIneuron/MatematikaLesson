// Dars01 · Amaliyot 07 — P1 Sanash (tarqoq) · 🟡 · Chamanzorda kapalaklar · tag: count_pick
// Animatsiya: kapalaklar tarqoq joyda uzluksiz uchib yuradi (har biri boshqa yo'l bilan).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 4, options: [3, 4, 5], ptype: 'P1', level: '🔴', tag: 'count_selective' };
const POS = [[14, 24], [70, 18], [38, 58], [82, 62]];   // kapalaklar (sanaladi)
const BEES = [[50, 30], [26, 48]];                       // asalarilar (chalg'ituvchi — sanalmaydi)
const T = {
  uz: {
    eyebrow: 'Bog\'da', title: 'Sanash',
    setup: 'Ra\'no bog\'da yuribdi. Gullar ustida kapalaklar ham, asalarilar ham uchmoqda.',
    ask: 'Nechta kapalak uchmoqda?',
    correct: 'Barakalla! To\'rtta kapalak.', hint: 'Faqat kapalaklarni sanang — asalarilarni sanamang.',
  },
  ru: {
    eyebrow: 'В саду', title: 'Счёт',
    setup: 'Рано гуляет в саду. Над цветами летают и бабочки, и пчёлы.',
    ask: 'Сколько бабочек летает?',
    correct: 'Молодец! Четыре бабочки.', hint: 'Считай только бабочек, пчёл не считай.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D01_07(props) {
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
    <div className="pq pq07">
      <style>{`
        .pq07{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq07 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#3aa06a;text-transform:uppercase;}
        .pq07 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq07 .pq-setup{color:#5c6672;font-weight:500;}
        .pq07 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq07 .pq-mead{position:relative;height:210px;background:linear-gradient(#eafaf0,#d6f2e0);border:2px solid #bfe8cd;border-radius:22px;overflow:hidden;}
        .pq07 .pq-grass{position:absolute;left:0;right:0;bottom:0;height:30px;background:repeating-linear-gradient(90deg,#8fd6a3 0 8px,#7fce95 8px 16px);z-index:1;}
        .pq07 .pq-flor{position:absolute;bottom:20px;font-size:30px;z-index:2;filter:drop-shadow(0 2px 1px rgba(0,0,0,.12));}
        .pq07 .pq-fly{position:absolute;font-size:34px;transform:translate(-50%,-50%);animation:pqFly 4s ease-in-out infinite;z-index:3;}
        .pq07 .pq-cnt{position:absolute;top:-14px;right:-12px;min-width:22px;height:22px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq07 .pq-ans{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:36px;font-weight:900;color:#1a7f43;z-index:5;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq07 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq07 .pq-opt{width:70px;height:70px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq07 .pq-opt:hover:not(:disabled){border-color:#bfe8cd;transform:translateY(-2px);}
        .pq07 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq07 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq07 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq07 .pq-opt:disabled{cursor:default;}
        .pq07 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq07 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq07 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqFly{0%{transform:translate(-50%,-50%);}25%{transform:translate(-30%,-70%) rotate(8deg);}50%{transform:translate(-60%,-40%) rotate(-6deg);}75%{transform:translate(-40%,-60%) rotate(6deg);}100%{transform:translate(-50%,-50%);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-mead">
        {ok && <span className="pq-ans">{DATA.target}</span>}
        <div className="pq-grass" />
        {['10%', '30%', '50%', '70%', '90%'].map((l, i) => (<span key={l} className="pq-flor" style={{ left: l }}>{i % 2 ? '🌼' : '🌸'}</span>))}
        {BEES.map((p, i) => (
          <span key={'bee' + i} className="pq-fly pq-bee" style={{ left: p[0] + '%', top: p[1] + '%', animationDelay: `${i * 0.7 + 0.3}s` }}>🐝</span>
        ))}
        {POS.map((p, i) => (
          <span key={i} className="pq-fly" style={{ left: p[0] + '%', top: p[1] + '%', animationDelay: `${i * 0.5}s` }}>🦋{ok && <b className="pq-cnt">{i + 1}</b>}</span>
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
