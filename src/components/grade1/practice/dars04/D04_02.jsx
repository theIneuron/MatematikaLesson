// Dars04 · Amaliyot 02 — P2 Sanash 6–10 (razogrev-spiral) · 🟢 · Anvar · tag: count_warmup
// Pingvin hovuzida 7 baliq suzmoqda — sanash takrori (Dars03 dan spiral).
// Vizual: pingvin va baliqlar — chizilgan SVG (D03_04 Bird/Tree kanon uslubi);
// baliq kanoni o'ngga qaragan, shu bois flip endi fL/dir=-1 tomonda (harakat yo'nalishi o'zgarmagan).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const COUNT = 7;
const DATA = { target: COUNT, options: [6, 7, 8], ptype: 'P2', level: '🟢', tag: 'count_warmup' };
const FISH = [
  { x: 8, y: 18, d: 7.2, dir: 1 }, { x: 52, y: 10, d: 8.4, dir: -1 }, { x: 26, y: 44, d: 6.6, dir: 1 },
  { x: 66, y: 38, d: 7.8, dir: -1 }, { x: 12, y: 66, d: 8.8, dir: 1 }, { x: 46, y: 62, d: 7.0, dir: -1 },
  { x: 74, y: 70, d: 8.0, dir: 1 },
];
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Anvar', title: 'Sanash',
    setup: 'Anvar pingvinlar hovuziga qaradi: ichida baliqlar suzib yuribdi.',
    ask: 'Hovuzda nechta baliq suzmoqda?',
    correct: 'Barakalla! Yettita baliq — pingvinlarga tushlik yetadi.', hint: 'Har baliqni bir marta sanang, hech birini qoldirmang.',
  },
  ru: {
    eyebrow: 'Зоопарк · Анвар', title: 'Счёт',
    setup: 'Анвар заглянул в бассейн пингвинов: там плавают рыбки.',
    ask: 'Сколько рыбок плавает в бассейне?',
    correct: 'Молодец! Семь рыбок — пингвинам хватит на обед.', hint: 'Считай каждую рыбку один раз, ничего не пропуская.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan pingvin (old ko'rinish): qora-ko'kimtir tana + oq qorin/yuz,
// sariq tumshuq va oyoqlar, sekin qoqadigan qanotchalar, blikli ko'zlar.
const Penguin = () => (
  <svg viewBox="0 0 44 54" width="40" height="49" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="22" cy="31" rx="15" ry="21" fill="#2b3340" stroke="#1d232d" strokeWidth="1.5" />
    <path d="M10 18 Q14 11 22 10.5" stroke="#39424f" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8" />
    <path className="pq-wingL" d="M7.5 24 Q2.5 33 7 43 Q11.5 40 11 28 Q10 25 7.5 24 Z" fill="#1d232d" />
    <path className="pq-wingR" d="M36.5 24 Q41.5 33 37 43 Q32.5 40 33 28 Q34 25 36.5 24 Z" fill="#1d232d" />
    <ellipse cx="17" cy="16.8" rx="5.8" ry="5.6" fill="#f4f7fa" />
    <ellipse cx="27" cy="16.8" rx="5.8" ry="5.6" fill="#f4f7fa" />
    <ellipse cx="22" cy="35" rx="10.5" ry="13.5" fill="#f4f7fa" />
    <circle cx="18.4" cy="16" r="2" fill="#1f2430" />
    <circle cx="19.1" cy="15.3" r="0.7" fill="#fff" />
    <circle cx="25.6" cy="16" r="2" fill="#1f2430" />
    <circle cx="26.3" cy="15.3" r="0.7" fill="#fff" />
    <polygon points="19.2,19.6 24.8,19.6 22,24" fill="#f2a63a" stroke="#d98a1f" strokeWidth="1" strokeLinejoin="round" />
    <ellipse cx="15.5" cy="51" rx="5" ry="2.6" fill="#e8983a" stroke="#d98a1f" strokeWidth="1" />
    <ellipse cx="28.5" cy="51" rx="5" ry="2.6" fill="#e8983a" stroke="#d98a1f" strokeWidth="1" />
  </svg>
);

