// Amaliyot19 (1-sinf) — P23 Sonlar qatori o'nliklab: 20 30 _ 50 · Blok 5 · daraja 🟡 · teg: skip_count
// jsx-question kontrakti: onReady, registerCheck, onSubmit. O'z tugmasi yo'q. Audio yo'q.
// Mexanika: tap-tanlash. Animatsiya: to'g'rida bo'sh katak to'ladi + qadam "+10" ko'rinadi.

import React, { useState, useEffect, useRef, useCallback } from 'react';

const SEQ = [20, 30, null, 50];   // qadam 10
const STEP = 10;
const ANSWER = 40;
const OPTIONS = [35, 40, 45];
const DATA = { answer: ANSWER, step: STEP, tag: 'skip_count', level: '🟡', block: 5, ptype: 'P23' };

const T = {
  uz: {
    title: 'O\'nliklab sanash',
    setup: 'Sonlar o\'nliklab sanalyapti — har safar 10 ga ortadi: 20, 30, ...',
    ask: 'Bo\'sh katakka qaysi son keladi?',
    correct: 'Barakalla! 30 ga 10 qo\'shsak — 40. 20, 30, 40, 50.',
    less: 'Kam. Har qadamda 10 ga oshadi: 30 dan keyin 40.',
    more: 'Ko\'p. 50 dan oldingi son — 40.',
  },
  ru: {
    title: 'Счёт десятками',
    setup: 'Числа считают десятками — каждый раз больше на 10: 20, 30, ...',
    ask: 'Какое число подходит в пустую клетку?',
    correct: 'Молодец! К 30 прибавить 10 — будет 40. 20, 30, 40, 50.',
    less: 'Мало. Каждый шаг больше на 10: после 30 идёт 40.',
    more: 'Много. Число перед 50 — это 40.',
  },
};

const IconOk = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IconNo = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);

export default function Amaliyot19(props) {
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
    const correct = picked === ANSWER;
    const msg = correct ? t.correct : (picked < ANSWER ? t.less : t.more);
    setFeedback({ correct, msg }); setChecked(true);
    if (correct) playCorrect?.(); else playWrong?.();
    onSubmit?.({
      questionText: `${t.setup} ${t.ask}`, options: OPTIONS.map(String),
      studentAnswer: { value: picked }, correctAnswer: { value: ANSWER },
      correct, meta: { tag: DATA.tag, level: DATA.level, block: DATA.block, ptype: DATA.ptype },
    });
  }, [picked, playCorrect, playWrong, onSubmit, t]);

  const checkRef = useRef(check); checkRef.current = check;
  useEffect(() => { registerCheck?.(() => checkRef.current()); }, [registerCheck]);

  const lock = isReview || checked;
  const ok = feedback && feedback.correct;

  return (
    <div className="aq aq19">
      <style>{`
        .aq19 { max-width:620px; margin:0 auto; padding:4px 2px 8px; font-family:'Manrope',system-ui,-apple-system,Segoe UI,Roboto,sans-serif; color:#1f2430; }
        .aq19 .aq-tag { font-size:12px; font-weight:700; letter-spacing:.02em; color:#6b7280; text-transform:uppercase; }
        .aq19 .aq-body { font-size:17px; line-height:1.5; margin:6px 0 22px; }
        .aq19 .aq-setup { color:#5c6672; font-weight:500; }
        .aq19 .aq-ask { display:block; margin-top:4px; font-size:19px; font-weight:800; color:#1f2430; }
        .aq19 .aq-row { display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:wrap; }
        .aq19 .aq-num { min-width:64px; height:64px; padding:0 8px; border-radius:14px; background:#f6f8fb; border:2px solid #e4e7ec;
          display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; color:#374151; font-variant-numeric:tabular-nums; }
        .aq19 .aq-gap { border-style:dashed; border-color:#b9c1cf; color:#2563eb; animation:aqPulse 1.1s ease-in-out infinite; }
        .aq19 .aq-gap.filled { border-style:solid; border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqPop .35s ease both; }
        .aq19 .aq-step { display:flex; flex-direction:column; align-items:center; color:#9aa1ad; font-size:12px; font-weight:700; }
        .aq19 .aq-step b { color:#2563eb; }
        .aq19 .aq-opts { display:flex; gap:12px; justify-content:center; margin-top:22px; }
        .aq19 .aq-opt { min-width:70px; height:66px; padding:0 8px; font-size:27px; font-weight:800; border-radius:16px;
          border:2.5px solid #d6dae3; background:#fff; color:#374151; cursor:pointer; font-variant-numeric:tabular-nums; transition:border-color .12s, background .12s, transform .1s; }
        .aq19 .aq-opt:hover:not(:disabled) { border-color:#9bb6f0; }
        .aq19 .aq-opt:active:not(:disabled) { transform:scale(.94); }
        .aq19 .aq-opt.sel { border-color:#2563eb; background:#e8eefc; }
        .aq19 .aq-opt.right { border-color:#1a7f43; background:#e8f7ee; color:#1a7f43; animation:aqCele .5s ease; }
        .aq19 .aq-opt:disabled { cursor:default; }
        .aq19 .aq-fb { display:flex; align-items:flex-start; gap:10px; margin-top:18px; padding:14px 16px; border-radius:14px; font-size:16px; line-height:1.45; font-weight:600; animation:aqIn .22s ease both; }
        .aq19 .aq-fb.ok { background:#e8f7ee; color:#1a7f43; }
        .aq19 .aq-fb.no { background:#fdecec; color:#c0392b; }
        @keyframes aqIn { from { opacity:0; transform:translateY(6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes aqPop { from { opacity:0; transform:scale(.4);} to { opacity:1; transform:scale(1);} }
        @keyframes aqCele { 0%{transform:scale(1);} 30%{transform:scale(1.05);} 60%{transform:scale(.97);} 100%{transform:scale(1);} }
        @keyframes aqPulse { 0%,100%{ box-shadow:0 0 0 0 rgba(37,99,235,.4);} 50%{ box-shadow:0 0 0 5px rgba(37,99,235,0);} }
      `}</style>

      <span className="aq-tag">{t.title}</span>
      <p className="aq-body"><span className="aq-setup">{t.setup}</span><b className="aq-ask">{t.ask}</b></p>

      <div className="aq-row">
        {SEQ.map((n, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="aq-step">+<b>{STEP}</b></div>}
            {n === null
              ? <div className={'aq-num aq-gap' + (ok ? ' filled' : '')}>{ok ? ANSWER : '?'}</div>
              : <div className="aq-num">{n}</div>}
          </React.Fragment>
        ))}
      </div>

      <div className="aq-opts">
        {OPTIONS.map((n) => {
          const right = ok && n === ANSWER;
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
