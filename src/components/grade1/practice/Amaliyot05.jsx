// Amaliyot05 (1-sinf) — P9 O'nlik (ten-frame): 10 gacha nechta yetmayapti? · Blok 3 · daraja 🟡 · teg: ten_frame
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'ri javobda yetishmagan doiralar birma-bir yashil to'ladi → "10!" bayram.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const FILLED = 6;
const TARGET = 10 - FILLED;   // 4
const OPTIONS = [3, 4, 5];
const DATA = { filled: FILLED, target: TARGET, tag: 'ten_frame', level: '🟡', block: 3, ptype: 'P9' };

const T = {
  uz: {
    title: "O'nlik ramka",
    setup: 'O\'nlik — bu 10 ta. Ramkada hozir 6 ta doira bor.',
    ask: 'Ramka to\'lishi uchun yana nechta doira kerak?',
    correct: 'Barakalla! 6 ga 4 qo\'shsak — o\'nta. 6 va 4 — 10.',
    less: 'Kam. Bo\'sh kataklarni sana — nechta bo\'sh qoldi?',
    more: 'Ko\'p. Faqat bo\'sh kataklarni sana.',
  },
  ru: {
    title: 'Десяток (рамка)',
    setup: 'Десяток — это 10. Сейчас в рамке 6 кружков.',
    ask: 'Сколько ещё нужно, чтобы заполнить рамку до десяти?',
    correct: 'Молодец! К шести добавить 4 — будет десять. 6 и 4 — 10.',
    less: 'Мало. Посчитай пустые клетки — сколько свободно?',
    more: 'Много. Считай только пустые клетки.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot05(props) {
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
    const msg = correct ? t.correct : (picked < TARGET ? t.less : t.more);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: TARGET },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq05">
      <style>{`
        .aq05 { max-width:600px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq05 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq05 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 18px; }
        .aq05 .aq-setup { color:#5c6672; font-weight:500; }
        .aq05 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq05 .aq-stage { position:relative; width:max-content; margin:0 auto; }
        .aq05 .aq-frame { display:grid; grid-template-columns:repeat(5, 54px); grid-auto-rows:54px; gap:6px;
          padding:10px; background:#f6f8fb; border-radius:16px; }
        .aq05 .aq-frame.win { animation:aqCele .5s ease; }
        .aq05 .aq-cell { border-radius:12px; border:2px solid #d6dae3; display:flex; align-items:center; justify-content:center; transition:border-color .2s; }
        .aq05 .aq-cell.target { border-color:#f0b046; border-style:dashed; animation:aqPulse 1.1s ease-in-out infinite; }
        .aq05 .aq-dot { width:34px; height:34px; border-radius:50%; background:#5b8def; animation:aqPop .25s ease both; }
        .aq05 .aq-dot.add { background:#3aa66b; animation:aqEnter .4s cubic-bezier(.3,1.4,.5,1) both; }
        .aq05 .aq-ten { position:absolute; right:-14px; top:-14px; background:#1a7f43; color:#fff; font-size:20px; font-weight:800;
          padding:6px 12px; border-radius:12px; animation:aqPop .35s ease both; }
        .aq05 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:24px; }
        .aq05 .aq-opt { width:66px; height:66px; font-size:29px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq05 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq05 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq05 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq05 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq05 .aq-opt:disabled { cursor:default; }
        .aq05 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq05 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq05 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqEnter { 0%{opacity:0; transform:translateY(-26px) scale(.5);} 100%{opacity:1; transform:translateY(0) scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
        @keyframes aqPulse { 0%,100%{ box-shadow:0 0 0 0 rgba(240,176,70,.5);} 50%{ box-shadow:0 0 0 5px rgba(240,176,70,0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-stage">
        <div className={'aq-frame' + (ok ? ' win' : '')}>
          {Array.from({ length: 10 }).map((_, i) => {
            const filled = i < FILLED;
            const added = ok && i >= FILLED;
            const target = !ok && i >= FILLED;
            return (
              <div key={i} className={'aq-cell' + (target ? ' target' : '')}>
                {filled && <span className="aq-dot" />}
                {added && <span className="aq-dot add" style={{ animationDelay: `${(i - FILLED) * 0.14}s` }} />}
              </div>
            );
          })}
        </div>
        {ok && <span className="aq-ten">10!</span>}
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const right = ok && n === TARGET;
          return (
            <button key={n} type="button" className={'aq-opt' + (right ? ' right' : picked === n ? ' sel' : '')} disabled={lock}
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