// Kanon baliq (yon ko'rinish, O'NGGA qaragan): tomchi-shakl tana #e8883a,
// qorni ochroq #f6c07a, uchburchak dum + kichik suzgich #c96a24, blikli ko'z, og'iz chizig'i.
const Fish = () => (
  <svg viewBox="0 0 34 22" width="30" height="19" aria-hidden="true" style={{ display: 'block' }}>
    <path className="pq-tail" d="M8 11 L1 4.5 L3.5 11 L1 17.5 Z" fill="#c96a24" stroke="#c96a24" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6 11 Q13 2.5 22 3.5 Q30 5 32.5 11 Q30 17 22 18.5 Q13 19.5 6 11 Z" fill="#e8883a" stroke="#c96a24" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 14 Q18 18 27 14.5 Q22 17.5 15 17 Q12 16 10 14 Z" fill="#f6c07a" />
    <path d="M15 10 Q19 7.5 21 11 Q18 13.5 15 12 Z" fill="#c96a24" />
    <circle cx="26.5" cy="8.5" r="1.9" fill="#1f2430" />
    <circle cx="27.2" cy="7.9" r="0.65" fill="#fff" />
    <path d="M31 12.5 q-1.6 1 -3 .6" stroke="#c96a24" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </svg>
);

export default function D04_02(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);
  // har baliq tasodifiy joydan boshlaydi (manfiy delay) — brauzer-komponentda Math.random mumkin
  const [delays] = useState(() => FISH.map((f) => -(Math.random() * f.d)));

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
    <div className="pq pq0402">
      <style>{`
        .pq0402{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0402 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b7fc4;text-transform:uppercase;}
        .pq0402 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0402 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0402 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0402 .pq-pool{position:relative;width:300px;height:170px;margin:0 auto;border-radius:24px;background:linear-gradient(#bfe3f7,#7cc0e8 70%,#5aa9d8);border:4px solid #dcedf7;box-shadow:inset 0 6px 14px rgba(20,80,120,.18);overflow:hidden;}
        .pq0402 .pq-peng{position:absolute;top:-4px;right:10px;line-height:0;animation:pqSway 2.4s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));z-index:2;}
        .pq0402 .pq-wingL{transform-box:fill-box;transform-origin:85% 10%;animation:pqWingL 2.4s ease-in-out infinite alternate;}
        .pq0402 .pq-wingR{transform-box:fill-box;transform-origin:15% 10%;animation:pqWingR 2.4s ease-in-out infinite alternate;}
        .pq0402 .pq-wave{position:absolute;left:0;right:0;top:8px;height:6px;border-radius:3px;background:rgba(255,255,255,.4);animation:pqWave 3.2s ease-in-out infinite;}
        .pq0402 .pq-fish{position:absolute;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0402 .pq-fish span{display:inline-block;line-height:0;}
        .pq0402 .pq-tail{transform-box:fill-box;transform-origin:100% 50%;animation:pqTail 1s ease-in-out infinite alternate;}
        .pq0402 .pq-fish.fR{animation:pqPatrol ease-in-out infinite alternate;}
        .pq0402 .pq-fish.fL{animation:pqPatrol ease-in-out infinite alternate-reverse;} .pq0402 .pq-fish.fL span{transform:scaleX(-1);}
        .pq0402 .pq-cnt{position:absolute;top:-9px;right:-9px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#1d4ed8;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;z-index:3;}
        .pq0402 .pq-ans{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:44px;font-weight:900;color:#fff;text-shadow:0 2px 10px rgba(13,60,95,.6);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:3;}
        .pq0402 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:22px;}
        .pq0402 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0402 .pq-opt:hover:not(:disabled){border-color:#a9cfe8;transform:translateY(-2px);}
        .pq0402 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0402 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0402 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0402 .pq-opt:disabled{cursor:default;}
        .pq0402 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0402 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0402 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-5deg);}50%{transform:rotate(5deg);}}
        @keyframes pqWingL{from{transform:rotate(-3deg);}to{transform:rotate(9deg);}}
        @keyframes pqWingR{from{transform:rotate(3deg);}to{transform:rotate(-9deg);}}
        @keyframes pqTail{from{transform:rotate(9deg);}to{transform:rotate(-9deg);}}
        @keyframes pqWave{0%,100%{transform:translateX(-8px);}50%{transform:translateX(8px);}}
        @keyframes pqPatrol{from{transform:translateX(-16px);}to{transform:translateX(16px);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translate(-50%,-50%) scale(.3);}100%{opacity:1;transform:translate(-50%,-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-pool">
        <span className="pq-wave" />
        <span className="pq-peng"><Penguin /></span>
        {FISH.map((f, i) => (
          <span key={i} className={'pq-fish ' + (ok ? '' : (f.dir === 1 ? 'fR' : 'fL'))}
            style={ok
              ? { left: `${10 + (i % 4) * 24}%`, top: `${20 + Math.floor(i / 4) * 38}%` }
              : { left: `${f.x}%`, top: `${f.y}%`, animationDuration: `${f.d / 2}s`, animationDelay: `${delays[i]}s` }}>
            <span style={ok && f.dir === -1 ? { transform: 'scaleX(-1)' } : undefined}><Fish /></span>
            {ok && <b className="pq-cnt">{i + 1}</b>}
          </span>
        ))}
        {ok && <span className="pq-ans">= {COUNT}</span>}
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
