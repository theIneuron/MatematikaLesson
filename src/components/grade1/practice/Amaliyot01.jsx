// Amaliyot01 (1-sinf) — P1 Sanash: predmetlarni sana, sonni tanla · Blok 1 · daraja 🟢 · teg: count_pick
// jsx-question kontrakti: onReady(true/false), registerCheck(fn), onSubmit(result). O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: olmalar birma-bir savatga tushadi; to'g'ri javobda har olmada sanoq 1..7 + bayram.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const COUNT = 7;
const OPTIONS = [5, 6, 7, 8];
const DATA = { target: COUNT, tag: 'count_pick', level: '🟢', block: 1, ptype: 'P1' };

const T = {
  uz: {
    title: 'Sanash',
    setup: 'Bog\'dan olma yig\'ib, savatga solindi. Olmalarni birma-bir sana.',
    ask: 'Savatda nechta olma bor?',
    correct: 'Barakalla! Yettita olma.',
    less: 'Yana sana — har olmani bir marta bos.',
    more: 'Har olmani faqat bir marta sana.',
  },
  ru: {
    title: 'Счёт',
    setup: 'Яблоки собрали в саду и положили в корзину. Посчитай их по одному.',
    ask: 'Сколько яблок в корзине?',
    correct: 'Молодец! Семь яблок.',
    less: 'Посчитай ещё — трогай каждое яблоко один раз.',
    more: 'Считай каждое яблоко только один раз.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const SPARKS = [[-46, -34], [46, -34], [-58, 6], [58, 6], [0, -58], [-20, 40], [20, 40]];
const Sparks = ({ show }) => show ? (
  <div className="aq-sparks">{SPARKS.map((d, i) => (
    <span key={i} className="aq-spark" style={{ '--dx': d[0] + 'px', '--dy': d[1] + 'px', animationDelay: `${i * 0.03}s` }}>✨</span>
  ))}</div>
) : null;

export default function Amaliyot01(props) {
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
    const msg = correct ? t.correct : (picked < DATA.target ? t.less : t.more);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: DATA.target },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq01">
      <style>{`
        .aq01 { max-width:660px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq01 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq01 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq01 .aq-setup { color:#5c6672; font-weight:500; }
        .aq01 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq01 .aq-stage { position:relative; }
        .aq01 .aq-basket { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; padding:20px; background:#fbf7ef; border:2px solid #efe6d4; border-radius:20px; }
        .aq01 .aq-basket.win { animation:aqCele .5s ease; }
        .aq01 .aq-apple { position:relative; font-size:42px; line-height:1; animation:aqDrop .45s cubic-bezier(.3,1.4,.5,1) both; }
        .aq01 .aq-cnt { position:absolute; top:-8px; right:-8px; min-width:22px; height:22px; padding:0 3px; border-radius:50%;
          background:#2563eb; color:#fff; font-size:13px; font-weight:800; display:flex; align-items:center; justify-content:center;
          font-variant-numeric:tabular-nums; animation:aqPop .3s ease both; }
        .aq01 .aq-opts { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:20px; }
        .aq01 .aq-opt { width:66px; height:66px; font-size:27px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums;
          transition:background .12s, border-color .12s, transform .1s; }
        .aq01 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq01 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq01 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; color:#1f2430; }
        .aq01 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq01 .aq-opt:disabled { cursor:default; }
        .aq01 .aq-sparks { position:absolute; left:50%; top:44%; width:0; height:0; pointer-events:none; }
        .aq01 .aq-spark { position:absolute; font-size:20px; animation:aqSpark .7s ease-out forwards; }
        .aq01 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq01 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq01 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqDrop { 0% { opacity:0; transform:translateY(-40px) scale(.7);} 100% { opacity:1; transform:translateY(0) scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.06);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
        @keyframes aqSpark { 0%{opacity:0; transform:translate(0,0) scale(.4);} 20%{opacity:1;} 100%{opacity:0; transform:translate(var(--dx),var(--dy)) scale(1.1);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-stage">
        <div className={'aq-basket' + (ok ? ' win' : '')}>
          {Array.from({ length: COUNT }).map((_, i) => (
            <span key={i} className="aq-apple" style={{ animationDelay: `${i * 0.08}s` }}>
              🍎{ok && <b className="aq-cnt" style={{ animationDelay: `${i * 0.09}s` }}>{i + 1}</b>}
            </span>
          ))}
        </div>
        <Sparks show={ok} />
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const sel = picked === n;
          const right = ok && n === DATA.target;
          return (
            <button key={n} type="button" className={'aq-opt' + (right ? ' right' : sel ? ' sel' : '')} disabled={lock}
              onClick={() => { setPicked(n); setFeedback(null); }}>{n}</button>
          );
        })}
      </div>

      {feedback && (
        <div className={`aq-fb ${feedback.correct ? 'ok' : 'no'}`}>
          {feedback.correct ? <IconOk /> : <IconNo />}
          <span>{feedback.msg}</span>
        </div>
      )}
    </div>
  );
}
