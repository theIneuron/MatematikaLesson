// Dars02 · Amaliyot 02 — P2 Miqdor → raqam · 🟢 · Anvarning likopchasi · tag: qty_to_digit
// Olmalar likopchaga tushadi; to'g'ri javobda har olmada 1..3 sanoq.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const COUNT = 3;
const DATA = { target: 3, options: [2, 3, 4], ptype: 'P2', level: '🟢', tag: 'qty_to_digit' };
const T = {
  uz: {
    eyebrow: 'Anvarning likopchasi', title: 'Miqdorga raqam',
    setup: 'Anvar likopchaga olma qo\'ydi.',
    ask: 'Nechta olma bor? Raqamini tanlang.',
    correct: 'Barakalla! Uchta olma — uch raqami.', hint: 'Olmalarni sanang va mos raqamni tanlang.',
  },
  ru: {
    eyebrow: 'Тарелка Анвара', title: 'Цифра к количеству',
    setup: 'Анвар положил яблоки на тарелку.',
    ask: 'Сколько яблок? Выбери цифру.',
    correct: 'Молодец! Три яблока — цифра три.', hint: 'Посчитай яблоки и выбери нужную цифру.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D02_02(props) {
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
    <div className="pq pq0202">
      <style>{`
        .pq0202{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0202 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2b7fc4;text-transform:uppercase;}
        .pq0202 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq0202 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0202 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0202 .pq-stage{position:relative;}
        .pq0202 .pq-plate{position:relative;width:284px;height:140px;margin:6px auto 0;display:flex;gap:16px;justify-content:center;align-items:flex-end;padding-bottom:40px;background:radial-gradient(ellipse 54% 46% at 50% 76%,#ffffff 0 42%,#eef2f7 62%,#d3dce6 82%,#bcc7d4 96%);border:2px solid #b4c0cd;border-radius:50%;box-shadow:0 12px 18px rgba(0,0,0,.14),inset 0 -5px 10px rgba(0,0,0,.05);}
        .pq0202 .pq-plate::after{content:"";position:absolute;left:50%;top:60%;transform:translate(-50%,-50%);width:60%;height:44%;border-radius:50%;border:2px solid rgba(150,165,185,.35);pointer-events:none;}
        .pq0202 .pq-plate.win{animation:pqCele .5s ease;}
        .pq0202 .pq-apple{position:relative;font-size:46px;line-height:1;z-index:2;animation:pqDrop .5s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0202 .pq-cnt{position:absolute;top:-8px;right:-10px;min-width:22px;height:22px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq0202 .pq-ans{position:absolute;top:-4px;left:50%;transform:translateX(-50%);font-size:32px;font-weight:900;color:#1a7f43;z-index:4;animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;}
        .pq0202 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:20px;}
        .pq0202 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0202 .pq-opt:hover:not(:disabled){border-color:#c3d6ea;transform:translateY(-2px);}
        .pq0202 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0202 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0202 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0202 .pq-opt:disabled{cursor:default;}
        .pq0202 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0202 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0202 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-40px) scale(.7);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.06);}60%{transform:scale(.97);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        {ok && <span className="pq-ans">{DATA.target}</span>}
        <div className={'pq-plate' + (ok ? ' win' : '')}>
          {Array.from({ length: COUNT }).map((_, i) => (
            <span key={i} className="pq-apple" style={{ animationDelay: `${i * 0.12}s` }}>🍎{ok && <b className="pq-cnt">{i + 1}</b>}</span>
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
