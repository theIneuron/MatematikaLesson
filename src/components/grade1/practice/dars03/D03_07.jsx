// Dars03 · Amaliyot 07 — P2 Tartib · 🟡 · 6, 7, _, 9 — qaysi raqam tushib qoldi · tag: sequence_gap
// Ketma-ketlikda bo'sh katak; to'g'ri javobda katakka raqam tushadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const SEQ = [6, 7, null, 9];         // null — bo'sh katak
const DATA = { target: 8, options: [7, 8, 10], ptype: 'P2', level: '🟡', tag: 'sequence_gap' };
const T = {
  uz: {
    eyebrow: 'Hosil bayrami · Zuhra', title: 'Tartibni to\'ldir',
    setup: 'Zuhra bayram stollarini tartib bilan raqamlamoqda, lekin bitta stolning kartasi yo\'qolib qoldi.',
    ask: 'Yo\'qolgan karta qaysi raqam?',
    correct: 'Barakalla! Yo\'qolgani — sakkiz. Endi mehmonlar adashmaydi.', hint: 'Sanang: olti, yetti, keyin nechta keladi?',
  },
  ru: {
    eyebrow: 'Праздник урожая · Зухра', title: 'Заполни ряд',
    setup: 'Зухра нумерует праздничные столы по порядку, но карточка одного стола потерялась.',
    ask: 'Какая цифра на потерянной карточке?',
    correct: 'Молодец! Потерялась восьмёрка. Теперь гости не заблудятся.', hint: 'Считай: шесть, семь, а дальше сколько?',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function D03_07(props) {
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
    <div className="pq pq0307">
      <style>{`
        .pq0307{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0307 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a5bd6;text-transform:uppercase;}
        .pq0307 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 16px;}
        .pq0307 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0307 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0307 .pq-seq{display:flex;gap:10px;justify-content:center;align-items:center;padding:12px 0;}
        .pq0307 .pq-cell{width:64px;height:80px;border-radius:14px;border:2.5px solid #e2daf6;background:linear-gradient(#fff,#f5f1fd);display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:900;color:#5b46b0;font-variant-numeric:tabular-nums;}
        .pq0307 .pq-cell.gap{border-style:dashed;border-color:#b7a6ef;color:#b7a6ef;background:#faf8ff;animation:pqBreath 2s ease-in-out infinite;}
        .pq0307 .pq-cell.filled{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0307 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:16px;}
        .pq0307 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq0307 .pq-opt:hover:not(:disabled){border-color:#c3b1f0;transform:translateY(-2px);}
        .pq0307 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0307 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0307 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0307 .pq-opt:disabled{cursor:default;}
        .pq0307 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0307 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0307 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-seq">
        {SEQ.map((v, i) => (
          v === null
            ? <div key={i} className={'pq-cell gap' + (ok ? ' filled' : '')}>{ok ? DATA.target : '?'}</div>
            : <div key={i} className="pq-cell">{v}</div>
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
