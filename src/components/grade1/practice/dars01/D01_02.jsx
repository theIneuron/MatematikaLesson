// Dars01 · Amaliyot 02 — P1 Sanash · 🟢 · Anvarning akvariumi (baliq) · tag: count_pick
// Animatsiya: baliqlar chapdan o'ngga suzadi (uzluksiz), pufakchalar ko'tariladi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 3, options: [2, 3, 4], ptype: 'P1', level: '🟢', tag: 'count_pick' };
const T = {
  uz: {
    eyebrow: 'Anvarnikida', title: 'Sanash',
    setup: 'Ra\'no do\'sti Anvarnikiga keldi. Akvariumda baliqlar suzmoqda.',
    ask: 'Nechta baliq suzmoqda?',
    correct: 'Barakalla! Uchta baliq.', hint: 'Yana sanang — har baliqni bir marta bosing.',
  },
  ru: {
    eyebrow: 'У Анвара', title: 'Счёт',
    setup: 'Рано пришла к другу Анвару. В аквариуме плавают рыбки.',
    ask: 'Сколько рыбок плавает?',
    correct: 'Молодец! Три рыбки.', hint: 'Посчитай ещё — трогай каждую один раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D01_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // har baliq yo'lning tasodifiy nuqtasidan boshlansin (manfiy animation-delay)
  const [delays] = useState(() => [12, 14, 13].map((d) => -(Math.random() * d)));

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
    <div className="pq pq02">
      <style>{`
        .pq02{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq02 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b7fc4;text-transform:uppercase;}
        .pq02 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq02 .pq-setup{color:#5c6672;font-weight:500;}
        .pq02 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq02 .pq-tank{position:relative;height:200px;background:linear-gradient(#dff1fb,#bfe3f6);border:3px solid #8ecdee;border-radius:22px;overflow:hidden;}
        .pq02 .pq-sand{position:absolute;left:0;right:0;bottom:0;height:20px;background:linear-gradient(#efe2c2,#e2d1a6);border-top:2px solid #d8c48f;z-index:1;}
        .pq02 .pq-weed{position:absolute;bottom:12px;font-size:24px;z-index:1;}
        .pq02 .pq-fish{position:absolute;z-index:2;}
        .pq02 .pq-fishimg{display:inline-block;font-size:38px;line-height:1;}
        .pq02 .pq-fish.b1{top:24px;animation:pqSwimR 12s linear infinite;} .pq02 .pq-fish.b1 .pq-fishimg{transform:scaleX(-1);}
        .pq02 .pq-fish.b2{top:78px;animation:pqSwimR 14s linear infinite;} .pq02 .pq-fish.b2 .pq-fishimg{transform:scaleX(-1);}
        .pq02 .pq-fish.b3{top:120px;animation:pqSwimL 13s linear infinite;}
        .pq02 .pq-cnt{position:absolute;top:-12px;right:-8px;min-width:22px;height:22px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq02 .pq-bub{position:absolute;bottom:0;width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.7);animation:pqBub 3.4s linear infinite;}
        .pq02 .pq-ans{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:36px;font-weight:900;color:#0e6bb0;z-index:4;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq02 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq02 .pq-opt{width:70px;height:70px;font-size:28px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq02 .pq-opt:hover:not(:disabled){border-color:#8ecdee;transform:translateY(-2px);}
        .pq02 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq02 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq02 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq02 .pq-opt:disabled{cursor:default;}
        .pq02 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq02 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq02 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSwimR{from{left:-52px;}to{left:calc(100% + 8px);}}
        @keyframes pqSwimL{from{left:calc(100% + 8px);}to{left:-52px;}}
        @keyframes pqBub{0%{transform:translateY(0);opacity:0;}20%{opacity:1;}100%{transform:translateY(-150px);opacity:0;}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-tank">
        {ok && <span className="pq-ans">{DATA.target}</span>}
        <div className="pq-sand" />
        <span className="pq-weed" style={{ left: '16%' }}>🌿</span>
        <span className="pq-weed" style={{ left: '78%' }}>🪸</span>
        {[14, 40, 66].map((l, i) => (<span key={l} className="pq-bub" style={{ left: l + '%', animationDelay: `${i * 0.9}s` }} />))}
        {['b1', 'b2', 'b3'].map((c, i) => (
          <span key={c} className={'pq-fish ' + c} style={{ animationDelay: delays[i] + 's' }}><span className="pq-fishimg">🐠</span>{ok && <b className="pq-cnt">{i + 1}</b>}</span>
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
