// Dars04 · Amaliyot 05 — P2 Belgini tanla: 7 ▢ 4 · 🟢 · Ra'no · tag: pick_sign
// Fillar vazni: sonlar orasiga to'g'ri belgini (>, =, <) qo'yish. To'g'rida belgi katakka tushadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const A = 7, B = 4;
const SIGNS = ['>', '=', '<'];
const TARGET = '>';
const DATA = { ptype: 'P2', level: '🟢', tag: 'pick_sign' };
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Ra\'no', title: 'Belgini tanla',
    setup: 'Katta fil yetti shox barg yedi, kichigi to\'rtta. Ra\'no buni sonlarda yozdi.',
    ask: 'Sonlar orasiga qaysi belgi qo\'yiladi?',
    correct: 'Barakalla! Yetti to\'rtdan katta — belgi ochiq tomoni bilan kattaga qaraydi.',
    hint: 'Avval qaysi son kattaligini ayting. Belgi ochiq tomoni bilan katta songa qaraydi.',
  },
  ru: {
    eyebrow: 'Зоопарк · Рано', title: 'Выбери знак',
    setup: 'Большой слон съел семь веток, маленький — четыре. Рано записала это числами.',
    ask: 'Какой знак поставить между числами?',
    correct: 'Молодец! Семь больше четырёх — знак открыт в сторону большего.',
    hint: 'Сначала скажи, какое число больше. Знак открыт в сторону большего числа.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan fil (yon ko'rinish, o'ngga qaragan): kulrang 2-3 ton, tana, bosh,
// katta quloq (sekin qimirlaydi), egilgan xartum (sekin tebranadi), tish,
// oyoqlar, dum, blikli ko'z. Kichigi wrapper CSS'ida scaleX(-1) bilan chapga qaraydi.
const Elephant = ({ size = 64 }) => (
  <svg viewBox="0 0 104 80" width={size} height={Math.round(size * 0.77)} aria-hidden="true" style={{ display: 'block' }}>
    <path d="M9 33 Q2 40 6 48" stroke="#75808c" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M6 48 L3.5 52.5" stroke="#5c6672" strokeWidth="3.6" fill="none" strokeLinecap="round" />
    <rect x="17" y="50" width="11" height="24" rx="5" fill="#75808c" />
    <rect x="52" y="50" width="11" height="24" rx="5" fill="#75808c" />
    <ellipse cx="38" cy="40" rx="30" ry="24" fill="#97a1ac" stroke="#68737f" strokeWidth="1.6" />
    <ellipse cx="36" cy="51" rx="21" ry="10.5" fill="#b6bec7" opacity=".6" />
    <rect x="24" y="54" width="12" height="22" rx="5.5" fill="#97a1ac" stroke="#68737f" strokeWidth="1.4" />
    <rect x="42" y="54" width="12" height="22" rx="5.5" fill="#97a1ac" stroke="#68737f" strokeWidth="1.4" />
    <ellipse cx="30" cy="74" rx="4.6" ry="2.2" fill="#b6bec7" />
    <ellipse cx="48" cy="74" rx="4.6" ry="2.2" fill="#b6bec7" />
    <circle cx="74" cy="30" r="18" fill="#97a1ac" stroke="#68737f" strokeWidth="1.6" />
    <ellipse cx="79" cy="19" rx="8" ry="4.6" fill="#b6bec7" opacity=".55" />
    <path d="M78 44 Q84 48 83 53" stroke="#f3efe2" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    <g className="pq-trunk">
      <path d="M88 30 Q98 38 96 50 Q94.5 60 86 64" stroke="#68737f" strokeWidth="10.5" fill="none" strokeLinecap="round" />
      <path d="M88 30 Q98 38 96 50 Q94.5 60 86 64" stroke="#97a1ac" strokeWidth="7.5" fill="none" strokeLinecap="round" />
      <path d="M93 39 q4 1.4 5.4 .2 M93.5 47 q3.2 1 4.6 -.2" stroke="#7c8794" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".75" />
    </g>
    <g className="pq-ear">
      <path d="M64 13 Q45 11 41 30 Q39 46 57 48 Q68 45 68 30 Z" fill="#7f8994" stroke="#5c6672" strokeWidth="1.6" />
      <path d="M61 19 Q50 19 47.5 31 Q46.5 41 57 42.5 Q63 40 62.5 29 Z" fill="#aab3bd" opacity=".85" />
    </g>
    <circle cx="80" cy="25" r="2.7" fill="#1f2430" />
    <circle cx="81" cy="24.2" r="1" fill="#fff" />
  </svg>
);

export default function D04_05(props) {
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
    const correct = picked === TARGET;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: SIGNS, studentAnswer: { value: picked }, correctAnswer: { value: TARGET }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0405">
      <style>{`
        .pq0405{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0405 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a7f8a;text-transform:uppercase;}
        .pq0405 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0405 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0405 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0405 .pq-eleph{display:flex;gap:44px;justify-content:center;align-items:flex-end;margin-bottom:6px;}
        .pq0405 .pq-el{animation:pqSway 3.2s ease-in-out infinite;line-height:0;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0405 .pq-el.small{animation-delay:1.1s;}
        .pq0405 .pq-el.small svg{transform:scaleX(-1);}
        .pq0405 .pq-trunk{transform-box:fill-box;transform-origin:25% 10%;animation:pqTrunk 3.6s ease-in-out infinite;}
        .pq0405 .pq-ear{transform-box:fill-box;transform-origin:70% 8%;animation:pqEar 4.4s ease-in-out infinite;}
        .pq0405 .pq-el.small .pq-trunk{animation-delay:.9s;}
        .pq0405 .pq-el.small .pq-ear{animation-delay:.6s;}
        .pq0405 .pq-row{display:flex;gap:12px;justify-content:center;align-items:center;}
        .pq0405 .pq-num{width:76px;height:88px;border-radius:16px;border:3px solid #d9dde5;background:linear-gradient(#fff,#f4f6fa);display:flex;align-items:center;justify-content:center;font-size:46px;font-weight:900;color:#374151;font-variant-numeric:tabular-nums;}
        .pq0405 .pq-gap{width:64px;height:64px;border-radius:14px;border:2.5px dashed #b9c1cf;background:#fbfcfe;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;color:#b9c1cf;animation:pqBreath 2s ease-in-out infinite;}
        .pq0405 .pq-gap.filled{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0405 .pq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pq0405 .pq-opt{width:72px;height:72px;font-size:34px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.12s;}
        .pq0405 .pq-opt:hover:not(:disabled){border-color:#aab6c9;transform:translateY(-2px);}
        .pq0405 .pq-opt:active:not(:disabled){transform:scale(.94);}
        .pq0405 .pq-opt.sel{border-color:#2563eb;background:#e8eefc;}
        .pq0405 .pq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pqCele .5s ease;}
        .pq0405 .pq-opt:disabled{cursor:default;}
        .pq0405 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0405 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0405 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqSway{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
        @keyframes pqTrunk{0%,100%{transform:rotate(-3.5deg);}50%{transform:rotate(4deg);}}
        @keyframes pqEar{0%,100%{transform:rotate(0deg);}50%{transform:rotate(-8deg);}}
        @keyframes pqBreath{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-eleph">
        <span className="pq-el big"><Elephant size={64} /></span>
        <span className="pq-el small"><Elephant size={42} /></span>
      </div>
      <div className="pq-row">
        <div className="pq-num">{A}</div>
        <div className={'pq-gap' + (ok ? ' filled' : '')}>{ok ? TARGET : '?'}</div>
        <div className="pq-num">{B}</div>
      </div>

      <div className="pq-opts">
        {SIGNS.map((s) => {
          const sel = picked === s; const right = ok && s === TARGET;
          return <button key={s} type="button" className={'pq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(s); setFeedback(null); }}>{s}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
