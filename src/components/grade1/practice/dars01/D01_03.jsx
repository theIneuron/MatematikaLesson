// Dars01 · Amaliyot 03 — P2 Raqamni tanish · 🟢 · Bit robot ekrani · tag: digit_recognize
// Animatsiya: Bit robotning antennasi yonib-o'chadi, ekrandagi raqam nur sochib pulslaydi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { target: 3, options: [1, 3, 5], ptype: 'P2', level: '🟢', tag: 'digit_recognize' };
const T = {
  uz: {
    eyebrow: 'Bit robot', title: 'Raqamni tanish',
    setup: 'Bit robot ekranida bitta raqamni yoqdi.',
    ask: 'Bu qaysi raqam?',
    correct: 'Barakalla! Bu uch raqami.', hint: 'Ekranga yaxshilab qarang va aynan shu raqamni tanlang.',
  },
  ru: {
    eyebrow: 'Робот Бит', title: 'Узнай цифру',
    setup: 'Робот Бит зажёг на экране одну цифру.',
    ask: 'Какая это цифра?',
    correct: 'Молодец! Это цифра три.', hint: 'Посмотри на экран и выбери такую же цифру.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D01_03(props) {
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
    <div className="pq pq03">
      <style>{`
        .pq03{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq03 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#5b57d6;text-transform:uppercase;}
        .pq03 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq03 .pq-setup{color:#5c6672;font-weight:500;}
        .pq03 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq03 .pq-robot{display:flex;flex-direction:column;align-items:center;padding:16px;}
        .pq03 .pq-ant{width:5px;height:20px;background:#8a86e6;border-radius:3px;position:relative;}
        .pq03 .pq-ant::before{content:"";position:absolute;top:-9px;left:50%;transform:translateX(-50%);width:12px;height:12px;border-radius:50%;background:#ffd23f;box-shadow:0 0 10px #ffd23f;animation:pqBlink 1s ease-in-out infinite;}
        .pq03 .pq-head{margin-top:-2px;width:210px;background:linear-gradient(#ecebff,#dcd9fb);border:3px solid #b7b1f2;border-radius:22px;padding:16px;}
        .pq03 .pq-screen{background:#12103a;border-radius:14px;height:120px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 20px rgba(120,110,255,.4);}
        .pq03 .pq-digit{font-size:82px;font-weight:900;color:#7cf0ff;font-variant-numeric:tabular-nums;text-shadow:0 0 14px #38d6ff;animation:pqGlow 1.6s ease-in-out infinite;}
        .pq03 .pq-eyes{display:flex;gap:26px;justify-content:center;margin-top:12px;}
        .pq03 .pq-eyes span{width:16px;height:16px;border-radius:50%;background:#5b57d6;animation:pqBlink2 3s infinite;}
        .pq03 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq03 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq03 .pq-opt:hover:not(:disabled){border-color:#b7b1f2;transform:translateY(-2px);}
        .pq03 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq03 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq03 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq03 .pq-opt:disabled{cursor:default;}
        .pq03 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq03 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq03 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBlink{0%,100%{opacity:1;}50%{opacity:.35;}}
        @keyframes pqBlink2{0%,92%,100%{transform:scaleY(1);}96%{transform:scaleY(.1);}}
        @keyframes pqGlow{0%,100%{text-shadow:0 0 10px #38d6ff;transform:scale(1);}50%{text-shadow:0 0 22px #7cf0ff;transform:scale(1.05);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-robot">
        <span className="pq-ant" />
        <div className="pq-head">
          <div className="pq-screen"><span className="pq-digit">{DATA.target}</span></div>
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
