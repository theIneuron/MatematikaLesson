// Dars13 · Amaliyot 05 — P13 Misol yechish «Qalam do'koni» · 🔴 · tag: solve_sum_ten
// Ikki guruh qalam: chapda 3, o'ngda 7. «3 + 7 = ?» — yig'indini tanlaydi.
// G'alabada hamma qalam birga sanaladi (1..10) + «3 + 7 = 10».
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 3, B = 7, SUM = A + B; // 10
const DATA = { a: A, b: B, target: SUM, options: [8, 9, 10], ptype: 'P13', level: '🔴', tag: 'solve_sum_ten' };

const PAL = [
  { body: '#f2b134', light: '#f9ce74', dark: '#cd9421' },
  { body: '#d9534b', light: '#e88881', dark: '#b13a33' },
  { body: '#4f8fc4', light: '#83b1d9', dark: '#396f9c' },
  { body: '#57a84f', light: '#87c580', dark: '#42813e' },
];

const T = {
  uz: {
    eyebrow: "Qalam do'koni · Misol", title: "3 + 7 nechta?",
    setup: "Chapda uchta qalam, o'ngda yettita qalam.",
    ask: "Hammasi bo'lib nechta qalam? 3 + 7 = ?",
    correct: "Barakalla! Uch va yetti — o'nta. 3 + 7 = 10.",
    hint: "Avval uchtani, keyin yettitani birga sanang.",
  },
  ru: {
    eyebrow: "Магазин карандашей · Пример", title: "3 + 7 — сколько?",
    setup: "Слева три карандаша, справа семь.",
    ask: "Сколько всего карандашей? 3 + 7 = ?",
    correct: "Молодец! Три и семь — десять. 3 + 7 = 10.",
    hint: "Сначала посчитай три, потом семь — вместе.",
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

const Pencil = ({ c }) => (
  <svg viewBox="0 0 22 76" width="16" height="55" aria-hidden="true" style={{ display: 'block' }}>
    <polygon points="11,2 8.2,10 13.8,10" fill="#3b3b42" />
    <polygon points="11,2 4.5,17 17.5,17" fill="#edc689" />
    <polygon points="11,2 11,17 4.5,17" fill="#d6a765" opacity=".7" />
    <rect x="4.5" y="16.5" width="13" height="44" rx="1" fill={c.body} />
    <rect x="4.5" y="16.5" width="3.8" height="44" fill={c.light} opacity=".6" />
    <rect x="14" y="16.5" width="3.5" height="44" fill={c.dark} opacity=".55" />
    <rect x="4.5" y="60" width="13" height="7" rx="1" fill="#ced1d7" />
    <rect x="5" y="66.5" width="12" height="8.6" rx="2.6" fill="#ea90b5" />
  </svg>
);

export default function D13_05(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.value != null) setPicked(initialAnswer.studentAnswer.value);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct, msg: initialAnswer.correct ? t.correct : t.hint }); setChecked(true); }
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

  const Group = ({ n, off }) => (
    <div className="pq-group">
      <div className="pq-pens">
        {Array.from({ length: n }).map((_, i) => (
          <span key={i} className="pq-penw" style={{ animationDelay: `${(off + i) * 0.1}s` }}>
            <Pencil c={PAL[(off + i) % PAL.length]} />
            {ok && <b className="pq-cnt">{off + i + 1}</b>}
          </span>
        ))}
      </div>
      <span className="pq-glbl">{n}</span>
    </div>
  );

  return (
    <div className="pq pq1305">
      <style>{`
        .pq1305{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq1305 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#c9822f;text-transform:uppercase;}
        .pq1305 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 12px;}
        .pq1305 .pq-setup{color:#5c6672;font-weight:500;}
        .pq1305 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq1305 .pq-scene{position:relative;width:340px;max-width:100%;margin:0 auto;border-radius:20px;background:linear-gradient(#f3e2c6 0%,#eed7b2 60%,#e7c99b 100%);border:2px solid #d9be92;padding:16px 10px;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:8px;}
        .pq1305 .pq-group{flex:0 0 auto;min-width:96px;border-radius:14px;background:linear-gradient(#cd8f52,#b0703a);border:2.5px solid #86531f;box-shadow:0 5px 12px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.24);padding:8px 6px 6px;display:flex;flex-direction:column;align-items:center;}
        .pq1305 .pq-pens{display:flex;flex-wrap:wrap;gap:2px;justify-content:center;align-items:flex-end;min-height:56px;max-width:112px;}
        .pq1305 .pq-penw{position:relative;line-height:0;animation:pqSway 3s ease-in-out infinite;transform-origin:bottom center;}
        .pq1305 .pq-cnt{position:absolute;top:-6px;right:-4px;min-width:15px;height:15px;padding:0 2px;border-radius:50%;background:#2563eb;color:#fff;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:6;animation:pqPop .3s ease both;}
        .pq1305 .pq-glbl{margin-top:4px;font-size:19px;font-weight:900;color:#fff6ea;font-variant-numeric:tabular-nums;text-shadow:0 1px 2px rgba(0,0,0,.3);}
        .pq1305 .pq-op{font-size:26px;font-weight:900;color:#8a5a28;flex:0 0 auto;}
        .pq1305 .pq-eq{display:flex;justify-content:center;align-items:center;gap:6px;margin-top:14px;animation:pqIn .3s ease both;}
        .pq1305 .pq-eq b{min-width:34px;height:38px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;border-radius:11px;background:#fff6ea;border:2px solid #e2c79a;color:#a05a1f;font-variant-numeric:tabular-nums;}
        .pq1305 .pq-eq b.ten{background:#e8f7ee;border-color:#1a7f43;color:#1a7f43;}
        .pq1305 .pq-eq i{font-style:normal;font-size:20px;font-weight:900;color:#8a94a2;}
        .pq1305 .pq-opts{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:18px;}
        .pq1305 .pq-opt{width:72px;height:72px;font-size:30px;font-weight:800;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;font-variant-numeric:tabular-nums;transition:.12s;}
        .pq1305 .pq-opt:hover:not(:disabled){border-color:#e2c79a;transform:translateY(-2px);}
        .pq1305 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq1305 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq1305 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq1305 .pq-opt:disabled{cursor:default;}
        .pq1305 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq1305 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq1305 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:translateY(0) rotate(0);}50%{transform:translateY(-2px) rotate(-1.4deg);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.04);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-scene">
        <Group n={A} off={0} />
        <span className="pq-op">+</span>
        <Group n={B} off={A} />
      </div>

      {ok && (<div className="pq-eq"><b>{A}</b><i>+</i><b>{B}</b><i>=</i><b className="ten">{SUM}</b></div>)}

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
