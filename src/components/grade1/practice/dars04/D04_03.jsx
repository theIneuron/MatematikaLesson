// Dars04 · Amaliyot 03 — P4 Taqqoslash: qaysi kam? · 🟢 · Zuhra · tag: compare_less
// Quyonlarga sabzi: 6 va 4 — KAM tomonni top (teskari savol).
import React, { useState, useEffect, useRef, useCallback } from 'react';

const GROUPS = [{ id: 'a', n: 6, em: '🥕' }, { id: 'b', n: 4, em: '🥕' }];
const CORRECT_ID = 'b';
const DATA = { ptype: 'P4', level: '🟢', tag: 'compare_less' };
const T = {
  uz: {
    eyebrow: 'Hayvonot bog\'i · Zuhra', title: 'Qaysi kam?',
    setup: 'Zuhra quyonlarga ikki tovoq sabzi qo\'ydi.',
    ask: 'Qaysi tovoqda sabzi KAM?',
    correct: 'Barakalla! To\'rt oltidan kam.', hint: 'Diqqat: bu safar KAM tomonni so\'raymiz. Sanang va solishtiring.',
  },
  ru: {
    eyebrow: 'Зоопарк · Зухра', title: 'Где меньше?',
    setup: 'Зухра поставила кроликам две миски с морковкой.',
    ask: 'В какой миске морковок МЕНЬШЕ?',
    correct: 'Молодец! Четыре меньше шести.', hint: 'Внимание: сейчас мы ищем, где МЕНЬШЕ. Посчитай и сравни.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

// Chizilgan quyon (yon ko'rinish, o'ngga qaragan): oq-kulrang tana, ikki uzun
// quloq (ichi pushti, sekin tebranadi), dumaloq dum, blikli ko'z, mo'ylovlar.
// Chapga qaragani — .mirror (scaleX(-1)).
const Bunny = () => (
  <svg viewBox="0 0 60 64" width="45" height="48" className="pq-bunnysvg" aria-hidden="true">
    <g className="pq-ear">
      <ellipse cx="35" cy="12" rx="4.6" ry="9.5" fill="#eceaf2" stroke="#a29fb5" strokeWidth="1.5" transform="rotate(-12 35 21)" />
      <ellipse cx="35" cy="13" rx="2.1" ry="6.4" fill="#f5b5c6" transform="rotate(-12 35 21)" />
    </g>
    <g className="pq-ear e2">
      <ellipse cx="45.5" cy="11.5" rx="4.8" ry="10" fill="#eceaf2" stroke="#a29fb5" strokeWidth="1.5" transform="rotate(10 45.5 21)" />
      <ellipse cx="45.5" cy="12.5" rx="2.2" ry="6.8" fill="#f5b5c6" transform="rotate(10 45.5 21)" />
    </g>
    <circle cx="8.5" cy="49" r="6" fill="#fbfafd" stroke="#a29fb5" strokeWidth="1.5" />
    <ellipse cx="26" cy="47" rx="17" ry="14.5" fill="#eceaf2" stroke="#a29fb5" strokeWidth="1.5" />
    <ellipse cx="19" cy="50" rx="9.5" ry="8.5" fill="#d3d0df" opacity=".7" />
    <ellipse cx="31" cy="50" rx="7.5" ry="7" fill="#fbfafd" opacity=".9" />
    <circle cx="41" cy="29" r="11.5" fill="#eceaf2" stroke="#a29fb5" strokeWidth="1.5" />
    <ellipse cx="36.5" cy="33" rx="5" ry="3.6" fill="#d3d0df" opacity=".55" />
    <circle cx="44.5" cy="27" r="2.1" fill="#1f2430" />
    <circle cx="45.3" cy="26.2" r="0.7" fill="#fff" />
    <ellipse cx="51" cy="31" rx="1.9" ry="1.5" fill="#e88fa5" />
    <path d="M51 32.8 q-1.6 2 -3.8 1.4" stroke="#a29fb5" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M52.5 29.8 q3.6 -1.2 6 -1 M52.8 31.6 q3.6 .2 5.8 1.1" stroke="#8f8ca3" strokeWidth="1" fill="none" strokeLinecap="round" opacity=".8" />
    <ellipse cx="36.5" cy="60" rx="4" ry="2.4" fill="#eceaf2" stroke="#a29fb5" strokeWidth="1.5" />
    <ellipse cx="44" cy="60" rx="4" ry="2.4" fill="#eceaf2" stroke="#a29fb5" strokeWidth="1.5" />
  </svg>
);

export default function D04_03(props) {
  const { lang = 'uz', mode = 'answer', initialAnswer = null, playCorrect, playWrong, onReady, registerCheck, onSubmit } = props || {};
  const t = T[lang] || T.uz;
  const isReview = mode === 'review';
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (initialAnswer && initialAnswer.studentAnswer) {
      if (initialAnswer.studentAnswer.id != null) setPicked(initialAnswer.studentAnswer.id);
      if (typeof initialAnswer.correct === 'boolean') { setFeedback({ correct: initialAnswer.correct }); setChecked(true); }
    }
  }, [initialAnswer]);
  useEffect(() => { onReady?.(picked !== null && !checked); }, [picked, checked, onReady]);

  const check = useCallback(() => {
    if (picked === null) return;
    const correct = picked === CORRECT_ID;
    setFeedback({ correct, msg: correct ? t.correct : t.hint }); if (correct) setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({ questionText: `${t.setup} ${t.ask}`, options: GROUPS.map((g) => `${g.n} ta`), studentAnswer: { id: picked }, correctAnswer: { id: CORRECT_ID }, correct, meta: { ...DATA } });
  }, [picked, playCorrect, playWrong, onSubmit, t]);
  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked; const ok = feedback && feedback.correct;

  return (
    <div className="pq pq0403">
      <style>{`
        .pq0403{max-width:660px;margin:0 auto;padding:4px 2px 8px;font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2430;}
        .pq0403 .pq-eye{font-size:12px;font-weight:800;letter-spacing:.04em;color:#d97742;text-transform:uppercase;}
        .pq0403 .pq-body{font-size:17px;line-height:1.5;margin:4px 0 14px;}
        .pq0403 .pq-setup{color:#5c6672;font-weight:500;}
        .pq0403 .pq-ask{display:block;margin-top:4px;font-size:20px;font-weight:800;}
        .pq0403 .pq-stage{position:relative;display:flex;gap:14px;justify-content:center;align-items:stretch;}
        .pq0403 .pq-bunny{align-self:center;line-height:0;animation:pqHop 1.8s ease-in-out infinite;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));}
        .pq0403 .pq-bunny.mirror .pq-bunnysvg{transform:scaleX(-1);}
        .pq0403 .pq-ear{transform-box:fill-box;transform-origin:50% 88%;animation:pqEarSway 1.7s ease-in-out infinite alternate;}
        .pq0403 .pq-ear.e2{animation-delay:.5s;}
        .pq0403 .pq-card{position:relative;width:158px;min-height:126px;padding:14px 10px;border-radius:20px;border:3px solid #f4d9c8;background:linear-gradient(#fff,#fdf3ec);cursor:pointer;transition:.14s;display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;animation:pqFloat 4s ease-in-out infinite;}
        .pq0403 .pq-card.c2{animation-delay:.7s;}
        .pq0403 .pq-card:hover:not(.lock){border-color:#e3a276;transform:translateY(-3px);}
        .pq0403 .pq-card.sel{border-color:#2563eb;background:#eef3fe;}
        .pq0403 .pq-card.right{border-color:#1a7f43;background:#e8f7ee;animation:pqCele .5s ease;}
        .pq0403 .pq-card.lock{cursor:default;}
        .pq0403 .pq-obj{position:relative;font-size:26px;line-height:1;animation:pqDrop .4s cubic-bezier(.3,1.4,.5,1) both;}
        .pq0403 .pq-cnt{position:absolute;top:-8px;right:-8px;min-width:18px;height:18px;padding:0 3px;border-radius:50%;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:pqPop .3s ease both;}
        .pq0403 .pq-chip{position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:24px;font-weight:900;color:#1a7f43;background:#fff;padding:2px 16px;border-radius:14px;box-shadow:0 4px 12px rgba(26,127,67,.22);animation:pqAns .5s cubic-bezier(.3,1.5,.5,1) both;z-index:2;white-space:nowrap;}
        .pq0403 .pq-tick{position:absolute;top:8px;right:8px;color:#1a7f43;}
        .pq0403 .pq-fb{display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:14px 16px;border-radius:14px;font-size:16px;font-weight:700;line-height:1.45;animation:pqIn .22s ease both;}
        .pq0403 .pq-fb.ok{background:#e8f7ee;color:#1a7f43;} .pq0403 .pq-fb.no{background:#fdecec;color:#c0392b;}
        @keyframes pqHop{0%,100%{transform:translateY(0);}30%{transform:translateY(-9px);}55%{transform:translateY(0);}}
        @keyframes pqEarSway{from{transform:rotate(-3deg);}to{transform:rotate(3deg);}}
        @keyframes pqFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
        @keyframes pqDrop{0%{opacity:0;transform:translateY(-24px) scale(.6);}100%{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes pqPop{from{opacity:0;transform:scale(.4);}to{opacity:1;transform:scale(1);}}
        @keyframes pqAns{0%{opacity:0;transform:translateX(-50%) scale(.3);}100%{opacity:1;transform:translateX(-50%) scale(1);}}
        @keyframes pqCele{0%{transform:scale(1);}30%{transform:scale(1.05);}60%{transform:scale(.98);}100%{transform:scale(1);}}
        @keyframes pqIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
      `}</style>
      <span className="pq-eye">{t.eyebrow}</span>
      <p className="pq-body"><span className="pq-setup">{t.setup}</span><b className="pq-ask">{t.ask}</b></p>

      <div className="pq-stage">
        {ok && <span className="pq-chip">6 &gt; 4</span>}
        <span className="pq-bunny"><Bunny /></span>
        {GROUPS.map((g, gi) => {
          const sel = picked === g.id; const right = ok && g.id === CORRECT_ID;
          return (
            <div key={g.id} className={'pq-card c' + (gi + 1) + (lock ? ' lock' : '') + (right ? ' right' : sel ? ' sel' : '')} onClick={() => { if (!lock) { setPicked(g.id); setFeedback(null); } }}>
              {right && <span className="pq-tick"><IconOk /></span>}
              {Array.from({ length: g.n }).map((_, i) => (
                <span key={i} className="pq-obj" style={{ animationDelay: `${(gi * 3 + i) * 0.06}s` }}>{g.em}{ok && <b className="pq-cnt">{i + 1}</b>}</span>
              ))}
            </div>
          );
        })}
        <span className="pq-bunny mirror" style={{ animationDelay: '.9s' }}><Bunny /></span>
      </div>

      {feedback && (<div className={`pq-fb ${feedback.correct ? 'ok' : 'no'}`}>{feedback.correct ? <IconOk /> : <IconNo />}<span>{feedback.msg}</span></div>)}
    </div>
  );
}
