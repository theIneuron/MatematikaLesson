// ПК1 · Yangi savol 2 — Son tarkibi (7) · GEYT-ONLY (amaliyotda bajarilmagan) · tag: pk_compose_birds
// Yetti qush ikki shoxga qo'ndi. Chap shoxda 4, o'ng shoxda nechta? (son tarkibi: 7 = 4 va 3)
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q — PKHost/PracticeHost yuritadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { total: 7, left: 4, target: 3, options: [2, 3, 4], ptype: 'P6', level: '🟢', tag: 'pk_compose_birds' };
const T = {
  uz: {
    eyebrow: 'Nazorat · Son tarkibi', title: 'Nechta qush?',
    setup: 'Yetti qush ikki shoxga qo\'ndi. To\'rttasi chap shoxda.',
    ask: 'O\'ng shoxda nechta qush bor?',
    correct: 'Barakalla! To\'rt va uch — yetti.',
    hint: 'Jami yetti qush. To\'rttasi chapda. Yetti bo\'lishi uchun o\'ngga nechta kerak? Barmoqlarda sanang.',
    total: 'Jami',
  },
  ru: {
    eyebrow: 'Контроль · Состав числа', title: 'Сколько птиц?',
    setup: 'Семь птиц сели на две ветки. Четыре — на левой.',
    ask: 'Сколько птиц на правой ветке?',
    correct: 'Молодец! Четыре и три — семь.',
    hint: 'Всего семь птиц. Четыре — слева. Сколько нужно справа, чтобы стало семь? Посчитай на пальцах.',
    total: 'Всего',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bitta qush (emoji), shoxda sekin tebranadi.
const Bird = ({ delay }) => (<span className="pkq-bird" style={{ animationDelay: `${delay}s` }}>🐦</span>);

export default function PKQ02(props) {
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
    <div className="pq pkq02">
      <style>{`
        .pkq02{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pkq02 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#2f9e57;text-transform:uppercase;}
        .pkq02 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pkq02 .pq-setup{color:#5c6672;font-weight:500;}
        .pkq02 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pkq02 .pkq-scene{position:relative;padding:14px 12px 20px;background:linear-gradient(#eaf6ff,#eef8ec 70%);border:2px solid #cfe6d4;border-radius:22px;}
        .pkq02 .pkq-total{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:14px;font-size:15px;font-weight:800;color:#3a7a35;}
        .pkq02 .pkq-total b{min-width:34px;height:34px;padding:0 8px;border-radius:12px;background:#fff;border:2px solid #b7dcb9;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#1a7f43;font-variant-numeric:tabular-nums;}
        .pkq02 .pkq-branches{display:flex;gap:16px;justify-content:center;align-items:flex-start;}
        .pkq02 .pkq-branch{flex:1;max-width:150px;display:flex;flex-direction:column;align-items:center;gap:6px;}
        .pkq02 .pkq-birds{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;align-items:flex-end;min-height:64px;}
        .pkq02 .pkq-bird{font-size:26px;line-height:1;transform-origin:bottom center;animation:pkqSway 3s ease-in-out infinite;}
        .pkq02 .pkq-qm{font-size:38px;font-weight:900;color:#b06e24;animation:pkqBreath 1.9s ease-in-out infinite;}
        .pkq02 .pkq-new{animation:pkqDrop .45s cubic-bezier(.3,1.4,.5,1) both;}
        .pkq02 .pkq-bar{width:100%;height:9px;border-radius:6px;background:linear-gradient(#8a5a2a,#6b4420);box-shadow:0 2px 3px rgba(0,0,0,.18);}
        .pkq02 .pkq-lbl{font-size:12.5px;font-weight:800;color:#5c6672;text-transform:uppercase;letter-spacing:.03em;}
        .pkq02 .pkq-chip{display:block;text-align:center;margin-top:12px;font-size:20px;font-weight:900;color:#1a7f43;animation:pkqPop .5s cubic-bezier(.3,1.5,.5,1) both;font-variant-numeric:tabular-nums;}
        .pkq02 .pkq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pkq02 .pkq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.14s;}
        .pkq02 .pkq-opt:hover:not(:disabled){border-color:#9bd6ac;transform:translateY(-2px);}
        .pkq02 .pkq-opt:active:not(:disabled){transform:scale(.94);}
        .pkq02 .pkq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pkq02 .pkq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pkqCele .5s ease;}
        .pkq02 .pkq-opt:disabled{cursor:default;}
        .pkq02 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pkqIn .22s ease both;}
        .pkq02 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pkq02 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pkqSway{0%,100%{transform:rotate(-5deg);}50%{transform:rotate(5deg);}}
        @keyframes pkqBreath{0%,100%{transform:scale(1);opacity:.72;}50%{transform:scale(1.14);opacity:1;}}
        @keyframes pkqDrop{from{opacity:0;transform:translateY(-14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pkqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pkqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pkqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pkq-scene">
        <div className="pkq-total">{t.total}<b>{DATA.total}</b></div>
        <div className="pkq-branches">
          <div className="pkq-branch">
            <div className="pkq-birds">
              {Array.from({ length: DATA.left }).map((_, i) => <Bird key={i} delay={i * 0.3} />)}
            </div>
            <div className="pkq-bar" />
            <span className="pkq-lbl">{DATA.left}</span>
          </div>
          <div className="pkq-branch">
            <div className="pkq-birds">
              {ok
                ? Array.from({ length: DATA.target }).map((_, i) => <span key={i} className="pkq-bird pkq-new" style={{ animationDelay: `${i * 0.12}s` }}>🐦</span>)
                : <span className="pkq-qm">?</span>}
            </div>
            <div className="pkq-bar" />
            <span className="pkq-lbl">{ok ? DATA.target : '?'}</span>
          </div>
        </div>
        {ok && <span className="pkq-chip">{DATA.left} + {DATA.target} = {DATA.total}</span>}
      </div>

      <div className="pkq-opts">
        {DATA.options.map((n) => {
          const sel = picked === n; const right = ok && n === DATA.target;
          return <button key={n} type="button" className={'pkq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
