// ПК1 · Yangi savol 1 — Taqqoslash (> < =) · GEYT-ONLY (amaliyotda bajarilmagan) · tag: pk_compare_sign
// Ikki likobchada pechenye: chapda 4, o'ngda 7. O'rtadagi bo'sh katakka to'g'ri belgi tanlanadi.
// jsx-question kontrakti: onReady/registerCheck/onSubmit. O'z tugmasi yo'q — PKHost/PracticeHost yuritadi.
import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = { left: 4, right: 7, answer: '<', options: ['>', '<', '='], ptype: 'P4', level: '🟢', tag: 'pk_compare_sign' };
const T = {
  uz: {
    eyebrow: 'Nazorat · Taqqoslash', title: 'Qaysi belgi to\'g\'ri?',
    setup: 'Ikki likobchaga pechenye qo\'yishdi. Ularni sanab, taqqoslang.',
    ask: 'O\'rtadagi katakka qaysi belgi mos keladi?',
    correct: 'Barakalla! To\'rt — yettidan kichik.',
    hint: 'Har likobchani sanang. Qaysinisida ozroq — o\'sha kichik. Belgining uchi kichik songa qaraydi.',
  },
  ru: {
    eyebrow: 'Контроль · Сравнение', title: 'Какой знак верный?',
    setup: 'На две тарелки положили печенье. Посчитай и сравни.',
    ask: 'Какой знак подходит в среднее окошко?',
    correct: 'Молодец! Четыре меньше семи.',
    hint: 'Посчитай на каждой тарелке. Где меньше — то и меньше. Остриё знака смотрит на меньшее число.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Bir likobcha: rangli doira + ustida sanaladigan pechenye (emoji). count — nechta.
const Plate = ({ count, tint }) => (
  <div className="pkq-plate">
    <div className="pkq-cookies">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="pkq-ck" style={{ animationDelay: `${i * 0.09}s` }}>🍪</span>
      ))}
    </div>
    <div className="pkq-dish" style={{ background: tint }} />
  </div>
);

export default function PKQ01(props) {
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
    const correct = picked === DATA.answer;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: DATA.options, studentAnswer: { value: picked }, correctAnswer: { value: DATA.answer }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pkq01">
      <style>{`
        .pkq01{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pkq01 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#7a54c2;text-transform:uppercase;}
        .pkq01 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pkq01 .pq-setup{color:#5c6672;font-weight:500;}
        .pkq01 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pkq01 .pkq-stage{display:flex;gap:14px;justify-content:center;align-items:center;padding:22px 12px;background:linear-gradient(#f4f1fb,#ece7f7);border:2px solid #ddd3f0;border-radius:22px;}
        .pkq01 .pkq-plate{display:flex;flex-direction:column;align-items:center;gap:8px;}
        .pkq01 .pkq-cookies{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;width:118px;min-height:78px;align-items:center;}
        .pkq01 .pkq-ck{font-size:28px;line-height:1;animation:pkqPop .4s cubic-bezier(.3,1.5,.5,1) both;}
        .pkq01 .pkq-dish{width:112px;height:14px;border-radius:0 0 40px 40px;box-shadow:0 3px 6px rgba(0,0,0,.14);}
        .pkq01 .pkq-slot{width:60px;height:60px;flex-shrink:0;border-radius:16px;border:2.5px dashed #b9a7e0;background:#fff;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#c3b4e6;font-variant-numeric:tabular-nums;}
        .pkq01 .pkq-slot.win{border-style:solid;border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pkqCele .5s ease;}
        .pkq01 .pkq-opts{display:flex;gap:12px;justify-content:center;margin-top:20px;}
        .pkq01 .pkq-opt{width:72px;height:72px;font-size:34px;font-weight:900;border-radius:18px;border:2.5px solid #d6dae3;background:#fff;color:#374151;cursor:pointer;transition:.14s;}
        .pkq01 .pkq-opt:hover:not(:disabled){border-color:#b9a7e0;transform:translateY(-2px);}
        .pkq01 .pkq-opt:active:not(:disabled){transform:scale(.94);}
        .pkq01 .pkq-opt.sel{border-color:#2563eb;background:#e8eefc;color:#2563eb;}
        .pkq01 .pkq-opt.right{border-color:#1a7f43;background:#e8f7ee;color:#1a7f43;animation:pkqCele .5s ease;}
        .pkq01 .pkq-opt:disabled{cursor:default;}
        .pkq01 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pkqIn .22s ease both;}
        .pkq01 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pkq01 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pkqPop{from{opacity:0;transform:scale(.3);}to{opacity:1;transform:scale(1);}}
        @keyframes pkqCele{0%{transform:scale(1);}30%{transform:scale(1.08);}60%{transform:scale(.96);}100%{transform:scale(1);}}
        @keyframes pkqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pkq-stage">
        <Plate count={DATA.left} tint="#f2c14e" />
        <div className={'pkq-slot' + (ok ? ' win' : '')}>{ok ? DATA.answer : '?'}</div>
        <Plate count={DATA.right} tint="#d98cc0" />
      </div>

      <div className="pkq-opts">
        {DATA.options.map((s) => {
          const sel = picked === s; const right = ok && s === DATA.answer;
          return <button key={s} type="button" className={'pkq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock} onClick={() => { setPicked(s); setFeedback(null); }}>{s}</button>;
        })}
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
